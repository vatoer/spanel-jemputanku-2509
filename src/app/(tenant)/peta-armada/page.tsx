"use client";
import { AppleMapKitMap } from "@/components/tenant/AppleMapKitMap";
import { TenantBreadcrumb } from "@/components/tenant/TenantBreadcrumb";
import { TenantMobileNav } from "@/components/tenant/TenantMobileNav";
import { TenantSidebar } from "@/components/tenant/TenantSidebar";
import { useEffect, useState } from "react";

export default function PetaArmadaPage() {
  // Koordinat pusat kota Jabodetabek
  const markers = [
    { lat: -6.174133328554954, lng: 106.83395769497209, title: "Jakarta" },
    { lat: -6.595038, lng: 106.816635, title: "Bogor" },
    { lat: -6.402484, lng: 106.794243, title: "Depok" },
    { lat: -6.308865, lng: 106.891594, title: "Bekasi" },
    { lat: -6.242222, lng: 106.992222, title: "Tangerang" },
    { lat: -6.354869, lng: 106.655895, title: "Tangerang Selatan" },
  ];
  const [routes, setRoutes] = useState<Array<{ from: string; to: string; polyline: { lat: number; lng: number }[] }>>([]);

  useEffect(() => { 
    async function fetchRoutes() {
      const jakarta = markers[0];
      const cities = markers.slice(1);
      const results = [];
      for (const city of cities) {
        const res = await fetch("/api/generate-directions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ start: city, end: jakarta })
        });
        const data = await res.json();
        if (data.polyline) {
          results.push({ from: city.title, to: jakarta.title, polyline: data.polyline });
        }
      }
      setRoutes(results);
    }
    fetchRoutes();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TenantSidebar />
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-4"><TenantMobileNav /></div>
        <main className="container mx-auto px-4 py-8">
          <TenantBreadcrumb />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Peta Armada</h1>
          <div className="rounded-xl shadow border bg-white overflow-hidden" style={{ height: 500, width: 800 }}>
            <AppleMapKitMap markers={markers} routes={routes} />
          </div>
        </main>
      </div>
    </div>
  );
}
