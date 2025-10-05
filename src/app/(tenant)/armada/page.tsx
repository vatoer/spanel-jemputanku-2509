import { ArmadaHeader } from "@/components/tenant/ArmadaHeader";
import { ArmadaSummaryStats } from "@/components/tenant/ArmadaSummaryStats";
import { ArmadaTableContainer } from "@/components/tenant/ArmadaTableContainer";
import { TenantMobileNav } from "@/components/tenant/TenantMobileNav";
import { TenantSidebar } from "@/components/tenant/TenantSidebar";
import { getVehiclesByTenant } from "@/lib/services/vehicle";

export default async function ArmadaPage() {

  const tenantId = "tenant-transjakarta"; // TODO: Ganti dengan tenantId yang sesuai
  const vehicles = await getVehiclesByTenant(tenantId, { includeDriver: true });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TenantSidebar />
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-4"><TenantMobileNav /></div>
        <ArmadaHeader />
        <main className="flex-1 container mx-auto px-4 py-8 flex flex-col gap-6">
          {/* Statistik dan legend tetap di page agar global */}
          <ArmadaSummaryStats stats={{ total: 10, aktif: 6, maintenance: 2, nonaktif: 2 }} />
          {/* <ArmadaTypeLegend /> */}

          {/* Semua logic table, filter, pagination, bulk actions di-handle di container */}
          <ArmadaTableContainer vehicles={vehicles} />
        </main>
      </div>
    </div>
  );
}
