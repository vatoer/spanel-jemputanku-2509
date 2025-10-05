import { createVehicle, getVehiclesByTenant } from "@/lib/services/vehicle";
import { CreateVehicleData, createVehicleSchema } from "@/schema/vehicle";
import { Vehicle } from "@prisma/client";
import { ActionResponse } from "../response";

export const ambilDaftarArmada = async (): Promise<ActionResponse<Vehicle[]>> => {
  // Implementasi logika untuk mengambil daftar armada berdasarkan tenantId
    const tenantId = "tenant-transjakarta";

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
  const tenantId = "tenant-transjakarta";
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

export const ambilArmadaByPlatNomor = async (platNomor: string): Promise<ActionResponse<Vehicle>> => {
  try {
    const { getVehicleByLicensePlate } = await import("@/lib/services/vehicle");
    const armada = await getVehicleByLicensePlate(platNomor, { includeDriver: true });
    
    if (!armada) {
      return {
        success: false,
        error: "Armada tidak ditemukan"
      };
    }

    return {
      success: true,
      data: armada
    };
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return {
      success: false,
      error: "Gagal mengambil data armada"
    };
  }
};

export const updateArmada = async (
  platNomor: string, 
  data: CreateVehicleData
): Promise<ActionResponse<Vehicle>> => {
  try {
    const { updateVehicleSchema } = await import("@/schema/vehicle");
    const { getVehicleByLicensePlate, updateVehicle } = await import("@/lib/services/vehicle");
    
    // Validate input data
    updateVehicleSchema.parse(data);
    
    // Get current vehicle
    const currentVehicle = await getVehicleByLicensePlate(platNomor);
    if (!currentVehicle) {
      return {
        success: false,
        error: "Armada tidak ditemukan"
      };
    }

    // Update vehicle
    const updatedVehicle = await updateVehicle(currentVehicle.id, data);
    
    return {
      success: true,
      data: updatedVehicle
    };
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return {
      success: false,
      error: "Gagal mengupdate armada"
    };
  }
};

export const hapusArmada = async (id: string) => {
  // Implementasi logika untuk menghapus armada
}