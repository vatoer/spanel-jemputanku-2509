"use server";

import * as serviceRecordService from "@/lib/services/serviceRecord";
import { getVehicleById, getVehicleByLicensePlate } from "@/lib/services/vehicle";
import {
  CreateVehicleServiceRecordData,
  UpdateVehicleServiceRecordData,
  VehicleServiceRecordData,
  createVehicleServiceRecordSchema,
  updateVehicleServiceRecordSchema
} from "@/schema/riwayat";
import { GetUpcomingServicesByLicensePlateResult } from "@/types/vehicle-service-record.types";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "../response";

/**
 * Get all service records for a specific vehicle
 */
export async function getServiceRecordsByVehicle(
  vehicleId: string
): Promise<ActionResponse<VehicleServiceRecordData[]>> {
  try {
    const records = await serviceRecordService.getServiceRecordsByVehicleId(vehicleId);

    return {
      success: true,
      data: records as VehicleServiceRecordData[]
    };
  } catch (error) {
    console.error("Error fetching service records:", error);
    return {
      success: false,
      error: "Gagal mengambil data riwayat service"
    };
  }
}

/**
 * Get all service records for a vehicle by license plate
 */
export async function getServiceRecordsByPlate(
  licensePlate: string
): Promise<ActionResponse<VehicleServiceRecordData[]>> {
  try {
    const records = await serviceRecordService.getServiceRecordsByLicensePlate(licensePlate);

    return {
      success: true,
      data: records as VehicleServiceRecordData[]
    };
  } catch (error) {
    console.error("Error fetching service records by plate:", error);
    return {
      success: false,
      error: "Gagal mengambil data riwayat service"
    };
  }
}

/**
 * Get a single service record by ID
 */
export async function getServiceRecordById(
  id: string
): Promise<ActionResponse<VehicleServiceRecordData>> {
  try {
    const record = await serviceRecordService.getServiceRecordById(id);

    if (!record) {
      return {
        success: false,
        error: "Riwayat service tidak ditemukan"
      };
    }

    return {
      success: true,
      data: record as VehicleServiceRecordData
    };
  } catch (error) {
    console.error("Error fetching service record:", error);
    return {
      success: false,
      error: "Gagal mengambil data riwayat service"
    };
  }
}

/**
 * Create a new service record
 */
