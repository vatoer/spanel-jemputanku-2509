"use client";
import { ArmadaForm, ArmadaFormValues } from "@/components/tenant/ArmadaForm";
import { TenantBreadcrumb } from "@/components/tenant/TenantBreadcrumb";
import { TenantMobileNav } from "@/components/tenant/TenantMobileNav";
import { TenantSidebar } from "@/components/tenant/TenantSidebar";
import { useRouter } from "next/navigation";

// Dummy data, replace with fetch by platNomor
const dummyData: ArmadaFormValues = {
  platNomor: "B 1234 CD",
  tipe: "Bus Besar",
  kapasitas: 45,
  status: "Aktif",
  tahun: 2021,
  merk: "Mercedes-Benz",
  warna: "Putih",
  nomorRangka: "MB1234567890",
  nomorMesin: "EN9876543210",
  tanggalStnk: "2025-01-10",
  tanggalKir: "2025-06-15",
  fitur: ["AC", "WiFi"],
  catatan: "Terakhir service: 1 bulan lalu."
};

export default function EditArmadaPage({ params }: { params: { platNomor: string } }) {
  const router = useRouter();

  function handleSubmit(data: ArmadaFormValues) {
    // TODO: Integrasi ke backend
    alert("Data armada berhasil diupdate: " + JSON.stringify(data, null, 2));
    router.push(`/armada/${params.platNomor}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TenantSidebar />
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-4"><TenantMobileNav /></div>
        <main className="container mx-auto px-4 py-8">
          <TenantBreadcrumb />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 tracking-tight">Edit Detail Armada</h1>
          <p className="text-gray-500 mb-6">Perbarui informasi armada di bawah ini.</p>
          <div className="max-w-2xl">
            <ArmadaForm onSubmit={handleSubmit} />
          </div>
        </main>
      </div>
    </div>
  );
}
