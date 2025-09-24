import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export class RideService {
  /**
   * Get rides by tenant with filtering
   */
  static async getRidesByTenant(
    tenantId: string,
    options?: {
      status?: string;
      userId?: string;
      vehicleId?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    }
  ) {
    const where: Prisma.RideWhereInput = {
      vehicle: { tenantId }
    };

    if (options?.status) {
      where.status = options.status as any;
    }

    if (options?.userId) {
      where.userId = options.userId;
    }

    if (options?.vehicleId) {
      where.vehicleId = options.vehicleId;
    }

    if (options?.startDate || options?.endDate) {
      where.startTime = {};
      if (options.startDate) where.startTime.gte = options.startDate;
      if (options.endDate) where.startTime.lte = options.endDate;
    }

    return await prisma.ride.findMany({
      where,
      include: {
        user: true,
        vehicle: {
          include: { driver: true }
        },
        origin: true,
        destination: true
      },
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 50,
      skip: options?.offset || 0
    });
  }

  /**
   * Create a new ride booking
   */
  static async createRide(data: {
    userId: string;
    vehicleId: string;
    originId?: string;
    destinationId?: string;
    startTime: Date;
    endTime: Date;
  }) {
    return await prisma.$transaction(async (tx) => {
      // Check if vehicle is available during this time
      const conflictingRides = await tx.ride.findMany({
        where: {
          vehicleId: data.vehicleId,
          status: {
            in: ['BOOKED', 'SCHEDULED', 'IN_PROGRESS']
          },
          OR: [
            {
              AND: [
                { startTime: { lte: data.startTime } },
                { endTime: { gte: data.startTime } }
              ]
            },
            {
              AND: [
                { startTime: { lte: data.endTime } },
                { endTime: { gte: data.endTime } }
              ]
            },
            {
              AND: [
                { startTime: { gte: data.startTime } },
                { endTime: { lte: data.endTime } }
              ]
            }
          ]
        }
      });

      if (conflictingRides.length > 0) {
        throw new Error('Vehicle is not available during the requested time');
      }

      const ride = await tx.ride.create({
        data: {
          ...data,
          status: 'BOOKED'
        },
        include: {
          user: true,
          vehicle: {
            include: { driver: true }
          },
          origin: true,
          destination: true
        }
      });

      return ride;
    });
  }

  /**
   * Update ride status
   */
  static async updateRideStatus(
    rideId: string,
    status: 'BOOKED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  ) {
    return await prisma.ride.update({
      where: { id: rideId },
      data: { 
        status,
        ...(status === 'IN_PROGRESS' && { startTime: new Date() }),
        ...(status === 'COMPLETED' && { endTime: new Date() })
      },
      include: {
        user: true,
        vehicle: {
          include: { driver: true }
        },
        origin: true,
        destination: true
      }
    });
  }

  /**
   * Get ride by ID
   */
  static async getRideById(rideId: string) {
    return await prisma.ride.findUnique({
      where: { id: rideId },
      include: {
        user: true,
        vehicle: {
          include: { 
            driver: true,
            tenant: true
          }
        },
        origin: true,
        destination: true
      }
    });
  }

  /**
   * Get rides for a specific user
   */
  static async getRidesByUser(
    userId: string,
    options?: {
      status?: string;
      limit?: number;
      offset?: number;
    }
  ) {
    const where: Prisma.RideWhereInput = { userId };

    if (options?.status) {
      where.status = options.status as any;
    }

    return await prisma.ride.findMany({
      where,
      include: {
        vehicle: {
          include: { driver: true }
        },
        origin: true,
        destination: true
      },
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 20,
      skip: options?.offset || 0
    });
  }

  /**
   * Get rides for a specific vehicle
   */
  static async getRidesByVehicle(
    vehicleId: string,
    options?: {
      status?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ) {
    const where: Prisma.RideWhereInput = { vehicleId };

    if (options?.status) {
      where.status = options.status as any;
    }

    if (options?.startDate || options?.endDate) {
      where.startTime = {};
      if (options.startDate) where.startTime.gte = options.startDate;
      if (options.endDate) where.startTime.lte = options.endDate;
    }

    return await prisma.ride.findMany({
      where,
      include: {
        user: true,
        origin: true,
        destination: true
      },
      orderBy: { startTime: 'desc' },
      take: options?.limit || 50
    });
  }

  /**
   * Get active rides (in progress)
   */
  static async getActiveRides(tenantId: string) {
    return await prisma.ride.findMany({
      where: {
        vehicle: { tenantId },
        status: 'IN_PROGRESS'
      },
      include: {
        user: true,
        vehicle: {
          include: { driver: true }
        },
        origin: true,
        destination: true
      },
      orderBy: { startTime: 'asc' }
    });
  }

  /**
   * Get upcoming rides (scheduled)
   */
  static async getUpcomingRides(
    tenantId: string,
    hoursAhead: number = 24
  ) {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() + hoursAhead);

    return await prisma.ride.findMany({
      where: {
        vehicle: { tenantId },
        status: {
          in: ['BOOKED', 'SCHEDULED']
        },
        startTime: {
          gte: new Date(),
          lte: cutoffTime
        }
      },
      include: {
        user: true,
        vehicle: {
          include: { driver: true }
        },
        origin: true,
        destination: true
      },
      orderBy: { startTime: 'asc' }
    });
  }

  /**
   * Cancel ride
   */
  static async cancelRide(rideId: string, reason?: string) {
    return await prisma.ride.update({
      where: { id: rideId },
      data: { 
        status: 'CANCELLED',
        // You might want to add a cancellation reason field
      },
      include: {
        user: true,
        vehicle: true,
        origin: true,
        destination: true
      }
    });
  }

  /**
   * Get ride statistics for tenant
   */
  static async getRideStats(
    tenantId: string,
    timeframe: 'day' | 'week' | 'month' | 'year' = 'month'
  ) {
    const startDate = new Date();
    switch (timeframe) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const rides = await prisma.ride.findMany({
      where: {
        vehicle: { tenantId },
        createdAt: { gte: startDate }
      }
    });

    const stats = {
      total: rides.length,
      completed: rides.filter(r => r.status === 'COMPLETED').length,
      cancelled: rides.filter(r => r.status === 'CANCELLED').length,
      inProgress: rides.filter(r => r.status === 'IN_PROGRESS').length,
      scheduled: rides.filter(r => r.status === 'SCHEDULED').length,
      booked: rides.filter(r => r.status === 'BOOKED').length
    };

    const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
    const cancellationRate = stats.total > 0 ? (stats.cancelled / stats.total) * 100 : 0;

    return {
      ...stats,
      completionRate: Math.round(completionRate * 100) / 100,
      cancellationRate: Math.round(cancellationRate * 100) / 100
    };
  }

  /**
   * Get vehicle utilization based on rides
   */
  static async getVehicleUtilization(
    tenantId: string,
    timeframe: 'week' | 'month' = 'month'
  ) {
    const startDate = new Date();
    if (timeframe === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { tenantId },
      include: {
        rides: {
          where: {
            createdAt: { gte: startDate },
            status: 'COMPLETED'
          }
        }
      }
    });

    return vehicles.map(vehicle => ({
      vehicleId: vehicle.id,
      licensePlate: vehicle.licensePlate,
      model: vehicle.model,
      ridesCount: vehicle.rides.length,
      utilization: vehicle.rides.length / (timeframe === 'week' ? 7 : 30) // rides per day average
    }));
  }

  /**
   * Get popular routes based on ride data
   */
  static async getPopularRoutes(tenantId: string, limit: number = 10) {
    const rides = await prisma.ride.findMany({
      where: {
        vehicle: { tenantId },
        status: 'COMPLETED',
        originId: { not: null },
        destinationId: { not: null }
      },
      include: {
        origin: true,
        destination: true
      }
    });

    // Group by origin-destination pairs
    const routeMap = new Map<string, {
      origin: any;
      destination: any;
      count: number;
    }>();

    rides.forEach(ride => {
      if (ride.origin && ride.destination) {
        const key = `${ride.originId}-${ride.destinationId}`;
        const existing = routeMap.get(key);
        
        if (existing) {
          existing.count++;
        } else {
          routeMap.set(key, {
            origin: ride.origin,
            destination: ride.destination,
            count: 1
          });
        }
      }
    });

    return Array.from(routeMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Update ride details
   */
  static async updateRide(
    rideId: string,
    data: {
      startTime?: Date;
      endTime?: Date;
      originId?: string;
      destinationId?: string;
    }
  ) {
    return await prisma.ride.update({
      where: { id: rideId },
      data,
      include: {
        user: true,
        vehicle: {
          include: { driver: true }
        },
        origin: true,
        destination: true
      }
    });
  }

  /**
   * Get driver's current ride
   */
  static async getDriverCurrentRide(driverId: string) {
    return await prisma.ride.findFirst({
      where: {
        vehicle: { driverId },
        status: 'IN_PROGRESS'
      },
      include: {
        user: true,
        vehicle: true,
        origin: true,
        destination: true
      }
    });
  }

  /**
   * Check vehicle availability
   */
  static async checkVehicleAvailability(
    vehicleId: string,
    startTime: Date,
    endTime: Date,
    excludeRideId?: string
  ) {
    const where: Prisma.RideWhereInput = {
      vehicleId,
      status: {
        in: ['BOOKED', 'SCHEDULED', 'IN_PROGRESS']
      },
      OR: [
        {
          AND: [
            { startTime: { lte: startTime } },
            { endTime: { gte: startTime } }
          ]
        },
        {
          AND: [
            { startTime: { lte: endTime } },
            { endTime: { gte: endTime } }
          ]
        },
        {
          AND: [
            { startTime: { gte: startTime } },
            { endTime: { lte: endTime } }
          ]
        }
      ]
    };

    if (excludeRideId) {
      where.id = { not: excludeRideId };
    }

    const conflictingRides = await prisma.ride.findMany({ where });
    
    return {
      available: conflictingRides.length === 0,
      conflictingRides
    };
  }
}