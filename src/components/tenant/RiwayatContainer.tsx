"use client";
import { RiwayatTanstackTable } from "@/components/tenant/RiwayatTanstackTable";
import { VehicleServiceRecord } from "@/schema/riwayat";
import * as React from "react";

export interface RiwayatContainerProps {
  platNomor: string;
  riwayatData?: VehicleServiceRecord[];
  onAddRiwayat?: (data: VehicleServiceRecord) => void;
}

export function RiwayatContainer({ platNomor, riwayatData, onAddRiwayat }: RiwayatContainerProps) {
  const [riwayat, setRiwayat] = React.useState<VehicleServiceRecord[]>(riwayatData || []);
    
  const handleTambahRiwayat = (data: VehicleServiceRecord) => {
    setRiwayat(prev => [...prev, data]);
    
    // Notify parent jika ada callback
    onAddRiwayat?.(data);
  };

  return (
    <>
      {/* Pure content - Focus pada data display saja */}
      <RiwayatTanstackTable data={riwayat} platNomor={platNomor} />
    </>
  );
}
