import { ArmadaRiwayatHeaderActions } from "@/components/tenant/ArmadaRiwayatHeaderActions";
import { ArmadaRiwayatHeaderInfo } from "@/components/tenant/ArmadaRiwayatHeaderInfo";
import { RiwayatContainer } from "@/components/tenant/RiwayatContainer";
import { TenantBreadcrumb } from "@/components/tenant/TenantBreadcrumb";
import { TenantMobileNav } from "@/components/tenant/TenantMobileNav";
import { TenantSidebar } from "@/components/tenant/TenantSidebar";

export default async function RiwayatArmadaPage({ params }: { params: Promise<{ platNomor: string }> }) {
  const { platNomor } = await params;
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TenantSidebar />
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-4"><TenantMobileNav /></div>
        
        {/* Simplified Header dengan Breadcrumb - Konsisten dengan detail page */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 py-4">
            {/* Breadcrumb - Left aligned untuk navigasi */}
            <TenantBreadcrumb />
            
            {/* Header Content - Modular components untuk better separation */}
            <div className="flex items-start justify-between mt-3 gap-4">
              {/* Header Info - Informational content */}
              <ArmadaRiwayatHeaderInfo 
                platNomor={platNomor}
                title="Riwayat Pemeliharaan & Perbaikan"
                description="Catatan seluruh aktivitas pemeliharaan dan perbaikan armada"
              />
              
              {/* Actions - Navigate to new page for better UX */}
              <ArmadaRiwayatHeaderActions 
                platNomor={platNomor}
              />
            </div>
          </div>
        </header>
        
        {/* Main Content - Optimized container untuk riwayat view */}
        <main className="flex-1 w-full bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
            {/* Content wrapper dengan proper spacing untuk table view */}
            <div className="space-y-6">
              <RiwayatContainer 
                platNomor={platNomor}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
