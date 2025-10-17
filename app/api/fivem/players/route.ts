import { NextRequest, NextResponse } from 'next/server';
import { fetchServerPlayers } from '@/lib/fivem';

export const dynamic = 'force-static';

// 預設提供特定伺服器的資料
export function generateStaticParams() {
  return [
    { id: 'exogen' },
    { id: 'seventh' },
    { id: 'example-c' }
  ];
}

export async function GET(req: NextRequest, { params }: { params: { id?: string } }) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id') || params?.id;

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  // 根據不同伺服器ID返回不同的預設資料
  if (id === 'exogen') {
    return NextResponse.json({
      id: id,
      name: "Exogen",
      players: 41,
      maxPlayers: 64,
      lastUpdated: new Date().toISOString(),
      static: true
    });
  } else if (id === 'seventh') {
    return NextResponse.json({
      id: id,
      name: "第七席",
      players: 0,
      maxPlayers: 32,
      lastUpdated: new Date().toISOString(),
      static: true
    });
  } else {
    return NextResponse.json({
      id: id,
      name: "示例伺服器 C",
      players: 0,
      maxPlayers: 64,
      lastUpdated: new Date().toISOString(),
      static: true
    });
  }
}