# Vercel Deployment Guide — Nexus Talent AI Job Tracker

## Architecture on Vercel

```
vercel.app
├── /            → frontend/dist (Vite static build)
├── /api/*       → backend/api/index.ts (Node.js serverless function)
└── /*           → index.html (SPA fallback for React Router)
```

## Prerequisites

- [Vercel account](https://vercel.com/signup) (free tier works)
- [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (free M0 tier works)
- [OpenRouter API key](https://openrouter.ai/) for AI features

---

## Step 1 — Set up MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → create a free **M0** cluster
2. Under **Database Access** → add a user with **Read/Write** privileges
3. Under **Network Access** → add `0.0.0.0/0` (allow all IPs — required for Vercel serverless)
4. Click **Connect → Drivers** and copy the connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/nexus-talent?retryWrites=true&w=majority
   ```

---

## Step 2 — Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Push your code to GitHub (if not already done)
2. Go to [vercel.com/new](https://vercel.com/new) → **Import Git Repository**
3. Select your repository
4. Vercel will auto-detect settings from `vercel.json` — **no changes needed**
5. Click **Deploy**

### Option B: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## Step 3 — Set Environment Variables in Vercel

Go to your project → **Settings → Environment Variables** and add:

| Variable | Value | Required |
|---|---|---|
| `MONGO_URI` | `mongodb+srv://...` | ✅ Yes |
| `JWT_SECRET` | A long random string (32+ chars) | ✅ Yes |
| `OPENROUTER_API_KEY` | Your OpenRouter key | ✅ Yes |
| `FRONTEND_URL` | `https://your-project.vercel.app` | Recommended |

> **Generate a secure JWT_SECRET:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

After adding all variables, **Redeploy** the project.

---

## Step 4 — Verify Deployment

Check these URLs work:

- `https://your-project.vercel.app` → React app loads
- `https://your-project.vercel.app/api/health` → Returns `✅ AI Job Tracker API is healthy and running`

---

## Custom Domain (Optional)

Go to **Settings → Domains** and add your custom domain. Once added, update the `FRONTEND_URL` env var to your custom domain.

---

## Local Development (unchanged)

```bash
# Backend (runs on :5000)
cd backend && npm run dev

# Frontend (runs on :5173, proxies /api → :5000)
cd frontend && npm run dev
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `CORS error` | Add your Vercel URL to `FRONTEND_URL` env var |
| `Database connection failed` | Check `MONGO_URI` is correct and Atlas allows `0.0.0.0/0` |
| `Function timeout` | Upgrade Vercel plan or optimize queries |
| `404 on page refresh` | Already handled — vercel.json SPA rewrite is in place |
