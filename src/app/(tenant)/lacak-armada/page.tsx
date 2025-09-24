"use client"
import { FleetTrackingSidebar } from "@/components/fleet/FleetTrackingSidebar";
import { UnifiedLayout } from "@/components/layout/UnifiedLayout";
import { LAYOUT_PRESETS } from "@/types/layout";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Demo fleet data with proper typing
const FLEET_VEHICLES = [
  { 
    id: "BUS001", 
    name: "Bus Jemputanku 01", 
    route: "Line 6 Bekasi Timur - Pejambon", 
    routeCode: "6",
    status: "active" as const, 
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
    status: "active" as const, 
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
    status: "idle" as const, 
    driver: "Cahyo Nugroho",
    passengers: 0,
    capacity: 50,
    location: { lat: -6.2408, lng: 106.8583 },
    speed: 0,
    lastUpdate: "5 menit yang lalu"
  },
  { 
    id: "BUS004", 
    name: "Bus Jemputanku 04", 
    route: "Line 12 Bekasi Timur - Senayan", 
    routeCode: "12",
    status: "maintenance" as const, 
    driver: "Dedi Kurniawan",
    passengers: 0,
    capacity: 45,
    location: { lat: -6.2188, lng: 106.8147 },
    speed: 0,
    lastUpdate: "15 menit yang lalu"
  },
  {
    id: "BUS005",
    name: "Bus Jemputanku 05",
    route: "Line 6 Bekasi Timur - Pejambon",
    routeCode: "6",
    status: "active" as const,
    driver: "Eka Pratama",
    passengers: 30,
    capacity: 50,
    location: { lat: -6.2100, lng: 106.8200 },
    speed: 40,
    lastUpdate: "3 menit yang lalu"
  }
];

const ROUTES = [
  { code: "6", name: "Line 6 Bekasi Timur - Pejambon", color: "#3B82F6" },
  { code: "10", name: "Line 10 Bekasi Barat - Pejambon", color: "#10B981" },
  { code: "11", name: "Line 11 Cikarang - Pejambon", color: "#F59E0B" },
  { code: "12", name: "Line 12 Bekasi Timur - Senayan", color: "#EF4444" },
  { code: "5", name: "Line 5 Bekasi Selatan - Pejambon", color: "#3B82F6" }
];

// Dynamic import for map component
const AppleMapKitDirectionsViewer = dynamic(
  () => import("@/components/tenant/AppleMapKitDirectionsViewer").then(mod => mod.AppleMapKitDirectionsViewer),
  { ssr: false }
);

export default function LacakArmadaPage() {
  const router = useRouter();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string>("all");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Filter vehicles by route
  const filteredVehicles = selectedRoute === "all" 
    ? FLEET_VEHICLES 
    : FLEET_VEHICLES.filter(vehicle => vehicle.routeCode === selectedRoute);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const activeVehicles = filteredVehicles.filter(v => v.status === 'active').length;
  const totalPassengers = filteredVehicles.reduce((sum, v) => sum + v.passengers, 0);

  // Enhanced layout configuration for fleet tracking
  const layoutConfig = {
    ...LAYOUT_PRESETS.fleetTracking,
    headerActions: (
      <div className="flex items-center gap-3">
        {/* Fleet Quick Stats */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
            <div className="text-lg font-bold text-white">{activeVehicles}</div>
            <div className="text-xs text-blue-100">Aktif</div>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
            <div className="text-lg font-bold text-white">{totalPassengers}</div>
            <div className="text-xs text-blue-100">Penumpang</div>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
            <div className="text-lg font-bold text-white">{filteredVehicles.length}</div>
            <div className="text-xs text-blue-100">Total</div>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-2 text-white">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-sm font-medium">Live • {lastUpdated.toLocaleTimeString('id-ID')}</span>
        </div>

        {/* Action Buttons */}
        <button
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
          onClick={() => {/* Export report functionality */}}
        >
          <span>📊</span>
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    ),
    // Custom sidebar content for fleet tracking
    sidebarContent: <FleetTrackingSidebar 
      vehicles={FLEET_VEHICLES}
      filteredVehicles={filteredVehicles}
      selectedRoute={selectedRoute}
      selectedVehicle={selectedVehicle}
      onRouteChange={setSelectedRoute}
      onVehicleSelect={setSelectedVehicle}
      routes={ROUTES}
    />
  };

  return (
    <UnifiedLayout config={layoutConfig}>
      {/* Main Content Area - Fleet Tracking Map */}
      <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden relative">
        {/* Selected Vehicle Info Overlay */}
        {selectedVehicle && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-4 w-80 z-10 hidden lg:block">
            {(() => {
              const vehicle = FLEET_VEHICLES.find(v => v.id === selectedVehicle);
              return vehicle ? (
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(vehicle.status)}`}></div>
                      <div>
                        <div className="font-bold text-gray-900">{vehicle.name}</div>
                        <div className="text-sm text-gray-600">{vehicle.id}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedVehicle(null)}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="font-semibold text-gray-800">{vehicle.passengers}</div>
                      <div className="text-xs text-gray-600">Penumpang</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="font-semibold text-gray-800">{vehicle.speed} km/h</div>
                      <div className="text-xs text-gray-600">Kecepatan</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span>🗺️</span>
                      <span>{vehicle.route}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span>👨‍💼</span>
                      <span>{vehicle.driver}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>⏰</span>
                      <span>Update: {vehicle.lastUpdate}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded-lg transition font-medium">
                      📞 Hubungi Driver
                    </button>
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs py-2 px-3 rounded-lg transition font-medium">
                      📊 Detail
                    </button>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}

        {/* Mobile Vehicle Info */}
        {selectedVehicle && (
          <div className="lg:hidden absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-4 z-10">
            {(() => {
              const vehicle = FLEET_VEHICLES.find(v => v.id === selectedVehicle);
              return vehicle ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)}`}></div>
                      <div className="font-semibold text-gray-900">{vehicle.name}</div>
                    </div>
                    <button 
                      onClick={() => setSelectedVehicle(null)}
                      className="text-gray-400 hover:text-gray-600 transition text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-gray-600">Penumpang: </span>
                      <span className="font-semibold">{vehicle.passengers}/{vehicle.capacity}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Speed: </span>
                      <span className="font-semibold">{vehicle.speed} km/h</span>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}
        
        {/* Map Placeholder */}
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
            <span className="text-4xl">🗺️</span>
          </div>
          
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Fleet Tracking Map</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Sistem pelacakan armada real-time dengan integrasi Apple MapKit JS. 
              Memantau posisi bus, rute optimasi, dan estimasi waktu tiba.
            </p>
            
            {selectedRoute !== "all" && (
              <div className="text-sm text-blue-600 font-medium mt-1">
                📍 Rute {ROUTES.find(r => r.code === selectedRoute)?.name}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4 text-sm mb-6 mt-8">
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
    </UnifiedLayout>
  );
}