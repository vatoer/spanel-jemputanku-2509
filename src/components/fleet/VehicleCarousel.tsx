import { useIsMobile } from '@/hooks/use-mobile';
import React, { useRef, useState } from 'react';

export interface FleetVehicle {
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

interface VehicleCarouselProps {
  vehicles: FleetVehicle[];
  selectedVehicle: FleetVehicle | null;
  onVehicleSelect: (vehicle: FleetVehicle) => void;
  onContactDriver?: (vehicle: FleetVehicle) => void;
  onViewDetails?: (vehicle: FleetVehicle) => void;
}

export const VehicleCarousel: React.FC<VehicleCarouselProps> = ({
  vehicles,
  selectedVehicle,
  onVehicleSelect,
  onContactDriver,
  onViewDetails
}) => {
  const isMobile = useIsMobile();
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Navigation state
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Drag handlers for carousel
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  // Navigation functions
  const scrollToLeft = () => {
    if (!carouselRef.current) return;
    const cardWidth = isMobile ? 180 : 200;
    carouselRef.current.scrollBy({
      left: -(cardWidth + 16), // card width + gap
      behavior: 'smooth'
    });
  };

  const scrollToRight = () => {
    if (!carouselRef.current) return;
    const cardWidth = isMobile ? 180 : 200;
    carouselRef.current.scrollBy({
      left: cardWidth + 16, // card width + gap
      behavior: 'smooth'
    });
  };

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Add scroll event listener
  React.useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    carousel.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition(); // Initial check
    
    return () => carousel.removeEventListener('scroll', checkScrollPosition);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'idle': return 'bg-amber-100 text-amber-700';
      case 'maintenance': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '● Active';
      case 'idle': return '● Standby';
      case 'maintenance': return '● Maintenance';
      default: return '● Unknown';
    }
  };

  return (
    <div className={`${isMobile ? 'p-3' : 'p-4'} bg-white border-b border-gray-200 relative z-10`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-semibold text-gray-800 ${isMobile ? 'text-sm' : 'text-base'}`}>
          Fleet Vehicles
        </h3>
        <div className="flex items-center gap-2">
          {!isMobile && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mr-3">
              <span>Drag to scroll</span>
              <span className="text-gray-300">•</span>
              <span>Click to select</span>
            </div>
          )}
          
          {/* Navigation Arrows */}
          <div className="flex items-center gap-1">
            <button
              onClick={scrollToLeft}
              disabled={!canScrollLeft}
              className={`p-1.5 rounded-md border transition-all ${
                canScrollLeft
                  ? 'border-gray-300 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800'
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={scrollToRight}
              disabled={!canScrollRight}
              className={`p-1.5 rounded-md border transition-all ${
                canScrollRight
                  ? 'border-gray-300 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800'
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        ref={carouselRef}
        className={`flex gap-4 overflow-x-auto scrollbar-hide pb-2 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Vehicle Cards */}
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            onClick={() => onVehicleSelect(vehicle)}
            className={`${isMobile ? 'min-w-[180px]' : 'min-w-[200px]'} p-2 rounded-lg border cursor-pointer transition-all select-none ${
              selectedVehicle?.id === vehicle.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-sm'
            }`}
          >
            {/* Header: Vehicle ID & Contact Button */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center`}>
                  <span className={`text-white font-bold ${isMobile ? 'text-xs' : 'text-sm'}`}>🚌</span>
                </div>
                <div className={`font-medium text-gray-900 ${isMobile ? 'text-xs' : 'text-sm'} truncate`}>
                  {vehicle.id}
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onContactDriver?.(vehicle);
                }}
                className="p-1 text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 rounded transition"
                title="Contact Driver"
              >
                📞
              </button>
            </div>
            
            {/* Route & Driver */}
            <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600 mb-1`}>
              <div className="truncate">
                🗺️ Line {vehicle.routeCode} • 👨‍💼 {vehicle.driver.split(' ')[0]}
              </div>
            </div>

            {/* Passengers & Speed */}
            <div className="flex items-center justify-between mb-2">
              <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600`}>
                👥 {vehicle.passengers}/{vehicle.capacity}
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600`}>
                🚄 {vehicle.speed} km/h
              </div>
            </div>

            {/* Status Badge */}
            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
              {getStatusText(vehicle.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};