import { NextResponse } from 'next/server';
import { checkAllServicesStatus } from '@/lib/external-status';

export async function GET() {
  try {
    const servicesStatus = await checkAllServicesStatus();

    const response = {
      services: servicesStatus,
      lastUpdated: new Date().toISOString(),
      summary: {
        total: servicesStatus.length,
        operational: servicesStatus.filter(s => s.status === 'operational').length,
        degraded: servicesStatus.filter(s => s.status === 'degraded').length,
        down: servicesStatus.filter(s => s.status === 'outage').length
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('External services status error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch external services status',
        services: [],
        lastUpdated: new Date().toISOString(),
        summary: {
          total: 0,
          operational: 0,
          degraded: 0,
          down: 0
        }
      },
      { status: 500 }
    );
  }
}

// 設置 ISR revalidate
export const revalidate = 180; // 3 分鐘