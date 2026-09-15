"""MSG API — everything the frontend needs, nothing it should compute itself.

Run:  uvicorn app.main:app --reload --port 8000  (from backend/)
Docs: http://localhost:8000/docs
"""
import os
import random
import time
from collections import defaultdict, deque

from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from . import security
from .content import CONTENT

app = FastAPI(title="MSG API", version="1.0.0",
              description="The Mecca, in API form. Go NY Go.")

# ── Lightweight in-memory rate limiting ───────────────────────────────────
# No external dependency (keeps the single-worker Render deploy simple). A
# sliding window per client IP: at most RATE_MAX requests per RATE_WINDOW
# seconds against /api/*. Good enough to blunt accidental hammering and casual
# abuse; a real multi-instance deploy would move this to Redis.
RATE_WINDOW = 60.0
RATE_MAX = 120
_hits: dict[str, deque] = defaultdict(deque)


def _client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@app.middleware("http")
async def rate_limit(request: Request, call_next):
    if request.url.path.startswith("/api/"):
        ip = _client_ip(request)
        now = time.monotonic()
        q = _hits[ip]
        while q and now - q[0] > RATE_WINDOW:
            q.popleft()
        if len(q) >= RATE_MAX:
            retry = int(RATE_WINDOW - (now - q[0])) + 1
            return JSONResponse(
                status_code=429,
                content={"error": "Easy, killer",
                         "detail": "Too many shots too fast. Take a breather and try again.",
                         "retry_after": retry},
                headers={"Retry-After": str(retry)},
            )
        q.append(now)
        # Keep the table from growing without bound.
        if len(_hits) > 5000:
            for k in [k for k, v in list(_hits.items()) if not v]:
                _hits.pop(k, None)
    return await call_next(request)


@app.exception_handler(404)
async def not_found(request: Request, exc):
    """Friendly, on-brand 404 for unknown API routes."""
    if request.url.path.startswith("/api/"):
        return JSONResponse(
            status_code=404,
            content={"error": "Airball",
                     "detail": f"No play called '{request.url.path}'. Check the endpoint.",
                     "docs": "/docs"},
        )
    return JSONResponse(status_code=404, content={"error": "Not found"})

