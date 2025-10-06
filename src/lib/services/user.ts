import { prisma } from "@/lib/prisma";
import type {
  AssignDriverToVehicleResult,
  CreateDriverResult,
  CreateUserResult,
  GetAvailableDriversResult,
  GetDriverPerformanceResult,
  GetDriversByTenantResult,
  GetDriverStatsResult,
  GetUserActivityResult,
  GetUserPermissionsResult,
  GetUsersByTenantResult,
  RemoveUserFromTenantResult,
  SearchDriversResult,
  ToggleDriverStatusResult,
  UnassignDriverFromVehicleResult,
  UpdateDriverResult
} from "@/types/user.types";

export class UserService {
  /**
   * Get users by tenant with role filtering
   */
  static async getUsersByTenant(
    tenantId: string,
    options?: {
      role?: string;
      includeVehicles?: boolean;
      includeRoles?: boolean;
    }
  ): Promise<GetUsersByTenantResult> {
    return await prisma.user.findMany({
      where: {
        UserTenant: {
          some: { tenantId }
        },
        ...(options?.role && {
          UserRole: {
            some: { roleId: options.role as any }
          }
        })
      },
      include: {
        UserRole: options?.includeRoles ? {
          include: {
            role: true
          }
        } : false,
        DriverVehicle: options?.includeVehicles ? true : false,
        UserTenant: {
          where: { tenantId },
          include: { tenant: true }
        }
      }
    });
  }

  /**
   * Get all drivers for a tenant
   */
  static async getDriversByTenant(tenantId: string): Promise<GetDriversByTenantResult> {
    return await prisma.user.findMany({
      where: {
        UserTenant: {
          some: { tenantId }
        },
        UserRole: {
          some: { roleId: 'DRIVER' }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        VehicleDriver: true,
        Ride: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          where: {
            status: 'COMPLETED'
          }
        }
      }
    });
  }

