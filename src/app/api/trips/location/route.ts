import { LiveTrackingService } from '@/lib/services/liveTracking';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tripId, vehicleId, latitude, longitude, speed, heading, accuracy } = body;

    if (!tripId || !vehicleId || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing required location data' },
        { status: 400 }
      );
    }

    const location = await LiveTrackingService.updateVehicleLocation({
      tripId,
      vehicleId,
      latitude,
      longitude,
      speed,
      heading,
      accuracy
    });

    return NextResponse.json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Update location error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update location' },
      { status: 500 }
    );
  }
}