import { ArmadaRiwayatDetailHeaderActions } from "@/components/tenant/ArmadaRiwayatDetailHeaderActions";
import { ArmadaRiwayatHeaderInfo } from "@/components/tenant/ArmadaRiwayatHeaderInfo";
import { RiwayatDetailView } from "@/components/tenant/RiwayatDetailView";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    platNomor: string;
    id: string;
  };
}

// Mock function to get service record - replace with actual API call
async function getServiceRecord(id: string) {
  // TODO: Replace with actual API call
  return {
    id,
    type: "MAINTENANCE",
    category: "ENGINE", 
    title: "Ganti Oli Mesin",
    description: "Penggantian oli mesin rutin dengan oli Shell Helix Ultra 5W-30. Dilakukan pengecekan filter oli dan filter udara.",
    serviceDate: "2024-01-15",
    cost: 350000,
    mileage: 25000,
    status: "COMPLETED",
    nextDueDate: "2024-04-15",
    vendor: "Bengkel Auto Prima",
    invoice: "INV-2024-001",
    createdAt: new Date(),
    updatedAt: new Date(),
    vehicleId: "vehicle-123"
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { platNomor, id } = params;
  
  try {
    const serviceRecord = await getServiceRecord(id);
    
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

export default async function DetailRiwayatPage({ params }: PageProps) {
  const { platNomor, id } = params;
  const decodedPlatNomor = decodeURIComponent(platNomor);

  try {
    const serviceRecord = await getServiceRecord(id);

    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border-b border-gray-200">
          <ArmadaRiwayatHeaderInfo 
            platNomor={decodedPlatNomor}
            title="Detail Riwayat Pemeliharaan dan Perbaikan"
            description="Informasi lengkap pemeliharaan dan perbaikan kendaraan"
          />
          <ArmadaRiwayatDetailHeaderActions 
            platNomor={decodedPlatNomor}
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