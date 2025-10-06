import { ArmadaRiwayatAddContainer } from "@/components/tenant/ArmadaRiwayatAddContainer";
import { ArmadaRiwayatHeaderInfo } from "@/components/tenant/ArmadaRiwayatHeaderInfo";
import { ArmadaRiwayatTambahHeaderActions } from "@/components/tenant/ArmadaRiwayatTambahHeaderActions";

interface PageProps {
  params: {
    platNomor: string;
  };
}

export async function generateMetadata({ params }: { params: Promise<{ platNomor: string }> })  {
  const { platNomor } = await params;
  
  return {
    title: `Tambah Riwayat - ${decodeURIComponent(platNomor)} | JemputanKu Panel`,
    description: `Tambah riwayat pemeliharaan dan perbaikan untuk kendaraan ${decodeURIComponent(platNomor)}`,
  };
}

export default async function TambahRiwayatPage({ params }: { params: Promise<{ platNomor: string }> })  {
  const { platNomor } = await params;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border-b border-gray-200">
        <ArmadaRiwayatHeaderInfo 
          platNomor={platNomor}
          title="Tambah Riwayat Pemeliharaan dan Perbaikan"
          description="Tambahkan catatan pemeliharaan dan perbaikan baru untuk kendaraan ini"
        />
        <ArmadaRiwayatTambahHeaderActions platNomor={platNomor} />
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto">
          <ArmadaRiwayatAddContainer 
            platNomor={platNomor} 
          />
        </div>
      </div>
    </div>
  );
}