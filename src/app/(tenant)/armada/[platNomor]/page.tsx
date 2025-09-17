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
          <ArmadaDetail platNomor={params.platNomor} />
        </main>
      </div>
    </div>
  );
}
