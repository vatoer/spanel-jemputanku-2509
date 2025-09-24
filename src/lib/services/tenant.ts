import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export class TenantService {
  /**
   * Get all tenants with pagination
   */
  static async getAllTenants(options?: {
    status?: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'EXPIRED' | 'CANCELLED';
    limit?: number;
    offset?: number;
    search?: string;
  }) {
    const where: Prisma.TenantWhereInput = {};

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { domain: { contains: options.search, mode: 'insensitive' } }
      ];
    }

    return await prisma.tenant.findMany({
      where,
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            plan: true
          }
        },
        _count: {
          select: {
            UserTenant: true,
            Vehicle: true,
            Route: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 50,
      skip: options?.offset || 0
    });
  }

  /**
   * Get tenant by ID with full details
   */
  static async getTenantById(tenantId: string) {
    return await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          include: {
            plan: true,
            payments: {
              orderBy: { createdAt: 'desc' },
              take: 5
            }
          }
        },
        UserTenant: {
          include: {
            user: true
          }
        },
        Vehicle: {
          include: {
            driver: true,
            vehicleRouteAssignments: {
              include: {
                route: true
              }
            },
            _count: {
              select: { rides: true }
            }
          }
        },
        Route: {
          include: {
            vehicleRouteAssignments: {
              include: {
                vehicle: true
              }
            }
          }
        },
        _count: {
          select: {
            UserTenant: true,
            Vehicle: true,
            Route: true
          }
        }
      }
    });
  }

  /**
   * Create new tenant
   */
  static async createTenant(data: {
    name: string;
    domain: string;
    subscriptionPlanId?: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      // Create tenant
      const tenant = await tx.tenant.create({
        data: {
          name: data.name,
          domain: data.domain,
          status: 'ACTIVE'
        }
      });

      // Create initial subscription if plan provided
      if (data.subscriptionPlanId) {
        const plan = await tx.subscriptionPlan.findUnique({
          where: { id: data.subscriptionPlanId }
        });

        if (plan) {
          await tx.tenantSubscription.create({
            data: {
              tenantId: tenant.id,
              planId: plan.id,
              status: 'TRIAL',
              startDate: new Date(),
              trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
              maxVehiclesAtTime: plan.maxVehicles,
              maxDriversAtTime: plan.maxDrivers,
              maxRoutesAtTime: plan.maxRoutes,
              priceAtTime: plan.price
            }
          });
        }
      }

      return await tx.tenant.findUnique({
        where: { id: tenant.id },
        include: {
          subscriptions: {
            include: {
              plan: true
            }
          }
        }
      });
    });
  }

  /**
   * Update tenant information
   */
  static async updateTenant(
    tenantId: string,
    data: {
      name?: string;
      domain?: string;
      status?: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'EXPIRED' | 'CANCELLED';
    }
  ) {
    return await prisma.tenant.update({
      where: { id: tenantId },
      data,
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            plan: true
          }
        },
        _count: {
          select: {
            UserTenant: true,
            Vehicle: true,
            Route: true
          }
        }
      }
    });
  }

  /**
   * Suspend tenant (soft delete with data preservation)
   */
  static async suspendTenant(tenantId: string, reason?: string) {
    return await prisma.$transaction(async (tx) => {
      // Update tenant status
      const tenant = await tx.tenant.update({
        where: { id: tenantId },
        data: { 
          status: 'SUSPENDED'
        }
      });

      // Cancel active rides
      await tx.ride.updateMany({
        where: {
          vehicle: { tenantId },
          status: {
            in: ['BOOKED', 'SCHEDULED', 'IN_PROGRESS']
          }
        },
        data: { status: 'CANCELLED' }
      });

      return tenant;
    });
  }

  /**
   * Reactivate suspended tenant
   */
  static async reactivateTenant(tenantId: string) {
    return await prisma.tenant.update({
      where: { id: tenantId },
      data: { status: 'ACTIVE' },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            plan: true
          }
        }
      }
    });
  }

  /**
   * Delete tenant (hard delete - use with caution)
   */
  static async deleteTenant(tenantId: string) {
    return await prisma.$transaction(async (tx) => {
      // Delete in order due to foreign key constraints
      await tx.ride.deleteMany({
        where: { vehicle: { tenantId } }
      });

      await tx.vehicleServiceRecord.deleteMany({
        where: { vehicle: { tenantId } }
      });

      await tx.vehicleRouteAssignment.deleteMany({
        where: { vehicle: { tenantId } }
      });

      await tx.driverVehicle.deleteMany({
        where: { vehicle: { tenantId } }
      });

      await tx.vehicle.deleteMany({
        where: { tenantId }
      });

      await tx.routePoint.deleteMany({
        where: { route: { tenantId } }
      });

      await tx.route.deleteMany({
        where: { tenantId }
      });

      await tx.subscriptionPayment.deleteMany({
        where: { subscription: { tenantId } }
      });

      await tx.tenantSubscription.deleteMany({
        where: { tenantId }
      });

      await tx.userTenant.deleteMany({
        where: { tenantId }
      });

      return await tx.tenant.delete({
        where: { id: tenantId }
      });
    });
  }

  /**
   * Get tenant statistics
   */
  static async getTenantStats(tenantId: string) {
    const [
      userCount,
      vehicleCount,
      routeCount,
      activeRides,
      totalRides,
      recentPayments
    ] = await Promise.all([
      prisma.userTenant.count({ where: { tenantId } }),
      prisma.vehicle.count({ where: { tenantId } }),
      prisma.route.count({ where: { tenantId } }),
      prisma.ride.count({
        where: {
          vehicle: { tenantId },
          status: 'IN_PROGRESS'
        }
      }),
      prisma.ride.count({
        where: { vehicle: { tenantId } }
      }),
      prisma.subscriptionPayment.findMany({
        where: { subscription: { tenantId } },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    const subscription = await prisma.tenantSubscription.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      include: {
        plan: true
      }
    });

    return {
      users: userCount,
      vehicles: vehicleCount,
      routes: routeCount,
      activeRides,
      totalRides,
      subscription,
      recentPayments
    };
  }

  /**
   * Check if tenant can perform action based on subscription limits
   */
  static async checkTenantLimits(
    tenantId: string,
    action: 'ADD_USER' | 'ADD_VEHICLE' | 'ADD_ROUTE'
  ) {
    const subscription = await prisma.tenantSubscription.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    });

    if (!subscription || subscription.status !== 'ACTIVE') {
      return {
        allowed: false,
        reason: 'No active subscription'
      };
    }

    const stats = await this.getTenantStats(tenantId);

    switch (action) {
      case 'ADD_USER':
        if (subscription.maxDriversAtTime && stats.users >= subscription.maxDriversAtTime) {
          return {
            allowed: false,
            reason: `User limit reached (${subscription.maxDriversAtTime})`
          };
        }
        break;

      case 'ADD_VEHICLE':
        if (subscription.maxVehiclesAtTime && stats.vehicles >= subscription.maxVehiclesAtTime) {
          return {
            allowed: false,
            reason: `Vehicle limit reached (${subscription.maxVehiclesAtTime})`
          };
        }
        break;

      case 'ADD_ROUTE':
        if (subscription.maxRoutesAtTime && stats.routes >= subscription.maxRoutesAtTime) {
          return {
            allowed: false,
            reason: `Route limit reached (${subscription.maxRoutesAtTime})`
          };
        }
        break;
    }

    return { allowed: true };
  }

  /**
   * Get tenants with expiring subscriptions
   */
  static async getTenantsWithExpiringSubscriptions(daysAhead: number = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

    return await prisma.tenant.findMany({
      where: {
        subscriptions: {
          some: {
            endDate: {
              lte: cutoffDate
            },
            status: 'ACTIVE'
          }
        }
      },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE'
          },
          include: {
            plan: true
          }
        }
      }
    });
  }

  /**
   * Get tenant activity summary
   */
  static async getTenantActivity(
    tenantId: string,
    timeframe: 'day' | 'week' | 'month' = 'month'
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
    }

    const [newUsers, newRides, completedRides, revenue] = await Promise.all([
      prisma.userTenant.count({
        where: {
          tenantId,
          user: {
            createdAt: { gte: startDate }
          }
        }
      }),
      prisma.ride.count({
        where: {
          vehicle: { tenantId },
          createdAt: { gte: startDate }
        }
      }),
      prisma.ride.count({
        where: {
          vehicle: { tenantId },
          status: 'COMPLETED',
          endTime: { gte: startDate }
        }
      }),
      prisma.subscriptionPayment.aggregate({
        where: {
          subscription: { tenantId },
          status: 'PAID',
          createdAt: { gte: startDate }
        },
        _sum: { amount: true }
      })
    ]);

    return {
      newUsers,
      newRides,
      completedRides,
      revenue: revenue._sum.amount || 0,
      timeframe
    };
  }

  /**
   * Get all tenants by subscription tier
   */
  static async getTenantsByPlan(planId: string) {
    return await prisma.tenant.findMany({
      where: {
        subscriptions: {
          some: {
            planId,
            status: 'ACTIVE'
          }
        }
      },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE'
          },
          include: {
            plan: true
          }
        },
        _count: {
          select: {
            UserTenant: true,
            Vehicle: true,
            Route: true
          }
        }
      }
    });
  }

  /**
   * Bulk update tenant statuses
   */
  static async bulkUpdateTenantStatus(
    tenantIds: string[],
    status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'EXPIRED' | 'CANCELLED'
  ) {
    return await prisma.tenant.updateMany({
      where: {
        id: { in: tenantIds }
      },
      data: { status }
    });
  }

  /**
   * Search tenants with advanced filters
   */
  static async searchTenants(filters: {
    name?: string;
    domain?: string;
    status?: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'EXPIRED' | 'CANCELLED';
    planId?: string;
    subscriptionStatus?: 'ACTIVE' | 'TRIAL' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED' | 'PAUSED';
    minUsers?: number;
    maxUsers?: number;
    minVehicles?: number;
    maxVehicles?: number;
    createdAfter?: Date;
    createdBefore?: Date;
  }) {
    const where: Prisma.TenantWhereInput = {};

    if (filters.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }

    if (filters.domain) {
      where.domain = { contains: filters.domain, mode: 'insensitive' };
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.planId || filters.subscriptionStatus) {
      where.subscriptions = {
        some: {
          ...(filters.planId && { planId: filters.planId }),
          ...(filters.subscriptionStatus && { status: filters.subscriptionStatus })
        }
      };
    }

    if (filters.createdAfter || filters.createdBefore) {
      where.createdAt = {};
      if (filters.createdAfter) where.createdAt.gte = filters.createdAfter;
      if (filters.createdBefore) where.createdAt.lte = filters.createdBefore;
    }

    const tenants = await prisma.tenant.findMany({
      where,
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            plan: true
          }
        },
        _count: {
          select: {
            UserTenant: true,
            Vehicle: true,
            Route: true
          }
        }
      }
    });

    // Filter by user/vehicle counts (done in memory since Prisma doesn't support count filtering directly)
    return tenants.filter(tenant => {
      if (filters.minUsers && tenant._count.UserTenant < filters.minUsers) return false;
      if (filters.maxUsers && tenant._count.UserTenant > filters.maxUsers) return false;
      if (filters.minVehicles && tenant._count.Vehicle < filters.minVehicles) return false;
      if (filters.maxVehicles && tenant._count.Vehicle > filters.maxVehicles) return false;
      return true;
    });
  }

  /**
   * Get tenant resource usage summary
   */
  static async getTenantResourceUsage(tenantId: string) {
    const subscription = await prisma.tenantSubscription.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      include: {
        plan: true
      }
    });

    if (!subscription) {
      throw new Error('No subscription found for tenant');
    }

    const stats = await this.getTenantStats(tenantId);

    return {
      users: {
        current: stats.users,
        limit: subscription.maxDriversAtTime,
        percentage: subscription.maxDriversAtTime ? Math.round((stats.users / subscription.maxDriversAtTime) * 100) : 0
      },
      vehicles: {
        current: stats.vehicles,
        limit: subscription.maxVehiclesAtTime,
        percentage: subscription.maxVehiclesAtTime ? Math.round((stats.vehicles / subscription.maxVehiclesAtTime) * 100) : 0
      },
      routes: {
        current: stats.routes,
        limit: subscription.maxRoutesAtTime,
        percentage: subscription.maxRoutesAtTime ? Math.round((stats.routes / subscription.maxRoutesAtTime) * 100) : 0
      },
      subscription: {
        plan: subscription.plan.name,
        status: subscription.status,
        price: subscription.priceAtTime || subscription.plan.price,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        trialEndsAt: subscription.trialEndsAt
      }
    };
  }

  /**
   * Add user to tenant
   */
  static async addUserToTenant(userId: string, tenantId: string) {
    // Check limits first
    const limitCheck = await this.checkTenantLimits(tenantId, 'ADD_USER');
    if (!limitCheck.allowed) {
      throw new Error(limitCheck.reason);
    }

    return await prisma.userTenant.create({
      data: {
        userId,
        tenantId
      },
      include: {
        user: true,
        tenant: true
      }
    });
  }

  /**
   * Remove user from tenant
   */
  static async removeUserFromTenant(userId: string, tenantId: string) {
    return await prisma.userTenant.delete({
      where: {
        userId_tenantId: {
          userId,
          tenantId
        }
      }
    });
  }

  /**
   * Get tenant users
   */
  static async getTenantUsers(tenantId: string) {
    return await prisma.userTenant.findMany({
      where: { tenantId },
      include: {
        user: {
          include: {
            UserRole: {
              include: {
                role: true
              }
            }
          }
        }
      }
    });
  }
}