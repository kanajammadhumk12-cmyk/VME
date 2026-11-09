const { promisify } = require('node:util');
const fs = require('node:fs');
const {
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  scrypt,
  timingSafeEqual
} = require('node:crypto');
const path = require('node:path');
const Database = require('better-sqlite3');
const nodemailer = require('nodemailer');

const scryptAsync = promisify(scrypt);
const SESSION_COOKIE = 'vme_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_DURATION_WITHOUT_REMEMBER_MS = 12 * 60 * 60 * 1000;
const VERIFICATION_DURATION_MS = 10 * 60 * 1000;
const RESEND_DELAY_MS = 60 * 1000;
const MAX_VERIFICATION_ATTEMPTS = 5;
const MAX_BODY_BYTES = 16 * 1024;
const PASSWORD_HASH_BYTES = 64;
const PASSWORD_SALT_BYTES = 16;
const VALID_ROLES = new Set(['customer', 'mechanic', 'electrician']);
const VERIFICATION_CODE_RE = /^\d{6}$/;

class AuthError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function hashPassword(password, salt = randomBytes(PASSWORD_SALT_BYTES)) {
  const hash = await scryptAsync(password, salt, PASSWORD_HASH_BYTES);
  return { hash: hash.toString('hex'), salt: salt.toString('hex') };
}

function safeEqualHex(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string' || left.length !== right.length) return false;
  return timingSafeEqual(Buffer.from(left, 'hex'), Buffer.from(right, 'hex'));
}

function safeUser(user) {
  return {
    id: user.id,
    registrationId: user.registration_id || null,
    name: user.full_name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.role
  };
}

function getCookie(req, name) {
  const cookieHeader = req.headers.cookie || '';
  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0 || part.slice(0, separator).trim() !== name) continue;
    return part.slice(separator + 1).trim();
  }
  return '';
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

async function readJson(req) {
  const contentType = req.headers['content-type'] || '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    throw new AuthError(415, 'Content-Type must be application/json.');
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new AuthError(413, 'Request body is too large.');
    chunks.push(chunk);
  }

  let parsed;
  try {
    parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    throw new AuthError(400, 'Request body must contain valid JSON.');
  }

  if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
    throw new AuthError(400, 'Request body must contain valid JSON.');
  }
  return parsed;
}

function validateSameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return;

  try {
    if (new URL(origin).host !== req.headers.host) {
      throw new AuthError(403, 'Cross-origin authentication requests are not allowed.');
    }
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError(403, 'Invalid request origin.');
  }
}

function normalizeRegistration(body) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const rawPhone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const phone = rawPhone.replace(/\D/g, '');
  const password = typeof body.password === 'string' ? body.password : '';
  const role = typeof body.role === 'string' ? body.role.trim().toLowerCase() : '';

  if (name.length < 2 || name.length > 100) throw new AuthError(400, 'Enter a name between 2 and 100 characters.');
  if (!/^[a-z0-9_.-]{3,30}$/.test(username)) throw new AuthError(400, 'Username must be 3–30 characters and use letters, numbers, dots, underscores, or hyphens.');
  if (!isValidEmail(email)) throw new AuthError(400, 'Enter a valid email address.');
  if (phone.length < 7 || phone.length > 15) throw new AuthError(400, 'Enter a valid phone number with 7–15 digits.');
  if (password.length < 12 || password.length > 128) throw new AuthError(400, 'Password must be between 12 and 128 characters.');
  if (!VALID_ROLES.has(role)) throw new AuthError(400, 'Select a valid account type.');
  const coordinates = normalizeTechnicianLocation(body, role);

  return { name, username, email, phone, password, role, ...coordinates };
}

function normalizeTechnicianLocation(body, role) {
  if (role === 'customer') return { latitude: null, longitude: null };

  const latitude = parseCoordinate(body.latitude);
  const longitude = parseCoordinate(body.longitude);
  if (latitude === null || latitude < -90 || latitude > 90 || longitude === null || longitude < -180 || longitude > 180) {
    throw new AuthError(400, 'Share a valid workshop location to register as a technician.');
  }
  return { latitude, longitude };
}