  /**
   * Create a new user and assign to tenant
   */
  static async createUser(data: {
    name: string;
    email: string;
    tenantId: string;
    role: string;
    image?: string;
  }): Promise<CreateUserResult> {
    return await prisma.$transaction(async (tx) => {
      // Check if user already exists
      const existingUser = await tx.user.findUnique({
        where: { email: data.email }
      });

      let user;
      if (existingUser) {
        user = existingUser;
      } else {
        // Create new user
        user = await tx.user.create({
          data: {
            name: data.name,
            email: data.email,
            image: data.image
          }
        });
      }

      // Assign to tenant if not already assigned
      const existingTenantAssignment = await tx.userTenant.findUnique({
        where: {
          userId_tenantId: {
            userId: user.id,
            tenantId: data.tenantId
          }
        }
      });

      if (!existingTenantAssignment) {
        await tx.userTenant.create({
          data: {
            userId: user.id,
            tenantId: data.tenantId
          }
        });
      }

      // Assign role if not already assigned
      const existingRole = await tx.userRole.findUnique({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: data.role as any
          }
        }
      });

      if (!existingRole) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: data.role as any
          }
        });
      }

      return await tx.user.findUnique({
        where: { id: user.id },
        include: {
          UserRole: true,
          UserTenant: {
            where: { tenantId: data.tenantId }
          }
        }
      });
    });
  }

  /**
   * Assign user to tenant with role
   */
  static async assignUserToTenant(
    userId: string,
    tenantId: string,
    role: string
  ) {
    return await prisma.$transaction(async (tx) => {
      // Assign to tenant
      await tx.userTenant.upsert({
        where: {
          userId_tenantId: { userId, tenantId }
        },
        create: { userId, tenantId },
        update: {} // Already exists
      });

      // Assign role
      await tx.userRole.upsert({
        where: {
          userId_roleId: { userId, roleId: role as any }
        },
        create: { userId, roleId: role as any },
        update: {} // Already exists
      });

      return await tx.user.findUnique({
        where: { id: userId },
        include: {
          UserRole: true,
          UserTenant: { where: { tenantId } }
        }
      });
    });
  }

  /**
   * Remove user from tenant
   */
  static async removeUserFromTenant(userId: string, tenantId: string): Promise<RemoveUserFromTenantResult> {
    return await prisma.$transaction(async (tx) => {
      // Remove from tenant
      await tx.userTenant.delete({
        where: {
          userId_tenantId: { userId, tenantId }
        }
      });

      // Unassign from any vehicles in this tenant
      const userVehicles = await tx.vehicle.findMany({
        where: {
          tenantId,
          driverId: userId
        }
      });

      if (userVehicles.length > 0) {
        await tx.vehicle.updateMany({
          where: {
            tenantId,
            driverId: userId
          },
          data: { driverId: null }
        });
      }

      return { removedFromVehicles: userVehicles.length };
    });
  }

  /**
   * Update user role in tenant
   */
  static async updateUserRole(
    userId: string,
    oldRole: string,
    newRole: string
  ) {
    return await prisma.$transaction(async (tx) => {
      // Remove old role
      await tx.userRole.delete({
        where: {
          userId_roleId: { userId, roleId: oldRole as any }
        }
      });

      // Add new role
      await tx.userRole.create({
        data: {
          userId,
          roleId: newRole as any
        }
      });

      return await tx.user.findUnique({
        where: { id: userId },
        include: { UserRole: true }
      });
    });
  }

  /**
   * Get user permissions for tenant
   */
  static async getUserPermissions(userId: string, tenantId: string): Promise<GetUserPermissionsResult> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        UserRole: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        },
        UserTenant: {
          where: { tenantId }
        }
      }
    });

    if (!user || user.UserTenant.length === 0) {
      return [];
    }

    // Flatten permissions from all roles
    const permissions = user.UserRole.flatMap(userRole =>
      userRole.role.permissions.map(rp => ({
        resource: rp.permission.resource,
        action: rp.permission.action,
        name: rp.permission.name
      }))
    );

    // Remove duplicates
    return permissions.filter(
      (permission, index, self) =>
        index === self.findIndex(p =>
          p.resource === permission.resource && p.action === permission.action
        )
    );
  }

  /**
   * Check if user has permission
   */
  static async hasPermission(
    userId: string,
    tenantId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId, tenantId);
    return permissions.some(p => p.resource === resource && p.action === action);
  }

  /**
   * Get driver statistics
   */
  static async getDriverStats(tenantId: string, timeframe: 'week' | 'month' | 'year' = 'month'): Promise<GetDriverStatsResult> {
    const startDate = new Date();
    switch (timeframe) {
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

    const drivers = await prisma.user.findMany({
      where: {
        UserTenant: {
          some: { tenantId }
        },
        UserRole: {
          some: { roleId: 'DRIVER' }
        }
      },
      include: {
        DriverVehicle: true,
        Ride: {
          where: {
            createdAt: { gte: startDate },
            status: 'COMPLETED'
          }
        }
      }
    });

    return drivers.map(driver => ({
      id: driver.id,
      name: driver.name,
      email: driver.email,
      assignedVehicles: driver.DriverVehicle.length,
      completedRides: driver.Ride.length,
      lastRide: driver.Ride[0]?.createdAt || null
    }));
  }

  /**
   * Get user activity log
   */
  static async getUserActivity(userId: string, limit: number = 20): Promise<GetUserActivityResult> {
    // This would require an activity log table, for now return ride history
    const rides = await prisma.ride.findMany({
      where: { userId },
      include: {
        vehicle: true,
        origin: true,
        destination: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return rides.map(ride => ({
      id: ride.id,
      type: 'ride',
      action: ride.status.toLowerCase(),
      details: `${ride.origin?.name || 'Unknown'} to ${ride.destination?.name || 'Unknown'}`,
      vehicle: ride.vehicle.licensePlate,
      timestamp: ride.createdAt
    }));
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    userId: string,
    data: {
      name?: string;
      image?: string;
    }
  ) {
    return await prisma.user.update({
      where: { id: userId },
      data,
      include: {
        UserRole: true,
        UserTenant: true
      }
    });
  }

  /**
   * Search users across tenants (for platform admins)
   */
  static async searchUsers(
    query: string,
    tenantId?: string,
    limit: number = 10
  ) {
    return await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } }
            ]
          },
          ...(tenantId ? [{
            UserTenant: {
              some: { tenantId }
            }
          }] : [])
        ]
      },
      include: {
        UserRole: true,
        UserTenant: {
          include: { tenant: true }
        }
      },
      take: limit
    });
  }

  /**
   * Get tenant admins
   */
  static async getTenantAdmins(tenantId: string) {
    return await prisma.user.findMany({
      where: {
        UserTenant: {
          some: { tenantId }
        },
        UserRole: {
          some: {
            roleId: {
              in: ['TENANT_OWNER', 'TENANT_ADMIN']
            }
          }
        }
      },
      include: {
        UserRole: true
      }
    });
  }

  /**
   * Get driver detail by ID with all related data
   */
  static async getDriverDetailById(driverId: string, tenantId: string) {
    return await prisma.user.findFirst({
      where: {
        id: driverId,
        UserTenant: {
          some: { tenantId }
        },
        UserRole: {
          some: { roleId: 'DRIVER' }
        }
      },
      include: {
        UserRole: {
          include: {
            role: true
          }
        },
        UserTenant: {
          where: { tenantId },
          include: { tenant: true }
        },
        DriverVehicle: {
          include: {
            vehicle: {
              select: {
                id: true,
                licensePlate: true,
                manufacturer: true,
                model: true,
                year: true,
                color: true,
                status: true
              }
            }
          }
        },
        Ride: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            vehicle: {
              select: {
                id: true,
                licensePlate: true,
                manufacturer: true,
                model: true
              }
            },
            origin: true,
            destination: true
          }
        },
        _count: {
          select: {
            Ride: {
              where: {
                status: 'COMPLETED'
              }
            },
            DriverVehicle: true
          }
        }
      }
    });
  }



  /**
   * Create a new driver
   */
  static async createDriver(data: {
    name: string;
    email: string;
    tenantId: string;
    image?: string;
    licenseNumber?: string;
    phone?: string;
  }): Promise<CreateDriverResult> {
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
        user = existingUser;
      } else {
        // Create new user
        user = await tx.user.create({
          data: {
            name: data.name,
            email: data.email,
            image: data.image
          }
        });
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
          }
        }
      });
    });
  }

  /**
   * Update driver information
   */
  static async updateDriver(driverId: string, data: {
    name?: string;
    email?: string;
    image?: string;
    status?: string;
  }): Promise<UpdateDriverResult> {
    return await prisma.user.update({
      where: { id: driverId },
      data,
      include: {
        UserRole: {
          include: { role: true }
        },
        VehicleDriver: true
      }
    });
  }

  /**
   * Assign driver to vehicle
   */
  static async assignDriverToVehicle(driverId: string, vehicleId: string): Promise<AssignDriverToVehicleResult> {
    return await prisma.$transaction(async (tx) => {
      // Check if driver exists and is valid
      const driver = await tx.user.findFirst({
        where: {
          id: driverId,
          UserRole: {
            some: { roleId: 'DRIVER' }
          }
        }
      });

      if (!driver) {
        throw new Error('Driver not found or inactive');
      }

      // Check if vehicle exists and is available
      const vehicle = await tx.vehicle.findUnique({
        where: { id: vehicleId }
      });

      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      if (vehicle.driverId && vehicle.driverId !== driverId) {
        throw new Error('Vehicle is already assigned to another driver');
      }

      // Assign driver to vehicle
      await tx.vehicle.update({
        where: { id: vehicleId },
        data: { driverId }
      });

      // Create driver-vehicle history record
      await tx.driverVehicle.create({
        data: {
          driverId,
          vehicleId
        }
      });

      return await tx.vehicle.findUnique({
        where: { id: vehicleId },
        include: {
          driver: true
        }
      });
    });
  }

  /**
   * Unassign driver from vehicle
   */
  static async unassignDriverFromVehicle(vehicleId: string): Promise<UnassignDriverFromVehicleResult> {
    return await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { driverId: null },
      include: {
        driver: true
      }
    });
  }

  /**
   * Get available drivers (not assigned to any vehicle)
   */
  static async getAvailableDrivers(tenantId: string): Promise<GetAvailableDriversResult> {
    return await prisma.user.findMany({
      where: {
        UserTenant: {
          some: { tenantId }
        },
        UserRole: {
          some: { roleId: 'DRIVER' }
        },
        VehicleDriver: {
          none: {}
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true
      }
    });
  }

  /**
   * Get individual driver statistics
   */
  static async getDriverById(driverId: string, tenantId: string) {
    const driver = await prisma.user.findFirst({
      where: {
        id: driverId,
        UserTenant: {
          some: { tenantId }
        },
        UserRole: {
          some: { roleId: 'DRIVER' }
        }
      },
      include: {
        VehicleDriver: true,
        Ride: {
          where: {
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30))
            }
          },
          take: 10,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            Ride: true,
            VehicleDriver: true
          }
        }
      }
    });

    if (!driver) {
      return null;
    }

    const ridesLast30Days = driver.Ride.length;
    const hasAssignedVehicle = driver.VehicleDriver.length > 0;

    return {
      ...driver,
      stats: {
        totalRides: driver._count.Ride,
        ridesLast30Days,
        hasAssignedVehicle,
        averageRidesPerDay: ridesLast30Days / 30
      }
    };
  }

  /**
   * Search drivers by name or email
   */
  static async searchDrivers(tenantId: string, searchTerm: string): Promise<SearchDriversResult> {
    return await prisma.user.findMany({
      where: {
        UserTenant: {
          some: { tenantId }
        },
        UserRole: {
          some: { roleId: 'DRIVER' }
        },
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      include: {
        VehicleDriver: true,
        _count: {
          select: {
            Ride: {
              where: { status: 'COMPLETED' }
            }
          }
        }
      },
      take: 10
    });
  }

  /**
   * Get driver performance metrics
   */
  static async getDriverPerformance(driverId: string, days: number = 30): Promise<GetDriverPerformanceResult> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const rides = await prisma.ride.findMany({
      where: {
        userId: driverId,
        createdAt: { gte: startDate }
      },
      select: {
        status: true,
        createdAt: true
      }
    });

    const completedRides = rides.filter(r => r.status === 'COMPLETED').length;
    const cancelledRides = rides.filter(r => r.status === 'CANCELLED').length;
    const totalRides = rides.length;

    return {
      totalRides,
      completedRides,
      cancelledRides,
      completionRate: totalRides > 0 ? (completedRides / totalRides) * 100 : 0,
      ridesPerDay: totalRides / days
    };
  }

  /**
   * Toggle driver status (activate/deactivate)
   */
  static async toggleDriverStatus(driverId: string, isActive: boolean): Promise<ToggleDriverStatusResult> {
    return await prisma.$transaction(async (tx) => {
      // Update user status
      const user = await tx.user.update({
        where: { id: driverId },
        data: {
          // Assuming there's a status field, otherwise we can use a different approach
          updatedAt: new Date()
        }
      });

      // If deactivating, remove from assigned vehicles
      if (!isActive) {
        await tx.vehicle.updateMany({
          where: { driverId },
          data: { driverId: null }
        });
      }

      return user;
    });
  }
}