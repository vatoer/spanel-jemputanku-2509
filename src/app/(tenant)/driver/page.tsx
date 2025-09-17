import { TenantBreadcrumb } from "@/components/tenant/TenantBreadcrumb";
import { TenantMobileNav } from "@/components/tenant/TenantMobileNav";
import { TenantSidebar } from "@/components/tenant/TenantSidebar";

export default function DriverPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TenantSidebar />
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-4"><TenantMobileNav /></div>
        <main className="container mx-auto px-4 py-8">
          <TenantBreadcrumb />
          <h1 className="text-2xl font-bold text-blue-700 mb-4">Manajemen Driver</h1>
          <p className="mb-6 text-gray-700">Kelola data driver, jadwal tugas, dan performa pengemudi bus.</p>
          {/* Tabel driver, aksi tambah/edit/hapus, dsb. */}
          <div className="bg-white rounded-xl shadow p-6">(Tabel driver akan ditampilkan di sini)</div>
        </main>
      </div>
    </div>
  );
}
