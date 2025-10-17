import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

function dateStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const DAILY_DIR = path.join(process.cwd(), 'data', 'fivem', 'daily-max');

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
  const id = params.id; // 可選：指定伺服器 id
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