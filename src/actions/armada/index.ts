import { createVehicle, getVehiclesByTenant } from "@/lib/services/vehicle";
import { CreateVehicleData, createVehicleSchema } from "@/schema/vehicle";
import { Vehicle } from "@prisma/client";
import { ActionResponse } from "../response";

export const ambilDaftarArmada = async (): Promise<ActionResponse<Vehicle[]>> => {
  // Implementasi logika untuk mengambil daftar armada berdasarkan tenantId
    const tenantId = "tenant-jemputanku-demo";

    try {
      const armadas = await getVehiclesByTenant(tenantId, { includeDriver: true });
      return {
        success: true,
        data: armadas
      };
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      return {
        success: false,
        error: "Gagal mengambil daftar armada"
      };
    }

}

export const simpanArmadaBaru = async (data: CreateVehicleData): Promise<ActionResponse<Vehicle>> => {
  // TODO: get tenantId from user session or context
  const tenantId = "tenant-jemputanku-demo";
  console.log("Menyimpan armada:", data);

  try {
    createVehicleSchema.parse(data);
  } catch (error) {
    console.error("Validasi data armada gagal:", error);
    return {
      success: false,
      error: "Data armada tidak valid"
    };
  }

  // Call the service to create the vehicle
  // use try-catch to handle potential errors

  try {
    const armada = await createVehicle({ ...data, tenantId });
    return {  
      success: true,
      data: armada
    };
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return {
      success: false,
      error: "Gagal menyimpan armada"
    };
  }
}

export const hapusArmada = async (id: string) => {
  // Implementasi logika untuk menghapus armada
}