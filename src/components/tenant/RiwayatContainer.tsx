"use client";
import { RiwayatTanstackTable } from "@/components/tenant/RiwayatTanstackTable";
import { VehicleServiceRecord } from "@/schema/riwayat";
import * as React from "react";

export interface RiwayatContainerProps {
  platNomor: string;
  onAddRiwayat?: (data: VehicleServiceRecord) => void;
}

export function RiwayatContainer({ platNomor, onAddRiwayat }: RiwayatContainerProps) {
  const [riwayat, setRiwayat] = React.useState<VehicleServiceRecord[]>([
    {
      id: "1",
      vehicleId: "vehicle-1",
      type: "MAINTENANCE",
      category: "ENGINE",
      title: "Ganti Oli Mesin",
      description: "Ganti oli, filter udara",
      serviceDate: "2025-01-10",
      cost: 500000,
      mileage: 25000,
      status: "COMPLETED",
      vendor: "Bengkel Maju",
      invoice: "INV-001",
      nextDueDate: "2025-04-10",
      createdAt: new Date("2025-01-10"),
      updatedAt: new Date("2025-01-10"),
    },
    {
      id: "2", 
      vehicleId: "vehicle-1",
      type: "REPAIR",
      category: "BRAKES", 
      title: "Ganti Kampas Rem",
      description: "Ganti kampas rem depan dan belakang",
      serviceDate: "2025-03-15",
      cost: 750000,
      mileage: 27000,
      status: "COMPLETED",
      vendor: "Auto Service Pro",
      invoice: "INV-002", 
      nextDueDate: undefined,
      createdAt: new Date("2025-03-15"),
      updatedAt: new Date("2025-03-15"),
    },
    {
      id: "3",
      vehicleId: "vehicle-1",
      type: "MAINTENANCE",
      category: "ENGINE",
      title: "Tune Up Mesin", 
      description: "Tune up mesin berkala",
      serviceDate: "2025-06-01",
      cost: 600000,
      mileage: 30000,
      status: "COMPLETED",
      vendor: "Bengkel Resmi",
      invoice: "INV-003",
      nextDueDate: "2025-09-01",
      createdAt: new Date("2025-06-01"),
      updatedAt: new Date("2025-06-01"),
    },
  ]);

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
