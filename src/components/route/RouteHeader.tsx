import { UserAvatar } from '@/components/layout/UserAvatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';
import React from 'react';

interface RouteHeaderProps {
  totalRoutes: number;
  activeRoutes: number;
  onAddRoute?: () => void;
  onBack?: () => void;
}

export const RouteHeader: React.FC<RouteHeaderProps> = ({
  totalRoutes,
  activeRoutes,
  onAddRoute,
  onBack
}) => {
  const isMobile = useIsMobile();
  const router = useRouter();

  return (
    <div className={`${isMobile ? 'bg-gradient-to-r from-blue-600 to-blue-700 p-2' : 'bg-gradient-to-r from-blue-600 to-blue-700 p-3'} shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back Button with Text */}
          <button
            onClick={onBack || (() => router.push('/dashboard'))}
            className={`flex items-center gap-1 ${isMobile ? 'p-1.5' : 'p-2'} bg-white/20 hover:bg-white/30 rounded transition-all text-white`}
            title="Back to Dashboard"
          >
            <svg className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {!isMobile && <span className="text-sm font-medium">Dashboard</span>}
          </button>
          
          {/* Divider */}
          <div className="w-px h-6 bg-white/20"></div>
          
          <div className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} bg-white/20 rounded flex items-center justify-center`}>
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>🗺️</span>
          </div>
          <div>
            <h1 className={`text-white font-bold ${isMobile ? 'text-sm' : 'text-base'}`}>
              {isMobile ? 'Routes' : 'Route Management'}
            </h1>
            <p className={`text-blue-100 ${isMobile ? 'text-xs' : 'text-xs'}`}>
              {isMobile ? `${totalRoutes} routes` : `${totalRoutes} transport routes`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Essential Stats - Simplified */}
          {!isMobile && (
            <div className="flex items-center gap-2 text-blue-100">
              <div className="flex items-center gap-1">
                <span className="text-xs">{activeRoutes}/{totalRoutes}</span>
                <span className="text-xs opacity-75">active</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button 
            onClick={onAddRoute}
            className={`bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded transition font-medium flex items-center gap-1 ${isMobile ? 'text-xs' : 'text-xs'}`}
          >
            <span>+</span>
            <span className={isMobile ? 'hidden' : ''}>Add Route</span>
          </button>

          {/* Divider for Desktop */}
          {!isMobile && <div className="w-px h-6 bg-white/20"></div>}

          {/* User Avatar */}
          <UserAvatar className="border-white/30 hover:border-white/50" />
        </div>
      </div>
    </div>
  );
};