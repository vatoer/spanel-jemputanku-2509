import { DriverHeader } from "@/components/tenant/DriverHeader";
import { DriverTableContainer } from "@/components/tenant/DriverTableContainer";
import { TenantMobileNav } from "@/components/tenant/TenantMobileNav";
import { TenantSidebar } from "@/components/tenant/TenantSidebar";

export default async function DriverPage() {
  const tenantId = "tenant-transjakarta"; // TODO: Ganti dengan tenantId yang sesuai
  
  // For now, use dummy data since the service needs to be fixed
  // TODO: Fix UserService.getDriversByTenant to properly return status field
  // const driversData = await UserService.getDriversByTenant(tenantId);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TenantSidebar />
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-4"><TenantMobileNav /></div>
        <DriverHeader />
        <main className="flex-1 container mx-auto px-4 py-8 flex flex-col gap-6">
          {/* Driver table with stats and filtering - following armada pattern */}
          <DriverTableContainer />
        </main>
      </div>
    </div>
  );
}
