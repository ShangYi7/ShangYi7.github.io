import { NextRequest, NextResponse } from 'next/server';
import { fetchServerPlayers } from '@/lib/fivem';

export const dynamic = 'force-static';

// 預設提供特定伺服器的資料
export async function generateStaticParams() {
  return [
    { id: 'cfx.re/join/4vr9rk' }, // 預設伺服器 ID
  ];
}

export async function GET(req: NextRequest, { params }: { params: { id?: string } }) {
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  
  // 在靜態輸出模式下，返回預設資料
  return NextResponse.json({
    id: id,
    name: "FiveM 伺服器",
    players: [],
    timestamp: new Date().toISOString(),
    static: true
  });
}