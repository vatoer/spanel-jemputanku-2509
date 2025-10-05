"use client";

import { useRouter } from "next/navigation";

interface ArmadaRiwayatHeaderActionsProps {
  platNomor: string;
}

export function ArmadaRiwayatHeaderActions({ 
  platNomor
}: ArmadaRiwayatHeaderActionsProps) {
  const router = useRouter();

  const handleBackToDetail = () => {
    router.push(`/armada/${platNomor}`);
  };

  const handleExportRiwayat = () => {
    // TODO: Implement export functionality
    console.log("Export riwayat untuk armada:", platNomor);
  };

  const handleAddRiwayat = () => {
    // Navigate to dedicated form page - Better UX for complex forms
    router.push(`/armada/${platNomor}/riwayat/tambah`);
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
          <span>Kembali</span>
        </button>
        <button 
          onClick={handleExportRiwayat}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors"
        >
          <span className="text-xs">📄</span>
          <span>Export</span>
        </button>
        <button 
          onClick={handleAddRiwayat}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 hover:border-emerald-300 transition-colors"
        >
          <span className="text-xs">➕</span>
          <span>Tambah Riwayat</span>
        </button>
      </div>
      
      {/* Mobile Actions - Simplified */}
      <div className="sm:hidden flex items-center gap-2">
        <button 
          onClick={handleBackToDetail}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          title="Kembali ke Detail"
          aria-label="Kembali ke detail armada"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={handleAddRiwayat}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg active:bg-emerald-200 transition-colors"
        >
          <span className="text-xs">➕</span>
          <span>Tambah</span>
        </button>
        
        {/* More Menu for Mobile */}
        <MobileMoreMenu 
          onExport={handleExportRiwayat}
        />
      </div>
    </div>
  );
}

interface MobileMoreMenuProps {
  onExport: () => void;
}

function MobileMoreMenu({ onExport }: MobileMoreMenuProps) {
  return (
    <button 
      onClick={onExport}
      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors"
      title="Export Riwayat"
      aria-label="Export riwayat armada"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </button>
  );
}