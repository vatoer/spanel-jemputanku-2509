"use server";

import { prisma } from "@/lib/prisma";
import type { CreateVehicleData, UpdateVehicleData } from "@/schema/vehicle";
import type { Prisma, VehicleStatus } from "@prisma/client";

/**
 * Get all vehicles for a tenant with optional filters
 */
export async function getVehiclesByTenant(
  tenantId: string,
  options?: {
    includeDriver?: boolean;
    includeRoutes?: boolean;
    includeServiceRecords?: boolean;
    status?: VehicleStatus;
  }
) {
  return await prisma.vehicle.findMany({
    where: { 
      tenantId,
      ...(options?.status && { status: options.status })
    },
    include: {
      driver: options?.includeDriver,
      vehicleRouteAssignments: options?.includeRoutes ? {
        include: { route: true },
        where: { isActive: true }
      } : false,
      serviceRecords: options?.includeServiceRecords ? {
        orderBy: { serviceDate: 'desc' },
        take: 5 // Latest 5 records
      } : false
    }
  });
}

/**
 * Get a single vehicle by ID
 */
export async function getVehicleById(
  vehicleId: string,
  options?: {
    includeDriver?: boolean;
    includeRoutes?: boolean;
    includeServiceRecords?: boolean;
  }
) {
  return await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      driver: options?.includeDriver,
      vehicleRouteAssignments: options?.includeRoutes ? {
        include: { route: true },
        where: { isActive: true }
      } : false,
      serviceRecords: options?.includeServiceRecords ? {
        orderBy: { serviceDate: 'desc' },
        take: 5 // Latest 5 records
      } : false
    }
  });
}

/**
 * Get a single vehicle by license plate
 * Matches license plates by removing spaces and case-insensitive comparison
 */
