"use client"
import { UnifiedLayout } from "@/components/layout/UnifiedLayout";
import { LAYOUT_PRESETS } from "@/types/layout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Demo fleet data
const FLEET_VEHICLES = [
  { 
    id: "BUS001", 
    name: "Bus Jemputanku 01", 
    route: "Line 6 Bekasi Timur - Pejambon", 
    routeCode: "6",
    status: "active", 
    driver: "Ahmad Susanto",
    passengers: 24,
    capacity: 50,
    location: { lat: -6.2088, lng: 106.8456 },
    speed: 35,
    lastUpdate: "2 menit yang lalu"
  },
  { 
    id: "BUS002", 
    name: "Bus Jemputanku 02", 
    route: "Line 10 Bekasi Barat - Pejambon", 
    routeCode: "10",
    status: "active", 
    driver: "Budi Santoso",
    passengers: 18,
    capacity: 45,
    location: { lat: -6.2198, lng: 106.8312 },
    speed: 28,
    lastUpdate: "1 menit yang lalu"
  },
  { 
    id: "BUS003", 
    name: "Bus Jemputanku 03", 
    route: "Line 11 Cikarang - Pejambon", 
    routeCode: "11",
    status: "idle", 
    driver: "Siti Rahayu",
    passengers: 0,
    capacity: 45,
    location: { lat: -6.2354, lng: 106.8432 },
    speed: 0,
    lastUpdate: "5 menit yang lalu"
  },
  { 
    id: "BUS004", 
    name: "Bus Jemputanku 04", 
    route: "Line 12 Bekasi Timur - Senayan", 
    routeCode: "12",
    status: "maintenance", 
    driver: "-",
    passengers: 0,
    capacity: 50,
    location: { lat: -6.2187, lng: 106.8234 },
    speed: 0,
    lastUpdate: "1 jam yang lalu"
  }
];

const ROUTES = [
  { code: "all", name: "All Routes" },
  { code: "6", name: "Line 6 Bekasi Timur - Pejambon" },
  { code: "10", name: "Line 10 Bekasi Barat - Pejambon" },
  { code: "11", name: "Line 11 Cikarang - Pejambon" },
  { code: "12", name: "Line 12 Bekasi Timur - Senayan" }
];

