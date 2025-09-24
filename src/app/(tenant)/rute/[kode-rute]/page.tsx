"use client"
import { DirectionsJson } from "@/components/tenant/AppleMapKitDirectionsViewer";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dummy data, replace with fetch from API/DB or params
const ROUTES = [
  { code: "6", name: "Line 6 Bekasi Timur - Pejambon", origin: "Bekasi Timur", destination: "Pejambon" },
  { code: "10", name: "Line 10 Bekasi Barat - Pejambon", origin: "Bekasi Barat", destination: "Pejambon" },
  { code: "11", name: "Line 11 Cikarang - Pejambon", origin: "Cikarang", destination: "Pejambon" },
  { code: "12", name: "Line 12 Bekasi Timur - Senayan", origin: "Bekasi Timur", destination: "Senayan" },
];

const AppleMapKitDirectionsViewer = dynamic(
  () => import("@/components/tenant/AppleMapKitDirectionsViewer").then(mod => mod.AppleMapKitDirectionsViewer),
  { ssr: false }
);

export default function RuteDetailPage({ params }: { params: { "kode-rute": string } }) {
  const kodeRute = params["kode-rute"];
  const rute = ROUTES.find(r => r.code === kodeRute);
  const [editing, setEditing] = useState(false);
  // Load directions from public/rute-directions/line-[code].json, fallback to directions-example.json if not found
  const [directions, setDirections] = useState<DirectionsJson | null>(null);
  useEffect(() => {
    async function fetchDirections() {
      try {
        const res = await fetch(`/rute-directions/line-${kodeRute}.json`);
        if (res.ok) {
          setDirections(await res.json());
        } else {
          // fallback to example
          const fallback = await fetch("/directions-example.json");
          setDirections(await fallback.json());
        }
      } catch {
        const fallback = await fetch("/directions-example.json");
        setDirections(await fallback.json());
      }
    }
    fetchDirections();
  }, [kodeRute]);

  if (!rute) return <div>Rute tidak ditemukan</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-[400px] border rounded">
        {/* Show map for this route */}
        {directions ? (
          <AppleMapKitDirectionsViewer directions={directions} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">Peta rute akan tampil di sini</div>
        )}
      </div>
      <div className="bg-white rounded shadow p-4">
        <h2 className="font-bold mb-2">{rute.name}</h2>
        <div className="mb-2 text-sm text-gray-500">{rute.origin} → {rute.destination}</div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setEditing(e => !e)}
        >
          {editing ? "Batal Edit" : "Edit Rute"}
        </button>
        {editing && (
          <div className="mt-4">
            {/* TODO: Form untuk edit origin, destination, bus stop, dan peta interaktif */}
            <div className="text-gray-400">Form edit rute & peta interaktif akan tampil di sini</div>
            <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Simpan Perubahan</button>
          </div>
        )}
      </div>
    </div>
  );
}
