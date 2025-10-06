"use client";

import { updateArmada } from "@/actions/armada/index";
import { CreateVehicleData, UpdateVehicleData } from "@/schema/vehicle";
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

  // Transform Vehicle data to form format
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
    taxDate: initialData.taxDate || "",
    features: initialData.features || [],
    notes: initialData.notes || ""
  };

  async function handleSubmit(data: CreateVehicleData) {
    setIsLoading(true);
    
    try {
      // Add required fields for update
      const updateData: UpdateVehicleData = {
        ...data,
        id: initialData.id, // Required for update
        tenantId: initialData.tenantId, // Keep existing tenantId
      };

      const result = await updateArmada(platNomor, updateData);
      
      if (result.success) {
        const licensePlate = result.data.licensePlate.replace(/\s+/g, '');
        router.push(`/armada/${licensePlate}`);
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