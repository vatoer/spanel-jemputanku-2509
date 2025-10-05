import { useIsMobile } from '@/hooks/use-mobile';
import React from 'react';
import { FleetVehicle } from './VehicleCarousel';

interface FleetSidebarProps {
  selectedVehicle: FleetVehicle | null;
  onContactDriver?: (vehicle: FleetVehicle) => void;
  onViewHistory?: (vehicle: FleetVehicle) => void;
  onViewRoute?: (vehicle: FleetVehicle) => void;
}

export const FleetSidebar: React.FC<FleetSidebarProps> = ({
  selectedVehicle,
  onContactDriver,
  onViewHistory,
  onViewRoute,
}) => {
  const isMobile = useIsMobile();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'idle': return 'bg-yellow-100 text-yellow-700';
      case 'maintenance': return 'bg-gray-100 text-gray-700';
      default: return 'bg-red-100 text-red-700'; // unknown status
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'idle': return 'Idle';
      case 'maintenance': return 'Maintenance';
      default: return 'Unknown';
    }
  };

  const formatLastUpdate = (timestamp: string) => {
    const now = new Date();
    const updateTime = new Date(timestamp);
    const diffMs = now.getTime() - updateTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ${diffMins % 60}m ago`;
  };

  return (
    <div className={`bg-white border-l border-gray-200 ${isMobile ? 'w-full' : 'w-80'} flex flex-col`}>
      {!selectedVehicle ? (
        <div className={`flex flex-col items-center justify-center flex-1 text-center ${isMobile ? 'p-3' : 'p-4'}`}>
          <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🚌</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Select a Vehicle
          </h3>
          <p className="text-sm text-gray-500 max-w-sm">
            Choose a vehicle from the carousel above to view its details, track its location, and contact the driver.
          </p>
        </div>
      ) : (
        <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-3' : 'p-4'}`}>
          <div className="space-y-4">
          {/* Vehicle Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🚌</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedVehicle.id}</h2>
                <p className="text-sm text-gray-600">{selectedVehicle.name}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedVehicle.status)}`}>
              {getStatusText(selectedVehicle.status)}
            </div>
          </div>

          {/* Route Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h3 className="font-medium text-blue-900 mb-2">Route Information</h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Line:</span>
                <span className="text-blue-900 font-medium">{selectedVehicle.routeCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Route:</span>
                <span className="text-blue-900 font-medium truncate ml-2">{selectedVehicle.route}</span>
              </div>
            </div>
          </div>

          {/* Driver & Passengers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Driver</div>
              <div className="font-medium text-gray-900">{selectedVehicle.driver}</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Capacity</div>
              <div className="font-medium text-gray-900">
                {selectedVehicle.passengers}/{selectedVehicle.capacity}
              </div>
            </div>
          </div>

          {/* Live Stats */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <h3 className="font-medium text-emerald-900 mb-3">Live Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-emerald-700 text-sm">Speed:</span>
                <span className="text-emerald-900 font-medium">{selectedVehicle.speed} km/h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-700 text-sm">Location:</span>
                <span className="text-emerald-900 font-medium text-xs">
                  {selectedVehicle.location.lat.toFixed(4)}, {selectedVehicle.location.lng.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-700 text-sm">Last Update:</span>
                <span className="text-emerald-900 font-medium text-xs">
                  {formatLastUpdate(selectedVehicle.lastUpdate)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => onContactDriver?.(selectedVehicle)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              📞 Contact Driver
            </button>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onViewRoute?.(selectedVehicle)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                🗺️ Route
              </button>
              <button
                onClick={() => onViewHistory?.(selectedVehicle)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                📊 History
              </button>
            </div>
          </div>

            {/* Additional Info */}
            <div className="pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <div>Vehicle ID: {selectedVehicle.id}</div>
                <div>Last sync: {formatLastUpdate(selectedVehicle.lastUpdate)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};