# Placement Tracker

Full-stack app for a placement coordinator to manage students, company drives and who applied / got shortlisted / selected.

**Stack:** React (Vite) + Node.js/Express + MySQL, JWT authentication.

## Setup
1. MySQL: run `server/schema.sql` (e.g. `mysql -u root -p < server/schema.sql`).
2. Server: `cd server && cp .env.example .env` (fill in DB password and JWT secret), then `npm install && npm run dev`.
3. Client: `cd client && npm install && npm run dev`, open http://localhost:5173.
4. First visit: click "First time? Create the account" to create the coordinator login.

## Structure
- `server/routes/*` one file per resource (auth, students, drives, applications)
- `server/middleware/auth.js` JWT check; every route except /api/auth is protected
- `applications` table links students and drives (many-to-many) and stores the status
- `client/src/App.jsx` pages as small components; `api.js` wraps fetch and adds the token

## Possible improvements
Edit student/drive, Excel import, email notifications, pagination, tests.
