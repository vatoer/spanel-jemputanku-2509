import React from 'react';
import { Route } from './RouteCarousel';

export interface Stop {
  id: number;
  name: string;
  time: string;
  order: number;
}

interface StopsPanelProps {
  selectedRoute: Route;
  stops: Stop[];
  showStops: boolean;
  onToggleStops: () => void;
}

export const StopsPanel: React.FC<StopsPanelProps> = ({
  selectedRoute,
  stops,
  showStops,
  onToggleStops
}) => {
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Route Stops</h3>
          <button
            onClick={onToggleStops}
            className={`text-xs px-3 py-1 rounded-full font-medium transition ${
              showStops ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-blue-100'
            }`}
          >
            {showStops ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{selectedRoute.name}</span>
        </div>
      </div>

      {showStops && (
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-2">
            {stops.map((stop, index) => (
              <div key={stop.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 || index === stops.length - 1 ? 'bg-blue-500' : 'bg-gray-400'
                  }`}></div>
                  {index < stops.length - 1 && (
                    <div className="w-0.5 h-6 bg-gray-300 mt-1"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-xs truncate">{stop.name}</div>
                  <div className="text-xs text-gray-500">
                    {stop.time} • #{stop.order}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};