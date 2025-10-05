"use client";

import { useRouter } from "next/navigation";

interface ArmadaDetailHeaderActionsProps {
  platNomor: string;
}

export function ArmadaDetailHeaderActions({ 
  platNomor
}: ArmadaDetailHeaderActionsProps) {
  const router = useRouter();

  const handleNavigateToRiwayat = () => {
    router.push(`/armada/${platNomor}/riwayat`);
  };

  const handleNavigateToEdit = () => {
    router.push(`/armada/${platNomor}/edit`);
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* Pure Actions - No status display */}
      {/* Desktop Actions */}
      <div className="hidden sm:flex items-center gap-2">
        <button 
          onClick={handleNavigateToRiwayat}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors"
        >
          <span className="text-xs">📊</span>
          <span>Riwayat</span>
        </button>
        <button 
          onClick={handleNavigateToEdit}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 hover:border-emerald-300 transition-colors"
        >
          <span className="text-xs">✏️</span>
          <span>Edit</span>
        </button>
      </div>
      
      {/* Mobile Actions - Simplified */}
      <div className="sm:hidden flex items-center gap-2">
        <button 
          onClick={handleNavigateToEdit}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg active:bg-emerald-200 transition-colors"
        >
          <span className="text-xs">✏️</span>
          <span>Edit</span>
        </button>
        
        {/* More Menu for Mobile */}
        <MobileMoreMenu 
          platNomor={platNomor} 
          onNavigateToRiwayat={handleNavigateToRiwayat}
        />
      </div>
    </div>
  );
}

interface MobileMoreMenuProps {
  platNomor: string;
  onNavigateToRiwayat: () => void;
}

function MobileMoreMenu({ platNomor, onNavigateToRiwayat }: MobileMoreMenuProps) {
  return (
    <button 
      onClick={onNavigateToRiwayat}
      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors"
      title="Lihat Riwayat"
      aria-label="Lihat riwayat armada"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </button>
  );
}