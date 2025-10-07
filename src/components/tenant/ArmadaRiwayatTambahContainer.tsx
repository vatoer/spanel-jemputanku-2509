"use client";

import { CreateVehicleServiceRecordData } from "@/schema/riwayat";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArmadaRiwayatForm } from "./ArmadaRiwayatForm";

interface ArmadaRiwayatTambahContainerProps {
  platNomor: string;
}

export function ArmadaRiwayatTambahContainer({ platNomor }: ArmadaRiwayatTambahContainerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(data: CreateVehicleServiceRecordData) {
    setIsLoading(true);
    
    try {
      // TODO: Implement the actual API call to create service record
      console.log("Creating service record:", { platNomor, data });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to riwayat list
      router.push(`/armada/${platNomor}/riwayat`);
      router.refresh();
    } catch (error) {
      console.error("Error creating service record:", error);
      alert("Terjadi kesalahan saat menyimpan riwayat");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ArmadaRiwayatForm 
      onSubmit={handleSubmit}
      platNomor={platNomor}
      isLoading={isLoading}
      />
  );
}