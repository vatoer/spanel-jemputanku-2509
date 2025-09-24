import { LiveTrackingService } from '@/lib/services/liveTracking';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tripId, routePointId } = body;

    if (!tripId || !routePointId) {
      return NextResponse.json(
        { error: 'Trip ID and Route Point ID are required' },
        { status: 400 }
      );
    }

    const tripStop = await LiveTrackingService.arriveAtStop(tripId, routePointId);

    return NextResponse.json({
      success: true,
      data: tripStop,
      message: 'Arrived at stop successfully'
    });
  } catch (error) {
    console.error('Arrive at stop error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to arrive at stop' },
      { status: 500 }
    );
  }
}