export async function getVehicleByLicensePlate(
  licensePlate: string,
  options?: {
    includeDriver?: boolean;
    includeRoutes?: boolean;
    includeServiceRecords?: boolean;
  }
) {
  // remove all other non-alphanumeric characters for better matching
  const normalizedInput = licensePlate.replace(/[^A-Z0-9]/g, '').toUpperCase();

  // Alternative approach: Get all vehicles and filter in memory (safer but less efficient for large datasets)
  // Use raw SQL for better performance with proper parameterization
  const vehicles = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM "Vehicle" 
    WHERE UPPER(REPLACE("license_plate", ' ', '')) = ${normalizedInput}
    LIMIT 1
  `;
  
  if (vehicles.length === 0) {
    return null;
  }
  
  // Now get the full vehicle with includes using the found ID
  return await prisma.vehicle.findUnique({
    where: { id: vehicles[0].id },
    include: {
      driver: options?.includeDriver,
      vehicleRouteAssignments: options?.includeRoutes ? {
        include: { route: true },
        where: { isActive: true }
      } : false,
      serviceRecords: options?.includeServiceRecords ? {
        orderBy: { serviceDate: 'desc' },
        take: 5 // Latest 5 records
      } : false
    }
  });
}

/**
 * Create a new vehicle
 */
export async function createVehicle(data: CreateVehicleData & { tenantId: string }) {
  // Check if license plate already exists
  const existing = await prisma.vehicle.findUnique({
    where: { licensePlate: data.licensePlate }
  });

  if (existing) {
    throw new Error('License plate already exists');
  }

  return await prisma.vehicle.create({
    data,
    include: {
      driver: true,
      tenant: true
    }
  });
}

/**
 * Assign driver to vehicle
 */
export async function assignDriver(vehicleId: string, driverId: string) {
  return await prisma.$transaction(async (tx) => {
    // Update vehicle with new driver
    const vehicle = await tx.vehicle.update({
      where: { id: vehicleId },
      data: { driverId },
      include: { driver: true }
    });

    // Create driver-vehicle history record
    await tx.driverVehicle.create({
      data: {
        driverId,
        vehicleId
      }
    });

    return vehicle;
  });
}

/**
 * Assign vehicle to route
 */
export async function assignToRoute(
  vehicleId: string, 
  routeId: string, 
  assignedBy: string
) {
  // Check if vehicle is already assigned to this route
  const existingAssignment = await prisma.vehicleRouteAssignment.findUnique({
    where: {
      vehicleId_routeId: { vehicleId, routeId }
    }
  });

  if (existingAssignment && existingAssignment.isActive) {
    throw new Error('Vehicle already assigned to this route');
  }

  if (existingAssignment && !existingAssignment.isActive) {
    // Reactivate existing assignment
    return await prisma.vehicleRouteAssignment.update({
      where: {
        vehicleId_routeId: { vehicleId, routeId }
      },
      data: {
        isActive: true,
        assignedAt: new Date(),
        assignedBy,
        unassignedAt: null,
        unassignedBy: null
      }
    });
  }

  // Create new assignment
  return await prisma.vehicleRouteAssignment.create({
    data: {
      vehicleId,
      routeId,
      assignedBy
    }
  });
}

/**
 * Unassign vehicle from route
 */
export async function unassignFromRoute(
  vehicleId: string,
  routeId: string,
  unassignedBy: string
) {
  return await prisma.vehicleRouteAssignment.update({
    where: {
      vehicleId_routeId: { vehicleId, routeId }
    },
    data: {
      isActive: false,
      unassignedAt: new Date(),
      unassignedBy
    }
  });
}

/**
 * Add service record
 */
export async function addServiceRecord(data: {
  vehicleId: string;
  type: 'MAINTENANCE' | 'REPAIR' | 'INSPECTION' | 'UPGRADE';
  category: 'ENGINE' | 'TRANSMISSION' | 'BRAKES' | 'TIRES' | 'ELECTRICAL' | 'AC_HEATING' | 'BODY' | 'INTERIOR' | 'SAFETY' | 'GENERAL';
  title: string;
  description?: string;
  serviceDate: Date;
  cost?: number;
  mileage?: number;
  nextDueDate?: Date;
  vendor?: string;
  invoice?: string;
}) {
  return await prisma.vehicleServiceRecord.create({
    data: {
      ...data,
      status: 'COMPLETED'
    }
  });
}

/**
 * Get upcoming service due dates
 */
export async function getUpcomingServices(tenantId: string, daysAhead: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

  return await prisma.vehicleServiceRecord.findMany({
    where: {
      vehicle: { tenantId },
      nextDueDate: {
        lte: cutoffDate,
        gte: new Date()
      },
      status: 'COMPLETED'
    },
    include: {
      vehicle: true
    },
    orderBy: {
      nextDueDate: 'asc'
    }
  });
}

/**
 * Get vehicle utilization stats
 */
export async function getUtilizationStats(tenantId: string) {
  const vehicles = await prisma.vehicle.findMany({
    where: { tenantId },
    include: {
      rides: {
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
          }
        }
      },
      vehicleRouteAssignments: {
        where: { isActive: true }
      }
    }
  });

  return vehicles.map(vehicle => ({
    id: vehicle.id,
    licensePlate: vehicle.licensePlate,
    model: vehicle.model,
    ridesLast30Days: vehicle.rides.length,
    isAssignedToRoute: vehicle.vehicleRouteAssignments.length > 0,
    hasDriver: !!vehicle.driverId
  }));
}

/**
 * Get vehicle maintenance costs
 */
export async function getMaintenanceCosts(
  vehicleId: string, 
  startDate?: Date, 
  endDate?: Date
) {
  const where: Prisma.VehicleServiceRecordWhereInput = {
    vehicleId,
    cost: { not: null }
  };

  if (startDate || endDate) {
    where.serviceDate = {};
    if (startDate) where.serviceDate.gte = startDate;
    if (endDate) where.serviceDate.lte = endDate;
  }

  const records = await prisma.vehicleServiceRecord.findMany({
    where,
    select: {
      cost: true,
      type: true,
      category: true,
      serviceDate: true,
      title: true
    },
    orderBy: {
      serviceDate: 'desc'
    }
  });

  const totalCost = records.reduce((sum, record) => sum + (record.cost || 0), 0);
  const costByType = records.reduce((acc, record) => {
    acc[record.type] = (acc[record.type] || 0) + (record.cost || 0);
    return acc;
  }, {} as Record<string, number>);

  return {
    totalCost,
    costByType,
    records
  };
}

/**
 * Update vehicle status
 */
export async function updateVehicleStatus(
  vehicleId: string,
  status: VehicleStatus
) {
  return await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { status },
    include: {
      driver: true
    }
  });
}

/**
 * Update vehicle details
 */
export async function updateVehicle(
  vehicleId: string, 
  data: Partial<UpdateVehicleData>
) {
  // If updating license plate, check for uniqueness
  if (data.licensePlate) {
    const existing = await prisma.vehicle.findUnique({
      where: { licensePlate: data.licensePlate }
    });
    
    if (existing && existing.id !== vehicleId) {
      throw new Error('License plate already exists');
    }
  }

  return await prisma.vehicle.update({
    where: { id: vehicleId },
    data,
    include: {
      driver: true,
      tenant: true
    }
  });
}

/**
 * Search vehicles by license plate or model
 */
export async function searchVehicles(
  tenantId: string,
  searchTerm: string,
  options?: {
    includeDriver?: boolean;
    status?: VehicleStatus;
  }
) {
  return await prisma.vehicle.findMany({
    where: {
      tenantId,
      ...(options?.status && { status: options.status }),
      OR: [
        { licensePlate: { contains: searchTerm, mode: 'insensitive' } },
        { model: { contains: searchTerm, mode: 'insensitive' } },
        { manufacturer: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    include: {
      driver: options?.includeDriver,
    },
    orderBy: {
      licensePlate: 'asc',
    },
  });
}

/**
 * Get vehicles count by status
 */
export async function getVehicleStatsByTenant(tenantId: string) {
  const [total, active, maintenance, inactive] = await Promise.all([
    prisma.vehicle.count({ where: { tenantId } }),
    prisma.vehicle.count({ where: { tenantId, status: 'ACTIVE' } }),
    prisma.vehicle.count({ where: { tenantId, status: 'MAINTENANCE' } }),
    prisma.vehicle.count({ where: { tenantId, status: 'INACTIVE' } }),
  ]);

  return {
    total,
    active,
    maintenance,
    inactive,
  };
}

/**
 * Delete vehicle (soft delete by unassigning from everything)
 */
export async function deleteVehicle(vehicleId: string) {
  return await prisma.$transaction(async (tx) => {
    // Check if vehicle exists
    const vehicle = await tx.vehicle.findUnique({
      where: { id: vehicleId }
    });

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    // Unassign from all routes
    await tx.vehicleRouteAssignment.updateMany({
      where: { vehicleId, isActive: true },
      data: { 
        isActive: false, 
        unassignedAt: new Date(),
        unassignedBy: 'SYSTEM' 
      }
    });

    // Remove driver assignment
    await tx.vehicle.update({
      where: { id: vehicleId },
      data: { driverId: null }
    });

    // Delete the vehicle
    return await tx.vehicle.delete({
      where: { id: vehicleId }
    });
  });
}