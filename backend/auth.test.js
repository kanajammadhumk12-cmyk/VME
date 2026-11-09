const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { AuthError, createAuthService } = require('./auth');

test('authentication registration, verification, sessions, and password reset', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vme-auth-test-'));
  const previousEnvironment = {
    VME_DB_PATH: process.env.VME_DB_PATH,
    AUTH_SECRET: process.env.AUTH_SECRET,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_FROM: process.env.SMTP_FROM,
    NODE_ENV: process.env.NODE_ENV
  };

  process.env.VME_DB_PATH = path.join(tempDir, 'auth.sqlite');
  process.env.AUTH_SECRET = 'test-secret-'.repeat(4);
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_PORT;
  delete process.env.SMTP_SECURE;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASSWORD;
  delete process.env.SMTP_FROM;
  process.env.NODE_ENV = 'test';

  const sentEmails = [];
  const auth = createAuthService({
    createTransport: () => ({
      sendMail: async message => sentEmails.push(message)
    })
  });
  const server = http.createServer((req, res) => {
    auth.handle(req, res).catch(error => {
      if (error instanceof AuthError) {
        res.writeHead(error.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
        return;
      }
      res.writeHead(500);
      res.end();
    });
  });

  try {
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const request = async (route, body, options = {}) => {
      const response = await fetch(`${baseUrl}${route}`, {
        method: options.method || 'POST',
        headers: {
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
          ...(options.cookie ? { Cookie: options.cookie } : {}),
          ...(options.origin ? { Origin: options.origin } : {})
        },
        body: body === undefined ? undefined : JSON.stringify(body)
      });
      return { response, body: response.status === 204 ? null : await response.json() };
    };

    const anonymousSession = await request('/api/auth/session', undefined, { method: 'GET' });
    assert.equal(anonymousSession.response.status, 200);
    assert.equal(anonymousSession.body.user, null);

    const badOrigin = await request('/api/auth/register', {}, { origin: 'http://attacker.example' });
    assert.equal(badOrigin.response.status, 403);

    const invalidRegistration = await request('/api/auth/register', {
      name: 'Test User',
      username: 'test_user',
      email: 'user@example.test',
      phone: '+1 (415) 555-0133',
      password: 'correct horse battery staple',
      role: 'mechanic'
    });
    assert.equal(invalidRegistration.response.status, 400);

    const emailNotConfigured = await request('/api/auth/register', {
      name: 'Test User',
      username: 'test_user',
      email: 'user@example.test',
      phone: '+1 (415) 555-0133',
      password: 'correct horse battery staple',
      role: 'customer'
    });
    assert.equal(emailNotConfigured.response.status, 503);
    assert.equal(sentEmails.length, 0);

    process.env.SMTP_HOST = 'smtp.example.test';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_SECURE = 'false';
    process.env.SMTP_USER = 'vme@example.test';
    process.env.SMTP_PASSWORD = 'test-password';
    process.env.SMTP_FROM = 'VME <vme@example.test>';

    const registration = await request('/api/auth/register', {
      name: 'Test User',
      username: 'test_user',
      email: 'user@example.test',
      phone: '+1 (415) 555-0133',
      password: 'correct horse battery staple',
      role: 'customer'
    });
    assert.equal(registration.response.status, 202);
    assert.equal(sentEmails.length, 1);
    const emailCode = sentEmails[0].text.match(/\b\d{6}\b/)[0];

    const invalidCode = await request('/api/auth/verify-email', {
      email: 'user@example.test',
      code: '000000'
    });
    assert.equal(invalidCode.response.status, 400);

    const verified = await request('/api/auth/verify-email', {
      email: 'user@example.test',
      code: emailCode
    });
    assert.equal(verified.response.status, 200);
    assert.equal(verified.body.user.role, 'customer');
    assert.equal(verified.body.user.registrationId, null);
    const initialCookie = verified.response.headers.get('set-cookie').split(';')[0];
    assert.match(verified.response.headers.get('set-cookie'), /HttpOnly/);
    assert.match(verified.response.headers.get('set-cookie'), /SameSite=Lax/);

    const anonymousDirectory = await request('/api/technicians?role=mechanic&lat=12.9716&lng=77.5946', undefined, { method: 'GET' });
    assert.equal(anonymousDirectory.response.status, 401);

    const mechanicRegistration = await request('/api/auth/register', {
      name: 'Nearby Mechanic',
      username: 'nearby_mechanic',
      email: 'mechanic@example.test',
      phone: '+1 (415) 555-0134',
      password: 'correct horse battery staple',
      role: 'mechanic',
      latitude: 12.9716,
      longitude: 77.5946
    });
    assert.equal(mechanicRegistration.response.status, 202);
    const mechanicCode = sentEmails[1].text.match(/\b\d{6}\b/)[0];
    const verifiedMechanic = await request('/api/auth/verify-email', {
      email: 'mechanic@example.test',
      code: mechanicCode
    });
    assert.equal(verifiedMechanic.response.status, 200);
    const mechanicCookie = verifiedMechanic.response.headers.get('set-cookie').split(';')[0];
    assert.match(verifiedMechanic.body.user.registrationId, /^VME-MECH-\d+$/);

    const nearbyMechanics = await request('/api/technicians?role=mechanic&lat=12.9716&lng=77.5946', undefined, {
      method: 'GET',
      cookie: initialCookie
    });
    assert.equal(nearbyMechanics.response.status, 200);
    assert.equal(nearbyMechanics.body.technicians.length, 1);
    assert.equal(nearbyMechanics.body.technicians[0].name, 'Nearby Mechanic');
    assert.equal(nearbyMechanics.body.technicians[0].distanceKm, 0);
    assert.equal('email' in nearbyMechanics.body.technicians[0], false);
    assert.equal('phone' in nearbyMechanics.body.technicians[0], false);

    const technicianDirectory = await request('/api/technicians?role=mechanic&lat=12.9716&lng=77.5946', undefined, {
      method: 'GET',
      cookie: mechanicCookie
    });
    assert.equal(technicianDirectory.response.status, 403);

    const duplicatePhoneWithoutPlus = await request('/api/auth/register', {
      name: 'Third User',
      username: 'third_user',
      email: 'third@example.test',
      phone: '14155550133',
      password: 'correct horse battery staple',
      role: 'electrician',
      latitude: 12.9716,
      longitude: 77.5946
    });
    assert.equal(duplicatePhoneWithoutPlus.response.status, 409);

    const session = await request('/api/auth/me', undefined, { method: 'GET', cookie: initialCookie });
    assert.equal(session.response.status, 200);
    assert.equal(session.body.user.email, 'user@example.test');

    const invalidRole = await request('/api/auth/login', {
      emailOrPhone: 'user@example.test',
      password: 'correct horse battery staple',
      role: 'admin'
    });
    assert.equal(invalidRole.response.status, 400);

    const loginWithRegId = await request('/api/auth/login', {
      emailOrPhone: verifiedMechanic.body.user.registrationId,
      password: 'correct horse battery staple',
      role: 'mechanic'
    });
    assert.equal(loginWithRegId.response.status, 200);
    assert.equal(loginWithRegId.body.user.name, 'Nearby Mechanic');

    const wrongRole = await request('/api/auth/login', {
      emailOrPhone: 'user@example.test',
      password: 'correct horse battery staple',
      role: 'mechanic'
    });
    assert.equal(wrongRole.response.status, 403);

    const login = await request('/api/auth/login', {
      emailOrPhone: '+1 415 555 0133',
      password: 'correct horse battery staple',
      role: 'customer',
      rememberMe: false
    });
    assert.equal(login.response.status, 200);

    const loginDigitsOnly = await request('/api/auth/login', {
      emailOrPhone: '14155550133',
      password: 'correct horse battery staple',
      role: 'customer'
    });
    assert.equal(loginDigitsOnly.response.status, 200);
    assert.doesNotMatch(login.response.headers.get('set-cookie'), /Max-Age=/);
    const loginCookie = login.response.headers.get('set-cookie').split(';')[0];

    const resetRequested = await request('/api/auth/password-reset/request', { email: 'user@example.test' });
    assert.equal(resetRequested.response.status, 202);
    const resetCode = sentEmails[2].text.match(/\b\d{6}\b/)[0];
    const reset = await request('/api/auth/password-reset/complete', {
      email: 'user@example.test',
      code: resetCode,
      password: 'a brand new secure passphrase'
    });
    assert.equal(reset.response.status, 200);

    const invalidatedSession = await request('/api/auth/me', undefined, { method: 'GET', cookie: loginCookie });
    assert.equal(invalidatedSession.response.status, 401);

    const oldPassword = await request('/api/auth/login', {
      emailOrPhone: 'user@example.test',
      password: 'correct horse battery staple',
      role: 'customer'
    });
    assert.equal(oldPassword.response.status, 401);

    const newPassword = await request('/api/auth/login', {
      emailOrPhone: 'user@example.test',
      password: 'a brand new secure passphrase',
      role: 'customer'
    });
    assert.equal(newPassword.response.status, 200);

    const logout = await request('/api/auth/logout', {}, { cookie: newPassword.response.headers.get('set-cookie') });
    assert.equal(logout.response.status, 200);
    assert.match(logout.response.headers.get('set-cookie'), /Max-Age=0/);
  } finally {
    await new Promise(resolve => server.close(resolve));
    await auth.close();
    for (const [key, value] of Object.entries(previousEnvironment)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
