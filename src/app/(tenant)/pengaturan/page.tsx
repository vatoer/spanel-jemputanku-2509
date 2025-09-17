import { TenantBreadcrumb } from "@/components/tenant/TenantBreadcrumb";
import { TenantMobileNav } from "@/components/tenant/TenantMobileNav";
import { TenantSidebar } from "@/components/tenant/TenantSidebar";
import { PengaturanForm } from "../../../components/tenant/PengaturanForm";

export default function PengaturanPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TenantSidebar />
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-4"><TenantMobileNav /></div>
        <main className="container mx-auto px-4 py-8">
          <TenantBreadcrumb />
          <h1 className="text-2xl font-bold text-blue-700 mb-4">Pengaturan Tenant</h1>
          <p className="mb-6 text-gray-700">Atur profil tenant, preferensi aplikasi, dan manajemen admin tenant.</p>
          {/* Form pengaturan, dsb. */}
          <PengaturanForm />
        </main>
      </div>
    </div>
  );
}
