"use client";
import { RiwayatContainer } from "@/components/tenant/RiwayatContainer";
import { TenantBreadcrumb } from "@/components/tenant/TenantBreadcrumb";
import { TenantMobileNav } from "@/components/tenant/TenantMobileNav";
import { TenantSidebar } from "@/components/tenant/TenantSidebar";
import { use } from "react";



export default function RiwayatArmadaPage({ params }: { params: Promise<{ platNomor: string }> }) {
  const { platNomor } = use(params);
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TenantSidebar />
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-4"><TenantMobileNav /></div>
        <main className="container mx-auto px-4 py-8">
          <TenantBreadcrumb />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Riwayat Pemeliharaan & Perbaikan</h1>
          <p className="mb-6 text-gray-700">Catatan seluruh aktivitas service dan perbaikan armada <span className="font-semibold">{platNomor}</span>.</p>
          <RiwayatContainer platNomor={platNomor} />
        </main>
      </div>
    </div>
  );
}
