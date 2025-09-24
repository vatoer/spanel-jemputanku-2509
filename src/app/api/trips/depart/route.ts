import { LiveTrackingService } from '@/lib/services/liveTracking';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tripId, routePointId, passengersOn, passengersOff } = body;

    if (!tripId || !routePointId) {
      return NextResponse.json(
        { error: 'Trip ID and Route Point ID are required' },
        { status: 400 }
      );
    }

    const tripStop = await LiveTrackingService.departFromStop(
      tripId, 
      routePointId, 
      passengersOn, 
      passengersOff
    );

    return NextResponse.json({
      success: true,
      data: tripStop,
      message: 'Departed from stop successfully'
    });
  } catch (error) {
    console.error('Depart from stop error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to depart from stop' },
      { status: 500 }
    );
  }
}