import { LiveTrackingService } from '@/lib/services/liveTracking';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId parameter is required' },
        { status: 400 }
      );
    }

    const activeTrips = await LiveTrackingService.getActiveTrips(tenantId);

    return NextResponse.json({
      success: true,
      data: activeTrips
    });
  } catch (error) {
    console.error('Get active trips error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get active trips' },
      { status: 500 }
    );
  }
}