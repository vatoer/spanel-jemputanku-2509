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

  // Convert vehicles to map markers format - only plate number and line
  const markers = useMemo(() => {
    return vehicles.map(vehicle => ({
      lat: vehicle.location.lat,
      lng: vehicle.location.lng,
      title: `${vehicle.id} • Line ${vehicle.routeCode}`,
      icon: "🚐" // Vehicle icon for fleet markers
    }));
  }, [vehicles]);



  if (!vehicles.length) {
    return (
      <div className="flex-1 relative min-h-[300px] max-h-full overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          <div className="text-center">
            <div className={`${isMobile ? 'w-20 h-20' : 'w-32 h-32'} bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto mb-6 flex items-center justify-center shadow-sm`}>
              <span className={`${isMobile ? 'text-2xl' : 'text-4xl'}`}>🗺️</span>
            </div>
            
            <div className="space-y-4">
              <h2 className={`font-bold text-gray-800 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                No Vehicles Available
              </h2>
              <p className={`text-gray-600 ${isMobile ? 'text-sm px-4' : 'text-base max-w-md mx-auto'}`}>
                No vehicles to display on the map.
              </p>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="flex-1 relative min-h-[300px] max-h-full overflow-hidden">
      {/* Real Fleet Tracking Map using working AppleMapKitMap */}
      <div className="w-full h-full overflow-hidden">
        {markers.length > 0 ? (
          <AppleMapKitMap 
            markers={markers}
            directions={[]}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <div className="text-center">
              <div className={`${isMobile ? 'w-20 h-20' : 'w-32 h-32'} bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto mb-6 flex items-center justify-center shadow-sm`}>
                <span className={`${isMobile ? 'text-2xl' : 'text-4xl'}`}>�️</span>
              </div>
              
              <div className="space-y-4">
                <h2 className={`font-bold text-gray-800 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  No Vehicles Available
                </h2>
                <p className={`text-gray-600 ${isMobile ? 'text-sm px-4' : 'text-base max-w-md mx-auto'}`}>
                  No vehicles to display on the map.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Simplified Live Indicator - Remove redundant vehicle counts */}
      <div className="absolute top-4 left-4 z-30">
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Remove Desktop Selected Vehicle Overlay - Info already shown in sidebar */}

      {/* Simplified Legend - Remove redundant counts, focus on visual clarity */}
      {!isMobile && (
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
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Maintenance</span>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Render children (overlays) */}
      {children}
    </div>
  );
};