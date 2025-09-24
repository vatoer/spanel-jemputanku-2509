import { prisma } from "@/lib/prisma";

export class RouteService {
  /**
   * Get all routes for a tenant
   */
  static async getRoutesByTenant(
    tenantId: string,
    options?: {
      includePoints?: boolean;
      includeVehicles?: boolean;
      isActive?: boolean;
    }
  ) {
    return await prisma.route.findMany({
      where: { 
        tenantId,
        ...(options?.isActive !== undefined && { isActive: options.isActive })
      },
      include: {
        RoutePoint: options?.includePoints ? {
          orderBy: { order: 'asc' }
        } : false,
        origin: true,
        destination: true,
        vehicleRouteAssignments: options?.includeVehicles ? {
          where: { isActive: true },
          include: { vehicle: true }
        } : false
      },
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Get route by ID with full details
   */
  static async getRouteById(routeId: string) {
    return await prisma.route.findUnique({
      where: { id: routeId },
      include: {
        RoutePoint: {
          orderBy: { order: 'asc' }
        },
        origin: true,
        destination: true,
        vehicleRouteAssignments: {
          where: { isActive: true },
          include: { 
            vehicle: {
              include: { driver: true }
            }
          }
        },
        tenant: true
      }
    });
  }

  /**
   * Create a new route
   */
  static async createRoute(data: {
    tenantId: string;
    name: string;
    description?: string;
    points: Array<{
      latitude: number;
      longitude: number;
      name?: string;
      type: 'ORIGIN' | 'STOP' | 'DESTINATION';
    }>;
  }) {
    return await prisma.$transaction(async (tx) => {
      // Create the route first
      const route = await tx.route.create({
        data: {
          tenantId: data.tenantId,
          name: data.name,
          description: data.description
        }
      });

      // Create route points
      const routePoints = await Promise.all(
        data.points.map((point, index) =>
          tx.routePoint.create({
            data: {
              routeId: route.id,
              latitude: point.latitude,
              longitude: point.longitude,
              order: index,
              name: point.name,
              type: point.type
            }
          })
        )
      );

      // Set origin and destination references
      const origin = routePoints.find(p => data.points[routePoints.indexOf(p)]?.type === 'ORIGIN');
      const destination = routePoints.find(p => data.points[routePoints.indexOf(p)]?.type === 'DESTINATION');

      if (origin || destination) {
        await tx.route.update({
          where: { id: route.id },
          data: {
            originId: origin?.id,
            destinationId: destination?.id
          }
        });
      }

      return await tx.route.findUnique({
        where: { id: route.id },
        include: {
          RoutePoint: { orderBy: { order: 'asc' } },
          origin: true,
          destination: true
        }
      });
    });
  }

  /**
   * Update route points
   */
  static async updateRoutePoints(
    routeId: string,
    points: Array<{
      id?: string; // If updating existing point
      latitude: number;
      longitude: number;
      name?: string;
      type: 'ORIGIN' | 'STOP' | 'DESTINATION';
    }>
  ) {
    return await prisma.$transaction(async (tx) => {
      // Delete existing points
      await tx.routePoint.deleteMany({
        where: { routeId }
      });

      // Create new points
      const routePoints = await Promise.all(
        points.map((point, index) =>
          tx.routePoint.create({
            data: {
              routeId,
              latitude: point.latitude,
              longitude: point.longitude,
              order: index,
              name: point.name,
              type: point.type
            }
          })
        )
      );

      // Update origin and destination references
      const origin = routePoints.find(p => points[routePoints.indexOf(p)]?.type === 'ORIGIN');
      const destination = routePoints.find(p => points[routePoints.indexOf(p)]?.type === 'DESTINATION');

      await tx.route.update({
        where: { id: routeId },
        data: {
          originId: origin?.id || null,
          destinationId: destination?.id || null
        }
      });

      return routePoints;
    });
  }

  /**
   * Add a single route point
   */
  static async addRoutePoint(
    routeId: string,
    point: {
      latitude: number;
      longitude: number;
      name?: string;
      type: 'ORIGIN' | 'STOP' | 'DESTINATION';
      insertAtOrder?: number;
    }
  ) {
    return await prisma.$transaction(async (tx) => {
      const existingPoints = await tx.routePoint.findMany({
        where: { routeId },
        orderBy: { order: 'asc' }
      });

      const insertOrder = point.insertAtOrder ?? existingPoints.length;

      // Shift existing points if inserting in middle
      if (insertOrder < existingPoints.length) {
        await Promise.all(
          existingPoints
            .filter(p => p.order >= insertOrder)
            .map(p => 
              tx.routePoint.update({
                where: { id: p.id },
                data: { order: p.order + 1 }
              })
            )
        );
      }

      const newPoint = await tx.routePoint.create({
        data: {
          routeId,
          latitude: point.latitude,
          longitude: point.longitude,
          order: insertOrder,
          name: point.name,
          type: point.type
        }
      });

      // Update origin/destination if needed
      if (point.type === 'ORIGIN' || point.type === 'DESTINATION') {
        await tx.route.update({
          where: { id: routeId },
          data: {
            ...(point.type === 'ORIGIN' && { originId: newPoint.id }),
            ...(point.type === 'DESTINATION' && { destinationId: newPoint.id })
          }
        });
      }

      return newPoint;
    });
  }

  /**
   * Remove route point
   */
  static async removeRoutePoint(routePointId: string) {
    return await prisma.$transaction(async (tx) => {
      const point = await tx.routePoint.findUnique({
        where: { id: routePointId }
      });

      if (!point) {
        throw new Error('Route point not found');
      }

      // Remove point
      await tx.routePoint.delete({
        where: { id: routePointId }
      });

      // Reorder remaining points
      const remainingPoints = await tx.routePoint.findMany({
        where: { 
          routeId: point.routeId,
          order: { gt: point.order }
        },
        orderBy: { order: 'asc' }
      });

      await Promise.all(
        remainingPoints.map(p =>
          tx.routePoint.update({
            where: { id: p.id },
            data: { order: p.order - 1 }
          })
        )
      );

      // Update route origin/destination if this was one of them
      const route = await tx.route.findUnique({
        where: { id: point.routeId }
      });

      if (route?.originId === routePointId || route?.destinationId === routePointId) {
        await tx.route.update({
          where: { id: point.routeId },
          data: {
            ...(route.originId === routePointId && { originId: null }),
            ...(route.destinationId === routePointId && { destinationId: null })
          }
        });
      }

      return point;
    });
  }

  /**
   * Get route distance and duration (you'd integrate with your directions API)
   */
  static async calculateRouteMetrics(routeId: string) {
    const route = await prisma.route.findUnique({
      where: { id: routeId },
      include: {
        RoutePoint: { orderBy: { order: 'asc' } }
      }
    });

    if (!route || route.RoutePoint.length < 2) {
      return { distance: 0, duration: 0, points: [] };
    }

    // This would integrate with your /api/generate-directions
    // For now, return basic calculation
    return {
      distance: 0, // Calculate using directions API
      duration: 0, // Calculate using directions API
      points: route.RoutePoint
    };
  }

  /**
   * Get routes by origin/destination area
   */
  static async getRoutesByArea(
    tenantId: string,
    bounds: {
      northEast: { lat: number; lng: number };
      southWest: { lat: number; lng: number };
    }
  ) {
    return await prisma.route.findMany({
      where: {
        tenantId,
        isActive: true,
        OR: [
          {
            origin: {
              latitude: {
                gte: bounds.southWest.lat,
                lte: bounds.northEast.lat
              },
              longitude: {
                gte: bounds.southWest.lng,
                lte: bounds.northEast.lng
              }
            }
          },
          {
            destination: {
              latitude: {
                gte: bounds.southWest.lat,
                lte: bounds.northEast.lat
              },
              longitude: {
                gte: bounds.southWest.lng,
                lte: bounds.northEast.lng
              }
            }
          }
        ]
      },
      include: {
        origin: true,
        destination: true,
        vehicleRouteAssignments: {
          where: { isActive: true },
          include: { vehicle: true }
        }
      }
    });
  }

  /**
   * Update route basic info
   */
  static async updateRoute(
    routeId: string,
    data: {
      name?: string;
      description?: string;
      isActive?: boolean;
    }
  ) {
    return await prisma.route.update({
      where: { id: routeId },
      data,
      include: {
        RoutePoint: { orderBy: { order: 'asc' } },
        origin: true,
        destination: true
      }
    });
  }

  /**
   * Duplicate route
   */
  static async duplicateRoute(routeId: string, newName: string) {
    const originalRoute = await prisma.route.findUnique({
      where: { id: routeId },
      include: {
        RoutePoint: { orderBy: { order: 'asc' } }
      }
    });

    if (!originalRoute) {
      throw new Error('Route not found');
    }

    return await this.createRoute({
      tenantId: originalRoute.tenantId,
      name: newName,
      description: `Copy of ${originalRoute.description || originalRoute.name}`,
      points: originalRoute.RoutePoint.map(point => ({
        latitude: point.latitude,
        longitude: point.longitude,
        name: point.name || undefined,
        type: point.type as 'ORIGIN' | 'STOP' | 'DESTINATION'
      }))
    });
  }

  /**
   * Delete route
   */
  static async deleteRoute(routeId: string) {
    return await prisma.$transaction(async (tx) => {
      // Unassign all vehicles
      await tx.vehicleRouteAssignment.updateMany({
        where: { routeId, isActive: true },
        data: { 
          isActive: false,
          unassignedAt: new Date(),
          unassignedBy: 'SYSTEM'
        }
      });

      // Delete route points
      await tx.routePoint.deleteMany({
        where: { routeId }
      });

      // Delete route
      return await tx.route.delete({
        where: { id: routeId }
      });
    });
  }

  /**
   * Get route statistics
   */
  static async getRouteStats(tenantId: string) {
    const routes = await prisma.route.findMany({
      where: { tenantId },
      include: {
        RoutePoint: true,
        vehicleRouteAssignments: {
          where: { isActive: true }
        }
      }
    });

    return {
      totalRoutes: routes.length,
      activeRoutes: routes.filter(r => r.isActive).length,
      routesWithVehicles: routes.filter(r => r.vehicleRouteAssignments.length > 0).length,
      averageStopsPerRoute: routes.reduce((sum, r) => sum + r.RoutePoint.length, 0) / routes.length || 0
    };
  }
}