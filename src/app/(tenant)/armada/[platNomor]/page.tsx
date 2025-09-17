import { ArmadaDetail } from "@/components/tenant/ArmadaDetail";
import { TenantBreadcrumb } from "@/components/tenant/TenantBreadcrumb";
import { TenantMobileNav } from "@/components/tenant/TenantMobileNav";
import { TenantSidebar } from "@/components/tenant/TenantSidebar";

export default function ArmadaDetailPage({ params }: { params: { platNomor: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TenantSidebar />
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-4"><TenantMobileNav /></div>
        <main className="container mx-auto px-4 py-8">
          <TenantBreadcrumb />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 tracking-tight">Detail Armada</h1>
          <p className="text-gray-500 mb-6">Berikut adalah detail informasi armada.</p>
          <div className="max-w-2xl">
            <ArmadaDetail platNomor={params.platNomor} />
          </div>
        </main>
      </div>
    </div>
  );
}
