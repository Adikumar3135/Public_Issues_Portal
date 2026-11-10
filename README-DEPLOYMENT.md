# Public Issue Reporting & Resolution Portal

Full-stack project: React + Vite + Tailwind CSS v4 client, Express 5 + MongoDB/Mongoose API.

## Features included

- Citizen: register/login, submit complaint, view/search/filter complaints, complaint details and history, notifications and profile.
- Admin: live dashboard, review queue, approve/reject complaints, route to departments, assign staff, create/deactivate departments and staff, analytics.
- Municipal staff: assigned work queue, start work and resolve complaints with a resolution note.
- JWT bearer authentication, role-protected routes, API error/loading/empty states and responsive layouts.

## Local setup

Requirements: Node.js 20.19+ or 22.12+, MongoDB Atlas/local MongoDB.

### 1. Backend

```bash
cd server
cp .env.example .env
```

Set `MONGODB_URI` and a unique `JWT_SECRET` (at least 32 characters). Set admin seed variables if creating the first admin.

```bash
npm install
npm run dev
```

API health check: `http://localhost:5000/api/health`

Create first admin (after setting ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in server/.env):

```bash
npm run seed:admin
```

### 2. Frontend

In another terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Open the Vite URL shown in terminal (normally `http://localhost:5173`).

## Important first-run order

1. Start MongoDB and backend.
2. Seed the first administrator using `npm run seed:admin`.
3. Sign in as admin.
4. Create at least one active department.
5. Create municipal staff and assign each to a department.
6. Citizen can register from the public registration page.
7. Citizen submits a complaint.
8. Admin starts review, approves it into a department, then assigns a staff member from that same department.
9. Staff starts work and resolves the complaint with a resolution note.
10. Citizen sees status history and notifications.

Citizen registration is public. Admin and municipal accounts must be created by an admin.

## Deployment

### Backend (Render, Railway, or similar)

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN=1d`, `CLIENT_URL=https://YOUR-FRONTEND-DOMAIN`
- Optional first admin seed variables: `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`; run `npm run seed:admin` once from the deployed service shell or locally against the production database, then remove the seed password variables.
- Do not commit or upload `.env`.

### Frontend (Vercel, Netlify, etc.)

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api`
- Redeploy after changing environment variables.

### SPA routing

Configure your hosting provider to rewrite unknown frontend paths to `/index.html` so React Router routes work on refresh. Vercel can use the included `vercel.json`.

## Security / production notes

- Never commit `.env`, MongoDB credentials, JWT secrets or seed passwords.
- This learning project stores JWT in sessionStorage; an XSS vulnerability can expose it. For a hardened production deployment, migrate to Secure, HttpOnly, SameSite cookies and add CSRF protection.
- Use HTTPS, a strong unique JWT secret, database network restrictions and least-privilege DB credentials.
- Test all roles against the deployed API before inviting real users.
- The backend does not currently implement image upload, password reset, profile editing, bulk mark-read, or live socket notifications. The client does not show controls for those unsupported actions.
