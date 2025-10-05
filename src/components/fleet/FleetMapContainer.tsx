import { useIsMobile } from '@/hooks/use-mobile';
import { DirectionJson } from '@/types/mapkit.types';
import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';

// Use the working AppleMapKitMap component from tenant folder
const AppleMapKitMap = dynamic(
  () => import('@/components/tenant/AppleMapKitMap').then(mod => ({ default: mod.AppleMapKitMap })),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-blue-600 font-medium">Loading Fleet Map...</div>
          <div className="text-blue-500 text-sm mt-1">Powered by Apple MapKit JS</div>
        </div>
      </div>
    )
  }
);

interface FleetVehicle {
  id: string;
  name: string;
  route: string;
  routeCode: string;
  status: 'active' | 'idle' | 'maintenance';
  driver: string;
  passengers: number;
  capacity: number;
  location: { lat: number; lng: number };
  speed: number;
  lastUpdate: string;
}

interface FleetMapContainerProps {
  vehicles: FleetVehicle[];
  directions?: DirectionJson[];
  selectedVehicle: string | null;
  children?: React.ReactNode;
}

export const FleetMapContainer: React.FC<FleetMapContainerProps> = ({
  vehicles,
  directions,
  selectedVehicle,
  children
}) => {
  const isMobile = useIsMobile();

  // Convert vehicles to map markers format
  const markers = useMemo(() => {
    return vehicles.map(vehicle => ({
      lat: vehicle.location.lat,
      lng: vehicle.location.lng,
      title: `${vehicle.id} • Line ${vehicle.routeCode}`,
      icon: "🚐" // Vehicle icon for fleet markers
    }));
  }, [vehicles]);

  return (
    <div className="w-full h-full overflow-hidden relative">
      {markers.length > 0 ? (
        <div className="w-full h-full overflow-hidden relative">
          <AppleMapKitMap 
            markers={markers}
            directions={[]}
          />

          {/* Status Legend - Positioned as overlay */}
          {!isMobile && (
            <Legend />
          )}
        </div>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          {/* Map Placeholder */}
          <div className="text-center">
            <div className={`${isMobile ? 'w-20 h-20' : 'w-32 h-32'} bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto mb-6 flex items-center justify-center shadow-sm`}>
              <span className={`${isMobile ? 'text-2xl' : 'text-4xl'}`}>🗺️</span>
            </div>
            
            <div className="space-y-4">
              <h2 className={`font-bold text-gray-800 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                Fleet Tracking Map
              </h2>
              <p className={`text-gray-600 ${isMobile ? 'text-sm px-4' : 'text-base max-w-md mx-auto'}`}>
                {isMobile 
                  ? 'Real-time vehicle tracking powered by Apple MapKit JS'
                  : 'Advanced real-time vehicle tracking and monitoring powered by Apple MapKit JS'
                }
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Render children (overlays) */}
      {children}
    </div>
  );
};

export const Legend = () => {
  return (
    <div className="absolute bottom-4 left-4 z-30">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-2 shadow-sm">
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Active</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Idle</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span>Maintenance</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Unknown</span>
              </div>
            </div>
          </div>
        </div>
  )
}