export async function createServiceRecord(
  vehicleId: string,
  data: CreateVehicleServiceRecordData
): Promise<ActionResponse<VehicleServiceRecordData>> {
  try {
    // Validate input data
    const validatedData = createVehicleServiceRecordSchema.parse(data);
    
    // Check if vehicle exists using service layer
    const vehicle = await getVehicleById(vehicleId);

    if (!vehicle) {
      return {
        success: false,
        error: "Kendaraan tidak ditemukan"
      };
    }

    // Create service record using service layer
    const serviceRecord = await serviceRecordService.createServiceRecord(vehicleId, validatedData);

    // Revalidate related paths
    revalidatePath(`/armada/${vehicle.licensePlate}/riwayat`);
    revalidatePath(`/armada/${vehicle.licensePlate}`);

    return {
      success: true,
      data: serviceRecord as VehicleServiceRecordData
    };
  } catch (error: any) {
    console.error("Error creating service record:", error);
    
    // Handle Zod validation errors
    if (error?.errors) {
      const errorMessages = error.errors.map((err: any) => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      
      return {
        success: false,
        error: `Validasi data gagal: ${errorMessages}`
      };
    }

    return {
      success: false,
      error: "Gagal menyimpan riwayat service"
    };
  }
}

/**
 * Create service record by vehicle license plate
 */
export async function createServiceRecordByPlate(
  licensePlate: string,
  data: CreateVehicleServiceRecordData
): Promise<ActionResponse<VehicleServiceRecordData>> {
  try {
    // Find vehicle by license plate using service layer
    const vehicle = await getVehicleByLicensePlate(licensePlate);

    if (!vehicle) {
      return {
        success: false,
        error: "Kendaraan tidak ditemukan"
      };
    }

    return await createServiceRecord(vehicle.id, data);
  } catch (error) {
    console.error("Error creating service record by plate:", error);
    return {
      success: false,
      error: "Gagal menyimpan riwayat service"
    };
  }
}

/**
 * Update an existing service record
 */
export async function updateServiceRecord(
  id: string,
  data: UpdateVehicleServiceRecordData
): Promise<ActionResponse<VehicleServiceRecordData>> {
  try {
    // Validate input data
    const validatedData = updateVehicleServiceRecordSchema.parse(data);
    
    // Check if service record exists using service layer
    const existingRecord = await serviceRecordService.getServiceRecordById(id);

    if (!existingRecord) {
      return {
        success: false,
        error: "Riwayat service tidak ditemukan"
      };
    }

    // Update service record using service layer
    const updatedRecord = await serviceRecordService.updateServiceRecord(id, validatedData);

    // Revalidate related paths
    revalidatePath(`/armada/${existingRecord.vehicle.licensePlate}/riwayat`);
    revalidatePath(`/armada/${existingRecord.vehicle.licensePlate}/riwayat/${id}`);
    revalidatePath(`/armada/${existingRecord.vehicle.licensePlate}`);

    return {
      success: true,
      data: updatedRecord as VehicleServiceRecordData
    };
  } catch (error: any) {
    console.error("Error updating service record:", error);
    
    // Handle Zod validation errors
    if (error?.errors) {
      const errorMessages = error.errors.map((err: any) => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      
      return {
        success: false,
        error: `Validasi data gagal: ${errorMessages}`
      };
    }

    return {
      success: false,
      error: "Gagal mengupdate riwayat service"
    };
  }
}

/**
 * Delete a service record
 */
export async function deleteServiceRecord(
  id: string
): Promise<ActionResponse<VehicleServiceRecordData>> {
  try {
    // Check if service record exists and get vehicle info using service layer
    const existingRecord = await serviceRecordService.getServiceRecordById(id);

    if (!existingRecord) {
      return {
        success: false,
        error: "Riwayat service tidak ditemukan"
      };
    }

    // Delete service record using service layer
    const deletedRecord = await serviceRecordService.deleteServiceRecord(id);

    // Revalidate related paths
    revalidatePath(`/armada/${existingRecord.vehicle.licensePlate}/riwayat`);
    revalidatePath(`/armada/${existingRecord.vehicle.licensePlate}`);

    return {
      success: true,
      data: deletedRecord as VehicleServiceRecordData
    };
  } catch (error) {
    console.error("Error deleting service record:", error);
    return {
      success: false,
      error: "Gagal menghapus riwayat service"
    };
  }
}

/**
 * Get upcoming service due dates for a vehicle
 */
export async function getUpcomingServicesByPlate(
  licensePlate: string,
  daysAhead: number = 30
): Promise<ActionResponse<GetUpcomingServicesByLicensePlateResult>> {
  try {
    const upcomingServices = await serviceRecordService.getUpcomingServicesByLicensePlate(
      licensePlate,
      daysAhead
    );
    return {
      success: true,
      data: upcomingServices
    };
  } catch (error) {
    console.error("Error fetching upcoming services:", error);
    return {
      success: false,
      error: "Gagal mengambil data service yang akan datang"
    };
  }
}

/**
 * Get service records statistics for a vehicle
 */
export async function getServiceRecordsStats(
  licensePlate: string
): Promise<ActionResponse<{
  totalRecords: number;
  totalCost: number;
  lastService: Date | null;
  nextDueService: Date | null;
  recordsByStatus: Record<string, number>;
  recordsByType: Record<string, number>;
}>> {
  try {
    const stats = await serviceRecordService.getServiceRecordsStatsByLicensePlate(licensePlate);

    return {
      success: true,
      data: stats
    };
  } catch (error) {
    console.error("Error fetching service records stats:", error);
    return {
      success: false,
      error: "Gagal mengambil statistik riwayat service"
    };
  }
}
