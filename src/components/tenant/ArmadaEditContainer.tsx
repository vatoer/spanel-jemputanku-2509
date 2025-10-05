"use client";

import { updateArmada } from "@/actions/armada";
import { CreateVehicleData } from "@/schema/vehicle";
import { Vehicle } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArmadaForm } from "./ArmadaForm";

interface ArmadaEditContainerProps {
  platNomor: string;
  initialData: Vehicle;
}

export function ArmadaEditContainer({ platNomor, initialData }: ArmadaEditContainerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Transform Vehicle data to CreateVehicleData format for form
  const formData: Partial<CreateVehicleData> = {
    licensePlate: initialData.licensePlate,
    model: initialData.model,
    capacity: initialData.capacity,
    status: initialData.status,
    year: initialData.year,
    manufacturer: initialData.manufacturer,
    color: initialData.color,
    chassisNumber: initialData.chassisNumber || "",
    engineNumber: initialData.engineNumber || "",
    stnkDate: initialData.stnkDate || "",
    kirDate: initialData.kirDate || "",
    features: initialData.features || [],
    notes: initialData.notes || ""
  };

  async function handleSubmit(data: CreateVehicleData) {
    setIsLoading(true);
    
    try {
      // Data is already in the correct format, just ensure tenantId is included
      const updateData: CreateVehicleData = {
        ...data,
        tenantId: initialData.tenantId, // Keep existing tenantId
      };

      const result = await updateArmada(platNomor, updateData);
      
      if (result.success) {
        router.push(`/armada/${result.data.licensePlate}`);
        router.refresh();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating armada:", error);
      alert("Terjadi kesalahan saat mengupdate armada");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ArmadaForm 
      onSubmit={handleSubmit} 
      initialData={formData}
      isLoading={isLoading}
    />
  );
}