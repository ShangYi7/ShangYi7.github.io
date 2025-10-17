import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

function dateStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const LOG_DIR = path.join(process.cwd(), 'data', 'fivem');

export const dynamic = 'force-static';

// 預設提供最近日期的資料
export async function generateStaticParams() {
  return [
    { date: dateStr() },
    { date: dateStr(new Date(Date.now() - 86400000)) }, // 昨天
  ];
}

export async function GET(req: NextRequest, { params }: { params: { date?: string, id?: string } }) {
  // 在靜態輸出模式下，使用預設日期
  const date = params.date || dateStr();
  const id = params.id;
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