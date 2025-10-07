"use client";
import { RiwayatTanstackTable } from "@/components/tenant/RiwayatTanstackTable";
import { ServiceRecord } from "@/lib/services/serviceRecord";
import * as React from "react";

export interface RiwayatContainerProps {
  platNomor: string;
  riwayatData?: ServiceRecord[];
  onAddRiwayat?: (data: ServiceRecord) => void;
}

export function RiwayatContainer({ platNomor, riwayatData, onAddRiwayat }: RiwayatContainerProps) {
  const [riwayat, setRiwayat] = React.useState<ServiceRecord[]>(riwayatData || []);

  const handleTambahRiwayat = (data: ServiceRecord) => {
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
