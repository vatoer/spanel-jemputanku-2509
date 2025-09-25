import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';
import React from 'react';

interface FleetHeaderProps {
  totalVehicles: number;
  activeVehicles: number;
  totalPassengers: number;
  onBack?: () => void;
}

export const FleetHeader: React.FC<FleetHeaderProps> = ({
  totalVehicles,
  activeVehicles,
  totalPassengers,
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
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>🚌</span>
          </div>
          <div>
            <h1 className={`text-white font-bold ${isMobile ? 'text-sm' : 'text-base'}`}>
              {isMobile ? 'Fleet Tracking' : 'Fleet Tracking'}
            </h1>
            <p className={`text-blue-100 ${isMobile ? 'text-xs' : 'text-xs'}`}>
              {isMobile ? `${totalVehicles} vehicles` : `Monitor ${totalVehicles} vehicles live`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Essential Stats Only */}
          <div className="flex items-center gap-2 text-blue-100">
            <div className="flex items-center gap-1">
              <span className="text-xs">{activeVehicles}/{totalVehicles}</span>
              <span className="text-xs opacity-75">active</span>
            </div>
            {!isMobile && (
              <div className="flex items-center gap-1">
                <span className="text-xs">👥 {totalPassengers}</span>
              </div>
            )}
          </div>

          {/* Live Status Indicator */}
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className={`text-green-100 font-medium ${isMobile ? 'text-xs' : 'text-xs'}`}>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};