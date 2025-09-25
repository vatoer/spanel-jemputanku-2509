"use client"
import { UnifiedLayout } from "@/components/layout/UnifiedLayout";
import { DirectionJson } from "@/components/tenant/AppleMapKitDirectionsViewer";
import { LAYOUT_PRESETS } from "@/types/layout";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Dummy data, replace with API/DB fetch as needed
const ROUTES = [
  { code: "6", name: "Line 6 Bekasi Timur - Pejambon", origin: "Bekasi Timur", destination: "Pejambon", status: "active" },
  { code: "10", name: "Line 10 Bekasi Barat - Pejambon", origin: "Bekasi Barat", destination: "Pejambon", status: "active" },
  { code: "11", name: "Line 11 Cikarang - Pejambon", origin: "Cikarang", destination: "Pejambon", status: "maintenance" },
  { code: "12", name: "Line 12 Bekasi Timur - Senayan", origin: "Bekasi Timur", destination: "Senayan", status: "active" }
];

const AppleMapKitDirectionsViewer = dynamic(
  () => import("@/components/tenant/AppleMapKitDirectionsViewer").then(mod => mod.AppleMapKitDirectionsViewer),
  { ssr: false }
);

export default function RouteManagementPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(ROUTES[0]);
  const [showStops, setShowStops] = useState(true);
  const [directions, setDirections] = useState<DirectionJson | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  
  // Demo stops data - replace with real data from your API
  const demoStops = [
    { name: "Terminal Bekasi Timur", time: "05:30", type: "terminal", eta: null },
    { name: "Halte Jatimakmur", time: "05:45", type: "stop", eta: "2 menit" },
    { name: "Halte Jatikramat", time: "06:00", type: "stop", eta: "8 menit" },
    { name: "Halte Jati Bening", time: "06:15", type: "stop", eta: "15 menit" },
    { name: "Terminal Pejambon", time: "07:00", type: "terminal", eta: "45 menit" }
  ];

  // Enhanced layout configuration for route management
  const layoutConfig = {
    ...LAYOUT_PRESETS.routeManagement,
    headerActions: (
      <div className="flex items-center gap-3">
        {/* Route Quick Stats */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
            <div className="text-lg font-bold text-white">{ROUTES.length}</div>
            <div className="text-xs text-blue-100">Total Routes</div>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
            <div className="text-lg font-bold text-white">{ROUTES.filter(r => r.status === 'active').length}</div>
            <div className="text-xs text-blue-100">Active</div>
          </div>
        </div>

        {/* Action Buttons */}
        <button
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
          onClick={() => {/* Add route functionality */}}
        >
          <span>+</span>
          <span className="hidden sm:inline">Add Route</span>
        </button>
      </div>
    ),
    // Custom sidebar content for route management
    sidebarContent: <RouteManagementSidebar 
      routes={ROUTES} 
      selectedRoute={selected} 
      onRouteSelect={setSelected}
      onShowStops={setShowStops}
      showStops={showStops}
    />
  };

  const handleRouteSelect = (route: typeof ROUTES[0]) => {
    setSelected(route);
  };

  const handleEditRoute = (route: typeof ROUTES[0]) => {
    console.log('Edit route:', route.code);
  };

  const handleViewRoute = (route: typeof ROUTES[0]) => {
    console.log('View route details:', route.code);
  };

  // Carousel navigation functions
  const itemsPerView = 3; // Show 3 cards at a time on desktop
  const totalSlides = Math.ceil((ROUTES.length + 1) / itemsPerView); // +1 for "Add New" card

  const nextSlide = () => {
    const newSlide = Math.min(currentSlide + 1, totalSlides - 1);
    setCurrentSlide(newSlide);
    setCurrentTranslate(newSlide * (-100 / totalSlides));
  };

  const prevSlide = () => {
    const newSlide = Math.max(currentSlide - 1, 0);
    setCurrentSlide(newSlide);
    setCurrentTranslate(newSlide * (-100 / totalSlides));
  };

  // Drag/Swipe handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const pos = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartPos(pos);
    setCurrentTranslate(currentSlide * (-100 / totalSlides));
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    const pos = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = pos - startPos;
    const translatePercentage = (diff / window.innerWidth) * 100;
    
    setCurrentTranslate(currentSlide * (-100 / totalSlides) + translatePercentage);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const pos = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = pos - startPos;
    
    if (Math.abs(diff) > 50) { // Threshold for swipe
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    } else {
      // Snap back to current slide
      setCurrentTranslate(currentSlide * (-100 / totalSlides));
    }
  };

  return (
    <UnifiedLayout config={layoutConfig}>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        
        {/* Map Area */}
        <div className="flex-1 min-h-[500px]">
          <div className="h-full bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            {/* Enhanced Map Container */}
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
              {directions ? (
                <AppleMapKitDirectionsViewer directions={directions} />
              ) : (
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <div className="text-7xl mb-8 animate-pulse">🗺️</div>
                    
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">
                        Route Visualization
                      </h3>
                      
                      <div className="text-lg text-gray-600 mb-6">
                        Showing: <span className="font-semibold text-blue-600">{selected.name}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 text-sm mb-6">
                        <div className="flex items-center justify-center gap-3 text-emerald-700 bg-emerald-50 rounded-lg py-3 px-4">
                          <span className="w-3 h-3 bg-emerald-400 rounded-full"></span>
                          <span className="font-medium">Route Optimization</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-blue-700 bg-blue-50 rounded-lg py-3 px-4">
                          <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                          <span className="font-medium">Stop Management</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-amber-700 bg-amber-50 rounded-lg py-3 px-4">
                          <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                          <span className="font-medium">Schedule Planning</span>
                        </div>
                      </div>
                      
                      <div className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-3 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-center gap-2 font-medium">
                          <span>🗺️</span>
                          <span>Apple MapKit JS integration untuk route planning</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Route Cards Carousel (Desktop) / Route Selection (Mobile) */}
        <div className="lg:w-96">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-full">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Route Overview</h3>
              <p className="text-sm text-gray-600">Select and manage transport routes</p>
            </div>

            {/* Mobile Route Selection */}
            <div className="lg:hidden p-4">
              <select
                value={selected.code}
                onChange={(e) => {
                  const route = ROUTES.find(r => r.code === e.target.value);
                  if (route) handleRouteSelect(route);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
              >
                {ROUTES.map((route) => (
                  <option key={route.code} value={route.code}>
                    Line {route.code} - {route.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Route Cards */}
            <div className="hidden lg:block p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {ROUTES.map((route) => (
                <button
                  key={route.code}
                  onClick={() => handleRouteSelect(route)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 border-2 ${
                    selected.code === route.code 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 shadow-md' 
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg text-gray-900">Line {route.code}</span>
                    <span className={`w-3 h-3 rounded-full ${
                      route.status === 'active' ? 'bg-green-400' : 'bg-amber-400'
                    }`} />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{route.name}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{route.origin}</span>
                    <span className="mx-2">→</span>
                    <span>{route.destination}</span>
                  </div>
                </button>
              ))}
              
              {/* Add New Route Card */}
              <button
                onClick={() => {/* Add route functionality */}}
                className="w-full p-4 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl transition-all duration-200 text-center text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50"
              >
                <div className="text-2xl mb-2">+</div>
                <div className="text-sm font-medium">Add New Route</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
}

// Route Management Sidebar Component
function RouteManagementSidebar({ 
  routes, 
  selectedRoute, 
  onRouteSelect, 
  onShowStops, 
  showStops 
}: {
  routes: typeof ROUTES;
  selectedRoute: typeof ROUTES[0];
  onRouteSelect: (route: typeof ROUTES[0]) => void;
  onShowStops: (show: boolean) => void;
  showStops: boolean;
}) {
  return (
    <div className="p-4 space-y-6">
      {/* Current Route Info */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Current Route</h4>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-blue-900">Line {selectedRoute.code}</span>
            <span className={`w-3 h-3 rounded-full ${
              selectedRoute.status === 'active' ? 'bg-green-400' : 'bg-amber-400'
            }`} />
          </div>
          <p className="text-sm text-blue-700 mb-2">{selectedRoute.name}</p>
          <div className="text-xs text-blue-600">
            {selectedRoute.origin} → {selectedRoute.destination}
          </div>
        </div>
      </div>

      {/* Route Controls */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Route Controls</h4>
        <div className="space-y-3">
          <button
            onClick={() => onShowStops(!showStops)}
            className={`w-full p-3 rounded-lg transition-colors text-left ${
              showStops 
                ? 'bg-green-100 border border-green-300 text-green-700' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{showStops ? '👁️' : '👁️‍🗨️'}</span>
              <span className="font-medium">{showStops ? 'Hide' : 'Show'} Stops</span>
            </div>
          </button>

          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg py-3 px-4 transition-all text-sm font-medium">
            🎯 Optimize Route
          </button>

          <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg py-3 px-4 transition-all text-sm font-medium">
            ✏️ Edit Route
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Route Statistics</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-700">5</div>
            <div className="text-xs text-gray-500">Stops</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-700">45</div>
            <div className="text-xs text-gray-500">Min</div>
          </div>
        </div>
      </div>
    </div>
  );
}