import { NextRequest, NextResponse } from 'next/server';
import { fetchServerPlayers } from '@/lib/fivem';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  const snapshot = await fetchServerPlayers(id);
  if (!snapshot) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 502 });
  }
  return NextResponse.json(snapshot);
}