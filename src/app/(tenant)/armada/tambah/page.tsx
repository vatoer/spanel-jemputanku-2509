
"use client";
import { ArmadaForm } from "@/components/tenant/ArmadaForm";
import { TenantBreadcrumb } from "@/components/tenant/TenantBreadcrumb";
import { TenantMobileNav } from "@/components/tenant/TenantMobileNav";
import { TenantSidebar } from "@/components/tenant/TenantSidebar";
import { Armada } from "@/schema/vehicle";
import { useRouter } from "next/navigation";


export default function TambahArmadaPage() {
  const router = useRouter();

  function handleSubmit(data: Armada) {
    // TODO: Integrate with backend API
    alert("Data armada berhasil disubmit: " + JSON.stringify(data, null, 2));
    router.push("/armada");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TenantSidebar />
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-4"><TenantMobileNav /></div>
        <main className="container mx-auto px-4 py-8">
          <TenantBreadcrumb />
          <ArmadaForm onSubmit={handleSubmit} />
        </main>
      </div>
    </div>
  );
}
