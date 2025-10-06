import { DriverDetail } from "@/components/tenant/DriverDetail";
import { DriverDetailHeaderActions } from "@/components/tenant/DriverDetailHeaderActions";
import { DriverDetailHeaderInfo } from "@/components/tenant/DriverDetailHeaderInfo";
import { TenantBreadcrumb } from "@/components/tenant/TenantBreadcrumb";
import { TenantMobileNav } from "@/components/tenant/TenantMobileNav";
import { TenantSidebar } from "@/components/tenant/TenantSidebar";
import { UserService } from "@/lib/services/user";

export default async function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // For now, we'll use the same tenant ID as other pages. In a real app, this would come from the session
  const tenantId = "tenant-transjakarta";
  
  const driverData = await UserService.getDriverDetailById(id, tenantId);

  if (!driverData) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <TenantSidebar />
        <div className="flex-1 flex flex-col">
          <div className="md:hidden p-4"><TenantMobileNav /></div>
          <main className="container mx-auto px-4 py-8">
            <TenantBreadcrumb />
            <h1 className="text-2xl font-bold text-blue-700 mb-4">Driver Tidak Ditemukan</h1>
            <p className="mb-6 text-gray-700">Maaf, driver dengan ID "{id}" tidak ditemukan.</p>
          </main>
        </div>
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE": return "Aktif";
      case "INACTIVE": return "Tidak Aktif";
      case "SUSPENDED": return "Ditangguhkan";
      default: return "Tidak Aktif";
    }
  };

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
              <DriverDetailHeaderInfo 
                driverName={driverData.name || "Driver"}
                status={getStatusLabel((driverData as any)?.status || "INACTIVE")}
                title="Detail & Informasi Driver"
              />
              
              {/* Actions - Pure action buttons tanpa status */}
              <DriverDetailHeaderActions 
                driverId={id}
              />
            </div>
          </div>
        </header>
        
        {/* Main Content - Optimized container for detail view */}
        <main className="flex-1 w-full bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
            {/* Content wrapper dengan proper spacing */}
            <div className="space-y-6">
              <DriverDetail driverId={id} driverData={driverData as any} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