function parseCoordinate(value) {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (typeof value === 'string' && !value.trim()) return null;
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
}

function isValidEmail(value) {
  if (typeof value !== 'string' || value.length > 254 || value.includes(' ')) return false;

  const atIndex = value.indexOf('@');
  if (atIndex <= 0 || atIndex !== value.lastIndexOf('@')) return false;

  const localPart = value.slice(0, atIndex);
  const domainPart = value.slice(atIndex + 1);
  if (!localPart || !domainPart || domainPart.includes('..') || localPart.includes('..')) return false;
  if (localPart.startsWith('.') || localPart.endsWith('.') || domainPart.startsWith('.') || domainPart.endsWith('.')) return false;
  if (!domainPart.includes('.')) return false;

  const domainSegments = domainPart.split('.');
  return domainSegments.every(segment => segment.length > 0 && !segment.startsWith('-') && !segment.endsWith('-'));
}

function isValidCode(value) {
  return typeof value === 'string' && VERIFICATION_CODE_RE.test(value);
}

function createAuthService({ createTransport = nodemailer.createTransport } = {}) {
  const databasePath = process.env.VME_DB_PATH || path.join(__dirname, 'data', 'vme.sqlite');
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  let secret = process.env.AUTH_SECRET;
  if (!secret) {
    const secretPath = path.join(path.dirname(databasePath), '.auth-secret');
    try {
      fs.writeFileSync(secretPath, randomBytes(32).toString('hex'), { flag: 'wx', mode: 0o600 });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
    secret = fs.readFileSync(secretPath, 'utf8').trim();
  }
  if (secret.length < 32) {
    throw new Error('AUTH_SECRET must be at least 32 characters long.');
  }

  const database = new Database(databasePath);
  database.pragma('journal_mode = WAL');
  database.pragma('foreign_keys = ON');
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      registration_id TEXT UNIQUE,
      full_name TEXT NOT NULL,
      username TEXT NOT NULL COLLATE NOCASE UNIQUE,
      email TEXT NOT NULL COLLATE NOCASE UNIQUE,
      phone TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('customer', 'mechanic', 'electrician')),
      latitude REAL,
      longitude REAL,
      email_verified INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS email_verification_codes (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      code_hash TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      sent_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS password_reset_codes (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      code_hash TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      sent_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS auth_sessions (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS auth_sessions_expires_at_idx ON auth_sessions(expires_at);
    CREATE INDEX IF NOT EXISTS verification_codes_expires_at_idx ON email_verification_codes(expires_at);
  `);

  const userColumns = new Set(database.prepare('PRAGMA table_info(users)').all().map(column => column.name));
  if (!userColumns.has('latitude')) database.exec('ALTER TABLE users ADD COLUMN latitude REAL');
  if (!userColumns.has('longitude')) database.exec('ALTER TABLE users ADD COLUMN longitude REAL');
  if (!userColumns.has('registration_id')) database.exec('ALTER TABLE users ADD COLUMN registration_id TEXT');
  database.exec('CREATE UNIQUE INDEX IF NOT EXISTS users_registration_id_idx ON users(registration_id)');

  function execute(sql, parameters = []) {
    return database.prepare(sql).run(...parameters);
  }

  function first(sql, parameters = []) {
    return database.prepare(sql).get(...parameters) || null;
  }

  function transaction(work) {
    return database.transaction(work)();
  }

  const PREFIX_BY_ROLE = {
    mechanic: 'VME-MECH',
    electrician: 'VME-ELEC'
  };

  function generateRegistrationId(role) {
    const prefix = PREFIX_BY_ROLE[role];
    if (!prefix) return null;

    for (let i = 0; i < 200; i++) {
      const num = randomInt(1000, 10000);
      const candidate = `${prefix}-${num}`;
      const exists = first('SELECT id FROM users WHERE registration_id = ?', [candidate]);
      if (!exists) return candidate;
    }
    return `${prefix}-${Date.now().toString().slice(-6)}`;
  }

  const techniciansWithoutRegId = database.prepare(
    "SELECT id, role FROM users WHERE registration_id IS NULL AND role IN ('mechanic', 'electrician')"
  ).all();
  for (const u of techniciansWithoutRegId) {
    const regId = generateRegistrationId(u.role);
    if (regId) {
      database.prepare('UPDATE users SET registration_id = ? WHERE id = ?').run(regId, u.id);
    }
  }

  const ready = Promise.resolve();
  execute('DELETE FROM auth_sessions WHERE expires_at <= ?', [Date.now()]);
  execute('DELETE FROM email_verification_codes WHERE expires_at <= ?', [Date.now()]);
  execute('DELETE FROM password_reset_codes WHERE expires_at <= ?', [Date.now()]);

  const rateLimits = new Map();
  let smtpTransport;

  function rateLimit(req, action, limit, windowMs) {
    const now = Date.now();
    const address = req.socket.remoteAddress || 'unknown';
    const key = `${action}:${address}`;
    const record = rateLimits.get(key);

    if (!record || now >= record.resetAt) {
      rateLimits.set(key, { count: 1, resetAt: now + windowMs });
      return;
    }

    record.count += 1;
    if (record.count > limit) {
      throw new AuthError(429, 'Too many attempts. Please wait before trying again.');
    }

    if (rateLimits.size > 10000) {
      for (const [entryKey, entry] of rateLimits) {
        if (now >= entry.resetAt) rateLimits.delete(entryKey);
      }
    }
  }

  function getSmtpTransport() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const password = process.env.SMTP_PASSWORD;
    const from = process.env.SMTP_FROM;

    if (!host || !user || !password || !from || !Number.isInteger(port) || port < 1 || port > 65535) {
      throw new AuthError(503, 'Email verification is not configured. Set the SMTP settings in the server environment.');
    }

    if (!smtpTransport) {
      smtpTransport = createTransport({
        host,
        port,
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user, pass: password },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000
      });
    }

    return { transport: smtpTransport, from };
  }

  function hashVerificationCode(code) {
    return createHmac('sha256', secret).update(code).digest('hex');
  }

  function createSession(userId, res, rememberMe = true) {
    const token = randomBytes(32).toString('base64url');
    const now = Date.now();
    const durationMs = rememberMe ? SESSION_DURATION_MS : SESSION_DURATION_WITHOUT_REMEMBER_MS;
    const expiresAt = now + durationMs;
    const tokenHash = createHash('sha256').update(token).digest('hex');

    execute(`
      INSERT INTO auth_sessions (token_hash, user_id, expires_at, created_at)
      VALUES (?, ?, ?, ?)
    `, [tokenHash, userId, expiresAt, now]);

    const cookieParts = [
      `${SESSION_COOKIE}=${token}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax'
    ];
    if (rememberMe) cookieParts.push(`Max-Age=${Math.floor(SESSION_DURATION_MS / 1000)}`);
    if (process.env.NODE_ENV === 'production') cookieParts.push('Secure');
    res.setHeader('Set-Cookie', cookieParts.join('; '));
  }

  function clearSessionCookie(res) {
    const cookieParts = [`${SESSION_COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0'];
    if (process.env.NODE_ENV === 'production') cookieParts.push('Secure');
    res.setHeader('Set-Cookie', cookieParts.join('; '));
  }

  async function getSessionUser(req) {
    const token = getCookie(req, SESSION_COOKIE);
    if (!token || token.length > 128) return null;

    const tokenHash = createHash('sha256').update(token).digest('hex');
    const session = await first(`
      SELECT users.*, auth_sessions.expires_at
      FROM auth_sessions
      JOIN users ON users.id = auth_sessions.user_id
      WHERE auth_sessions.token_hash = ?
    `, [tokenHash]);

    if (!session) return null;
    if (session.expires_at <= Date.now()) {
      await execute('DELETE FROM auth_sessions WHERE token_hash = ?', [tokenHash]);
      return null;
    }

    return session;
  }

  async function sendVerificationEmail(email, code, from) {
    const { transport } = getSmtpTransport();
    await transport.sendMail({
      from,
      to: email,
      subject: 'Your VME email verification code',
      text: `Your VME verification code is ${code}. It expires in 10 minutes. If you did not request this code, you can ignore this email.`,
      html: `<p>Your VME verification code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:6px">${code}</p><p>It expires in 10 minutes. If you did not request this code, you can ignore this email.</p>`
    });
  }

  async function sendPasswordResetEmail(email, code, from) {
    const { transport } = getSmtpTransport();
    await transport.sendMail({
      from,
      to: email,
      subject: 'Your VME password reset code',
      text: `Your VME password reset code is ${code}. It expires in 10 minutes. If you did not request this code, secure your account by ignoring this email and contacting VME support.`,
      html: `<p>Your VME password reset code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:6px">${code}</p><p>It expires in 10 minutes. If you did not request this code, ignore this email.</p>`
    });
  }

  async function register(req, res) {
    rateLimit(req, 'register', 5, 15 * 60 * 1000);
    const body = await readJson(req);
    const input = normalizeRegistration(body);
    const { from } = getSmtpTransport();
    const existing = await first(`
      SELECT * FROM users WHERE email = ? OR LOWER(username) = LOWER(?) OR phone = ?
    `, [input.email, input.username, input.phone]);

    if (existing?.email_verified) {
      throw new AuthError(409, 'An account already exists with that email, username, or phone number.');
    }

    if (existing) {
      const previousCode = await first(`
        SELECT sent_at FROM email_verification_codes WHERE user_id = ?
      `, [existing.id]);
      if (previousCode && Date.now() - previousCode.sent_at < RESEND_DELAY_MS) {
        throw new AuthError(429, 'Please wait a minute before requesting another verification code.');
      }
    }

    const { hash: passwordHash, salt: passwordSalt } = await hashPassword(input.password);
    const now = Date.now();
    const userId = existing?.id || randomBytes(16).toString('hex');
    const isTechnician = input.role === 'mechanic' || input.role === 'electrician';
    const registrationId = isTechnician
      ? (existing?.registration_id || generateRegistrationId(input.role))
      : null;
    const code = String(randomInt(100000, 1000000));

    const savePendingRegistration = () => {
      if (existing) {
        execute(`
          UPDATE users SET full_name = ?, username = ?, email = ?, phone = ?,
              password_hash = ?, password_salt = ?, role = ?, latitude = ?, longitude = ?, registration_id = ?
          WHERE id = ? AND email_verified = 0
          `, [input.name, input.username, input.email, input.phone, passwordHash, passwordSalt, input.role, input.latitude, input.longitude, registrationId, userId]);
      } else {
        execute(`
            INSERT INTO users (
              id, registration_id, full_name, username, email, phone, password_hash, password_salt, role,
              latitude, longitude, email_verified, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
          `, [userId, registrationId, input.name, input.username, input.email, input.phone, passwordHash, passwordSalt, input.role, input.latitude, input.longitude, now]);
      }

      execute(`
        INSERT INTO email_verification_codes (user_id, code_hash, expires_at, attempts, sent_at)
        VALUES (?, ?, ?, 0, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          code_hash = excluded.code_hash,
          expires_at = excluded.expires_at,
          attempts = 0,
          sent_at = excluded.sent_at
      `, [userId, hashVerificationCode(code), now + VERIFICATION_DURATION_MS, now]);
    };

    try {
      await transaction(savePendingRegistration);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new AuthError(409, 'An account already exists with that email, username, or phone number.');
      }
      throw error;
    }

    try {
      await sendVerificationEmail(input.email, code, from);
    } catch (error) {
      await execute('DELETE FROM email_verification_codes WHERE user_id = ?', [userId]);
      console.error('Verification email delivery failed:', error.code || error.message);
      throw new AuthError(503, 'We could not send the verification email. Check the SMTP configuration and try again.');
    }

    sendJson(res, 202, {
      message: 'Verification code sent. Check your email and enter the code to finish creating your account.',
      email: input.email,
      expiresInSeconds: Math.floor(VERIFICATION_DURATION_MS / 1000)
    });
  }

  async function verifyEmail(req, res) {
    rateLimit(req, 'verify', 10, 15 * 60 * 1000);
    const body = await readJson(req);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const code = typeof body.code === 'string' ? body.code.trim() : '';
    if (!isValidEmail(email) || !isValidCode(code)) {
      throw new AuthError(400, 'Enter a valid email address and six-digit verification code.');
    }

    const user = await first('SELECT * FROM users WHERE email = ? AND email_verified = 0', [email]);
    const verification = user && await first(`
      SELECT * FROM email_verification_codes WHERE user_id = ?
    `, [user.id]);

    if (!user || !verification) throw new AuthError(400, 'The verification code is invalid or expired.');
    if (verification.expires_at <= Date.now()) {
      await execute('DELETE FROM email_verification_codes WHERE user_id = ?', [user.id]);
      throw new AuthError(400, 'The verification code is invalid or expired. Request a new code.');
    }
    if (verification.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      await execute('DELETE FROM email_verification_codes WHERE user_id = ?', [user.id]);
      throw new AuthError(429, 'Too many incorrect codes. Request a new verification code.');
    }

    const candidateHash = hashVerificationCode(code);
    if (!safeEqualHex(candidateHash, verification.code_hash)) {
      await execute(`
        UPDATE email_verification_codes SET attempts = attempts + 1 WHERE user_id = ?
      `, [user.id]);
      throw new AuthError(400, 'The verification code is invalid or expired.');
    }

    const verifiedUser = transaction(() => {
      const current = first('SELECT * FROM users WHERE id = ?', [user.id]);
      const isTechnician = current?.role === 'mechanic' || current?.role === 'electrician';
      const regId = isTechnician
        ? (current.registration_id || generateRegistrationId(current.role))
        : null;
      execute('UPDATE users SET email_verified = 1, registration_id = ? WHERE id = ?', [regId, user.id]);
      execute('DELETE FROM email_verification_codes WHERE user_id = ?', [user.id]);
      return first('SELECT * FROM users WHERE id = ?', [user.id]);
    });

    createSession(user.id, res);
    sendJson(res, 200, { user: safeUser(verifiedUser), registrationId: verifiedUser.registration_id });
  }

  async function login(req, res) {
    rateLimit(req, 'login', 10, 15 * 60 * 1000);
    const body = await readJson(req);
    const identifier = typeof body.emailOrPhone === 'string' ? body.emailOrPhone.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const requestedRole = typeof body.role === 'string' ? body.role.trim().toLowerCase() : '';
    const rememberMe = body.rememberMe === true;
    if (!identifier || identifier.length > 254 || password.length > 128) {
      throw new AuthError(400, 'Enter your email or phone number and password.');
    }
    if (requestedRole && !VALID_ROLES.has(requestedRole)) {
      throw new AuthError(400, 'Select a valid account type.');
    }

    const isEmail = identifier.includes('@');
    const isRegId = /^VME-(MECH|ELEC)-\d+$/i.test(identifier);
    const normalizedIdentifier = isEmail
      ? identifier.toLowerCase()
      : identifier.replace(/\D/g, '');

    let user;
    if (isRegId) {
      user = await first(`
        SELECT * FROM users
        WHERE UPPER(registration_id) = UPPER(?) AND email_verified = 1
      `, [identifier]);
    } else if (isEmail) {
      user = await first(`
        SELECT * FROM users
        WHERE email = ? AND email_verified = 1
      `, [normalizedIdentifier]);
    } else {
      user = await first(`
        SELECT * FROM users
        WHERE (
          phone = ?
          OR UPPER(registration_id) = UPPER(?)
          OR LOWER(username) = LOWER(?)
        ) AND email_verified = 1
      `, [normalizedIdentifier, identifier, identifier.toLowerCase()]);
    }

    const salt = user ? Buffer.from(user.password_salt, 'hex') : Buffer.alloc(PASSWORD_SALT_BYTES);
    const candidateHash = await hashPassword(password, salt);
    if (!user || !safeEqualHex(candidateHash.hash, user.password_hash)) {
      throw new AuthError(401, 'Invalid registration ID, email/phone, or password.');
    }
    if (requestedRole && requestedRole !== user.role) {
      throw new AuthError(403, 'That account does not have the selected role.');
    }

    createSession(user.id, res, rememberMe);
    sendJson(res, 200, { user: safeUser(user) });
  }

  async function logout(req, res) {
    const token = getCookie(req, SESSION_COOKIE);
    if (token && token.length <= 128) {
      const tokenHash = createHash('sha256').update(token).digest('hex');
      await execute('DELETE FROM auth_sessions WHERE token_hash = ?', [tokenHash]);
    }

    clearSessionCookie(res);
    sendJson(res, 200, { message: 'You have been signed out.' });
  }

  async function requestPasswordReset(req, res) {
    rateLimit(req, 'password-reset-request', 5, 15 * 60 * 1000);
    const body = await readJson(req);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!isValidEmail(email)) {
      throw new AuthError(400, 'Enter a valid email address.');
    }

    const { from } = getSmtpTransport();
    const user = await first('SELECT * FROM users WHERE email = ? AND email_verified = 1', [email]);
    if (user) {
      const previousCode = await first(`
        SELECT sent_at FROM password_reset_codes WHERE user_id = ?
      `, [user.id]);
      if (previousCode && Date.now() - previousCode.sent_at < RESEND_DELAY_MS) {
        sendJson(res, 202, {
          message: 'If a verified account exists for this email, a password reset code has been sent.'
        });
        return;
      }

      const code = String(randomInt(100000, 1000000));
      const now = Date.now();
      await execute(`
        INSERT INTO password_reset_codes (user_id, code_hash, expires_at, attempts, sent_at)
        VALUES (?, ?, ?, 0, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          code_hash = excluded.code_hash,
          expires_at = excluded.expires_at,
          attempts = 0,
          sent_at = excluded.sent_at
      `, [user.id, hashVerificationCode(code), now + VERIFICATION_DURATION_MS, now]);

      try {
        await sendPasswordResetEmail(email, code, from);
      } catch (error) {
        await execute('DELETE FROM password_reset_codes WHERE user_id = ?', [user.id]);
        console.error('Password reset email delivery failed:', error.code || error.message);
        throw new AuthError(503, 'We could not send the password reset email. Check the SMTP configuration and try again.');
      }
    }

    sendJson(res, 202, {
      message: 'If a verified account exists for this email, a password reset code has been sent.'
    });
  }

  async function completePasswordReset(req, res) {
    rateLimit(req, 'password-reset-complete', 10, 15 * 60 * 1000);
    const body = await readJson(req);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const code = typeof body.code === 'string' ? body.code.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!isValidEmail(email) || !isValidCode(code)) {
      throw new AuthError(400, 'Enter a valid email address and six-digit reset code.');
    }
    if (password.length < 12 || password.length > 128) {
      throw new AuthError(400, 'Password must be between 12 and 128 characters.');
    }

    const user = await first('SELECT * FROM users WHERE email = ? AND email_verified = 1', [email]);
    const reset = user && await first(`
      SELECT * FROM password_reset_codes WHERE user_id = ?
    `, [user.id]);

    if (!user || !reset) throw new AuthError(400, 'The reset code is invalid or expired.');
    if (reset.expires_at <= Date.now()) {
      await execute('DELETE FROM password_reset_codes WHERE user_id = ?', [user.id]);
      throw new AuthError(400, 'The reset code is invalid or expired. Request a new code.');
    }
    if (reset.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      await execute('DELETE FROM password_reset_codes WHERE user_id = ?', [user.id]);
      throw new AuthError(429, 'Too many incorrect codes. Request a new reset code.');
    }
    if (!safeEqualHex(hashVerificationCode(code), reset.code_hash)) {
      await execute('UPDATE password_reset_codes SET attempts = attempts + 1 WHERE user_id = ?', [user.id]);
      throw new AuthError(400, 'The reset code is invalid or expired.');
    }

    const { hash, salt } = await hashPassword(password);
    transaction(() => {
      execute(`
        UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?
      `, [hash, salt, user.id]);
      execute('DELETE FROM password_reset_codes WHERE user_id = ?', [user.id]);
      execute('DELETE FROM auth_sessions WHERE user_id = ?', [user.id]);
    });

    clearSessionCookie(res);
    sendJson(res, 200, { message: 'Password updated. Sign in using your new password.' });
  }

  async function listNearbyTechnicians(req, res, requestUrl) {
    const viewer = await getSessionUser(req);
    if (!viewer) throw new AuthError(401, 'You are not signed in.');
    if (viewer.role !== 'customer') throw new AuthError(403, 'Only customer accounts can browse technicians.');

    const role = requestUrl.searchParams.get('role');
    const latitude = parseCoordinate(requestUrl.searchParams.get('lat'));
    const longitude = parseCoordinate(requestUrl.searchParams.get('lng'));
    if (!['mechanic', 'electrician'].includes(role) || latitude === null || latitude < -90 || latitude > 90 || longitude === null || longitude < -180 || longitude > 180) {
      throw new AuthError(400, 'Select a technician type and provide a valid customer location.');
    }

    const toRadians = degrees => degrees * Math.PI / 180;
    const nearby = database.prepare(`
      SELECT id, full_name, role, latitude, longitude FROM users
      WHERE role = ? AND email_verified = 1 AND latitude IS NOT NULL AND longitude IS NOT NULL
    `).all(role);
    const technicians = nearby.map(technician => {
      const latitudeDelta = toRadians(technician.latitude - latitude);
      const longitudeDelta = toRadians(technician.longitude - longitude);
      const distance = 2 * 6371 * Math.asin(Math.sqrt(
        Math.sin(latitudeDelta / 2) ** 2 +
        Math.cos(toRadians(latitude)) * Math.cos(toRadians(technician.latitude)) * Math.sin(longitudeDelta / 2) ** 2
      ));
      return {
        id: technician.id,
        name: technician.full_name,
        role: technician.role,
        distanceKm: Math.round(distance * 10) / 10
      };
    }).filter(technician => technician.distanceKm <= 25)
      .sort((left, right) => left.distanceKm - right.distanceKm);

    sendJson(res, 200, { technicians });
  }

  async function handle(req, res) {
    const requestUrl = new URL(req.url, 'http://localhost');
    const route = requestUrl.pathname;

    if (route === '/api/auth/session' && req.method === 'GET') {
      const user = await getSessionUser(req);
      sendJson(res, 200, { user: user ? safeUser(user) : null });
      return;
    }

    if (route === '/api/auth/me' && req.method === 'GET') {
      const user = await getSessionUser(req);
      if (!user) throw new AuthError(401, 'You are not signed in.');
      sendJson(res, 200, { user: safeUser(user) });
      return;
    }

    if (route === '/api/technicians' && req.method === 'GET') {
      await listNearbyTechnicians(req, res, requestUrl);
      return;
    }

    const postRoutes = new Set([
      '/api/auth/register',
      '/api/auth/verify-email',
      '/api/auth/login',
      '/api/auth/logout',
      '/api/auth/password-reset/request',
      '/api/auth/password-reset/complete'
    ]);

    if (!postRoutes.has(route)) {
      throw new AuthError(404, 'Authentication endpoint not found.');
    }
    if (!['POST', 'HEAD'].includes(req.method)) {
      res.setHeader('Allow', 'POST, HEAD');
      throw new AuthError(405, 'Method not allowed.');
    }

    validateSameOrigin(req);
    if (req.method === 'HEAD') {
      res.writeHead(200, { 'Cache-Control': 'no-store' });
      res.end();
      return;
    }

    const routeHandlers = {
      '/api/auth/register': register,
      '/api/auth/verify-email': verifyEmail,
      '/api/auth/login': login,
      '/api/auth/logout': logout,
      '/api/auth/password-reset/request': requestPasswordReset,
      '/api/auth/password-reset/complete': completePasswordReset
    };

    const handler = routeHandlers[route];
    if (handler) await handler(req, res);
  }

  return {
    handle,
    ready,
    close: async () => {
      await ready;
      database.close();
    }
  };
}

module.exports = { AuthError, createAuthService };
