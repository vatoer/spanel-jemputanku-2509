"use client";

import { useRouter } from "next/navigation";

interface ArmadaRiwayatDetailHeaderActionsProps {
  platNomor: string;
  serviceRecordId: string;
}

export function ArmadaRiwayatDetailHeaderActions({ 
  platNomor,
  serviceRecordId
}: ArmadaRiwayatDetailHeaderActionsProps) {
  const router = useRouter();

  const handleBackToRiwayat = () => {
    router.push(`/armada/${platNomor}/riwayat`);
  };

  const handleEdit = () => {
    router.push(`/armada/${platNomor}/riwayat/${serviceRecordId}/edit`);
  };

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus riwayat pemeliharaan dan perbaikan ini?")) {
      try {
        // TODO: Implement delete API call
        console.log("Deleting service record:", serviceRecordId);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Navigate back to riwayat list
        router.push(`/armada/${platNomor}/riwayat`);
      } catch (error) {
        console.error("Error deleting service record:", error);
        // TODO: Show error toast
      }
    }
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
        <button 
          onClick={handleEdit}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors"
        >
          <span className="text-xs">✏️</span>
          <span>Edit</span>
        </button>
        <button 
          onClick={handleDelete}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors"
        >
          <span className="text-xs">🗑️</span>
          <span>Hapus</span>
        </button>
      </div>
      
      {/* Mobile Actions */}
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
        <button 
          onClick={handleEdit}
          className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit Riwayat"
          aria-label="Edit riwayat pemeliharaan dan perbaikan"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button 
          onClick={handleDelete}
          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Hapus Riwayat"
          aria-label="Hapus riwayat pemeliharaan dan perbaikan"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}