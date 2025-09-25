import { useIsMobile } from '@/hooks/use-mobile';
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
  selectedVehicle: string | null;
  children?: React.ReactNode;
}

export const FleetMapContainer: React.FC<FleetMapContainerProps> = ({
  vehicles,
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

      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 z-30">
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-medium">Live Tracking</span>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              {vehicles.length} vehicles • {vehicles.filter(v => v.status === 'active').length} active
            </div>
            <div className="text-xs text-blue-600">
              🗺️ Apple MapKit JS
            </div>
          </div>
        </div>
      </div>

      {/* Selected Vehicle Info Overlay */}
      {selectedVehicle && (
        <div className="absolute top-4 right-4 z-30 max-w-xs">
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg">
            {(() => {
              const vehicle = vehicles.find(v => v.id === selectedVehicle);
              return vehicle ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-sm">{vehicle.name}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.status === 'active' ? 'bg-green-100 text-green-700' :
                      vehicle.status === 'idle' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {vehicle.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-gray-500">Speed</div>
                      <div className="font-semibold">{vehicle.speed} km/h</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-gray-500">Passengers</div>
                      <div className="font-semibold">{vehicle.passengers}/{vehicle.capacity}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    🗺️ {vehicle.route} • 👨‍💼 {vehicle.driver}
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-30">
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-sm">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Active ({vehicles.filter(v => v.status === 'active').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Idle ({vehicles.filter(v => v.status === 'idle').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Maintenance ({vehicles.filter(v => v.status === 'maintenance').length})</span>
            </div>
          </div>
        </div>
      </div>



      {/* Render children (overlays) */}
      {children}
    </div>
  );
};