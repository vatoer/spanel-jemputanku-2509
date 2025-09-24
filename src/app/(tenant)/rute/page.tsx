"use client"
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dummy data, replace with API/DB fetch as needed
const ROUTES = [
  { code: "6", name: "Line 6 Bekasi Timur - Pejambon", origin: "Bekasi Timur", destination: "Pejambon" },
  { code: "10", name: "Line 10 Bekasi Barat - Pejambon", origin: "Bekasi Barat", destination: "Pejambon" },
  { code: "11", name: "Line 11 Cikarang - Pejambon", origin: "Cikarang", destination: "Pejambon" },
  { code: "12", name: "Line 12 Bekasi Timur - Senayan", origin: "Bekasi Timur", destination: "Senayan" }
];

const AppleMapKitDirectionsViewer = dynamic(
  () => import("@/components/tenant/AppleMapKitDirectionsViewer").then(mod => mod.AppleMapKitDirectionsViewer),
  { ssr: false }
);

export default function RutePage() {
  const [selected, setSelected] = useState(ROUTES[0]);
  const [showStops, setShowStops] = useState(true);
  const [directions, setDirections] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  
  // Demo stops data - replace with real data from your API
  const demoStops = [
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
      } catch {}
    }
    fetchDirections();
  }, []);

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
  const itemsPerView = 4; // Show 4 cards at a time on desktop
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
    const threshold = window.innerWidth * 0.1; // 10% of screen width
    
    let newSlide = currentSlide;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentSlide > 0) {
        // Drag ke kanan = previous slide (ke kiri)
        newSlide = currentSlide - 1;
      } else if (diff < 0 && currentSlide < totalSlides - 1) {
        // Drag ke kiri = next slide (ke kanan)  
        newSlide = currentSlide + 1;
      }
    }
    
    setCurrentSlide(newSlide);
    setCurrentTranslate(newSlide * (-100 / totalSlides));
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Responsive: Mobile Overlay + Desktop Side-by-side */}
      <div className="flex flex-col lg:flex-row gap-4">
        
        {/* Map Container */}
        <div className="relative flex-1 h-[400px] border rounded-lg shadow-sm overflow-hidden">
          {/* Map Background */}
          {directions ? (
            <AppleMapKitDirectionsViewer directions={directions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Peta rute akan tampil di sini
            </div>
          )}

          {/* Mobile Only: Route Info Overlay - Bottom */}
          <div className="lg:hidden absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border p-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-800">{selected.name}</div>
                <div className="text-xs text-gray-600">
                  {demoStops.length} pemberhentian • Est. 45 menit
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleViewRoute(selected)}
                  className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                >
                  👁️
                </button>
                <button
                  onClick={() => handleEditRoute(selected)}
                  className="px-2 py-1 text-xs rounded bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
                >
                  ✏️
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Only: Stops Sidebar */}
        <div className="hidden lg:block lg:w-80">
          <div className="bg-white border rounded-lg shadow-sm h-[400px] flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b bg-gray-50 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">
                  🚏 Halte {selected.name}
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleViewRoute(selected)}
                    className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                    title="View Details"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => handleEditRoute(selected)}
                    className="px-2 py-1 text-xs rounded bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
                    title="Edit Route"
                  >
                    ✏️
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {demoStops.length} stops • {selected.origin} → {selected.destination}
              </p>
            </div>

            {/* Desktop Stops List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2 space-y-1">
                {demoStops.map((stop, index) => (
                  <div key={stop.id} className="flex items-center p-2 rounded hover:bg-blue-50 transition">
                    <div className="flex-shrink-0 mr-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-green-500 text-white' : 
                        index === demoStops.length - 1 ? 'bg-red-500 text-white' : 
                        'bg-blue-500 text-white'
                      }`}>
                        {stop.order}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {stop.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        📍 Est. {stop.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Route Selection: Mobile Carousel + Desktop Grid */}
      
      {/* Mobile Only: Horizontal Carousel */}
      <div className="lg:hidden bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-3 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-sm text-gray-800">
              📍 Pilih Rute ({ROUTES.length})
            </h2>
            <div className="text-xs text-gray-500">Swipe →</div>
          </div>
        </div>

        <div className="p-3">
          <div 
            className="flex gap-3 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {ROUTES.map((rute) => (
              <div key={rute.code} className="flex-shrink-0 w-60">
                <div className={`rounded-lg border-2 transition-all duration-200 ${
                  selected.code === rute.code
                    ? 'bg-blue-100 border-blue-500 text-blue-900 shadow-lg scale-105'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-md'
                }`}>
                  
                  <button
                    onClick={() => handleRouteSelect(rute)}
                    className="w-full px-3 py-3 text-left cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-sm leading-tight pr-2">
                        {rute.name}
                      </div>
                      <div className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0">
                        🚏 {demoStops.length}
                      </div>
                    </div>

                    <div className="text-xs opacity-90 mb-2 font-medium">
                      📍 {rute.origin} → {rute.destination}
                    </div>

                    <div className="text-xs text-gray-600 mb-2">
                      {rute.origin} • +{demoStops.length - 2} stops
                    </div>

                    {selected.code === rute.code && (
                      <div className="flex items-center text-xs text-blue-700 font-medium">
                        ✓ Aktif
                      </div>
                    )}
                  </button>

                  <div className="border-t border-gray-200 px-2 py-1.5 flex justify-between">
                    <div className="text-xs text-gray-500">
                      #{rute.code}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewRoute(rute);
                        }}
                        className="px-1.5 py-0.5 text-xs rounded bg-gray-200 hover:bg-blue-100 text-gray-700 hover:text-blue-700 transition"
                      >
                        👁️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditRoute(rute);
                        }}
                        className="px-1.5 py-0.5 text-xs rounded bg-orange-100 hover:bg-orange-200 text-orange-700 transition"
                      >
                        ✏️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Only: Carousel with Arrow Navigation */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border px-6 py-2">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className=" font-semibold text-gray-800">
            📍 Pilih Rute ({ROUTES.length})
          </h2>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              {currentSlide + 1} / {totalSlides} • Drag atau arrow
            </div>
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition disabled:opacity-50"
                disabled={currentSlide === 0}
              >
                ←
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition disabled:opacity-50"
                disabled={currentSlide === totalSlides - 1}
              >
                →
              </button>
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden pt-4 pl-4">
          <div 
            className={`flex gap-4 ${isDragging ? '' : 'transition-transform duration-300 ease-in-out'} cursor-grab active:cursor-grabbing select-none`}
            style={{ 
              transform: `translateX(${isDragging ? currentTranslate : currentSlide * (-100 / totalSlides)}%)`,
              width: `${totalSlides * 100}%`
            }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            {ROUTES.map((rute) => (
              <div key={rute.code} className="flex-shrink-0" style={{ width: `${100 / (totalSlides * itemsPerView)}%` }}>
                <div className="mx-2">
                  <div className={`rounded-lg border-2 transition-all duration-200 ${
                  selected.code === rute.code
                    ? 'bg-blue-100 border-blue-500 text-blue-900 shadow-lg scale-105'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-md'
                }`}>
                  
                  <button
                    onClick={() => handleRouteSelect(rute)}
                    className="w-full px-3 py-3 text-left cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-sm leading-tight pr-2">
                        {rute.name}
                      </div>
                      <div className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0">
                        🚏 {demoStops.length}
                      </div>
                    </div>

                    <div className="text-xs opacity-90 mb-2 font-medium">
                      📍 {rute.origin} → {rute.destination}
                    </div>

                    {selected.code === rute.code && (
                      <div className="flex items-center text-xs text-blue-700 font-medium">
                        ✓ Aktif
                      </div>
                    )}
                  </button>

                  <div className="border-t border-gray-200 px-2 py-1.5 flex justify-between">
                    <div className="text-xs text-gray-500">
                      #{rute.code}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewRoute(rute);
                        }}
                        className="px-2 py-0.5 text-xs rounded bg-gray-200 hover:bg-blue-100 text-gray-700 hover:text-blue-700 transition"
                      >
                        👁️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditRoute(rute);
                        }}
                        className="px-2 py-0.5 text-xs rounded bg-orange-100 hover:bg-orange-200 text-orange-700 transition"
                      >
                        ✏️
                      </button>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add New Route Card */}
            <div className="flex-shrink-0" style={{ width: `${100 / (totalSlides * itemsPerView)}%` }}>
              <div className="mx-2">
                <div className="h-full rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all duration-200">
                  <button className="w-full h-full px-3 py-8 flex flex-col items-center justify-center text-center cursor-pointer">
                    <div className="text-2xl mb-2">➕</div>
                    <div className="font-semibold text-sm">Tambah Rute</div>
                    <div className="text-xs mt-1">Buat rute baru</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Only: Collapsible Stop Details */}
      <div className="lg:hidden bg-white border rounded-lg shadow-sm">
        <div className="p-4 border-b bg-gray-50 cursor-pointer" onClick={() => setShowStops(!showStops)}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800">
                🚏 Detail Halte - {selected.name}
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {demoStops.length} pemberhentian • {selected.origin} → {selected.destination}
              </p>
            </div>
            <div className="text-gray-500">
              {showStops ? '▲' : '▼'}
            </div>
          </div>
        </div>

        <div className={`transition-all duration-300 overflow-hidden ${
          showStops ? 'max-h-96' : 'max-h-0'
        }`}>
          <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
            {demoStops.map((stop, index) => (
              <div key={stop.id} className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition border border-gray-100">
                <div className="flex-shrink-0 mr-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-green-500 text-white' : 
                    index === demoStops.length - 1 ? 'bg-red-500 text-white' : 
                    'bg-blue-500 text-white'
                  }`}>
                    {stop.order}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-base text-gray-900 mb-1">
                    {stop.name}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center">
                    🕒 Estimasi {stop.time}
                    {index === 0 && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Start</span>}
                    {index === demoStops.length - 1 && <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">End</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
