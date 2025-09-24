import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export class VehicleService {
  /**
   * Get all vehicles for a tenant with optional filters
   */
  static async getVehiclesByTenant(
    tenantId: string,
    options?: {
      includeDriver?: boolean;
      includeRoutes?: boolean;
      includeServiceRecords?: boolean;
      isActive?: boolean;
    }
  ) {
    return await prisma.vehicle.findMany({
      where: { 
        tenantId,
        ...(options?.isActive !== undefined && { 
          // Add active filter if needed
        })
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
   * Create a new vehicle
   */
  static async createVehicle(data: {
    tenantId: string;
    licensePlate: string;
    model: string;
    manufacturer: string;
    year: number;
    color: string;
    capacity: number;
    driverId?: string;
  }) {
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
  static async assignDriver(vehicleId: string, driverId: string) {
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
  static async assignToRoute(
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
  static async unassignFromRoute(
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
  static async addServiceRecord(data: {
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
  static async getUpcomingServices(tenantId: string, daysAhead: number = 30) {
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
  static async getUtilizationStats(tenantId: string) {
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
  static async getMaintenanceCosts(
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
   * Update vehicle details
   */
  static async updateVehicle(
    vehicleId: string, 
    data: Partial<{
      model: string;
      manufacturer: string;
      year: number;
      color: string;
      capacity: number;
    }>
  ) {
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
   * Delete vehicle (soft delete by unassigning from everything)
   */
  static async deleteVehicle(vehicleId: string) {
    return await prisma.$transaction(async (tx) => {
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

      // Mark as deleted (you might want to add isActive field to Vehicle model)
      return await tx.vehicle.delete({
        where: { id: vehicleId }
      });
    });
  }
}