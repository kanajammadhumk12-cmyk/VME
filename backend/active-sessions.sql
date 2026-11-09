SELECT
  users.id AS user_id,
  users.full_name,
  users.email,
  users.role,
  datetime(auth_sessions.created_at / 1000.0, 'unixepoch') AS created_at_utc,
  datetime(auth_sessions.expires_at / 1000.0, 'unixepoch') AS expires_at_utc
FROM auth_sessions
JOIN users ON users.id = auth_sessions.user_id
WHERE auth_sessions.expires_at > CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER)
ORDER BY auth_sessions.created_at DESC;
