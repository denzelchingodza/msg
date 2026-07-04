"""Signed fan profiles.

The browser stores the profile as an opaque signed blob (payload + HMAC).
Every sync the server verifies the signature before trusting any numbers —
hand-edit localStorage to fake a 999-day streak and the server resets you.
Real fans don't cheat.

The signing secret is generated on first run at backend/.secret and is
gitignored. Rotating it invalidates existing profiles (acceptable for a toy).
"""
import base64
import datetime
import hashlib
import hmac
import json
import secrets
from pathlib import Path

SECRET_PATH = Path(__file__).resolve().parent.parent / ".secret"

FRESH = {
    "total_facts": 0,
    "rare_pulls": 0,
    "best_quiz": 0,
    "best_quiz_rank": "TOURIST AT THE GARDEN",
    "takes_generated": 0,
    "day_streak": 0,
    "last_played": None,
}


def _secret() -> bytes:
    if not SECRET_PATH.exists():
        SECRET_PATH.write_text(secrets.token_hex(32), encoding="utf-8")
        try:
            SECRET_PATH.chmod(0o600)
        except OSError:
            pass
    return SECRET_PATH.read_text(encoding="utf-8").strip().encode()


def _sign(payload: dict) -> str:
    blob = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
    return hmac.new(_secret(), blob, hashlib.sha256).hexdigest()


def encode(profile: dict) -> str:
    payload = {k: profile.get(k, FRESH[k]) for k in FRESH}
    wrapped = {"data": payload, "sig": _sign(payload)}
    return base64.urlsafe_b64encode(json.dumps(wrapped).encode()).decode()


def decode(blob: str | None) -> tuple[dict, bool]:
    """Return (profile, tampered). Missing/invalid blob → fresh profile."""
    if not blob:
        return dict(FRESH), False
    try:
        wrapped = json.loads(base64.urlsafe_b64decode(blob.encode()))
        payload, sig = wrapped.get("data", {}), wrapped.get("sig", "")
        if not hmac.compare_digest(_sign(payload), sig):
            return dict(FRESH), True
        profile = dict(FRESH)
        profile.update({k: payload[k] for k in FRESH if k in payload})
        return profile, False
    except (ValueError, KeyError, TypeError):
        return dict(FRESH), True


def touch_streak(profile: dict) -> dict:
    """Duolingo-style daily streak, updated server-side."""
    today = datetime.date.today()
    last = profile.get("last_played")
    if last != today.isoformat():
        yesterday = (today - datetime.timedelta(days=1)).isoformat()
        profile["day_streak"] = (profile.get("day_streak", 0) + 1
                                 if last == yesterday else 1)
    profile["last_played"] = today.isoformat()
    return profile
