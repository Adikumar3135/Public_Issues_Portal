# Public Issue Portal – setup

## Requirements
- Node.js 20.19+ or 22.12+
- MongoDB connection configured for the backend

## Install dependencies
Open two terminals.

### Backend
```bash
cd server
npm install
```
Create `server/.env` using `.env.example`, then fill in `MONGODB_URI` and a strong `JWT_SECRET` (at least 32 characters). Do not share or commit `.env`.

Start:
```bash
npm run dev
```

### Frontend
```bash
cd client
npm install
```
Optional: create `client/.env` from `.env.example` if your API is not at `http://localhost:5000/api`.

Start:
```bash
npm run dev
```

## Routes
- `/` – Login
- `/register` – Citizen registration
- `/citizen/dashboard` – Citizen-only
- `/admin/dashboard` – Admin-only
- `/staff/dashboard` – Municipal staff-only

The frontend route guards improve navigation but are not a substitute for backend authorization. The Express API must continue enforcing roles.

## Notes
- `node_modules` is intentionally excluded. Run `npm install` in both `client` and `server`.
- The real `server/.env` is intentionally excluded for security. Create it locally from `server/.env.example`.
