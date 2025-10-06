"use client";

import { createServiceRecordByPlate } from "@/actions/armada/riwayat";
import { CreateVehicleServiceRecordData } from "@/schema/riwayat";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArmadaRiwayatForm } from "./ArmadaRiwayatForm";

interface ArmadaRiwayatAddContainerProps {
  platNomor: string;
}

export function ArmadaRiwayatAddContainer({ 
  platNomor 
}: ArmadaRiwayatAddContainerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(data: CreateVehicleServiceRecordData) {
    setIsLoading(true);
    
    try {
      console.log("Creating service record:", { platNomor, data });
      
      // Clean up nullable fields before sending to API
      const cleanData = {
        ...data,
        description: data.description || undefined,
        vendor: data.vendor || undefined,
        invoice: data.invoice || undefined,
        cost: data.cost || undefined,
        mileage: data.mileage || undefined,
        nextDueDate: data.nextDueDate || undefined,
      };
      
      const result = await createServiceRecordByPlate(platNomor, cleanData);
      
      if (result.success) {
        // Navigate back to riwayat list
        router.push(`/armada/${platNomor}/riwayat`);
        router.refresh();
      } else {
        alert(`Error: ${result.error}`);
      }
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