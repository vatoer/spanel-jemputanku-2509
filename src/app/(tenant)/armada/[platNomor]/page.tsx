import { ArmadaDetail } from "@/components/tenant/ArmadaDetail";
import { ArmadaDetailHeaderActions } from "@/components/tenant/ArmadaDetailHeaderActions";
import { ArmadaDetailHeaderInfo } from "@/components/tenant/ArmadaDetailHeaderInfo";
import { TenantBreadcrumb } from "@/components/tenant/TenantBreadcrumb";
import { TenantMobileNav } from "@/components/tenant/TenantMobileNav";
import { TenantSidebar } from "@/components/tenant/TenantSidebar";
import { getVehicleByLicensePlate } from "@/lib/services/vehicle";

export default async function ArmadaDetailPage({ params }: { params: Promise<{ platNomor: string }> }) {

  const { platNomor } = await params;

  const armadaData = await getVehicleByLicensePlate(platNomor);

  if (!armadaData) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <TenantSidebar />
        <div className="flex-1 flex flex-col">
          <div className="md:hidden p-4"><TenantMobileNav /></div>
          <main className="container mx-auto px-4 py-8">
            <TenantBreadcrumb />
            <h1 className="text-2xl font-bold text-blue-700 mb-4">Armada Tidak Ditemukan</h1>
            <p className="mb-6 text-gray-700">Maaf, armada dengan plat nomor "{platNomor}" tidak ditemukan.</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TenantSidebar />
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-4"><TenantMobileNav /></div>
        
        {/* Simplified Header dengan Breadcrumb */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 py-4">
            {/* Breadcrumb - Left aligned untuk navigasi */}
            <TenantBreadcrumb />
            
            {/* Header Content - Modular components untuk better separation */}
            <div className="flex items-start justify-between mt-3 gap-4">
              {/* Header Info - Client Component dengan status information */}
              <ArmadaDetailHeaderInfo 
                platNomor={platNomor}
                status="Aktif"
                title="Detail & Informasi Armada"
              />
              
              {/* Actions - Pure action buttons tanpa status */}
              <ArmadaDetailHeaderActions 
                platNomor={platNomor}
              />
            </div>
          </div>
        </header>
        
        {/* Main Content - Optimized container for detail view */}
        <main className="flex-1 w-full bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
            {/* Content wrapper dengan proper spacing */}
            <div className="space-y-6">
              <ArmadaDetail platNomor={platNomor} armadaData={armadaData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
