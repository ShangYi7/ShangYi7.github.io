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

const LOG_DIR = path.join(process.cwd(), 'data', 'fivem');

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const date = url.searchParams.get('date') || dateStr();
  const id = url.searchParams.get('id');
  const file = path.join(LOG_DIR, `${date}.jsonl`);
  try {
    const raw = await fs.readFile(file, 'utf8');
    const lines = raw.split(/\r?\n/).filter(Boolean);
    const all = lines.map((line) => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return null;
      }
    }).filter(Boolean);
    const samples = id ? all.filter((x: any) => x && x.id === id) : all;
    // Sort ascending by timestamp
    samples.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return NextResponse.json({ samples });
  } catch (e: any) {
    return NextResponse.json({ error: 'No log file', date, message: String(e?.message || e) }, { status: 404 });
  }
}