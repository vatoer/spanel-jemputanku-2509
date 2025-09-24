import { LiveTrackingService } from '@/lib/services/liveTracking';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tripId, reason } = body;

    if (!tripId || !reason) {
      return NextResponse.json(
        { error: 'Trip ID and reason are required' },
        { status: 400 }
      );
    }

    const trip = await LiveTrackingService.emergencyStop(tripId, reason);

    return NextResponse.json({
      success: true,
      data: trip,
      message: 'Emergency stop activated'
    });
  } catch (error) {
    console.error('Emergency stop error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to activate emergency stop' },
      { status: 500 }
    );
  }
}