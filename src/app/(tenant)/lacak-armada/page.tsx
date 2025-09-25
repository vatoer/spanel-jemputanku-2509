"use client"
import { FleetHeader } from "@/components/fleet/FleetHeader";
import { FleetMapContainer } from "@/components/fleet/FleetMapContainer";
import { FleetSidebar } from "@/components/fleet/FleetSidebar";
import { FleetVehicle, VehicleCarousel } from "@/components/fleet/VehicleCarousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Demo fleet data with proper typing
const FLEET_VEHICLES: FleetVehicle[] = [
  { 
    id: "BUS001", 
    name: "Bus Jemputanku 01", 
    route: "Bekasi Timur - Pejambon", 
    routeCode: "6",
    status: "active", 
    driver: "Ahmad Susanto",
    passengers: 24,
    capacity: 50,
    location: { lat: -6.2088, lng: 106.8456 },
    speed: 35,
    lastUpdate: "2024-12-19T10:30:00Z"
  },
  { 
    id: "BUS002", 
    name: "Bus Jemputanku 02", 
    route: "Bekasi Barat - Pejambon", 
    routeCode: "10",
    status: "active", 
    driver: "Budi Santoso",
    passengers: 18,
    capacity: 45,
    location: { lat: -6.2198, lng: 106.8312 },
    speed: 28,
    lastUpdate: "2024-12-19T10:31:00Z"
  },
  { 
    id: "BUS003", 
    name: "Bus Jemputanku 03", 
    route: "Cikarang - Pejambon", 
    routeCode: "11",
    status: "idle", 
    driver: "Cahyo Nugroho",
    passengers: 0,
    capacity: 50,
    location: { lat: -6.2408, lng: 106.8583 },
    speed: 0,
    lastUpdate: "2024-12-19T10:27:00Z"
  },
  { 
    id: "BUS004", 
    name: "Bus Jemputanku 04", 
    route: "Bekasi Timur - Senayan", 
    routeCode: "12",
    status: "maintenance", 
    driver: "Dedi Kurniawan",
    passengers: 0,
    capacity: 45,
    location: { lat: -6.2188, lng: 106.8147 },
    speed: 0,
    lastUpdate: "2024-12-19T10:17:00Z"
  },
  {
    id: "BUS005",
    name: "Bus Jemputanku 05",
    route: "Bekasi Timur - Pejambon",
    routeCode: "6",
    status: "active",
    driver: "Eka Pratama",
    passengers: 30,
    capacity: 50,
    location: { lat: -6.2100, lng: 106.8200 },
    speed: 40,
    lastUpdate: "2024-12-19T10:29:00Z"
  }
];

export default function LacakArmadaPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handler functions
  const handleVehicleSelect = (vehicle: FleetVehicle) => {
    setSelectedVehicle(vehicle);
  };



  const handleContactDriver = (vehicle: FleetVehicle) => {
    alert(`Menghubungi driver ${vehicle.driver} (${vehicle.id})`);
  };

  const handleViewDetails = (vehicle: FleetVehicle) => {
    alert(`Melihat detail ${vehicle.id}`);
  };

  const handleViewHistory = (vehicle: FleetVehicle) => {
    alert(`Melihat riwayat ${vehicle.id}`);
  };

  const handleViewRoute = (vehicle: FleetVehicle) => {
    alert(`Melihat rute ${vehicle.id}`);
  };

  if (isMobile) {
    // Mobile Layout
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <FleetHeader 
          totalVehicles={FLEET_VEHICLES.length}
          activeVehicles={FLEET_VEHICLES.filter(v => v.status === 'active').length}
          totalPassengers={FLEET_VEHICLES.reduce((sum, v) => sum + v.passengers, 0)}
        />
        
        <div className="flex-1 relative overflow-hidden">
          <FleetMapContainer 
            vehicles={FLEET_VEHICLES}
            selectedVehicle={selectedVehicle?.id || null}
          />
          
          {/* Mobile overlay for selected vehicle details */}
          {selectedVehicle && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-gray-900">{selectedVehicle.name}</div>
                  </div>
                  <button 
                    onClick={() => setSelectedVehicle(null)}
                    className="text-gray-400 hover:text-gray-600 transition text-sm p-1"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-gray-600">👥 </span>
                    <span className="font-medium">{selectedVehicle.passengers}/{selectedVehicle.capacity}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">🚄 </span>
                    <span className="font-medium">{selectedVehicle.speed} km/h</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <VehicleCarousel
          vehicles={FLEET_VEHICLES}
          selectedVehicle={selectedVehicle}
          onVehicleSelect={handleVehicleSelect}
          onContactDriver={handleContactDriver}
          onViewDetails={handleViewDetails}
        />
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <FleetHeader 
        totalVehicles={FLEET_VEHICLES.length}
        activeVehicles={FLEET_VEHICLES.filter(v => v.status === 'active').length}
        totalPassengers={FLEET_VEHICLES.reduce((sum, v) => sum + v.passengers, 0)}
      />
      
      <div className="flex flex-1 overflow-hidden mb-2">
        <div className="flex-1 relative">
          <FleetMapContainer 
            vehicles={FLEET_VEHICLES}
            selectedVehicle={selectedVehicle?.id || null}
          />
        </div>
        
        <FleetSidebar
          selectedVehicle={selectedVehicle}
          onContactDriver={handleContactDriver}
          onViewHistory={handleViewHistory}
          onViewRoute={handleViewRoute}
        />
      </div>

      <VehicleCarousel
        vehicles={FLEET_VEHICLES}
        selectedVehicle={selectedVehicle}
        onVehicleSelect={handleVehicleSelect}
        onContactDriver={handleContactDriver}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}