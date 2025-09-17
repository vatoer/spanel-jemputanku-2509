
import { AktivitasSection } from "@/components/dashboard/AktivitasSection";
import { ArmadaSummary } from "@/components/dashboard/ArmadaSummary";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { JadwalRuteSection } from "@/components/dashboard/JadwalRuteSection";
import { TenantBreadcrumb } from "@/components/tenant/TenantBreadcrumb";
import { TenantMobileNav } from "@/components/tenant/TenantMobileNav";
import { TenantSidebar } from "@/components/tenant/TenantSidebar";

export default function DashboardTenant() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TenantSidebar />
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-4"><TenantMobileNav /></div>
  <DashboardHeader />
        <main className="flex-1 container mx-auto px-4 py-8 flex flex-col gap-8">
          <TenantBreadcrumb />
          <ArmadaSummary />
          <JadwalRuteSection />
          <AktivitasSection />
        </main>
      </div>
    </div>
  );
}
