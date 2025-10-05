import { ArmadaRiwayatHeaderInfo } from "@/components/tenant/ArmadaRiwayatHeaderInfo";
import { ArmadaRiwayatTambahForm } from "@/components/tenant/ArmadaRiwayatTambahForm";
import { ArmadaRiwayatTambahHeaderActions } from "@/components/tenant/ArmadaRiwayatTambahHeaderActions";
import { Metadata } from "next";

interface PageProps {
  params: {
    platNomor: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { platNomor } = params;
  
  return {
    title: `Tambah Riwayat - ${decodeURIComponent(platNomor)} | JemputanKu Panel`,
    description: `Tambah riwayat pemeliharaan dan perbaikan untuk kendaraan ${decodeURIComponent(platNomor)}`,
  };
}

export default function TambahRiwayatPage({ params }: PageProps) {
  const { platNomor } = params;
  const decodedPlatNomor = decodeURIComponent(platNomor);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border-b border-gray-200">
        <ArmadaRiwayatHeaderInfo 
          platNomor={decodedPlatNomor}
          title="Tambah Riwayat Pemeliharaan dan Perbaikan"
          description="Tambahkan catatan pemeliharaan dan perbaikan baru untuk kendaraan ini"
        />
        <ArmadaRiwayatTambahHeaderActions platNomor={decodedPlatNomor} />
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-2xl mx-auto">
          <ArmadaRiwayatTambahForm platNomor={decodedPlatNomor} />
        </div>
      </div>
    </div>
  );
}