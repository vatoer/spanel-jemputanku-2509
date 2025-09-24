"use client"

import {
  MapContainer,
  MobileOverlay,
  RouteCarousel,
  RouteHeader,
  StopsPanel,
  type Route,
  type Stop
} from "@/components/route";
import { DirectionsJson } from "@/components/tenant/AppleMapKitDirectionsViewer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Dummy data, replace with API/DB fetch as needed
const ROUTES: Route[] = [
  { code: "6", name: "Line 6 Bekasi Timur - Pejambon", origin: "Bekasi Timur", destination: "Pejambon", status: "active" },
  { code: "10", name: "Line 10 Bekasi Barat - Pejambon", origin: "Bekasi Barat", destination: "Pejambon", status: "active" },
  { code: "11", name: "Line 11 Cikarang - Pejambon", origin: "Cikarang", destination: "Pejambon", status: "maintenance" },
  { code: "12", name: "Line 12 Bekasi Timur - Senayan", origin: "Bekasi Timur", destination: "Senayan", status: "active" }
];

export default function RutePage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState<Route>(ROUTES[0]);
  const [showStops, setShowStops] = useState(true);
  const [directions, setDirections] = useState<DirectionsJson | null>(null);
  
  // Demo stops data
  const demoStops: Stop[] = [
    { id: 1, name: "Bekasi Timur Station", time: "07:00", order: 1 },
    { id: 2, name: "Mall Summarecon", time: "07:05", order: 2 },
    { id: 3, name: "Harapan Indah", time: "07:12", order: 3 },
    { id: 4, name: "Kelapa Gading", time: "07:25", order: 4 },
    { id: 5, name: "Bundaran HI", time: "07:45", order: 5 },
    { id: 6, name: "Terminal Pejambon", time: "08:00", order: 6 }
  ];

  useEffect(() => {
    async function fetchDirections() {
      try {
        const res = await fetch("/directions-example.json");
        if (res.ok) {
          setDirections(await res.json());
        }
      } catch {
        // Handle error silently
      }
    }
    fetchDirections();
  }, []);

  const handleRouteSelect = (route: Route) => {
    setSelected(route);
  };

  const handleEditRoute = (route: Route) => {
    console.log('Edit route:', route.code);
    // Navigate to edit page or open modal
  };

  const handleViewRoute = (route: Route) => {
    console.log('View route details:', route.code);
    // Navigate to detail page or open modal
  };

  const handleAddRoute = () => {
    console.log('Add new route');
    // Navigate to add page or open modal
  };

  const handleToggleStops = () => {
    setShowStops(!showStops);
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <RouteHeader 
        totalRoutes={ROUTES.length}
        activeRoutes={ROUTES.filter(r => r.status === 'active').length}
        onAddRoute={handleAddRoute}
        onBack={handleBack}
      />

      {/* Desktop: Map + Stops / Mobile: Map Only */}
      <div className={`${isMobile ? 'flex-1 mb-2' : 'h-[60vh] mb-3'} flex overflow-hidden`}>
        {/* Map Container */}
        <MapContainer 
          selectedRoute={selected}
          directions={directions}
        >
          {/* Mobile Overlay: Active Route Info (only if not showing stops at bottom) */}
          {isMobile && !showStops && (
            <MobileOverlay 
              selectedRoute={selected}
              stops={demoStops}
              showStops={false}
              onToggleStops={handleToggleStops}
            />
          )}
        </MapContainer>

        {/* Desktop: Stops Panel - Same height as map */}
        {!isMobile && (
          <StopsPanel 
            selectedRoute={selected}
            stops={demoStops}
            showStops={showStops}
            onToggleStops={handleToggleStops}
          />
        )}
      </div>

      {/* Route Cards Carousel */}
      <RouteCarousel 
        routes={ROUTES}
        selectedRoute={selected}
        onRouteSelect={handleRouteSelect}
        onEditRoute={handleEditRoute}
        onViewRoute={handleViewRoute}
        onAddRoute={handleAddRoute}
      />

      {/* Mobile: Stops at bottom */}
      {isMobile && showStops && (
        <div className="bg-white border-t border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 text-sm">Route Stops</h3>
              <button
                onClick={handleToggleStops}
                className="text-xs px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-700"
              >
                Hide
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{selected.name}</span>
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto p-3">
            <div className="space-y-2">
              {demoStops.map((stop, index) => (
                <div key={stop.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 || index === demoStops.length - 1 ? 'bg-blue-500' : 'bg-gray-400'
                    }`}></div>
                    {index < demoStops.length - 1 && (
                      <div className="w-0.5 h-5 bg-gray-300 mt-1"></div>
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
        </div>
      )}

      {/* Mobile: Show stops button when stops are hidden */}
      {isMobile && !showStops && (
        <div className="p-4 bg-white border-t border-gray-200">
          <button
            onClick={handleToggleStops}
            className="w-full py-3 text-sm bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition"
          >
            🚏 Show Route Stops ({demoStops.length})
          </button>
        </div>
      )}
    </div>
  );
}
