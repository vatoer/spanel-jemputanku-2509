"use client"
import { useState } from "react";

// Types
interface Vehicle {
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

interface Route {
  code: string;
  name: string;
}

interface FleetTrackingSidebarProps {
  vehicles: Vehicle[];
  filteredVehicles: Vehicle[];
  selectedRoute: string;
  selectedVehicle: string | null;
  onRouteChange: (route: string) => void;
  onVehicleSelect: (vehicleId: string) => void;
  routes: Route[];
}

export function FleetTrackingSidebar({
  vehicles,
  filteredVehicles,
  selectedRoute,
  selectedVehicle,
  onRouteChange,
  onVehicleSelect,
  routes
}: FleetTrackingSidebarProps) {
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'idle': return 'bg-yellow-500 text-white';
      case 'maintenance': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Beroperasi';
      case 'idle': return 'Standby';
      case 'maintenance': return 'Maintenance';
      default: return 'Unknown';
    }
  };

  const displayVehicles = showActiveOnly 
    ? filteredVehicles.filter(v => v.status === 'active')
    : filteredVehicles;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">🚛</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Fleet Control</h2>
            <p className="text-sm text-gray-600">{displayVehicles.length} kendaraan</p>
          </div>
        </div>

        {/* Route Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Filter Rute:</label>
          <select
            value={selectedRoute}
            onChange={(e) => onRouteChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white shadow-sm"
          >
            <option value="all">🗺️ Semua Rute ({vehicles.length})</option>
            {routes.filter(route => route.code !== "all").map(route => {
              const count = vehicles.filter(v => v.routeCode === route.code).length;
              return (
                <option key={route.code} value={route.code}>
                  🚌 {route.name} ({count})
                </option>
              );
            })}
          </select>
          
          {/* Quick Filter Buttons */}
          <div className="flex gap-2 pt-2">
            <button 
              onClick={() => {
                onRouteChange("all");
                setShowActiveOnly(false);
              }}
              className={`px-3 py-2 text-xs rounded-lg font-medium transition ${
                selectedRoute === "all" && !showActiveOnly
                  ? "bg-blue-100 text-blue-700 border-2 border-blue-300" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Semua
            </button>
            <button 
              onClick={() => setShowActiveOnly(!showActiveOnly)}
              className={`px-3 py-2 text-xs rounded-lg font-medium transition ${
                showActiveOnly
                  ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                  : "bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-700"
              }`}
            >
              Aktif Saja
            </button>
          </div>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-2">
          {displayVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                selectedVehicle === vehicle.id
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-gray-50'
              }`}
              onClick={() => onVehicleSelect(vehicle.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)}`}></div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{vehicle.name}</div>
                    <div className="text-xs text-gray-600">{vehicle.id}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(vehicle.status)}`}>
                    {getStatusText(vehicle.status)}
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-600 mb-2">
                <div className="flex items-center gap-1 mb-1">
                  <span>🗺️</span>
                  <span className="truncate">{vehicle.route}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>👨‍💼</span>
                  <span>{vehicle.driver}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-gray-600">Penumpang:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-800">{vehicle.passengers}/{vehicle.capacity}</span>
                    <div className="w-12 bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-blue-600 h-1 rounded-full transition-all" 
                        style={{ width: `${(vehicle.passengers / vehicle.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <span>🚗</span>
                  <span>{vehicle.speed} km/h</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⏰</span>
                  <span>{vehicle.lastUpdate}</span>
                </div>
              </div>
            </div>
          ))}
          
          {displayVehicles.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">🚌</span>
              </div>
              <p className="text-gray-500 text-sm">Tidak ada kendaraan ditemukan</p>
              <p className="text-gray-400 text-xs mt-1">Coba ubah filter rute atau status</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className="font-semibold text-emerald-600">{vehicles.filter(v => v.status === 'active').length}</div>
            <div className="text-gray-600">Aktif</div>
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className="font-semibold text-yellow-600">{vehicles.filter(v => v.status === 'idle').length}</div>
            <div className="text-gray-600">Standby</div>
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className="font-semibold text-red-600">{vehicles.filter(v => v.status === 'maintenance').length}</div>
            <div className="text-gray-600">Maintenance</div>
          </div>
        </div>
      </div>
    </div>
  );
}