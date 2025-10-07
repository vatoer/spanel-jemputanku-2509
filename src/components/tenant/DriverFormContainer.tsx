"use client";

import { simpanDriverBaru, updateDriver } from "@/actions/driver/index";
import { DriverForm } from "@/components/tenant/DriverForm";
import { CreateDriverData } from "@/schema/driver";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DriverFormContainerProps {
  isEdit?: boolean;
  initialData?: Partial<CreateDriverData>;
  driverId?: string;
}

export function DriverFormContainer({ isEdit = false, initialData, driverId }: DriverFormContainerProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: CreateDriverData) {
    setIsLoading(true);
    try {
      console.log('Submitting driver data:', data);
      
      if (isEdit && driverId) {
        // TODO: Implement updateDriver action when needed
        const result = await updateDriver(driverId, data);
        if (!result.success) {
          toast.error(result.error || "Gagal memperbarui driver");
          return;
        }
        toast.success("Driver berhasil diperbarui!");
      } else {
        const result = await simpanDriverBaru(data);
        
        if (!result.success) {
          toast.error(result.error || "Gagal menyimpan driver");
          return;
        }

        toast.success("Driver berhasil ditambahkan!");
        // Redirect to driver list
        router.push("/driver");
      }
    } catch (error) {
      console.error('Error saving driver:', error);
      toast.error("Terjadi kesalahan saat menyimpan driver. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DriverForm 
      onSubmit={handleSubmit} 
      isLoading={isLoading}
      initialData={initialData}
      isEdit={isEdit}
    />
  );
}