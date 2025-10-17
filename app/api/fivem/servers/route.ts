import { NextResponse } from 'next/server';
import { getServerConfigs } from '@/lib/fivem';

export const dynamic = 'force-static';

export async function GET() {
  const servers = getServerConfigs();
  return NextResponse.json({ servers });
}