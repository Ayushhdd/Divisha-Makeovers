# Divisha Makeovers

Combined project for the Divisha Makeovers public website, booking/admin portal, and backend API.

## Project Structure

```text
.
├── src/                 # Main Next.js public website
├── public/              # Website assets
├── backend/             # Express + MongoDB API for auth, services, appointments, payments, admin
└── portal-frontend/     # Vite React customer/admin portal
```

## First-Time Setup

Install dependencies for each app:

```bash
npm install
npm run install:backend
npm run install:portal
```

Create local env files from the examples:

```bash
copy backend\.env.example backend\.env
copy portal-frontend\.env.example portal-frontend\.env
```

Then update `backend/.env` with the real MongoDB, JWT, email, and admin values.

## Run Locally

Run the local project. This starts the backend API and the main website:

```bash
npm run dev
```

Run only the main website:

```bash
npm run dev:site
```

Run only the backend API:

```bash
npm run dev:backend
```

Run the customer/admin portal:

```bash
npm run dev:portal
```

Build the portal into the main website so `/portal/divisha/dashboard` works from the public site:

```bash
npm run build:portal
```

Default local URLs:

- Website: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`
- Website-to-backend proxy: `http://localhost:3000/backend-api`
- Portal: Vite will print the local URL, usually `http://localhost:5173`
- Combined portal route from the website: `http://localhost:3000/portal/divisha/dashboard`

## Backend API

Backend docs are in:

- `backend/API.md`
- `backend/SCHEMA.md`

Important backend routes:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/services`
- `POST /api/appointments`
- `POST /api/payments`
- `GET /api/admin/settings/public`

## Notes

- `.env` files are local only and should not be committed.
- Uploaded payment screenshots are stored under `backend/uploads/`.
- The portal frontend reads `VITE_API_URL`; locally it defaults to `http://localhost:5000/api`.
