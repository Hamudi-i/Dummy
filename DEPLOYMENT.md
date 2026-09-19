# 🚀 CO-LAB Free Deployment Guide ($0 Total Cost)

This guide walks you through deploying **CO-LAB** completely for free using:

- **Database**: [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com) (Free PostgreSQL forever, no credit card required on Neon)
- **Backend API & WebSockets**: [Render](https://render.com) (Free Web Service)
- **Frontend**: [Vercel](https://vercel.com) (Free Hobby tier)

```
┌─────────────────────────┐          ┌─────────────────────────┐
│     Vercel (Next.js)    │  HTTPS   │      Render (Node.js)   │
│   Frontend Application  ├─────────►│  Express + WebSockets   │
│ https://<app>.vercel.app│◄─────────┤ https://<api>.onrender  │
└─────────────────────────┘   WSS    └────────────┬────────────┘
                                                  │
                                                  │ PostgreSQL (SSL)
                                                  ▼
                                     ┌─────────────────────────┐
                                     │  Neon / Supabase Cloud  │
                                     │    PostgreSQL Database  │
                                     └─────────────────────────┘
```

---

## Part 1: Set Up Free PostgreSQL Database

You need a hosted PostgreSQL database so both your local machine and Render can connect to it.

### Recommended: Neon (Easiest, No credit card)

1. Go to [https://neon.tech](https://neon.tech) and sign up with GitHub/Google.
2. Click **Create Project**, name it `colab-db`, and choose the region closest to you.
3. In your dashboard, you will immediately see **Connection Details**.
4. Copy the connection string (make sure **Pooled connection** or standard connection string is copied). It looks like:
   ```text
   postgresql://colab_owner:AbCdEf123456@ep-cool-cloud-123456.us-east-2.aws.neon.tech/colab-db?sslmode=require
   ```
5. Save this URI; this will be your `DATABASE_URL`.

_(Alternative: You can also use [Supabase](https://supabase.com). If using Supabase, go to **Project Settings -> Database -> Connection string -> URI** and select the **Session pooler** URI)._

---

## Part 2: Deploy Backend API on Render

Render will host your Express API server and Hocuspocus WebSockets for real-time collaboration.

### 1. Push your latest code to GitHub

Make sure your latest code is pushed to your GitHub repository:

```bash
git add .
git commit -m "chore: configure free deployment for render and vercel"
git push origin <your-branch>
```

### 2. Create Web Service on Render

1. Go to [https://dashboard.render.com](https://dashboard.render.com) and log in.
2. Click **New +** -> **Web Service**.
3. Select **Build and deploy from a Git repository**, then choose your `CO-LAB` repo.
4. Configure the settings:
   - **Name**: `colab-api` (or any unique name, e.g. `co-lab-api`)
   - **Region**: Select the region closest to your database
   - **Branch**: Select your deployment branch (e.g. `main` or your working branch)
   - **Root Directory**: `Backend` _(⚠️ CRITICAL: Must be `Backend` because this is a monorepo!)_
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run prisma:deploy && npm run start` _(This automatically applies database migrations and starts the server)_
   - **Instance Type**: `Free` ($0/month)

### 3. Add Environment Variables in Render

Under **Environment Variables**, click **Add Environment Variable** for each:

| Key                    | Value                                               | Description                                             |
| ---------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| `NODE_ENV`             | `production`                                        | Production mode                                         |
| `DATABASE_URL`         | _(Your Neon or Supabase connection string)_         | Database connection URI                                 |
| `JWT_SECRET`           | `replace_with_a_long_random_secret_string_32_chars` | Secret used to sign auth tokens                         |
| `REFRESH_SECRET_TOKEN` | `replace_with_another_long_random_secret_token`     | Secret used to sign refresh tokens                      |
| `BcryptHashRound`      | `10`                                                | Password hashing complexity                             |
| `BACKEND_URL`          | `https://colab-api.onrender.com`                    | Your Render service URL (copy from top of service page) |
| `FRONTEND_URL`         | `http://localhost:3000`                             | Will update to your Vercel URL in Part 4                |
| `CORS_ORIGINS`         | `http://localhost:3000`                             | Will update to your Vercel URL in Part 4                |

> 💡 **Note**: Do NOT define `PORT`. Render automatically injects `PORT=10000` which `src/index.ts` automatically listens to.

5. Click **Create Web Service**.
6. Render will install packages, run `prisma generate`, compile TypeScript, apply Prisma migrations, and start the server.
7. Once finished, click your service URL (e.g., `https://colab-api.onrender.com/health`). You should see:
   ```json
   { "status": "ok", "timestamp": "..." }
   ```

---

## Part 3: Deploy Frontend on Vercel

Vercel provides free, high-performance hosting for Next.js.

### 1. Import Project into Vercel

1. Go to [https://vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New...** -> **Project**.
3. Select your `CO-LAB` repository and click **Import**.

### 2. Configure Vercel Settings

1. **Root Directory**:
   - Click **Edit** next to Root Directory.
   - Select the `Frontend` folder and click **Continue**. _(⚠️ CRITICAL: Do not leave as root!)_
2. **Framework Preset**: Next.js (automatically detected).
3. **Build and Output Settings**: Leave as default.

### 3. Set Frontend Environment Variables

Expand **Environment Variables** and add:

| Key                   | Value                                        | Notes                                       |
| --------------------- | -------------------------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | `https://colab-api.onrender.com`             | Your Render backend URL (no trailing slash) |
| `NEXT_PUBLIC_WS_URL`  | `wss://colab-api.onrender.com/collaboration` | Secure WebSocket endpoint (`wss://`)        |

4. Click **Deploy**.
5. Vercel will build and deploy your application in ~1-2 minutes.
6. Once deployed, note down your live Vercel URL (e.g. `https://co-lab-xyz.vercel.app`).

---

## Part 4: Connect Frontend and Backend

Now that your frontend has a public URL:

1. Return to the **Render Dashboard** -> Your `colab-api` service -> **Environment**.
2. Update the following variables with your Vercel domain:
   - `FRONTEND_URL`: `https://co-lab-xyz.vercel.app`
   - `CORS_ORIGINS`: `https://co-lab-xyz.vercel.app`
3. Click **Save Changes**. Render will automatically redeploy with the updated CORS rules.

_(Note: The backend CORS configuration is already configured to automatically accept all `_.vercel.app` domains out of the box as well!)\*

---

## Part 5: Managing the Render Free Tier (Sleep & Cold Starts)

### How Render Free Tier Works

- Render's free tier spins down (sleeps) if there is no traffic for 15 minutes.
- When someone visits after it goes to sleep, the first request takes **~45-50 seconds** to wake up (cold start). Once awake, it is fast and responsive.

### Optional: Keep it awake for free ($0)

If you want to eliminate the cold start during class presentations or demos:

1. Sign up for a free account at [cron-job.org](https://cron-job.org) or [uptimerobot.com](https://uptimerobot.com).
2. Create a free HTTP monitor that pings `https://colab-api.onrender.com/health` every **10 minutes**.
3. This keeps the Render instance warm so your app always responds instantly!

---

## Part 6: (Optional) OAuth Social Logins

If you want the Google and GitHub login buttons on the login page to work:

1. In **Google Cloud Console** (Credentials -> OAuth 2.0 Client ID -> Web Application):
   - Authorized Redirect URI: `https://colab-api.onrender.com/api/auth/oauth/google/callback`
   - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to Render environment variables.
2. In **GitHub** (Settings -> Developer Settings -> OAuth Apps):
   - Authorization callback URL: `https://colab-api.onrender.com/api/auth/oauth/github/callback`
   - Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to Render environment variables.

Regular email & password signup and login works out of the box without any third-party credentials!
