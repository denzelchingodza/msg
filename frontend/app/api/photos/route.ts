import { readdir } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "photos");
    const names = await readdir(dir);
    const photos = names
      .filter((n) => EXTS.has(path.extname(n).toLowerCase()))
      .sort();
    return NextResponse.json({ photos });
  } catch {
    return NextResponse.json({ photos: [] });
  }
}
