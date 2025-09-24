"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    AlertTriangle,
    Clock,
    MapPin,
    Navigation,
    Play,
    Square,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface TripStatus {
  id: string;
  status: string;
  currentStopIndex: number;
  passengerCount: number;
  maxCapacity: number;
  delay: number;
  route: {
    name: string;
    RoutePoint: Array<{
      id: string;
      name: string;
      type: string;
      order: number;
    }>;
  };
  vehicle: {
    id: string;
    licensePlate: string;
    model: string;
  };
  driver: {
    name: string;
  };
  tripStops: Array<{
    id: string;
    routePointId: string;
    scheduledAt: string;
    arrivedAt?: string;
    departedAt?: string;
    status: string;
    delay: number;
    routePoint: {
      name: string;
      type: string;
    };
  }>;
  locations: Array<{
    latitude: number;
    longitude: number;
    timestamp: string;
  }>;
}

interface DriverInterfaceProps {
  tripId?: string;
  driverId: string;
  onStartTrip: (data: {
    routeId: string;
    vehicleId: string;
    scheduledStart: Date;
    scheduledEnd: Date;
  }) => void;
}

export default function DriverInterface({ tripId, driverId, onStartTrip }: DriverInterfaceProps) {
  const [tripStatus, setTripStatus] = useState<TripStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [watchId, setWatchId] = useState<number | null>(null);
  
  // Passenger count inputs
  const [passengerBoarded, setPassengerBoarded] = useState(0);
  const [passengerAlighted, setPassengerAlighted] = useState(0);
  const [notes, setNotes] = useState('');

  // Current location
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Request location permission and start tracking
  const startLocationTracking = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      setLocationPermission(permission.state);

      if (permission.state === 'granted' || permission.state === 'prompt') {
        const id = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude, speed, heading, accuracy } = position.coords;
            setCurrentLocation({ latitude, longitude });
            
            // Send location to server if trip is active
            if (tripId && tripStatus?.status && ['STARTED', 'IN_PROGRESS'].includes(tripStatus.status)) {
              updateVehicleLocation({
                tripId,
                vehicleId: tripStatus.vehicle.id,
                latitude,
                longitude,
                speed: speed || undefined,
                heading: heading || undefined,
                accuracy: accuracy || undefined
              });
            }
          },
          (error) => {
            console.error('Location error:', error);
            setLocationPermission('denied');
          },
          {
            enableHighAccuracy: true,
            maximumAge: 10000, // 10 seconds
            timeout: 30000 // 30 seconds
          }
        );
        setWatchId(id);
      }
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  // Stop location tracking
  const stopLocationTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  // Update vehicle location
  const updateVehicleLocation = async (locationData: {
    tripId: string;
    vehicleId: string;
    latitude: number;
    longitude: number;
    speed?: number;
    heading?: number;
    accuracy?: number;
  }) => {
    try {
      await fetch('/api/trips/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationData)
      });
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  // Fetch trip status
  const fetchTripStatus = async () => {
    if (!tripId) return;

    try {
      const response = await fetch(`/api/trips/${tripId}`);
      const result = await response.json();
      
      if (result.success) {
        setTripStatus(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch trip status:', error);
    }
  };

  // Trip actions
  const handleTripAction = async (action: string, additionalData?: any) => {
    if (!tripId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          ...additionalData
        })
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchTripStatus(); // Refresh status
        
        // Reset form inputs
        setPassengerBoarded(0);
        setPassengerAlighted(0);
        setNotes('');
      } else {
        alert(result.error || 'Action failed');
      }
    } catch (error) {
      console.error('Trip action failed:', error);
      alert('Action failed');
    } finally {
      setLoading(false);
    }
  };

  // Complete trip
  const completeTrip = () => {
    if (confirm('Are you sure you want to complete this trip?')) {
      handleTripAction('complete', { notes });
      stopLocationTracking();
    }
  };

  // Emergency stop
  const emergencyStop = () => {
    const reason = prompt('Emergency reason:');
    if (reason) {
      handleTripAction('emergency', { notes: reason });
    }
  };

  // Arrive at stop
  const arriveAtStop = (routePointId: string) => {
    handleTripAction('arrive', { routePointId });
  };

  // Depart from stop
  const departFromStop = (routePointId: string) => {
    handleTripAction('depart', {
      routePointId,
      passengerBoarded,
      passengerAlighted
    });
  };

  // Auto-refresh trip status
  useEffect(() => {
    if (tripId) {
      fetchTripStatus();
      const interval = setInterval(fetchTripStatus, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [tripId]);

  // Start location tracking when component mounts
  useEffect(() => {
    startLocationTracking();
    return () => stopLocationTracking();
  }, []);

  if (!tripStatus && tripId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading trip status...</div>
        </CardContent>
      </Card>
    );
  }

  const currentStop = tripStatus?.route.RoutePoint[tripStatus.currentStopIndex];
  const currentTripStop = tripStatus?.tripStops.find(
    ts => ts.routePointId === currentStop?.id
  );

  return (
    <div className="space-y-4 max-w-md mx-auto p-4">
      {/* Trip Header */}
      {tripStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{tripStatus.route.name}</span>
              <Badge variant={
                tripStatus.status === 'STARTED' ? 'default' :
                tripStatus.status === 'IN_PROGRESS' ? 'secondary' :
                tripStatus.status === 'PAUSED' ? 'destructive' :
                'outline'
              }>
                {tripStatus.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{tripStatus.passengerCount}/{tripStatus.maxCapacity}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{tripStatus.delay > 0 ? `+${tripStatus.delay}m` : 'On time'}</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Vehicle: {tripStatus.vehicle.licensePlate} ({tripStatus.vehicle.model})
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Location Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span>Status:</span>
            <Badge variant={
              locationPermission === 'granted' && watchId ? 'default' :
              locationPermission === 'denied' ? 'destructive' :
              'secondary'
            }>
              {locationPermission === 'granted' && watchId ? 'Active' :
               locationPermission === 'denied' ? 'Denied' :
               'Inactive'}
            </Badge>
          </div>
          {currentLocation && (
            <div className="mt-2 text-xs text-muted-foreground">
              Lat: {currentLocation.latitude.toFixed(6)}<br />
              Lng: {currentLocation.longitude.toFixed(6)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Stop */}
      {tripStatus && currentStop && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Current Stop
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="font-medium">{currentStop.name}</div>
                <div className="text-sm text-muted-foreground">
                  Stop {tripStatus.currentStopIndex + 1} of {tripStatus.route.RoutePoint.length}
                </div>
              </div>

              {/* Stop Status */}
              <div className="flex items-center gap-2">
                <span>Status:</span>
                <Badge variant={
                  currentTripStop?.status === 'ARRIVED' ? 'default' :
                  currentTripStop?.status === 'DEPARTED' ? 'secondary' :
                  'outline'
                }>
                  {currentTripStop?.status || 'PENDING'}
                </Badge>
              </div>

              {/* Passenger Counter */}
              {currentTripStop?.status === 'ARRIVED' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="boarded">Boarded</Label>
                      <Input
                        id="boarded"
                        type="number"
                        min="0"
                        value={passengerBoarded}
                        onChange={(e) => setPassengerBoarded(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="alighted">Alighted</Label>
                      <Input
                        id="alighted"
                        type="number"
                        min="0"
                        value={passengerAlighted}
                        onChange={(e) => setPassengerAlighted(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Stop Actions */}
              <div className="flex gap-2">
                {currentTripStop?.status === 'PENDING' && (
                  <Button
                    onClick={() => arriveAtStop(currentStop.id)}
                    disabled={loading}
                    className="flex-1"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Arrive
                  </Button>
                )}
                
                {currentTripStop?.status === 'ARRIVED' && (
                  <Button
                    onClick={() => departFromStop(currentStop.id)}
                    disabled={loading}
                    className="flex-1"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Depart
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trip Controls */}
      {tripStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Trip Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Textarea
                placeholder="Add notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              
              <div className="flex gap-2">
                {tripStatus.status === 'PAUSED' ? (
                  <Button
                    onClick={() => handleTripAction('resume')}
                    disabled={loading}
                    className="flex-1"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                ) : (
                  <Button
                    onClick={emergencyStop}
                    disabled={loading}
                    variant="destructive"
                    className="flex-1"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Emergency
                  </Button>
                )}
                
                <Button
                  onClick={completeTrip}
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Route Progress */}
      {tripStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Route Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tripStatus.tripStops.map((stop, index) => (
                <div
                  key={stop.id}
                  className={`flex items-center justify-between p-2 rounded ${
                    index === tripStatus.currentStopIndex
                      ? 'bg-primary/10 border border-primary/20'
                      : 'bg-muted/50'
                  }`}
                >
                  <div>
                    <div className="font-medium text-sm">
                      {stop.routePoint.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Scheduled: {new Date(stop.scheduledAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <Badge
                    variant={
                      stop.status === 'DEPARTED' ? 'default' :
                      stop.status === 'ARRIVED' ? 'secondary' :
                      stop.status === 'SKIPPED' ? 'destructive' :
                      'outline'
                    }
                    className="text-xs"
                  >
                    {stop.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}