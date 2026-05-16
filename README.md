# 🌿 GreenReward v5 — Setup Guide

## What's New in v5
- ✅ MySQL database (all data permanently saved)
- ✅ Smooth dark/light mode (no flash between pages)
- ✅ Live weather by city name (OpenWeatherMap API)
- ✅ AI chatbot (Anthropic Claude API + smart rule-based fallback)
- ✅ Add ANY custom plant — not limited to the library

---

## STEP 1 — Install MySQL

### Windows
1. Download from https://dev.mysql.com/downloads/installer/
2. Choose "Developer Default" → install
3. Set a root password — remember it!

### Mac
```bash
brew install mysql
brew services start mysql
```

---

## STEP 2 — Create Database

Open MySQL Command Line and run:
```sql
CREATE DATABASE greenreward;
```
That's all! Tables are created automatically when you start the server.

---

## STEP 3 — Get API Keys (both are FREE)

### OpenWeatherMap (Live Weather)
1. Go to https://openweathermap.org/api
2. Click Sign Up (free)
3. Go to My API Keys → copy your key

### Anthropic Claude (AI Chatbot) — Optional
1. Go to https://console.anthropic.com
2. Create account → API Keys → Create key
3. Note: Chatbot works without this too (uses smart rule-based replies)

---

## STEP 4 — Edit the .env File

Open `.env` in VS Code and fill in:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=greenreward

JWT_SECRET=greenreward_change_this_string_2025

WEATHER_API_KEY=paste_openweathermap_key_here

ANTHROPIC_API_KEY=paste_claude_key_here_optional
```

---

## STEP 5 — Install Packages

Open terminal in project folder and run:
```bash
npm install
```

---

## STEP 6 — Start the Server

```bash
node server.js
```

You should see:
```
🌿 GreenReward v5 running at http://localhost:3000
📊 MySQL: localhost/greenreward  
🌤  Weather API: Connected
🤖 AI Chatbot: Anthropic Claude
```

Open browser: **http://localhost:3000**

---

## STEP 7 — Add Your Plant Photos

1. Open `public/plant-photos/` in File Explorer
2. Drop in your .jpg photos named exactly: `neem.jpg`, `tulsi.jpg` etc.
3. See `public/plant-photos/README.txt` for the full list

---

## Troubleshooting

| Error | Fix |
|---|---|
| `Error: connect ECONNREFUSED` | MySQL is not running. Start it first. |
| `ER_ACCESS_DENIED_ERROR` | Wrong DB_USER or DB_PASSWORD in .env |
| `ER_BAD_DB_ERROR` | Run `CREATE DATABASE greenreward;` in MySQL |
| `Cannot find module 'mysql2'` | Run `npm install` again |
| Weather shows "Demo data" | Add WEATHER_API_KEY to .env |
| Chatbot gives simple answers | Add ANTHROPIC_API_KEY to .env |

---

## Dev Mode (auto-restart on file changes)
```bash
npm run dev
```

---

## Team GreenReward
Disha Patil · Ragini Telange · Samiisha Atirkar · Shubhangi Kale
www.greenreward.com
