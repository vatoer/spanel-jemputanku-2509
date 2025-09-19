"use client";
import { AppleMapKitDirectionsViewer, DirectionsJson } from "@/components/tenant/AppleMapKitDirectionsViewer";
import { useEffect, useState } from "react";

export default function ArmadaRutePage() {
  const [directions, setDirections] = useState<DirectionsJson | null>(null);

  useEffect(() => {
    fetch("/directions-example.json")
      .then((res) => res.json())
      .then((data) => setDirections(data));
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Contoh Rute Armada</h1>
      <div className="rounded-xl shadow border bg-white overflow-hidden" style={{ height: 500, width: 800 }}>
        {directions && <AppleMapKitDirectionsViewer directions={directions} />}
      </div>
    </main>
  );
}
