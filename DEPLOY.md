# Deploying MSG

Two pieces: the **frontend** (Next.js) goes on **Vercel**, the **backend**
(FastAPI) goes on **Render**. Do the backend first so you have its URL when
setting up the frontend.

The repo is already prepped for this:
- `render.yaml` — tells Render how to build/run the backend.
- Backend reads `MSG_SECRET` and `ALLOWED_ORIGINS` from environment variables.
- Photos and `court.jpg` are now committed, so the deployed site has its images.

---

## Step 0 — Push the code to GitHub

Everything must be on GitHub first. In Terminal:

```bash
cd ~/msg
rm -f .git/index.lock .git/HEAD.lock   # clears any stale git locks
git add -A
git commit -m "Prep for deploy: images committed, env-based backend config"
git push origin dev
```

(You can deploy straight from the `dev` branch — both Render and Vercel let you
pick which branch to deploy. If you'd rather deploy from `main`, merge `dev`
into `main` first and push `main`.)

---

## Step 1 — Backend on Render

1. Go to https://render.com and sign up (free), connecting your GitHub.
2. Click **New +** → **Blueprint**.
3. Pick the `denzelchingodza/msg` repo. Render reads `render.yaml` and proposes
   a service called **msg-backend**.
4. If it asks which branch, choose the one you pushed (`dev` or `main`).
5. Click **Apply** / **Create**. Render installs deps and starts it.
6. When it's live, copy the URL at the top — something like
   `https://msg-backend.onrender.com`. **Save it.**

Quick test: open `https://msg-backend.onrender.com/api/health` in your browser.
You should see `{"status":"the Garden is open", ...}`.

> Note: the free Render tier sleeps after inactivity, so the first request
> after a while takes ~30 seconds to wake up. That's normal.

---

## Step 2 — Frontend on Vercel

1. Go to https://vercel.com and sign up (free), connecting your GitHub.
2. Click **Add New… → Project** and import the `msg` repo.
3. **Important — set the Root Directory to `frontend`** (click Edit next to
   Root Directory and pick `frontend`). Vercel auto-detects Next.js.
4. Expand **Environment Variables** and add one:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** your Render URL from Step 1 (e.g. `https://msg-backend.onrender.com`)
     — no trailing slash.
5. If it asks which branch, choose the one you pushed.
6. Click **Deploy**. After a minute you'll get a URL like
   `https://msg.vercel.app`. **Save it.**

---

## Step 3 — Let the backend trust the frontend (CORS)

The backend only accepts requests from origins it knows. Tell it your Vercel URL:

1. In **Render** → your `msg-backend` service → **Environment**.
2. Edit **ALLOWED_ORIGINS** and set it to your Vercel URL, e.g.
   `https://msg.vercel.app` (comma-separate if you have more than one).
3. Save — Render redeploys automatically.

(Vercel *preview* URLs ending in `.vercel.app` are already allowed by default,
so this mainly pins your main production domain.)

---

## Step 4 — Test it

Open your Vercel URL. Enter the Garden, spin a fact, run the gauntlet. If facts
load and the scoreboard shows numbers, the frontend and backend are talking.

If facts DON'T load:
- Wait 30s and retry (free Render backend waking up).
- Double-check `NEXT_PUBLIC_API_URL` on Vercel has no typo / no trailing slash.
- Confirm `ALLOWED_ORIGINS` on Render exactly matches your Vercel URL.
- Open the browser console (right-click → Inspect → Console) — a CORS error
  means Step 3's origin doesn't match.

---

## Updating later

Push to your deploy branch and both platforms rebuild automatically:

```bash
git add -A && git commit -m "your change" && git push
```
