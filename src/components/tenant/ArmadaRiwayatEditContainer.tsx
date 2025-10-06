"use client";

import { CreateVehicleServiceRecordData, VehicleServiceRecordData } from "@/schema/riwayat";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArmadaRiwayatForm } from "./ArmadaRiwayatForm";

interface ArmadaRiwayatEditContainerProps {
  platNomor: string;
  initialData: VehicleServiceRecordData;
}

export function ArmadaRiwayatEditContainer({ platNomor, initialData }: ArmadaRiwayatEditContainerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Transform VehicleServiceRecord to form format
  const formData: Partial<CreateVehicleServiceRecordData> = {
    type: initialData.type,
    category: initialData.category,
    title: initialData.title,
    description: initialData.description || "",
    serviceDate: initialData.serviceDate,
    cost: initialData.cost || undefined,
    mileage: initialData.mileage || undefined,
    status: initialData.status,
    nextDueDate: initialData.nextDueDate || undefined,
    vendor: initialData.vendor || "",
    invoice: initialData.invoice || "",
  };

  async function handleSubmit(data: CreateVehicleServiceRecordData) {
    setIsLoading(true);
    
    try {
      // TODO: Implement the actual API call to update service record
      console.log("Updating service record:", { 
        id: initialData.id, 
        platNomor, 
        data 
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to riwayat detail
      router.push(`/armada/${platNomor}/riwayat/${initialData.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating service record:", error);
      alert("Terjadi kesalahan saat mengupdate riwayat");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ArmadaRiwayatForm 
      onSubmit={handleSubmit}
      platNomor={platNomor}
      initialData={formData}
      isLoading={isLoading}
    />
  );
}