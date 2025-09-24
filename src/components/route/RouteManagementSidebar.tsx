"use client"
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

// Types
interface Route {
  code: string;
  name: string;
  origin: string;
  destination: string;
  status: 'active' | 'maintenance';
}

interface RouteManagementSidebarProps {
  routes: Route[];
  selectedRoute: Route;
  onRouteSelect: (route: Route) => void;
  onShowStops: (show: boolean) => void;
  showStops: boolean;
}

export function RouteManagementSidebar({
  routes,
  selectedRoute,
  onRouteSelect,
  onShowStops,
  showStops
}: RouteManagementSidebarProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'maintenance': return 'bg-red-500 text-white';
      case 'planning': return 'bg-yellow-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'maintenance': return 'Maintenance';
      case 'planning': return 'Perencanaan';
      default: return 'Normal';
    }
  };

  // Responsive items per view
  const itemsPerView = isMobile ? 1 : 2; // Show 1 card on mobile, 2 on desktop
  const totalSlides = Math.ceil((routes.length + 1) / itemsPerView); // +1 for "Add New" card

  const nextSlide = () => {
    const newSlide = Math.min(currentSlide + 1, totalSlides - 1);
    setCurrentSlide(newSlide);
  };

  const prevSlide = () => {
    const newSlide = Math.max(currentSlide - 1, 0);
    setCurrentSlide(newSlide);
  };

  // Touch/swipe handling for mobile
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < totalSlides - 1) {
      nextSlide();
    }
    if (isRightSwipe && currentSlide > 0) {
      prevSlide();
    }
  };

  return (
    <div className={`h-full flex flex-col bg-white ${isMobile ? 'touch-pan-y' : ''}`}>
      {/* Header */}
      <div className={`${isMobile ? 'p-4' : 'p-6'} bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-200`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-green-600 rounded-xl flex items-center justify-center`}>
              <span className={`text-white ${isMobile ? 'text-base' : 'text-lg'}`}>🗺️</span>
            </div>
            <div>
              <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>Route Control</h2>
              <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>{routes.length} rute tersedia</p>
            </div>
          </div>
          {/* Mobile toggle button */}
          {isMobile && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 bg-white/80 rounded-lg hover:bg-white transition-colors"
            >
              <span className="text-gray-600">
                {isExpanded ? '📄' : '📋'}
              </span>
            </button>
          )}
        </div>

        {/* Route Quick Actions */}
        <div className={`grid grid-cols-2 gap-2 ${isMobile ? 'mb-2' : 'mb-4'}`}>
          <button
            onClick={() => onShowStops(!showStops)}
            className={`px-3 py-2 text-xs rounded-lg font-medium transition min-h-[44px] ${
              showStops
                ? "bg-green-100 text-green-700 border-2 border-green-300"
                : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700"
            }`}
          >
            🚏 {isMobile ? (showStops ? 'Hide' : 'Show') : (showStops ? 'Sembunyikan' : 'Tampilkan')} {!isMobile && 'Halte'}
          </button>
          <button className="px-3 py-2 text-xs rounded-lg font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition min-h-[44px]">
            ➕ {isMobile ? 'Add' : 'Tambah Rute'}
          </button>
        </div>
      </div>

      {/* Route Carousel */}
      <div className={`${isMobile ? 'p-3' : 'p-4'} border-b border-gray-200`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`font-semibold text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {isMobile ? 'Routes' : 'Daftar Rute'}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs transition ${
                isMobile ? 'w-8 h-8 min-h-[44px]' : 'w-6 h-6'
              }`}
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide >= totalSlides - 1}
              className={`rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs transition ${
                isMobile ? 'w-8 h-8 min-h-[44px]' : 'w-6 h-6'
              }`}
            >
              →
            </button>
          </div>
        </div>

        <div 
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-300"
            style={{ 
              transform: `translateX(-${currentSlide * (100 / totalSlides)}%)`,
              width: `${totalSlides * 100}%`
            }}
          >
            {/* Route Cards */}
            {routes.map((route) => (
              <div
                key={route.code}
                className={`${isMobile ? 'p-4' : 'p-3'} rounded-lg border-2 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${isMobile ? 'mr-3' : 'mr-2'} ${
                  selectedRoute.code === route.code
                    ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 shadow-lg'
                    : 'border-gray-200 hover:border-green-300 bg-white hover:bg-gray-50 active:bg-gray-100'
                } ${isMobile ? 'min-h-[120px] touch-manipulation' : ''}`}
                style={{ minWidth: `${100 / itemsPerView / totalSlides}%` }}
                onClick={() => onRouteSelect(route)}
              >
                <div className={`flex items-center gap-2 ${isMobile ? 'mb-3' : 'mb-2'}`}>
                  <div className={`bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center ${
                    isMobile ? 'w-10 h-10' : 'w-8 h-8'
                  }`}>
                    <span className={`text-white font-bold ${isMobile ? 'text-sm' : 'text-xs'}`}>{route.code}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-gray-900 truncate ${isMobile ? 'text-sm' : 'text-xs'}`}>
                      Line {route.code}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(route.status)} ${isMobile ? 'mt-1' : ''}`}>
                      {getStatusText(route.status)}
                    </div>
                  </div>
                </div>
                
                <div className={`text-gray-600 space-y-1 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                  <div className="flex items-center gap-2">
                    <span>🚀</span>
                    <span className="truncate">{route.origin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🏁</span>
                    <span className="truncate">{route.destination}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Route Card */}
            <div
              className={`${isMobile ? 'p-4' : 'p-3'} rounded-lg border-2 border-dashed border-gray-300 hover:border-green-400 cursor-pointer transition-all duration-200 bg-gray-50 hover:bg-green-50 active:bg-green-100 ${isMobile ? 'mr-3' : 'mr-2'} flex flex-col items-center justify-center ${isMobile ? 'min-h-[120px] touch-manipulation' : ''}`}
              style={{ minWidth: `${100 / itemsPerView / totalSlides}%` }}
              onClick={() => {/* Add route functionality */}}
            >
              <div className={`bg-gray-300 rounded-lg flex items-center justify-center mb-2 ${
                isMobile ? 'w-10 h-10' : 'w-8 h-8'
              }`}>
                <span className={`text-gray-600 ${isMobile ? 'text-xl' : 'text-lg'}`}>+</span>
              </div>
              <div className={`text-gray-600 text-center ${isMobile ? 'text-sm' : 'text-xs'}`}>
                <div className="font-medium">{isMobile ? 'Add Route' : 'Tambah Rute'}</div>
                <div>{isMobile ? 'New' : 'Baru'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Route Details - Collapsible on mobile */}
      <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-3' : 'p-4'} ${isMobile && !isExpanded ? 'hidden' : ''}`}>
        <div className={`bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg ${isMobile ? 'p-3 mb-3' : 'p-4 mb-4'}`}>
          <h4 className={`font-semibold text-gray-800 mb-2 flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
            <span>🗺️</span>
            {isMobile ? `Line ${selectedRoute.code}` : selectedRoute.name}
          </h4>
          <div className={`space-y-2 text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
              <span className="font-medium">{isMobile ? 'From:' : 'Origin:'}</span>
              <span className="truncate">{selectedRoute.origin}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
              <span className="font-medium">{isMobile ? 'To:' : 'Destination:'}</span>
              <span className="truncate">{selectedRoute.destination}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
              <span className="font-medium">Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedRoute.status)}`}>
                {getStatusText(selectedRoute.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Route Actions */}
        <div className={`space-y-2 ${isMobile ? 'grid grid-cols-1 gap-2' : ''}`}>
          <button className={`w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 touch-manipulation ${
            isMobile ? 'py-3 text-sm min-h-[48px]' : 'py-2 text-sm'
          }`}>
            <span>👁️</span>
            {isMobile ? 'View' : 'View Details'}
          </button>
          <button className={`w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 touch-manipulation ${
            isMobile ? 'py-3 text-sm min-h-[48px]' : 'py-2 text-sm'
          }`}>
            <span>✏️</span>
            {isMobile ? 'Edit' : 'Edit Route'}
          </button>
          <button className={`w-full bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 touch-manipulation ${
            isMobile ? 'py-3 text-sm min-h-[48px]' : 'py-2 text-sm'
          }`}>
            <span>📊</span>
            Analytics
          </button>
        </div>

        {/* Demo Stops List (if showStops is true) */}
        {showStops && (
          <div className={isMobile ? 'mt-4' : 'mt-6'}>
            <h5 className={`font-semibold text-gray-700 mb-3 flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
              <span>🚏</span>
              {isMobile ? 'Stops' : 'Route Stops'}
            </h5>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {[
                { name: "Terminal Asal", time: "05:30", type: "terminal" },
                { name: "Halte 1", time: "05:45", type: "stop" },
                { name: "Halte 2", time: "06:00", type: "stop" },
                { name: "Terminal Tujuan", time: "06:30", type: "terminal" }
              ].map((stop, index) => (
                <div key={index} className={`flex items-center gap-3 bg-white rounded border border-gray-200 ${isMobile ? 'p-3' : 'p-2'}`}>
                  <div className={`rounded-full ${stop.type === 'terminal' ? 'bg-blue-500' : 'bg-gray-400'} ${
                    isMobile ? 'w-4 h-4' : 'w-3 h-3'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-gray-800 truncate ${isMobile ? 'text-sm' : 'text-sm'}`}>{stop.name}</div>
                    <div className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-xs'}`}>{stop.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {(!isMobile || isExpanded) && (
        <div className={`bg-gray-50 border-t border-gray-200 ${isMobile ? 'p-3' : 'p-4'}`}>
          <div className="text-xs text-gray-500 text-center">
            {isMobile ? 'Updated: ' : 'Last updated: '}{new Date().toLocaleTimeString('id-ID')}
          </div>
        </div>
      )}
    </div>
  );
}