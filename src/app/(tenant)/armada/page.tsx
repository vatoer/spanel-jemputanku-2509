import { ArmadaSummaryStats } from "@/components/tenant/ArmadaSummaryStats";
import { ArmadaTableContainer } from "@/components/tenant/ArmadaTableContainer";
import { TenantBreadcrumb } from "@/components/tenant/TenantBreadcrumb";
import { TenantMobileNav } from "@/components/tenant/TenantMobileNav";
import { TenantSidebar } from "@/components/tenant/TenantSidebar";

export default function ArmadaPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TenantSidebar />
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-4"><TenantMobileNav /></div>
        <main className="container mx-auto px-4 py-8">
          <TenantBreadcrumb />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Manajemen Armada</h1>
          <p className="mb-6 text-gray-700">Kelola data bus, status operasional, dan detail armada Anda di sini.</p>

          {/* Statistik dan legend tetap di page agar global */}
          <ArmadaSummaryStats stats={{ total: 10, aktif: 6, maintenance: 2, nonaktif: 2 }} />
          {/* <ArmadaTypeLegend /> */}

          {/* Semua logic table, filter, pagination, bulk actions di-handle di container */}
          <ArmadaTableContainer />
        </main>
      </div>
    </div>
  );
}
