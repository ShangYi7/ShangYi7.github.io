import { NextResponse } from 'next/server';
import { getWakaTimeStats, checkWakaTimeStatus, getWakaTimeUser } from '@/lib/wakatime';

export const dynamic = 'force-static';

export async function GET() {
  // 在靜態輸出模式下，返回預設資料
  return NextResponse.json({
    isAvailable: true,
    stats: {
      totalTime: '10h 30m',
      dailyAverage: '1h 30m',
      topLanguages: [
        { name: 'TypeScript', percent: 45.5, time: '4h 45m' },
        { name: 'JavaScript', percent: 25.2, time: '2h 38m' },
        { name: 'HTML', percent: 15.8, time: '1h 39m' },
        { name: 'CSS', percent: 10.3, time: '1h 05m' },
        { name: 'JSON', percent: 3.2, time: '20m' }
      ],
      topEditors: [
        { name: 'VS Code', percent: 95.5, time: '10h 02m' },
        { name: 'IntelliJ', percent: 4.5, time: '28m' }
      ]
    },
    user: {
      id: 'static-user-id',
      username: 'shangyi7',
      display_name: 'ShangYi7',
      email: 'user@example.com',
      photo: 'https://avatars.githubusercontent.com/u/1234567'
    },
    lastUpdated: new Date().toISOString()
  });
}