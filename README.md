# CalmCampus — Deployment Guide

## What changed from the artifact version
The two AI features (AI Study Planner + AI Counsellor) used to call
`api.anthropic.com` directly from the browser. That only worked inside the
Claude.ai artifact preview, which secretly injects auth for you. Outside that
sandbox there's no key at all, so both features would just fail.

Fix: `index.html` now calls `/api/chat` (a function that lives on your own
domain). That function — `api/chat.js` — holds your real Anthropic API key
as a server-side environment variable and forwards the request. The key
never reaches the browser or any client-side JS.

## Folder structure
```
calmcampus/
├── index.html      ← your app (frontend only, no key inside)
└── api/
    └── chat.js      ← serverless function, holds the real key
```

## Steps to deploy

### 1. Get an Anthropic API key
- Go to https://console.anthropic.com → API Keys → Create Key
- Copy it (starts with `sk-ant-...`). You'll need billing set up on that
  Anthropic account since API usage is pay-as-you-go (separate from any
  Claude.ai subscription).

### 2. Push this folder to GitHub
```bash
cd calmcampus
git init
git add .
git commit -m "CalmCampus - frontend + serverless AI proxy"
git branch -M main
git remote add origin https://github.com/palashmulchandani/calmcampus.git
git push -u origin main
```

### 3. Import into Vercel
- Go to https://vercel.com/new
- Import the `calmcampus` GitHub repo
- Framework preset: "Other" (it's static HTML + one serverless function —
  Vercel auto-detects anything in `/api` as a function, no config needed)
- Before clicking Deploy, add an Environment Variable:
  - Key: `ANTHROPIC_API_KEY`
  - Value: your `sk-ant-...` key
  - Scope: Production (and Preview if you want PR previews to work too)
- Click Deploy

### 4. Test it live
- Open your `*.vercel.app` URL
- Try the AI Study Planner and the AI Counsellor — both should now work
  through `/api/chat`
- Open browser dev tools → Network tab → confirm you never see your API key
  anywhere in the requests (you shouldn't, since it never leaves the server)

## Notes
- If you rotate/regenerate the key later, update it in Vercel's env vars —
  no code change needed.
- Free Vercel hobby tier is enough for this; serverless function cold starts
  are sub-second for a payload this small.
- If `generatePlan()` or `sendChat()` ever show "AI error", it's almost
  always one of: missing env var, no billing on the Anthropic account, or
  rate limiting — check the Vercel function logs (Project → Deployments →
  the function → Logs) for the exact error message.
 
