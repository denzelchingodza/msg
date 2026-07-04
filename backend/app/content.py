"""Loads all JSON content once at startup. Edit data/*.json, restart, done."""
import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def _load(name: str):
    with open(DATA_DIR / name, "r", encoding="utf-8") as f:
        return json.load(f)


CONTENT = {
    "facts": _load("facts.json")["facts"],
    "hot_takes": _load("hot_takes.json"),
    "quiz": _load("quiz.json"),
    "trash_talk": _load("trash_talk.json"),
    "faith": _load("faith.json"),
    "gallery": _load("gallery.json"),
}
