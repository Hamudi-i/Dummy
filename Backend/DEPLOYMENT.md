# Deployment Guide

End-to-end deployment of this starter pack:

- Database: Supabase (managed PostgreSQL)
- Backend API (this repo): Render
- Frontend (Next.js): Vercel

```
Browser  ->  Vercel (React SPA)  ->  Render (Express API)  ->  Supabase (Postgres)
```

The backend uses Prisma with PostgreSQL; Supabase is just Postgres behind a connection string.

## OAuth: Google, GitHub, and Apple

The social-login buttons work only after each provider has an OAuth application
configured. Do this after both the backend and frontend have public HTTPS URLs.

Example deployment URLs:

```
Frontend: https://co-lab.vercel.app
Backend:  https://co-lab-api.onrender.com
```

In the Render **Environment** page, add these values (using your own URLs):

```
BACKEND_URL=https://co-lab-api.onrender.com
FRONTEND_URL=https://co-lab.vercel.app
CORS_ORIGINS=https://co-lab.vercel.app
```

Then create OAuth apps in each provider dashboard and add the matching redirect
URL below. Copy each provider's client ID and secret into the corresponding
Render environment variables. Never put a client secret in the frontend.

| Provider | Provider dashboard action | Redirect / callback URL | Backend variables |
| --- | --- | --- | --- |
| Google | Google Cloud Console → APIs & Services → Credentials → Create Credentials → OAuth client ID → Web application | `https://co-lab-api.onrender.com/api/auth/oauth/google/callback` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| GitHub | GitHub → Settings → Developer settings → OAuth Apps → New OAuth App | `https://co-lab-api.onrender.com/api/auth/oauth/github/callback` | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` |
| Apple | Apple Developer → Certificates, Identifiers & Profiles → Identifiers / Keys → Sign in with Apple | `https://co-lab-api.onrender.com/api/auth/oauth/apple/callback` | `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` |

For Apple, `APPLE_CLIENT_ID` is the Services ID. Download the generated `.p8`
key, paste its contents into `APPLE_PRIVATE_KEY` as one line, and replace every
line break with the literal characters `\\n`. Apple requires HTTPS, so it cannot
be fully tested with the plain `http://localhost` URLs.

After saving the variables, redeploy or restart the Render service. In Google,
GitHub, and Apple, update the redirect URL whenever the backend domain changes.
For local development, use `http://localhost:5000` for `BACKEND_URL`,
`http://localhost:3000` for `FRONTEND_URL`, and register the same callback paths
with those local base URLs where the provider permits it.

---

## 1. Supabase (database)

1. Create a project at https://supabase.com and set a database password.
2. Go to **Project Settings -> Database -> Connection string -> URI** and copy the **Session pooler** URI. It looks like:
   ```
   postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
   ```
   Use the **Session pooler** (IPv4). The direct `db.<ref>.supabase.co` host is IPv6-only and Render cannot reach it.
3. This URI is your `DATABASE_URL`.

Tables are created automatically on first boot because `DB_SYNCHRONIZE=true`. For a real production database, later set `DB_SYNCHRONIZE=false` and move to migrations.

---

## 2. Render (backend API)

Option A - Blueprint (recommended): Render Dashboard -> **New -> Blueprint** -> select this repo. It reads [`render.yaml`](render.yaml).

Option B - Manual: **New -> Web Service** from this repo with:
- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Health check path: `/ebev1`

### Environment variables (Render dashboard)

| Variable | Value / notes |
| --- | --- |
| `DATABASE_URL` | Supabase Session pooler URI (from step 1) |
| `DB_SSL` | `true` |
| `DB_SYNCHRONIZE` | `true` for first deploy |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | long random string (rotate the old one) |
| `REFRESH_SECRET_TOKEN` | long random string (rotate the old one) |
| `BcryptHashRound` | `10` |
| `CORS_ORIGINS` | your Vercel URL, e.g. `https://your-app.vercel.app` |
| `BREVO_API_KEY` | Brevo transactional email key (rotate the old one) |
| `BREVO_SENDER_EMAIL` | verified sender email |
| `BREVO_SENDER_NAME` | sender display name |
| `MINIO_*` | file storage config (see Storage note below) |

Do NOT set `PORT` - Render provides it and the app reads `process.env.PORT`.

After deploy, your API is at `https://<service>.onrender.com` (root health check: `/ebev1`).

Note: Render's free tier spins down after ~15 min idle; the first request then takes ~50s to wake.

---

## 3. Vercel (frontend)

Import the `frontend/` directory into Vercel, then add `NEXT_PUBLIC_API_URL` with your
backend URL, for example `https://co-lab-api.onrender.com`. Deploy it and copy the
generated Vercel URL into the backend's `FRONTEND_URL` and `CORS_ORIGINS` values.

After the frontend is live, set `CORS_ORIGINS` on Render to the Vercel URL and redeploy the backend.

---

## 4. Seed the first admin (required to log in)

There is no public signup, so create a SuperAdmin once:

```bash
# from backend-starter-pack/, with DATABASE_URL + DB_SSL=true set in .env
npm install
SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='StrongPass123!' npm run seed
```

This runs [`scripts/seed-admin.ts`](scripts/seed-admin.ts), which creates the SuperAdmin role, the admin user (bcrypt-hashed password), and links them. It is idempotent (safe to re-run). Defaults are `admin@example.com` / `Admin@12345` if you omit the env vars.

---

## 5. File storage (MinIO) - current limitation

Uploads (school logos, user profile pictures) go to MinIO via `MINIO_*`. There is no MinIO server in this Supabase/Render/Vercel setup, so uploads will fail until `MINIO_*` points to a reachable S3-compatible endpoint. Options for later:

- Point `MINIO_*` at a hosted MinIO or any S3-compatible service.
- Switch the storage layer to Supabase Storage or Cloudflare R2 (small change in `src/common/minio-service.ts`).

Everything except file uploads works without this.

---

## Environment variable reference

See [`.env.example`](.env.example) for the full local list. For local development you can use discrete `POSTGRES_*` vars instead of `DATABASE_URL`.
