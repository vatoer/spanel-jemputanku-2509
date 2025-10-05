"use client";

import { useRouter } from "next/navigation";

interface ArmadaRiwayatEditHeaderActionsProps {
  platNomor: string;
  serviceRecordId: string;
}

export function ArmadaRiwayatEditHeaderActions({ 
  platNomor,
  serviceRecordId
}: ArmadaRiwayatEditHeaderActionsProps) {
  const router = useRouter();

  const handleBackToDetail = () => {
    router.push(`/armada/${platNomor}/riwayat/${serviceRecordId}`);
  };

  const handleBackToRiwayat = () => {
    router.push(`/armada/${platNomor}/riwayat`);
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* Desktop Actions */}
      <div className="hidden sm:flex items-center gap-2">
        <button 
          onClick={handleBackToDetail}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
        >
          <span className="text-xs">←</span>
          <span>Kembali ke Detail</span>
        </button>
        <button 
          onClick={handleBackToRiwayat}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors"
        >
          <span className="text-xs">📋</span>
          <span>Daftar Riwayat</span>
        </button>
      </div>
      
      {/* Mobile Actions */}
      <div className="sm:hidden flex items-center gap-2">
        <button 
          onClick={handleBackToDetail}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          title="Kembali ke Detail"
          aria-label="Kembali ke detail riwayat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={handleBackToRiwayat}
          className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Daftar Riwayat"
          aria-label="Kembali ke daftar riwayat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}