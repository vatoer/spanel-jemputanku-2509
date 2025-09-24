import { LiveTrackingService } from '@/lib/services/liveTracking';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  try {
    const tripId = params.tripId;

    const tripStatus = await LiveTrackingService.getTripStatus(tripId);

    if (!tripStatus) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tripStatus
    });
  } catch (error) {
    console.error('Get trip status error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get trip status' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  try {
    const tripId = params.tripId;
    const body = await request.json();
    const { action, notes, routePointId, passengerBoarded, passengerAlighted } = body;

    let result;

    switch (action) {
      case 'complete':
        result = await LiveTrackingService.completeTrip(tripId, notes);
        break;
      case 'arrive':
        if (!routePointId) {
          return NextResponse.json(
            { error: 'routePointId required for arrive action' },
            { status: 400 }
          );
        }
        result = await LiveTrackingService.arriveAtStop(tripId, routePointId);
        break;
      case 'depart':
        if (!routePointId) {
          return NextResponse.json(
            { error: 'routePointId required for depart action' },
            { status: 400 }
          );
        }
        result = await LiveTrackingService.departFromStop(
          tripId,
          routePointId,
          passengerBoarded || 0,
          passengerAlighted || 0
        );
        break;
      case 'emergency':
        result = await LiveTrackingService.emergencyStop(tripId, notes || 'Emergency stop');
        break;
      case 'resume':
        result = await LiveTrackingService.resumeTrip(tripId);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Trip action error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to perform trip action' },
      { status: 500 }
    );
  }
}