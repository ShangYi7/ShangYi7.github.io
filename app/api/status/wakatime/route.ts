import { NextResponse } from 'next/server';
import { getWakaTimeStats, checkWakaTimeStatus, getWakaTimeUser } from '@/lib/wakatime';

export async function GET() {
  try {
    const [stats, apiStatus, user] = await Promise.allSettled([
      getWakaTimeStats(),
      checkWakaTimeStatus(),
      getWakaTimeUser()
    ]);

    // 處理統計數據
    const wakaTimeStats = stats.status === 'fulfilled' ? stats.value : null;
    
    // 處理 API 狀態
    const wakaTimeApiStatus = apiStatus.status === 'fulfilled' ? apiStatus.value : false;
    
    // 處理用戶信息
    const userInfo = user.status === 'fulfilled' ? user.value : null;

    const response = {
      isAvailable: wakaTimeApiStatus && wakaTimeStats !== null,
      stats: wakaTimeStats,
      user: userInfo ? {
        id: userInfo.id,
        username: userInfo.username,
        display_name: userInfo.display_name,
        email: userInfo.email,
        photo: userInfo.photo
      } : null,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('WakaTime API error:', error);
    return NextResponse.json(
      { 
        isAvailable: false, 
        error: 'Failed to fetch WakaTime data',
        lastUpdated: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// 設置 ISR revalidate
export const revalidate = 300; // 5 分鐘