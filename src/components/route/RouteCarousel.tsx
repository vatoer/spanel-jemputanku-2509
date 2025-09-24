import { useIsMobile } from '@/hooks/use-mobile';
import React, { useRef, useState } from 'react';

export interface Route {
  code: string;
  name: string;
  origin: string;
  destination: string;
  status: 'active' | 'maintenance';
}

interface RouteCarouselProps {
  routes: Route[];
  selectedRoute: Route;
  onRouteSelect: (route: Route) => void;
  onEditRoute?: (route: Route) => void;
  onViewRoute?: (route: Route) => void;
  onAddRoute?: () => void;
}

export const RouteCarousel: React.FC<RouteCarouselProps> = ({
  routes,
  selectedRoute,
  onRouteSelect,
  onEditRoute,
  onViewRoute,
  onAddRoute
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
    const cardWidth = isMobile ? 140 : 160;
    carouselRef.current.scrollBy({
      left: -(cardWidth + 16), // card width + gap
      behavior: 'smooth'
    });
  };

  const scrollToRight = () => {
    if (!carouselRef.current) return;
    const cardWidth = isMobile ? 140 : 160;
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

  return (
    <div className={`${isMobile ? 'p-3' : 'p-4'} bg-white border-b border-gray-200 relative z-10`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-semibold text-gray-800 ${isMobile ? 'text-sm' : 'text-base'}`}>
          Routes
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
        {/* Route Cards - Compact Design */}
        {routes.map((route) => (
          <div
            key={route.code}
            onClick={() => onRouteSelect(route)}
            className={`${isMobile ? 'min-w-[140px]' : 'min-w-[160px]'} p-2 rounded-lg border cursor-pointer transition-all select-none ${
              selectedRoute.code === route.code
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-sm'
            }`}
          >
            {/* Header: Route Code, Status & Edit Button */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center`}>
                  <span className={`text-white font-bold ${isMobile ? 'text-xs' : 'text-sm'}`}>{route.code}</span>
                </div>
                <div className={`font-medium text-gray-900 ${isMobile ? 'text-xs' : 'text-sm'} truncate`}>
                  Line {route.code}
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEditRoute?.(route);
                }}
                className="p-1 text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 rounded transition"
                title="Edit Route"
              >
                ✏️
              </button>
            </div>
            
            {/* Origin → Destination in one row */}
            <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600 mb-1`}>
              <div className="truncate">
                📍 {route.origin} → 🎯 {route.destination}
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                route.status === 'active' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {route.status === 'active' ? '● Active' : '● Maintenance'}
              </div>
            </div>
          </div>
        ))}

        {/* Add New Route Card - Compact */}
        <div
          className={`${isMobile ? 'min-w-[140px]' : 'min-w-[160px]'} p-2 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer transition-all bg-gray-50 hover:bg-blue-50 flex flex-col items-center justify-center select-none`}
          onClick={onAddRoute}
        >
          <div className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} bg-gray-300 hover:bg-blue-300 rounded flex items-center justify-center mb-1 transition-colors`}>
            <span className={`text-gray-600 hover:text-blue-700 ${isMobile ? 'text-sm' : 'text-base'}`}>+</span>
          </div>
          <div className="text-center">
            <div className={`font-medium text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>Add Route</div>
          </div>
        </div>
      </div>
    </div>
  );
};