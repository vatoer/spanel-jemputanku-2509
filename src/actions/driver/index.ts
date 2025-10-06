"use server";

import { UserService } from "@/lib/services/user";
import { AssignDriverData, assignDriverSchema, CreateDriverData, createDriverSchema, UpdateDriverData, updateDriverSchema } from "@/schema/driver";
import { GetDriversByTenantResult } from "@/types/user.types";
import { User } from "@prisma/client";
import { ActionResponse } from "../response";

/**
 * Get all drivers for a tenant
 */
export const ambilDaftarDriver = async (tenantId?: string): Promise<ActionResponse<GetDriversByTenantResult>> => {
  try {
    // TODO: get tenantId from user session if not provided
    const actualTenantId = tenantId || "tenant-transjakarta";

    const drivers: GetDriversByTenantResult = await UserService.getDriversByTenant(actualTenantId);

    return {
      success: true,
      data: drivers
    };
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return {
      success: false,
      error: "Gagal mengambil daftar driver"
    };
  }
};

/**
 * Get driver by ID
 */
export const ambilDriverById = async (driverId: string, tenantId?: string): Promise<ActionResponse<any>> => {
  try {
    const actualTenantId = tenantId || "tenant-transjakarta";
    
    const driver = await UserService.getDriverById(driverId, actualTenantId);
    
    if (!driver) {
      return {
        success: false,
        error: "Driver tidak ditemukan"
      };
    }
    
    return {
      success: true,
      data: driver
    };
  } catch (error) {
    console.error("Error fetching driver:", error);
    return {
      success: false,
      error: "Gagal mengambil data driver"
    };
  }
};

/**
 * Create a new driver
 */
export const simpanDriverBaru = async (data: CreateDriverData, tenantId?: string): Promise<ActionResponse<User>> => {
  try {
    // Validate input data
    createDriverSchema.parse(data);
    
    const actualTenantId = tenantId || "tenant-transjakarta";
    
    const driver = await UserService.createDriver({
      ...data,
      tenantId: actualTenantId
    });
    
    if (!driver) {
      return {
        success: false,
        error: "Gagal membuat driver"
      };
    }
    
    return {
      success: true,
      data: driver
    };
  } catch (error) {
    console.error("Error creating driver:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("already a driver")) {
        return {
          success: false,
          error: "User sudah terdaftar sebagai driver"
        };
      }
      if (error.message.includes("Unique constraint")) {
        return {
          success: false,
          error: "Email sudah digunakan"
        };
      }
    }
    
    return {
      success: false,
      error: "Gagal menyimpan driver"
    };
  }
};

/**
 * Update driver information
 */
export const updateDriver = async (driverId: string, data: UpdateDriverData): Promise<ActionResponse<User>> => {
  try {
    // Validate input data
    updateDriverSchema.parse(data);
    
    const driver = await UserService.updateDriver(driverId, data);
    
    return {
      success: true,
      data: driver
    };
  } catch (error) {
    console.error("Error updating driver:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return {
          success: false,
          error: "Email sudah digunakan oleh user lain"
        };
      }
    }
    
    return {
      success: false,
      error: "Gagal mengupdate driver"
    };
  }
};

/**
 * Assign driver to vehicle
 */
export const assignDriverToVehicle = async (data: AssignDriverData): Promise<ActionResponse<any>> => {
  try {
    // Validate input data
    assignDriverSchema.parse(data);
    
    const result = await UserService.assignDriverToVehicle(data.driverId, data.vehicleId);
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("Error assigning driver to vehicle:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return {
          success: false,
          error: error.message.includes("Driver") ? "Driver tidak ditemukan" : "Vehicle tidak ditemukan"
        };
      }
      if (error.message.includes("already assigned")) {
        return {
          success: false,
          error: "Vehicle sudah ditugaskan ke driver lain"
        };
      }
      if (error.message.includes("inactive")) {
        return {
          success: false,
          error: "Driver tidak aktif"
        };
      }
    }
    
    return {
      success: false,
      error: "Gagal menugaskan driver ke vehicle"
    };
  }
};

/**
 * Unassign driver from vehicle
 */
export const unassignDriverFromVehicle = async (vehicleId: string): Promise<ActionResponse<any>> => {
  try {
    const result = await UserService.unassignDriverFromVehicle(vehicleId);
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("Error unassigning driver from vehicle:", error);
    return {
      success: false,
      error: "Gagal membatalkan penugasan driver"
    };
  }
};

/**
 * Get available drivers (not assigned to any vehicle)
 */
export const ambilDriverTersedia = async (tenantId?: string): Promise<ActionResponse<any[]>> => {
  try {
    const actualTenantId = tenantId || "tenant-transjakarta";
    
    const drivers = await UserService.getAvailableDrivers(actualTenantId);
    
    return {
      success: true,
      data: drivers
    };
  } catch (error) {
    console.error("Error fetching available drivers:", error);
    return {
      success: false,
      error: "Gagal mengambil daftar driver tersedia"
    };
  }
};

/**
 * Get driver statistics for tenant
 */
export const ambilStatistikDriver = async (tenantId?: string, timeframe: 'week' | 'month' | 'year' = 'month'): Promise<ActionResponse<any[]>> => {
  try {
    const actualTenantId = tenantId || "tenant-transjakarta";
    
    const stats = await UserService.getDriverStats(actualTenantId, timeframe);
    
    return {
      success: true,
      data: stats
    };
  } catch (error) {
    console.error("Error fetching driver statistics:", error);
    return {
      success: false,
      error: "Gagal mengambil statistik driver"
    };
  }
};

/**
 * Remove driver from tenant (soft delete)
 */
export const hapusDriver = async (driverId: string, tenantId?: string): Promise<ActionResponse<any>> => {
  try {
    const actualTenantId = tenantId || "tenant-transjakarta";
    
    const result = await UserService.removeUserFromTenant(driverId, actualTenantId);
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("Error removing driver:", error);
    return {
      success: false,
      error: "Gagal menghapus driver"
    };
  }
};

/**
 * Search drivers by name or email
 */
export const cariDriver = async (searchTerm: string, tenantId?: string): Promise<ActionResponse<any[]>> => {
  try {
    const actualTenantId = tenantId || "tenant-transjakarta";
    
    const drivers = await UserService.searchDrivers(actualTenantId, searchTerm);
    
    return {
      success: true,
      data: drivers
    };
  } catch (error) {
    console.error("Error searching drivers:", error);
    return {
      success: false,
      error: "Gagal mencari driver"
    };
  }
};

/**
 * Get driver performance metrics
 */
export const ambilPerformaDriver = async (driverId: string, days: number = 30): Promise<ActionResponse<any>> => {
  try {
    const performance = await UserService.getDriverPerformance(driverId, days);
    
    return {
      success: true,
      data: performance
    };
  } catch (error) {
    console.error("Error fetching driver performance:", error);
    return {
      success: false,
      error: "Gagal mengambil performa driver"
    };
  }
};

/**
 * Toggle driver active status
 */
export const toggleStatusDriver = async (driverId: string, isActive: boolean): Promise<ActionResponse<any>> => {
  try {
    const result = await UserService.toggleDriverStatus(driverId, isActive);
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("Error toggling driver status:", error);
    return {
      success: false,
      error: `Gagal ${isActive ? 'mengaktifkan' : 'menonaktifkan'} driver`
    };
  }
};
