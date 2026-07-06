# MSG (The Mecca, In App Form)

A New York Knicks shrine built as a real full stack app: **Next.js frontend**,
**FastAPI (Python) backend**. Made by a fan, for fans, and for anyone who has
ever asked a Knicks fan "why do you do this to yourself?" — the answer lives
in **The Faith**.

Celebrating the **2026 NBA Champions**: first chip since '73, Brunson Finals
MVP, first NBA Cup + title double in league history. Bing bong.

## What's inside

**Fact Roulette** — one button, 80 years of material. Rare pulls trigger a
Knicks colored confetti storm. The streak text escalates as you keep pressing.

**Rage Bait Machine** — hot takes engineered to end group chats ("The 25-26
Knicks sweep the 73-9 Warriors and it's only close for a half"), each with a
certified rage level and a count of rival fans who hated it. If you find
offense that's up to you.

**The Gauntlet** — 10 question multiple choice trivia runs across the '26 chip,
deep history, fanbase lore, and premium shade. Wrong answers get roasted.
Ranks climb from Tourist at the Garden to Banner Raiser.

**Trash Talk Generator** — pick a rival (Celtics, Nets, Heat, Pacers, Bulls,
Spurs, Lakers, and every other team in the East and West), receive ammunition,
fire at will.

**The Faith** — a timeline from 1946 to the parade. The sincere one. Show it to
someone who doesn't get it yet.

**Championship '26** — the Finals run game by game, from the Game 1 dagger to
the Canyon of Heroes. Drop your own photos in `frontend/public/photos/` and
they join the gallery automatically.

## Run it

You'll need **Node.js** and **Python 3**. No Docker required.

First time — install dependencies:

```bash
cd frontend && npm install && cd ..
pip install -r backend/requirements.txt
```

Then start both servers (backend on `:8000`, frontend on `:3000`) with one
command:

```bash
./dev.sh
```

Open **http://localhost:3000** and enter the Garden. Go NY go NY go.
