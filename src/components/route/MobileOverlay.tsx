import { useIsMobile } from '@/hooks/use-mobile';
import React from 'react';
import { Route } from './RouteCarousel';
import { Stop } from './StopsPanel';

interface MobileOverlayProps {
  selectedRoute: Route;
  stops: Stop[];
  showStops: boolean;
  onToggleStops: () => void;
}

export const MobileOverlay: React.FC<MobileOverlayProps> = ({
  selectedRoute,
  stops,
  showStops,
  onToggleStops
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 p-4 z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 text-sm truncate">
            {selectedRoute.name}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {stops.length} stops • Est. 45 min • Line {selectedRoute.code}
          </div>
        </div>
        <div className={`text-xs px-2 py-1 rounded-full font-medium ${
          selectedRoute.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {selectedRoute.status === 'active' ? 'Active' : 'Maintenance'}
        </div>
      </div>

      {/* Mobile Stops */}
      {showStops && (
        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-800">Route Stops</h4>
            <button
              onClick={() => onToggleStops()}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Hide
            </button>
          </div>
          <div className="max-h-32 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {stops.slice(0, 4).map((stop, index) => (
                <div key={stop.id} className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${
                    index === 0 || index === stops.length - 1 ? 'bg-blue-400' : 'bg-gray-400'
                  }`}></div>
                  <span className="truncate text-gray-700">{stop.name}</span>
                </div>
              ))}
              {stops.length > 4 && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>+{stops.length - 4} more</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!showStops && (
        <button
          onClick={onToggleStops}
          className="w-full py-2 text-xs bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition"
        >
          🚏 Show Route Stops ({stops.length})
        </button>
      )}
    </div>
  );
};