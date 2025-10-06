"use client";

import { simpanArmadaBaru } from "@/actions/armada/index";
import { ArmadaForm } from "@/components/tenant/ArmadaForm";
import { CreateVehicleData } from "@/schema/vehicle";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function ArmadaFormContainer() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: CreateVehicleData) {
    setIsLoading(true);
    try {
      console.log('Submitting vehicle data:', data);
      const result = await simpanArmadaBaru(data);
      
      if (!result.success) {
        alert(result.error); // Show specific error message from response
        return;
      }

      toast.success("Armada berhasil ditambahkan!");
      // Redirect to armada list
      router.push("/armada");
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast.error("Terjadi kesalahan saat menyimpan armada. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ArmadaForm 
      onSubmit={handleSubmit} 
      isLoading={isLoading}
    />
  );
}