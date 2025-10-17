import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function dateStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const DAILY_DIR = path.join(process.cwd(), 'data', 'fivem', 'daily-max');

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const date = url.searchParams.get('date') || dateStr();
  const id = url.searchParams.get('id'); // 可選：指定伺服器 id
  const file = path.join(DAILY_DIR, `${date}.json`);
  try {
    const raw = await fs.readFile(file, 'utf8');
    const map = JSON.parse(raw);
    if (id) {
      const entry = map[id];
      if (!entry) return NextResponse.json({ error: 'Not found', date, id }, { status: 404 });
      return NextResponse.json(entry);
    }
    return NextResponse.json(Object.values(map));
  } catch (e: any) {
    return NextResponse.json({ error: 'No daily max file', date, message: String(e?.message || e) }, { status: 404 });
  }
}