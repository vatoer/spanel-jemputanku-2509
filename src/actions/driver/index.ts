"use server";

import { prisma } from "@/lib/prisma";
import * as DriverService from "@/lib/services/driver";
import * as UserService from "@/lib/services/user";
import { AssignDriverData, assignDriverSchema, CreateDriverData, createDriverSchema, UpdateDriverData, updateDriverSchema } from "@/schema/driver";
import { GetDriversByTenantResult } from "@/types/user.types";
import { User } from "@prisma/client";
import { ActionResponse } from "../response";

/**
 * Create a new driver (inline function)
 */
async function createDriver(data: {
  name: string;
  email: string;
  tenantId: string;
  image?: string;
  phone?: string;
  address: string;
  bloodType: 'A' | 'B' | 'AB' | 'O';
  birthDate: Date;
  licenses?: Array<{
    licenseType: 'A' | 'A1' | 'B' | 'B1' | 'B2' | 'C' | 'D';
    licenseNumber: string;
    issuedDate: Date;
    expiresAt: Date;
    issuingAuthority?: string;
    notes?: string;
  }>;
}) {
  return await prisma.$transaction(async (tx) => {
    // Check if user already exists
    const existingUser = await tx.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      // Check if user is already a driver in this tenant
      const isDriver = await tx.userRole.findFirst({
        where: {
          userId: existingUser.id,
          roleId: 'DRIVER'
        }
      });

      if (isDriver) {
        throw new Error('User is already a driver');
      }
    }

    let user;
    if (existingUser) {
      // Update existing user with new information
      user = await tx.user.update({
        where: { id: existingUser.id },
        data: {
          name: data.name,
          image: data.image,
          phone: data.phone,
          address: data.address,
          bloodType: data.bloodType,
          birthDate: data.birthDate
        }
      });
    } else {
      // Create new user
      user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          image: data.image,
          phone: data.phone,
          address: data.address,
          bloodType: data.bloodType,
          birthDate: data.birthDate
        }
      });
    }

    // Create driver licenses if provided
    if (data.licenses && data.licenses.length > 0) {
      for (const license of data.licenses) {
        await tx.driverLicense.create({
          data: {
            driverId: user.id,
            licenseType: license.licenseType,
            licenseNumber: license.licenseNumber,
            issuedDate: license.issuedDate,
            expiresAt: license.expiresAt,
            issuingAuthority: license.issuingAuthority,
            notes: license.notes,
            isActive: true
          }
        });
      }
    }

    // Assign to tenant
    await tx.userTenant.upsert({
      where: {
        userId_tenantId: {
          userId: user.id,
          tenantId: data.tenantId
        }
      },
      create: {
        userId: user.id,
        tenantId: data.tenantId
      },
      update: {}
    });

    // Assign DRIVER role
    await tx.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: 'DRIVER'
        }
      },
      create: {
        userId: user.id,
        roleId: 'DRIVER'
      },
      update: {}
    });

    return await tx.user.findUnique({
      where: { id: user.id },
      include: {
        UserRole: {
          include: { role: true }
        },
        UserTenant: {
          where: { tenantId: data.tenantId },
          include: { tenant: true }
        },
        driverLicenses: true
      }
    });
  });
}

/**
 * Get all drivers for a tenant
 */
export const ambilDaftarDriver = async (tenantId?: string): Promise<ActionResponse<GetDriversByTenantResult>> => {
  try {
    // TODO: get tenantId from user session if not provided
    const actualTenantId = tenantId || "tenant-transjakarta";

    // TODO: Convert to functional approach
    const drivers: GetDriversByTenantResult = [] as any; // await UserService.getDriversByTenant(actualTenantId);

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
    
    const driver = await DriverService.getDriverById(driverId, actualTenantId);
    
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
    
    const driver = await createDriver({
      ...data,
      birthDate: data.birthDate || new Date(),
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
    
    const driver = await DriverService.updateDriver(driverId, data);
    
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
export const assignDriverToVehicle = async (driverId: string, vehicleId: string, data: AssignDriverData): Promise<ActionResponse<any>> => {
  try {
    // Validate input data
    assignDriverSchema.parse(data);
    
    const result = await DriverService.assignDriverToVehicle(data.driverId, data.vehicleId);
    
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
    const result = await DriverService.unassignDriverFromVehicle(vehicleId);
    
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
    
    const drivers = await DriverService.getAvailableDrivers(actualTenantId);
    
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
    
    const stats = await DriverService.getDriverStats(actualTenantId, timeframe);
    
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
    
    const drivers = await DriverService.searchDrivers(actualTenantId, searchTerm);
    
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
    const performance = await DriverService.getDriverPerformance(driverId, days);
    
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
    const result = await DriverService.toggleDriverStatus(driverId, isActive);
    
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
