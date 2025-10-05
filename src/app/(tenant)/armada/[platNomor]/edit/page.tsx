import { ambilArmadaByPlatNomor } from "@/actions/armada";
import { ArmadaEditContainer } from "@/components/tenant/ArmadaEditContainer";
import { TenantBreadcrumb } from "@/components/tenant/TenantBreadcrumb";
import { TenantMobileNav } from "@/components/tenant/TenantMobileNav";
import { TenantSidebar } from "@/components/tenant/TenantSidebar";
import { notFound } from "next/navigation";


export default async function EditArmadaPage({ params }: { params: Promise<{ platNomor: string }> }) {
  // Decode the plate number in case it's URL encoded

  const { platNomor } = await params;
  // Fetch armada data
  const result = await ambilArmadaByPlatNomor(platNomor);
  
  if (!result.success) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TenantSidebar />
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-4"><TenantMobileNav /></div>
        <main className="container mx-auto px-4 py-8">
          <TenantBreadcrumb />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 tracking-tight">
            Edit Detail Armada
          </h1>
          <p className="text-gray-500 mb-6">
            Perbarui informasi armada {platNomor} di bawah ini.
          </p>
          <div className="max-w-2xl">
            <ArmadaEditContainer 
              platNomor={platNomor}
              initialData={result.data}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
