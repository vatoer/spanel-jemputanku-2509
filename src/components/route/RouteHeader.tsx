import { useIsMobile } from '@/hooks/use-mobile';
import React from 'react';

interface RouteHeaderProps {
  totalRoutes: number;
  activeRoutes: number;
  onAddRoute?: () => void;
}

export const RouteHeader: React.FC<RouteHeaderProps> = ({
  totalRoutes,
  activeRoutes,
  onAddRoute
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? 'bg-gradient-to-r from-blue-600 to-blue-700 p-2' : 'bg-gradient-to-r from-blue-600 to-blue-700 p-3'} shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} bg-white/20 rounded flex items-center justify-center`}>
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>🗺️</span>
          </div>
          <div>
            <h1 className={`text-white font-bold ${isMobile ? 'text-sm' : 'text-base'}`}>
              {isMobile ? 'Routes' : 'Route Management'}
            </h1>
            <p className={`text-blue-100 ${isMobile ? 'text-xs' : 'text-xs'}`}>
              {isMobile ? `${totalRoutes} routes` : `${totalRoutes} transport routes`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Route Stats - Desktop Only */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              <div className="bg-white/20 rounded px-1.5 py-0.5 text-center">
                <div className="text-xs font-bold text-white">{totalRoutes}</div>
                <div className="text-xs text-blue-100">Total</div>
              </div>
              <div className="bg-white/20 rounded px-1.5 py-0.5 text-center">
                <div className="text-xs font-bold text-white">{activeRoutes}</div>
                <div className="text-xs text-blue-100">Active</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <button 
            onClick={onAddRoute}
            className={`bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded transition font-medium flex items-center gap-1 ${isMobile ? 'text-xs' : 'text-xs'}`}
          >
            <span>+</span>
            <span className={isMobile ? 'hidden' : ''}>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};