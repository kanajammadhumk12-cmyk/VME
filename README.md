# VME

VME includes a browser frontend and a Node.js backend with SQLite-backed user accounts, scrypt password hashing, email verification, and secure HTTP-only sessions.

- `frontend/` contains the HTML, CSS, and browser JavaScript.
- `backend/` contains the HTTP server and authentication service.
- User records and sessions are stored in `backend/data/vme.sqlite` by default. Set `VME_DB_PATH` to use a different SQLite file.

## EV service reporting

When a customer selects an EV bike, scooter, or car in the booking wizard, VME shows the vehicle-specific mechanical and electrical issue list with typical complaint descriptions. The wizard also provides suggested service categories, professional type, safety guidance, and EV report fields including registration number and optional photo/video selection. This reference dataset is maintained in `frontend/js/ev-data.js`.

## Configure email

Registration verification and password reset codes are sent through your SMTP provider. Copy `.env.example` to `.env` and configure your SMTP credentials. Keep `.env` private; it is ignored by Git.

```powershell
Copy-Item .env.example .env
```

If SMTP is not configured, the app still starts, but sign-up and password-reset requests return an explicit configuration error rather than pretending an email was sent.

## Install and run

Use Node.js 22.13 or later. From the project root:

```powershell
npm install
npm start
```

Open <http://localhost:3000>. To open VME on another device connected to the same Wi-Fi, use one of the `Share on your local network` URLs printed by the server. Keep the computer running and allow Node.js through Windows Firewall on your private network if prompted. These local-network links are not public internet links.

On first start, the backend creates the SQLite database and authentication tables, and generates a private authentication secret alongside the database file. Back up the database and secret securely; the secret is needed to verify email codes.

## Authentication

- Register with an email address, phone number, account role, and password of at least 12 characters.
- Mechanic and electrician registrations must share a workshop location. Verified technicians appear by name and distance in customer searches within 25 km; their coordinates and contact details are not included in directory results.
- Enter the one-time code sent to that email to verify the account and sign in.
- Sessions use random, server-stored tokens in HTTP-only, same-site cookies. “Remember me” keeps a session for seven days; otherwise it expires after 12 hours and the browser cookie is cleared when the browser session ends.
- Password reset codes are emailed, expire after ten minutes, and invalidate existing sessions when the password changes.

Run the authentication tests with:

```powershell
npm test
```
