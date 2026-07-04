# MSG — The Mecca, In App Form

A New York Knicks shrine built as a real full-stack app: **Next.js frontend**,
**FastAPI (Python) backend**. Made by a fan, for fans, and for anyone who has
ever asked a Knicks fan "why do you do this to yourself?" — the answer lives
in **The Faith**.

Celebrating the **2026 NBA Champions**: first chip since '73, Brunson Finals
MVP, first NBA Cup + title double in league history. Bing bong.

## What's inside

**Fact Roulette** — one button, 80 years of material. Rare pulls trigger a
Knicks-colored confetti storm. The streak text escalates as you keep pressing.

**Rage Bait Machine** — hot takes engineered to end group chats ("The 25-26
Knicks sweep the 73-9 Warriors and it's only close for a half"), each with a
certified rage level and a count of rival fans who hated it.

**The Gauntlet** — 10-question multiple-choice trivia runs across the '26
chip, deep history, fanbase lore, and premium shade. Wrong answers get
roasted. Ranks climb from Tourist at the Garden to Banner Raiser.

**Trash Talk Generator** — pick a rival (Celtics, Nets, Heat, Pacers, Bulls,
Spurs, Lakers), receive ammunition, fire at will.

**Championship '26** — the Finals run game by game, from the Game 1 dagger to
the Canyon of Heroes. Drop your own photos in `frontend/public/photos/` and
they join the gallery automatically.

**The Faith** — a timeline from 1946 to the parade. The sincere one. Show it
to someone who doesn't get it yet.

## Architecture

```
msg/
├── backend/                 # FastAPI — Python
│   ├── app/
│   │   ├── main.py          # all API endpoints
│   │   ├── security.py      # HMAC-signed fan profiles + daily streaks
│   │   └── content.py       # loads data/*.json at startup
│   ├── data/                # ALL content — facts, takes, quiz, trash talk
│   └── requirements.txt
├── frontend/                # Next.js 15 (App Router) — TypeScript
│   ├── app/                 # one folder per section
│   ├── lib/                 # API client + confetti helper
│   └── public/photos/       # your championship photos (gitignored)
└── dev.sh                   # runs both servers
```

The backend owns all game logic: rarity odds, quiz shuffling, streak math,
profile signing. The frontend is presentation + celebration. Content is pure
JSON in `backend/data/` — add facts, takes, and questions without touching
code.

## Run it

```bash
# backend (terminal 1)
cd backend
pip install -r requirements.txt
python3 -m uvicorn app.main:app --reload --port 8000

# frontend (terminal 2)
cd frontend
npm install
npm run dev
```

Or both at once: `./dev.sh` (after `chmod +x dev.sh`, one time).

Open **http://localhost:3000**. API docs live at http://localhost:8000/docs.

## Streaks, saves, and security

Your fan profile — daily streak, facts revealed, rare pulls, best Gauntlet
run, war crimes generated — is stored in your browser as an **opaque
HMAC-SHA256-signed blob**. Every sync, the backend verifies the signature
before trusting a single number. Hand-edit localStorage to fake a 999-day
streak and the server resets you and judges you on the home page. Real fans
don't cheat.

Other security measures:

- Signing secret is generated on first run (`backend/.secret`), never
  committed (gitignored), never sent to the client
- CORS locked to `localhost:3000`
- No accounts, no tracking, no third-party calls — everything is local
- Photos folder is gitignored: NBA/Getty images are copyrighted, keep them
  local; your own photos are yours to commit or not

## GitHub workflow (dev → main)

```bash
# one-time setup — create an empty repo named msg on GitHub first
git init
git add .
git commit -m "MSG v1.0 — the Garden opens"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/msg.git
git push -u origin main
git checkout -b dev
git push -u origin dev

# day-to-day: work on dev, ship via PR
git checkout dev
# ...changes...
git add . && git commit -m "add 10 more gauntlet questions"
git push
# open PR: dev → main on GitHub
```

Then protect `main`: GitHub → Settings → Branches → Add rule → `main` →
require a pull request before merging.

## Adding content

| File | Feeds |
|---|---|
| `backend/data/facts.json` | Fact Roulette (mark bangers `"rare": true`) |
| `backend/data/hot_takes.json` | Rage Bait Machine |
| `backend/data/quiz.json` | The Gauntlet (answer is index `"a"`; options shuffle at runtime) |
| `backend/data/trash_talk.json` | Trash Talk Generator |
| `backend/data/faith.json` | The Faith timeline |
| `backend/data/gallery.json` | Championship story cards |

Restart the backend after editing.

## Roadmap

- [ ] Share cards — render a hot take as a downloadable PNG for group chats
- [ ] Konami code easter egg: the Go NY Go chant takes over the screen
- [ ] Season countdown on the home page
- [ ] Walt Frazier mode: every UI string gets Clyde-ified
- [ ] Deploy: frontend on Vercel, backend on Fly.io/Render

## Credits

Built by Denzel — Knicks fan, therefore an optimist with scar tissue.
Facts verified against NBA.com's 2026 Finals coverage. All trash talk is
affectionate. Mostly.

*Bing bong.*
