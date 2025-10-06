import { ArmadaRiwayatEditContainer } from "@/components/tenant/ArmadaRiwayatEditContainer";
import { ArmadaRiwayatEditHeaderActions } from "@/components/tenant/ArmadaRiwayatEditHeaderActions";
import { ArmadaRiwayatHeaderInfo } from "@/components/tenant/ArmadaRiwayatHeaderInfo";
import { getServiceRecordById } from "@/lib/services/serviceRecord";
import { toVehicleServiceRecordData, VehicleServiceRecordData } from "@/schema/riwayat";
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
      title: `Edit ${serviceRecord.title} - ${decodeURIComponent(platNomor)} | JemputanKu Panel`,
      description: `Edit pemeliharaan dan perbaikan ${serviceRecord.title} untuk kendaraan ${decodeURIComponent(platNomor)}`,
    };
  } catch (error) {
    return {
      title: `Edit Riwayat - ${platNomor} | JemputanKu Panel`,
      description: `Edit riwayat pemeliharaan dan perbaikan untuk kendaraan ${decodeURIComponent(platNomor)}`,
    };
  }
}

export default async function EditRiwayatPage({ params }: { params: Promise<{ platNomor: string; id: string }> }) {
  const { platNomor, id } = await params;

  try {
    const serviceRecord = await getServiceRecordById(id);
    // convert to zod schema
    if (!serviceRecord) {
      notFound();
    }

    // convert to zod schema
    const initialData:VehicleServiceRecordData = toVehicleServiceRecordData(serviceRecord);


    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border-b border-gray-200">
          <ArmadaRiwayatHeaderInfo 
            platNomor={platNomor}
            title="Edit Riwayat Pemeliharaan dan Perbaikan"
            description="Perbarui informasi pemeliharaan dan perbaikan kendaraan"
          />
          <ArmadaRiwayatEditHeaderActions 
            platNomor={platNomor}
            serviceRecordId={id}
          />
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-4xl mx-auto">
            <ArmadaRiwayatEditContainer 
              platNomor={platNomor}
              initialData={initialData}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading service record:", error);
    notFound();
  }
}