"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertTriangle,
    Clock,
    MapPin,
    Navigation,
    RefreshCw,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ActiveTrip {
  id: string;
  status: string;
  currentStopIndex: number;
  passengerCount: number;
  maxCapacity: number;
  delay: number;
  scheduledStart: string;
  route: {
    name: string;
  };
  vehicle: {
    id: string;
    licensePlate: string;
    model: string;
  };
  driver: {
    id: string;
    name: string;
    email: string;
  };
  locations: Array<{
    latitude: number;
    longitude: number;
    timestamp: string;
  }>;
  _count: {
    rides: number;
  };
}

interface LiveTrackingDashboardProps {
  tenantId: string;
}

export default function LiveTrackingDashboard({ tenantId }: LiveTrackingDashboardProps) {
  const [activeTrips, setActiveTrips] = useState<ActiveTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch active trips
  const fetchActiveTrips = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/trips/active?tenantId=${tenantId}`);
      const result = await response.json();
      
      if (result.success) {
        setActiveTrips(result.data);
        setLastUpdate(new Date());
      } else {
        setError(result.error || 'Failed to fetch trips');
      }
    } catch (err) {
      setError('Network error');
      console.error('Failed to fetch active trips:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate trip statistics
  const tripStats = {
    total: activeTrips.length,
    started: activeTrips.filter(t => t.status === 'STARTED').length,
    inProgress: activeTrips.filter(t => t.status === 'IN_PROGRESS').length,
    delayed: activeTrips.filter(t => t.delay > 5).length,
    totalPassengers: activeTrips.reduce((sum, t) => sum + t.passengerCount, 0),
    totalBookings: activeTrips.reduce((sum, t) => sum + t._count.rides, 0)
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'STARTED': return 'bg-blue-500';
      case 'IN_PROGRESS': return 'bg-green-500';
      case 'PAUSED': return 'bg-yellow-500';
      case 'DELAYED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Format time since last location update
  const getLocationAge = (timestamp: string) => {
    const now = new Date();
    const locationTime = new Date(timestamp);
    const diffMinutes = Math.round((now.getTime() - locationTime.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const hours = Math.floor(diffMinutes / 60);
    return `${hours}h ${diffMinutes % 60}m ago`;
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchActiveTrips();
    const interval = setInterval(fetchActiveTrips, 30000);
    return () => clearInterval(interval);
  }, [tenantId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading live tracking data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Live Vehicle Tracking</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <Button
            onClick={fetchActiveTrips}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-destructive">{error}</div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{tripStats.total}</div>
            <div className="text-sm text-muted-foreground">Active Trips</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{tripStats.started}</div>
            <div className="text-sm text-muted-foreground">Started</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{tripStats.inProgress}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">{tripStats.delayed}</div>
            <div className="text-sm text-muted-foreground">Delayed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{tripStats.totalPassengers}</div>
            <div className="text-sm text-muted-foreground">Passengers</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{tripStats.totalBookings}</div>
            <div className="text-sm text-muted-foreground">Bookings</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Trips List */}
      {activeTrips.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              No active trips at the moment
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeTrips.map((trip) => (
            <Card key={trip.id} className="relative">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="truncate">{trip.route.name}</span>
                  <div className="flex items-center gap-2">
                    {trip.delay > 5 && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(trip.status)}`} />
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Vehicle & Driver Info */}
                <div className="space-y-1">
                  <div className="text-sm font-medium">
                    {trip.vehicle.licensePlate} • {trip.vehicle.model}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Driver: {trip.driver.name}
                  </div>
                </div>

                {/* Trip Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {trip.passengerCount}/{trip.maxCapacity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className={`text-sm ${trip.delay > 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {trip.delay > 0 ? `+${trip.delay}m` : 'On time'}
                    </span>
                  </div>
                </div>

                {/* Location Info */}
                {trip.locations.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Last Location:</span>
                    </div>
                    <div className="text-xs text-muted-foreground ml-6">
                      {trip.locations[0].latitude.toFixed(4)}, {trip.locations[0].longitude.toFixed(4)}
                      <br />
                      {getLocationAge(trip.locations[0].timestamp)}
                    </div>
                  </div>
                )}

                {/* Trip Status */}
                <div className="flex items-center justify-between">
                  <Badge variant={
                    trip.status === 'STARTED' ? 'default' :
                    trip.status === 'IN_PROGRESS' ? 'secondary' :
                    trip.status === 'PAUSED' ? 'destructive' :
                    'outline'
                  }>
                    {trip.status}
                  </Badge>
                  
                  <div className="text-xs text-muted-foreground">
                    {trip._count.rides} booking{trip._count.rides !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      // Open trip details or tracking map
                      window.open(`/trips/${trip.id}/track`, '_blank');
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Track
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      // Open driver communication
                      window.open(`/driver/${trip.driver.id}/contact`, '_blank');
                    }}
                  >
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}