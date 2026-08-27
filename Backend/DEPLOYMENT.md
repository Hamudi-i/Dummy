# Deployment Guide

End-to-end deployment of this starter pack:

- Database: Supabase (managed PostgreSQL)
- Backend API (this repo): Render
- Frontend (React SPA): Vercel

```
Browser  ->  Vercel (React SPA)  ->  Render (Express API)  ->  Supabase (Postgres)
```

The backend keeps TypeORM unchanged; Supabase is just Postgres behind a connection string.

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

See the frontend repo's `DEPLOYMENT.md`. In short: import the frontend repo, set `VITE_API=https://<service>.onrender.com/ebev1`, deploy.

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
