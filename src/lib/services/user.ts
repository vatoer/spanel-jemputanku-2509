import { prisma } from "@/lib/prisma";

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
  ) {
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
  static async getDriversByTenant(tenantId: string) {
    return await prisma.user.findMany({
      where: {
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
  }) {
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
  static async removeUserFromTenant(userId: string, tenantId: string) {
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
  static async getUserPermissions(userId: string, tenantId: string) {
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
  static async getDriverStats(tenantId: string, timeframe: 'week' | 'month' | 'year' = 'month') {
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
  static async getUserActivity(userId: string, limit: number = 20) {
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
}