import { readdir } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/** Gallery wall only shows cleanly named files (lowercase_underscores.ext).
 *  Anything with spaces, emoji, or caps is considered unsorted and skipped,
 *  so raw downloads dropped in the folder never leak onto the wall. */
const CLEAN = /^[a-z0-9_]+\.(jpg|jpeg|png|webp)$/;

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "photos");
    const names = await readdir(dir);
    const photos = names
      .filter((n) => EXTS.has(path.extname(n).toLowerCase()) && CLEAN.test(n))
      .sort();
    return NextResponse.json({ photos });
  } catch {
    return NextResponse.json({ photos: [] });
  }
}
