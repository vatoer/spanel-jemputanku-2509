import { DirectionJson } from '@/components/tenant/AppleMapKitDirectionsViewer';
import { useIsMobile } from '@/hooks/use-mobile';
import dynamic from 'next/dynamic';
import React from 'react';
import { Route } from './RouteCarousel';

const AppleMapKitDirectionsViewer = dynamic(
  () => import('@/components/tenant/AppleMapKitDirectionsViewer').then(mod => mod.AppleMapKitDirectionsViewer),
  { ssr: false }
);

interface MapContainerProps {
  selectedRoute: Route;
  directions: DirectionJson | null;
  children?: React.ReactNode; // For overlays like MobileOverlay
}

export const MapContainer: React.FC<MapContainerProps> = ({
  selectedRoute,
  directions,
  children
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex-1 relative min-h-[300px] max-h-full overflow-hidden">
      {directions ? (
        <div className="w-full h-full overflow-hidden">
          <AppleMapKitDirectionsViewer directions={directions} />
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
                Interactive Map
              </h2>
              <p className={`text-gray-600 ${isMobile ? 'text-sm px-4' : 'text-base max-w-md mx-auto'}`}>
                {isMobile 
                  ? 'Route visualization powered by Apple MapKit JS'
                  : 'Advanced route visualization and planning powered by Apple MapKit JS'
                }
              </p>
              
              <div className={`inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg ${isMobile ? 'text-sm' : ''}`}>
                <span>📍</span>
                <span className="font-medium">{selectedRoute.name}</span>
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