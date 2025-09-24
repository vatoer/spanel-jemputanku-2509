import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export class SubscriptionService {
  /**
   * Get current subscription limits for a tenant
   */
  static async getCurrentLimits(tenantId: string) {
    const activeSubscription = await prisma.tenantSubscription.findFirst({
      where: { 
        tenantId,
        status: 'ACTIVE',
        startDate: { lte: new Date() },
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } }
        ]
      },
      include: { plan: true }
    });

    if (!activeSubscription) {
      throw new Error('No active subscription found');
    }

    return {
      maxVehicles: activeSubscription.maxVehiclesAtTime || activeSubscription.plan.maxVehicles || 0,
      maxDrivers: activeSubscription.maxDriversAtTime || activeSubscription.plan.maxDrivers || 0,
      maxRoutes: activeSubscription.maxRoutesAtTime || activeSubscription.plan.maxRoutes || 0,
      subscription: activeSubscription
    };
  }

  /**
   * Check if tenant can add more vehicles
   */
  static async canAddVehicle(tenantId: string): Promise<boolean> {
    try {
      const limits = await this.getCurrentLimits(tenantId);
      const currentCount = await prisma.vehicle.count({ where: { tenantId } });
      
      return currentCount < limits.maxVehicles;
    } catch {
      return false;
    }
  }

  /**
   * Check if tenant can add more drivers
   */
  static async canAddDriver(tenantId: string): Promise<boolean> {
    try {
      const limits = await this.getCurrentLimits(tenantId);
      const currentCount = await prisma.userTenant.count({ 
        where: { 
          tenantId,
          user: { UserRole: { some: { roleId: 'DRIVER' } } }
        }
      });
      
      return currentCount < limits.maxDrivers;
    } catch {
      return false;
    }
  }

  /**
   * Check if tenant can add more routes
   */
  static async canAddRoute(tenantId: string): Promise<boolean> {
    try {
      const limits = await this.getCurrentLimits(tenantId);
      const currentCount = await prisma.route.count({ where: { tenantId } });
      
      return currentCount < limits.maxRoutes;
    } catch {
      return false;
    }
  }

  /**
   * Change tenant subscription plan
   */
  static async changeSubscription(tenantId: string, newPlanId: string) {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // End current subscription
      await tx.tenantSubscription.updateMany({
        where: { tenantId, status: 'ACTIVE' },
        data: { 
          endDate: new Date(), 
          status: 'CANCELLED'
        }
      });

      // Get new plan details
      const newPlan = await tx.subscriptionPlan.findUnique({ 
        where: { id: newPlanId } 
      });

      if (!newPlan) {
        throw new Error('Plan not found');
      }

      // Create new subscription with plan snapshot
      const newSubscription = await tx.tenantSubscription.create({
        data: {
          tenantId,
          planId: newPlanId,
          startDate: new Date(),
          maxVehiclesAtTime: newPlan.maxVehicles,
          maxDriversAtTime: newPlan.maxDrivers,
          maxRoutesAtTime: newPlan.maxRoutes,
          priceAtTime: newPlan.price,
          status: 'ACTIVE'
        }
      });

      // Update tenant status
      await tx.tenant.update({
        where: { id: tenantId },
        data: { status: 'ACTIVE' }
      });

      return newSubscription;
    });
  }

  /**
   * Check and handle expired subscriptions
   */
  static async checkExpiredSubscriptions() {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Mark expired subscriptions
      await tx.tenantSubscription.updateMany({
        where: {
          endDate: { lt: new Date() },
          status: 'ACTIVE'
        },
        data: { status: 'EXPIRED' }
      });

      // Update tenant status for tenants with no active subscriptions
      const tenantsToUpdate = await tx.tenant.findMany({
        where: {
          subscriptions: {
            every: { 
              OR: [
                { status: 'EXPIRED' },
                { status: 'CANCELLED' }
              ]
            }
          }
        }
      });

      for (const tenant of tenantsToUpdate) {
        await tx.tenant.update({
          where: { id: tenant.id },
          data: { status: 'EXPIRED' }
        });
      }

      return tenantsToUpdate.length;
    });
  }

  /**
   * Get subscription usage statistics
   */
  static async getUsageStats(tenantId: string) {
    const [limits, vehicleCount, driverCount, routeCount] = await Promise.all([
      this.getCurrentLimits(tenantId),
      prisma.vehicle.count({ where: { tenantId } }),
      prisma.userTenant.count({ 
        where: { 
          tenantId,
          user: { UserRole: { some: { roleId: 'DRIVER' } } }
        }
      }),
      prisma.route.count({ where: { tenantId } })
    ]);

    return {
      vehicles: {
        current: vehicleCount,
        limit: limits.maxVehicles,
        percentage: Math.round((vehicleCount / limits.maxVehicles) * 100)
      },
      drivers: {
        current: driverCount,
        limit: limits.maxDrivers,
        percentage: Math.round((driverCount / limits.maxDrivers) * 100)
      },
      routes: {
        current: routeCount,
        limit: limits.maxRoutes,
        percentage: Math.round((routeCount / limits.maxRoutes) * 100)
      }
    };
  }
}