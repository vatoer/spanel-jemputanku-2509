import { LiveTrackingService } from '@/lib/services/liveTracking';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { routeId, vehicleId, driverId, scheduledStart, scheduledEnd, maxCapacity } = body;

    if (!routeId || !vehicleId || !driverId || !scheduledStart || !scheduledEnd) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const trip = await LiveTrackingService.startTrip({
      routeId,
      vehicleId,
      driverId,
      scheduledStart: new Date(scheduledStart),
      scheduledEnd: new Date(scheduledEnd),
      maxCapacity
    });

    return NextResponse.json({
      success: true,
      data: trip
    });
  } catch (error) {
    console.error('Start trip error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start trip' },
      { status: 500 }
    );
  }
}