# 🌊 CalmCampus

**A free, anonymous AI-powered wellness platform built for students.**

🔗 **Live demo:** [calmcampus-lilac.vercel.app](https://calmcampus-lilac.vercel.app)

CalmCampus exists because student mental health is at a breaking point — exam pressure, social anxiety, and burnout affect millions, yet most students never seek help due to stigma, cost, or simply not knowing where to start. CalmCampus removes every barrier: no sign-up with real identity, no cost, no judgment. Just open it and start.

## ✨ Features

- 🫁 **Guided Breathing** — Box, 4-7-8, Deep Belly, and Calm techniques with real-time animated guidance
- 😊 **Mood Tracker** — Daily emotional check-ins with a private journal and visual history
- 🤖 **AI Study Planner** — Describe your subjects and available hours; get a personalized 5-day study plan
- 💬 **AI Counsellor (CalmBot)** — A warm, anonymous AI chat companion for stress, anxiety, and loneliness — with real Indian crisis helplines always visible
- ✅ **Habit & Sleep Tracker** — Build 8 daily wellness habits, log sleep quality, see visual trends
- 🏆 **Gamification** — XP, levels, and 11 unlockable badges to keep engagement going
- 🎵 **Ambient Sound Mixer** — 8 calming soundscapes synthesized live in-browser via the Web Audio API — zero audio file downloads
- 🆘 **Crisis SOS** — One-tap access to grounding techniques and verified Indian mental health helplines
- 📅 **Exam Countdown** — Simple deadline tracking to reduce last-minute panic

## 🔒 Privacy by design

- No real name, email, or student ID required — pick any nickname
- No analytics on personal usage, no third-party tracking, no ads
- AI conversations are not stored anywhere
- Most features work entirely offline, client-side

## 🛠️ Tech stack

- **Frontend:** Vanilla HTML5, CSS3, and JavaScript — no frameworks, no build step
- **AI:** Llama 3.3 70B via Groq, called through a secure serverless proxy (API keys never touch the browser)
- **Audio:** Native Web Audio API for procedurally generated ambient sounds
- **Hosting:** Vercel (serverless functions + static hosting + Web Analytics)

## 📐 Architecture
calmcampus/

├── index.html      # Markup

├── style.css       # All styling

├── script.js       # All app logic, including AI calls to /api/chat

└── api/

└── chat.js      # Serverless function — holds the real AI key server-side

The frontend never talks to the AI provider directly. Every AI request goes through `/api/chat`, a serverless function that injects the real API key server-side and forwards the request. This means the key is never exposed in browser dev tools, network requests, or the public repo.

## 🚀 Getting started locally

```bash
git clone https://github.com/PalashMulchandani/calmcampus.git
cd calmcampus
```



## 👨‍💻 About

Built solo by **Palash Mulchandani**, a Computer Science student at Woxsen University, after experiencing firsthand how little accessible mental health support exists for students. Originally prototyped as "NeuroWatch" during a summer internship, then independently rebuilt and expanded into the full platform you see today.

- GitHub: [@PalashMulchandani](https://github.com/PalashMulchandani)
- Contact: palashmulchandani@gmail.com

---

*If you're a student reading this and struggling — you're not alone, and the helplines inside this app are real. Please reach out.*