# Local dev origins, plus any set via ALLOWED_ORIGINS (comma-separated) for
# production — e.g. "https://your-app.vercel.app". The regex also lets every
# Vercel preview deploy (*.vercel.app) talk to the API without extra config.
_default_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
_env_origins = [o.strip() for o in os.environ.get("ALLOWED_ORIGINS", "").split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_default_origins + _env_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

RARE_CHANCE = 0.14
QUIZ_RUN_LENGTH = 10


@app.get("/api/health")
def health():
    return {"status": "the Garden is open", "champs": True, "since": "June 13, 2026"}


@app.get("/api/pull")
def pull_fact(exclude: str = ""):
    """One roulette pull. Rarity is decided server-side so odds stay honest."""
    recent = set(filter(None, exclude.split("|")))
    facts = CONTENT["facts"]
    pool = ([f for f in facts if f["rare"]]
            if random.random() < RARE_CHANCE
            else [f for f in facts if not f["rare"]])
    fresh = [f for f in pool if f["text"] not in recent] or pool
    fact = random.choice(fresh)
    return {"text": fact["text"], "rare": fact["rare"], "tag": fact["tag"]}


@app.get("/api/quiz/run")
def quiz_run():
    """A 10-question Gauntlet run with pre-shuffled options."""
    quiz = CONTENT["quiz"]
    questions = random.sample(quiz["questions"],
                              min(QUIZ_RUN_LENGTH, len(quiz["questions"])))
    out = []
    for q in questions:
        order = list(range(len(q["o"])))
        random.shuffle(order)
        out.append({
            "q": q["q"],
            "options": [q["o"][i] for i in order],
            "correct": order.index(q["a"]),
            "why": q["why"],
            "cat": q["cat"],
        })
    return {"questions": out, "praise": quiz["praise"], "roast": quiz["roast"],
            "ranks": quiz["ranks"]}


@app.get("/api/buzzer")
def buzzer():
    """Beat the Buzzer: the whole question pool, shuffled, for rapid fire."""
    quiz = CONTENT["quiz"]
    qs = list(quiz["questions"])
    random.shuffle(qs)
    out = []
    for q in qs:
        order = list(range(len(q["o"])))
        random.shuffle(order)
        out.append({
            "q": q["q"],
            "options": [q["o"][i] for i in order],
            "correct": order.index(q["a"]),
            "cat": q["cat"],
        })
    return {"questions": out}


@app.get("/api/take")
def hot_take():
    take = random.choice(CONTENT["hot_takes"]["takes"])
    return {**take,
            "hated_by": random.randint(4_200, 987_000),
            "next_label": random.choice(CONTENT["hot_takes"]["button_labels"])}


@app.get("/api/trash/teams")
def trash_teams():
    return {"teams": [{"name": t["name"], "nickname": t["nickname"],
                       "abbr": t.get("abbr", t["name"][:3].upper()),
                       "conf": t.get("conf", "East")}
                      for t in CONTENT["trash_talk"]["teams"]]}


@app.get("/api/trash/{team_idx}")
def trash_line(team_idx: int):
    teams = CONTENT["trash_talk"]["teams"]
    team = teams[team_idx % len(teams)]
    return {"team": team["name"], "nickname": team["nickname"],
            "line": random.choice(team["lines"]),
            "closer": random.choice(CONTENT["trash_talk"]["closers"])}


@app.get("/api/faith")
def faith():
    return CONTENT["faith"]


@app.get("/api/gallery")
def gallery():
    return CONTENT["gallery"]


class SyncBody(BaseModel):
    blob: str | None = None
    event: str | None = None  # fact | rare | take | quiz_best
    value: int = 0


@app.post("/api/profile/sync")
def profile_sync(body: SyncBody):
    profile, tampered = security.decode(body.blob)
    profile = security.touch_streak(profile)

    if body.event == "fact":
        profile["total_facts"] += 1
    elif body.event == "rare":
        profile["total_facts"] += 1
        profile["rare_pulls"] += 1
    elif body.event == "take":
        profile["takes_generated"] += 1
    elif body.event == "quiz_best" and body.value > profile["best_quiz"]:
        profile["best_quiz"] = body.value
        ranks = CONTENT["quiz"]["ranks"]
        title = ranks[0]["title"]
        for r in ranks:
            if body.value * 3 >= r["min"]:
                title = r["title"]
        profile["best_quiz_rank"] = title

    return {"profile": profile, "blob": security.encode(profile),
            "tampered": tampered}


# ── MSG Hoops second-screen relay ─────────────────────────────────────────
# A dumb message relay so a phone (role=pad) can drive the game shown on a
# desktop (role=host). Both connect to the same room code; anything one sends
# is forwarded to the other. All game logic stays client-side on the host.
_rooms: dict[str, dict[str, set]] = {}


async def _relay(group: set, msg: dict):
    dead = []
    for client in list(group):
        try:
            await client.send_json(msg)
        except Exception:
            dead.append(client)
    for client in dead:
        group.discard(client)


MAX_ROOMS = 500          # total concurrent rooms
MAX_PER_ROLE = 4         # host/pad sockets per room (allows a reconnect blip)


@app.websocket("/ws/hoops/{room}")
async def hoops_ws(ws: WebSocket, room: str, role: str = "pad"):
    await ws.accept()
    room = room.upper()[:6]
    role = "host" if role == "host" else "pad"
    other = "pad" if role == "host" else "host"

    # Refuse to spin up unbounded rooms/sockets.
    existing = _rooms.get(room)
    if existing is None and len(_rooms) >= MAX_ROOMS:
        await ws.send_json({"t": "full", "reason": "server_busy"})
        await ws.close()
        return
    r = _rooms.setdefault(room, {"host": set(), "pad": set()})
    if len(r[role]) >= MAX_PER_ROLE:
        await ws.send_json({"t": "full", "reason": "room_full"})
        await ws.close()
        if not r["host"] and not r["pad"]:
            _rooms.pop(room, None)
        return
    r[role].add(ws)

    # Announce this peer to the other side, and tell this peer if the other is here.
    await _relay(r[other], {"t": "peer", "role": role, "joined": True})
    try:
        await ws.send_json({"t": "ready", "peers": len(r[other])})
        while True:
            data = await ws.receive_json()
            await _relay(r[other], data)
    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        r[role].discard(ws)
        await _relay(r[other], {"t": "peer", "role": role, "joined": False})
        if not r["host"] and not r["pad"]:
            _rooms.pop(room, None)