export default function FleetTrackingPage() {
  const router = useRouter();
  const [selectedRoute, setSelectedRoute] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  // Filter vehicles based on selected route
  const filteredVehicles = selectedRoute === "all" 
    ? FLEET_VEHICLES 
    : FLEET_VEHICLES.filter(vehicle => vehicle.routeCode === selectedRoute);

  // Calculate stats
  const activeVehicles = FLEET_VEHICLES.filter(v => v.status === 'active').length;
  const totalPassengers = FLEET_VEHICLES.reduce((sum, v) => sum + v.passengers, 0);
  const averageCapacity = Math.round(
    (FLEET_VEHICLES.reduce((sum, v) => sum + (v.passengers / v.capacity) * 100, 0) / FLEET_VEHICLES.length)
  );

  // Auto-refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Enhanced layout configuration for fleet tracking
  const layoutConfig = {
    ...LAYOUT_PRESETS.fleetTracking,
    headerActions: (
      <div className="flex items-center gap-3">
        {/* Live Stats */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
            <div className="text-lg font-bold text-white">{activeVehicles}</div>
            <div className="text-xs text-blue-100">Active</div>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
            <div className="text-lg font-bold text-white">{totalPassengers}</div>
            <div className="text-xs text-blue-100">Passengers</div>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
            <div className="text-lg font-bold text-white">{averageCapacity}%</div>
            <div className="text-xs text-blue-100">Avg Capacity</div>
          </div>
        </div>

        {/* Action Buttons */}
        <button
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
          onClick={() => setLastUpdated(new Date())}
        >
          <span>🔄</span>
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    ),
    // Custom sidebar content for fleet tracking
    sidebarContent: <FleetTrackingSidebar 
      vehicles={filteredVehicles}
      routes={ROUTES}
      selectedRoute={selectedRoute}
      onRouteChange={setSelectedRoute}
      selectedVehicle={selectedVehicle}
      onVehicleSelect={setSelectedVehicle}
    />
  };

  return (
    <UnifiedLayout config={layoutConfig}>
      <div className="h-full flex">
        {/* Main Map Area */}
        <div className="flex-1 bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
          <div className="h-full bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 relative">
            {/* Map Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
            
            {/* Map Content */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center max-w-lg">
                <div className="text-7xl mb-8 animate-pulse">🗺️</div>
                
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Real-time Fleet Map
                  </h3>
                  
                  <div className="text-lg text-gray-600 mb-6">
                    Tracking {filteredVehicles.length} armada
                    {selectedRoute !== "all" && (
                      <div className="text-sm text-blue-600 font-medium mt-1">
                        📍 Rute {ROUTES.find(r => r.code === selectedRoute)?.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 text-sm mb-6">
                    <div className="flex items-center justify-center gap-3 text-emerald-700 bg-emerald-50 rounded-lg py-3 px-4">
                      <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                      <span className="font-medium">Live Vehicle Tracking</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-blue-700 bg-blue-50 rounded-lg py-3 px-4">
                      <span className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></span>
                      <span className="font-medium">Optimized Route Planning</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-amber-700 bg-amber-50 rounded-lg py-3 px-4">
                      <span className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></span>
                      <span className="font-medium">Real-time ETA Updates</span>
                    </div>
                  </div>
                  
                  <div className="text-xs bg-gradient-to-r from-yellow-100 to-orange-100 text-amber-800 px-4 py-3 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-center gap-2 font-medium">
                      <span>💡</span>
                      <span>Apple MapKit JS integration akan aktif di sini</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
}

// Fleet Tracking Sidebar Component
function FleetTrackingSidebar({ 
  vehicles, 
  routes, 
  selectedRoute, 
  onRouteChange, 
  selectedVehicle, 
  onVehicleSelect 
}: {
  vehicles: typeof FLEET_VEHICLES;
  routes: typeof ROUTES;
  selectedRoute: string;
  onRouteChange: (route: string) => void;
  selectedVehicle: string | null;
  onVehicleSelect: (vehicleId: string | null) => void;
}) {
  const activeCount = vehicles.filter(v => v.status === 'active').length;
  const idleCount = vehicles.filter(v => v.status === 'idle').length;
  const maintenanceCount = vehicles.filter(v => v.status === 'maintenance').length;

  return (
    <div className="p-4 space-y-6">
      {/* Fleet Overview Stats */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Fleet Status</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-emerald-700">{activeCount}</div>
            <div className="text-xs text-emerald-600">Active</div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-700">{vehicles.length}</div>
            <div className="text-xs text-blue-600">Total Fleet</div>
          </div>
        </div>
      </div>

      {/* Route Filter */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Filter by Route</h4>
        <select
          value={selectedRoute}
          onChange={(e) => onRouteChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
        >
          {routes.map((route) => (
            <option key={route.code} value={route.code}>
              {route.name}
            </option>
          ))}
        </select>
      </div>

      {/* Vehicle List */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Vehicles ({vehicles.length})
        </h4>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {vehicles.map((vehicle) => (
            <button
              key={vehicle.id}
              onClick={() => onVehicleSelect(selectedVehicle === vehicle.id ? null : vehicle.id)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                selectedVehicle === vehicle.id
                  ? 'bg-blue-50 border-blue-300 shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900">{vehicle.id}</span>
                <span className={`w-3 h-3 rounded-full ${
                  vehicle.status === 'active' ? 'bg-green-400' : 
                  vehicle.status === 'idle' ? 'bg-amber-400' : 'bg-red-400'
                }`} />
              </div>
              
              <p className="text-sm text-gray-600 mb-1">{vehicle.name}</p>
              <p className="text-xs text-gray-500 mb-2">Line {vehicle.routeCode}</p>
              
              {vehicle.status === 'active' && (
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>👥 {vehicle.passengers}/{vehicle.capacity}</span>
                  <span>🚀 {vehicle.speed} km/h</span>
                </div>
              )}
              
              <p className="text-xs text-gray-400 mt-1">{vehicle.lastUpdate}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg py-2 px-4 transition-all text-sm font-medium">
            📍 Center All Vehicles
          </button>
          <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg py-2 px-4 transition-all text-sm font-medium">
            📊 Fleet Report
          </button>
        </div>
      </div>
    </div>
  );
}