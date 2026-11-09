const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { AuthError, createAuthService } = require('./auth');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const FRONTEND_DIR = path.resolve(__dirname, '..', 'frontend');
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

const auth = createAuthService();

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function parseRequestUrl(req, res) {
  try {
    return new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  } catch (error) {
    console.warn('Rejected invalid request URL:', error.message);
    sendJson(res, 400, { error: 'Invalid request URL.' });
    return null;
  }
}

async function handleAuthRequest(req, res) {
  try {
    await auth.handle(req, res);
  } catch (error) {
    if (res.headersSent) {
      res.destroy(error);
      return;
    }

    if (error instanceof AuthError) {
      if (error.status === 405 && !res.hasHeader('Allow')) res.setHeader('Allow', 'POST, HEAD');
      sendJson(res, error.status, { error: error.message });
      return;
    }

    console.error('Authentication request failed:', error.code || error.message);
    sendJson(res, 500, { error: 'The authentication service encountered an unexpected error.' });
  }
}

function handleApiRequest(requestUrl, res) {
  if (requestUrl.pathname.startsWith('/api/')) {
    sendJson(res, 404, { error: 'API endpoint not found.' });
    return true;
  }
  return false;
}

function sendText(res, status, message, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(message),
    ...headers
  });
  res.end(message);
}

function decodeRequestPathname(requestUrl, res) {
  try {
    const pathname = decodeURIComponent(requestUrl.pathname);
    if (pathname.includes('\0')) {
      sendText(res, 400, '400 Bad Request');
      return null;
    }
    return pathname === '/' ? '/index.html' : pathname;
  } catch (error) {
    console.warn('Rejected invalid pathname:', error.message);
    sendText(res, 400, '400 Bad Request');
    return null;
  }
}

function resolveStaticFile(pathname, res) {
  const filePath = path.resolve(FRONTEND_DIR, `.${pathname}`);
  const relativePath = path.relative(FRONTEND_DIR, filePath);
  if (relativePath === '..' || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
    sendText(res, 403, '403 Forbidden');
    return null;
  }
  return filePath;
}

function sendStaticFile(req, res, filePath, error, content) {
  if (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') {
      sendText(res, 404, '404 Not Found');
    } else {
      console.error('Static file read failed:', error.code || error.message);
      sendText(res, 500, '500 Server Error');
    }
    return;
  }

  const contentType = MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': content.length
  });
  res.end(req.method === 'HEAD' ? undefined : content);
}

function serveStaticFile(req, res, requestUrl) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendText(res, 405, '405 Method Not Allowed', { Allow: 'GET, HEAD' });
    return;
  }

  const pathname = decodeRequestPathname(requestUrl, res);
  if (!pathname) return;
  const filePath = resolveStaticFile(pathname, res);
  if (!filePath) return;

  fs.readFile(filePath, (error, content) => sendStaticFile(req, res, filePath, error, content));
}

async function handleRequest(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  const requestUrl = parseRequestUrl(req, res);
  if (!requestUrl) return;

  if (requestUrl.pathname.startsWith('/api/auth/') || requestUrl.pathname === '/api/technicians') {
    await handleAuthRequest(req, res);
    return;
  }
  if (handleApiRequest(requestUrl, res)) return;
  serveStaticFile(req, res, requestUrl);
}

function handleRequestFailure(req, res, error) {
  if (res.headersSent) {
    res.destroy(error);
    return;
  }

  console.error('Request failed:', error.code || error.message);
  if (req.url.startsWith('/api/')) {
    sendJson(res, 500, { error: 'The server encountered an unexpected error.' });
    return;
  }
  sendText(res, 500, '500 Server Error');
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch(error => handleRequestFailure(req, res, error));
});

server.on('error', error => {
  console.error('VME server failed:', error.message);
  auth.close().catch(closeError => console.error('Database shutdown failed:', closeError.message));
  process.exitCode = 1;
});

auth.ready.then(() => {
  server.listen(PORT, HOST, () => {
    console.log(`VME Application server listening at http://localhost:${PORT}`);
    if (HOST === '0.0.0.0' || HOST === '::') {
      for (const addresses of Object.values(os.networkInterfaces())) {
        for (const address of addresses || []) {
          if (address.family === 'IPv4' && !address.internal) {
            console.log(`Share on your local network: http://${address.address}:${PORT}`);
          }
        }
      }
    }
  });
}).catch(async error => {
  console.error('VME SQLite initialization failed:', error.message);
  try {
    await auth.close();
  } catch (closeError) {
    console.error('Database shutdown failed:', closeError.message);
  }
  process.exitCode = 1;
});

function shutdown() {
  server.close(() => {
    auth.close().then(() => {
      process.exit(0);
    }).catch(error => {
      console.error('Database shutdown failed:', error.message);
      process.exitCode = 1;
    });
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
