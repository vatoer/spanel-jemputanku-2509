import { LiveTrackingService } from '@/lib/services/liveTracking';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tripId, notes } = body;

    if (!tripId) {
      return NextResponse.json(
        { error: 'Trip ID is required' },
        { status: 400 }
      );
    }

    const trip = await LiveTrackingService.completeTrip(tripId, notes);

    return NextResponse.json({
      success: true,
      data: trip,
      message: 'Trip completed successfully'
    });
  } catch (error) {
    console.error('Complete trip error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to complete trip' },
      { status: 500 }
    );
  }
}