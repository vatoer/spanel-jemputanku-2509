"use client";

import { useRouter } from "next/navigation";

interface ArmadaRiwayatTambahHeaderActionsProps {
  platNomor: string;
}

export function ArmadaRiwayatTambahHeaderActions({ 
  platNomor
}: ArmadaRiwayatTambahHeaderActionsProps) {
  const router = useRouter();

  const handleBackToRiwayat = () => {
    router.push(`/armada/${platNomor}/riwayat`);
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* Desktop Actions */}
      <div className="hidden sm:flex items-center gap-2">
        <button 
          onClick={handleBackToRiwayat}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
        >
          <span className="text-xs">←</span>
          <span>Kembali</span>
        </button>
      </div>
      
      {/* Mobile Actions - Simplified */}
      <div className="sm:hidden flex items-center gap-2">
        <button 
          onClick={handleBackToRiwayat}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          title="Kembali ke Riwayat"
          aria-label="Kembali ke riwayat armada"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}