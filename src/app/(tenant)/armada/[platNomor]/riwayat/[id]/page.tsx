import { ArmadaRiwayatDetailHeaderActions } from "@/components/tenant/ArmadaRiwayatDetailHeaderActions";
import { ArmadaRiwayatHeaderInfo } from "@/components/tenant/ArmadaRiwayatHeaderInfo";
import { RiwayatDetailView } from "@/components/tenant/RiwayatDetailView";
import { getServiceRecordById } from "@/lib/services/serviceRecord";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    platNomor: string;
    id: string;
  };
}


export async function generateMetadata({ params }: { params: Promise<{ platNomor: string; id: string }> }): Promise<Metadata> {
  const { platNomor, id } = await params;
  
  try {
    const serviceRecord = await getServiceRecordById(id);

    if (!serviceRecord) {
      return {
        title: `Edit Riwayat - ${platNomor} | JemputanKu Panel`,
        description: `Edit riwayat pemeliharaan dan perbaikan untuk kendaraan ${decodeURIComponent(platNomor)}`,
      };
    }
    
    return {
      title: `${serviceRecord.title} - ${decodeURIComponent(platNomor)} | JemputanKu Panel`,
      description: `Detail pemeliharaan dan perbaikan ${serviceRecord.title} untuk kendaraan ${decodeURIComponent(platNomor)}`,
    };
  } catch (error) {
    return {
      title: `Detail Riwayat - ${decodeURIComponent(platNomor)} | JemputanKu Panel`,
      description: `Detail riwayat pemeliharaan dan perbaikan untuk kendaraan ${decodeURIComponent(platNomor)}`,
    };
  }
}

export default async function DetailRiwayatPage({ params }: { params: Promise<{ platNomor: string; id: string }> }) {
  const { platNomor, id } = await params;

  try {
    const serviceRecord = await getServiceRecordById(id);

    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border-b border-gray-200">
          <ArmadaRiwayatHeaderInfo 
            platNomor={platNomor}
            title="Detail Riwayat Pemeliharaan dan Perbaikan"
            description="Informasi lengkap pemeliharaan dan perbaikan kendaraan"
          />
          <ArmadaRiwayatDetailHeaderActions 
            platNomor={platNomor}
            serviceRecordId={id}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-4xl mx-auto">
            <RiwayatDetailView serviceRecord={serviceRecord} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading service record:", error);
    notFound();
  }
}