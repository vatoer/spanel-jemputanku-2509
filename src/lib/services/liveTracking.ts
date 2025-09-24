import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export class LiveTrackingService {
  /**
   * Start a new trip - Driver initiates the journey
   */
  static async startTrip(data: {
    routeId: string;
    vehicleId: string;
    driverId: string;
    scheduledStart: Date;
    scheduledEnd: Date;
    maxCapacity?: number;
  }) {
    return await prisma.$transaction(async (tx) => {
      // Check if driver is already on an active trip
      const activeTrip = await tx.trip.findFirst({
        where: {
          driverId: data.driverId,
          status: {
            in: ['STARTED', 'IN_PROGRESS', 'PAUSED']
          }
        }
      });

      if (activeTrip) {
        throw new Error('Driver is already on an active trip');
      }

      // Check if vehicle is available
      const vehicleInUse = await tx.trip.findFirst({
        where: {
          vehicleId: data.vehicleId,
          status: {
            in: ['STARTED', 'IN_PROGRESS', 'PAUSED']
          }
        }
      });

      if (vehicleInUse) {
        throw new Error('Vehicle is already in use by another trip');
      }

      // Get route details to determine capacity
      const route = await tx.route.findUnique({
        where: { id: data.routeId },
        include: {
          RoutePoint: {
            orderBy: { order: 'asc' }
          }
        }
      });

      if (!route) {
        throw new Error('Route not found');
      }

      // Get vehicle capacity if not provided
      let maxCapacity = data.maxCapacity;
      if (!maxCapacity) {
        const vehicle = await tx.vehicle.findUnique({
          where: { id: data.vehicleId }
        });
        maxCapacity = vehicle?.capacity || 50;
      }

      // Create the trip
      const trip = await tx.trip.create({
        data: {
          routeId: data.routeId,
          vehicleId: data.vehicleId,
          driverId: data.driverId,
          scheduledStart: data.scheduledStart,
          scheduledEnd: data.scheduledEnd,
          actualStart: new Date(),
          status: 'STARTED',
          maxCapacity,
          currentStopIndex: 0
        },
        include: {
          route: {
            include: {
              RoutePoint: {
                orderBy: { order: 'asc' }
              }
            }
          },
          vehicle: true,
          driver: true
        }
      });

      // Create trip stops for all route points
      const tripStops = await Promise.all(
        route.RoutePoint.map((point, index) => {
          const estimatedTime = new Date(data.scheduledStart);
          estimatedTime.setMinutes(estimatedTime.getMinutes() + (index * 10)); // 10 min between stops

          return tx.tripStop.create({
            data: {
              tripId: trip.id,
              routePointId: point.id,
              scheduledAt: estimatedTime,
              status: index === 0 ? 'ARRIVED' : 'PENDING'
            }
          });
        })
      );

      // Start driver shift
      await tx.driverShift.create({
        data: {
          driverId: data.driverId,
          vehicleId: data.vehicleId,
          checkInAt: new Date(),
          status: 'ACTIVE',
          location: route.RoutePoint[0]?.name || 'Starting point'
        }
      });

      return { ...trip, tripStops };
    });
  }

  /**
   * Update vehicle location during trip
   */
  static async updateVehicleLocation(data: {
    tripId: string;
    vehicleId: string;
    latitude: number;
    longitude: number;
    speed?: number;
    heading?: number;
    accuracy?: number;
  }) {
    return await prisma.$transaction(async (tx) => {
      // Verify trip is active
      const trip = await tx.trip.findUnique({
        where: { id: data.tripId },
        include: {
          route: {
            include: {
              RoutePoint: {
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      });

      if (!trip || !['STARTED', 'IN_PROGRESS'].includes(trip.status)) {
        throw new Error('Trip is not active');
      }

      // Create location record
      const location = await tx.vehicleLocation.create({
        data: {
          tripId: data.tripId,
          vehicleId: data.vehicleId,
          latitude: data.latitude,
          longitude: data.longitude,
          speed: data.speed,
          heading: data.heading,
          accuracy: data.accuracy
        }
      });

      // Check if vehicle is near any upcoming stops
      const currentStop = trip.route.RoutePoint[trip.currentStopIndex];
      if (currentStop) {
        const distance = this.calculateDistance(
          data.latitude,
          data.longitude,
          currentStop.latitude,
          currentStop.longitude
        );

        // If within 100 meters, mark as arrived
        if (distance <= 0.1) { // 0.1 km = 100 meters
          await this.arriveAtStop(data.tripId, currentStop.id);
        }
      }

      return location;
    });
  }

  /**
   * Mark arrival at a stop
   */
  static async arriveAtStop(tripId: string, routePointId: string) {
    return await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { id: tripId },
        include: {
          route: {
            include: {
              RoutePoint: {
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      });

      if (!trip) {
        throw new Error('Trip not found');
      }

      // Update trip stop
      const tripStop = await tx.tripStop.update({
        where: {
          tripId_routePointId: {
            tripId,
            routePointId
          }
        },
        data: {
          arrivedAt: new Date(),
          status: 'ARRIVED'
        },
        include: {
          routePoint: true
        }
      });

      // Calculate delay
      const scheduledTime = tripStop.scheduledAt;
      const actualTime = tripStop.arrivedAt!;
      const delayMinutes = Math.round((actualTime.getTime() - scheduledTime.getTime()) / (1000 * 60));

      // Update delay
      await tx.tripStop.update({
        where: {
          tripId_routePointId: {
            tripId,
            routePointId
          }
        },
        data: { delay: delayMinutes }
      });

      // Update trip status if this is the first stop
      if (trip.status === 'STARTED') {
        await tx.trip.update({
          where: { id: tripId },
          data: { status: 'IN_PROGRESS' }
        });
      }

      return tripStop;
    });
  }

  /**
   * Depart from a stop
   */
  static async departFromStop(
    tripId: string,
    routePointId: string,
    passengerBoarded: number = 0,
    passengerAlighted: number = 0
  ) {
    return await prisma.$transaction(async (tx) => {
      // Update trip stop
      const tripStop = await tx.tripStop.update({
        where: {
          tripId_routePointId: {
            tripId,
            routePointId
          }
        },
        data: {
          departedAt: new Date(),
          status: 'DEPARTED',
          passengerBoarded,
          passengerAlighted
        }
      });

      // Update trip passenger count and current stop index
      const trip = await tx.trip.findUnique({
        where: { id: tripId },
        include: {
          route: {
            include: {
              RoutePoint: {
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      });

      if (trip) {
        const newPassengerCount = Math.max(0, 
          trip.passengerCount + passengerBoarded - passengerAlighted
        );
        
        const currentStopOrder = trip.route.RoutePoint.findIndex(
          p => p.id === routePointId
        );
        
        await tx.trip.update({
          where: { id: tripId },
          data: {
            passengerCount: newPassengerCount,
            currentStopIndex: Math.min(currentStopOrder + 1, trip.route.RoutePoint.length - 1)
          }
        });
      }

      return tripStop;
    });
  }

  /**
   * Complete a trip
   */
  static async completeTrip(tripId: string, notes?: string) {
    return await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.update({
        where: { id: tripId },
        data: {
          actualEnd: new Date(),
          status: 'COMPLETED',
          notes
        },
        include: {
          driver: true,
          vehicle: true,
          route: true
        }
      });

      // End driver shift
      await tx.driverShift.updateMany({
        where: {
          driverId: trip.driverId,
          vehicleId: trip.vehicleId,
          status: 'ACTIVE'
        },
        data: {
          checkOutAt: new Date(),
          status: 'COMPLETED'
        }
      });

      // Mark any remaining stops as skipped
      await tx.tripStop.updateMany({
        where: {
          tripId,
          status: 'PENDING'
        },
        data: {
          status: 'SKIPPED'
        }
      });

      return trip;
    });
  }

  /**
   * Get real-time trip status
   */
  static async getTripStatus(tripId: string) {
    return await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        route: {
          include: {
            RoutePoint: {
              orderBy: { order: 'asc' }
            }
          }
        },
        vehicle: true,
        driver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tripStops: {
          include: {
            routePoint: true
          },
          orderBy: {
            routePoint: {
              order: 'asc'
            }
          }
        },
        locations: {
          orderBy: { timestamp: 'desc' },
          take: 1
        },
        rides: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
  }

  /**
   * Get active trips for a tenant
   */
  static async getActiveTrips(tenantId: string) {
    return await prisma.trip.findMany({
      where: {
        vehicle: { tenantId },
        status: {
          in: ['STARTED', 'IN_PROGRESS', 'PAUSED']
        }
      },
      include: {
        route: true,
        vehicle: true,
        driver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        locations: {
          orderBy: { timestamp: 'desc' },
          take: 1
        },
        _count: {
          select: {
            rides: true
          }
        }
      },
      orderBy: { scheduledStart: 'asc' }
    });
  }

  /**
   * Get vehicle location history
   */
  static async getVehicleLocationHistory(
    vehicleId: string,
    startDate?: Date,
    endDate?: Date,
    limit: number = 100
  ) {
    const where: Prisma.VehicleLocationWhereInput = { vehicleId };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = startDate;
      if (endDate) where.timestamp.lte = endDate;
    }

    return await prisma.vehicleLocation.findMany({
      where,
      include: {
        trip: {
          include: {
            route: true
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: limit
    });
  }

  /**
   * Get driver's current shift
   */
  static async getDriverCurrentShift(driverId: string) {
    return await prisma.driverShift.findFirst({
      where: {
        driverId,
        status: 'ACTIVE'
      },
      include: {
        vehicle: true
      }
    });
  }

  /**
   * Emergency stop - pause trip
   */
  static async emergencyStop(tripId: string, reason: string) {
    return await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.update({
        where: { id: tripId },
        data: {
          status: 'PAUSED',
          notes: reason
        }
      });

      // Update driver shift to emergency
      await tx.driverShift.updateMany({
        where: {
          driverId: trip.driverId,
          status: 'ACTIVE'
        },
        data: {
          status: 'EMERGENCY',
          notes: reason
        }
      });

      return trip;
    });
  }

  /**
   * Resume trip from pause
   */
  static async resumeTrip(tripId: string) {
    return await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.update({
        where: { id: tripId },
        data: { status: 'IN_PROGRESS' }
      });

      // Resume driver shift
      await tx.driverShift.updateMany({
        where: {
          driverId: trip.driverId,
          status: 'EMERGENCY'
        },
        data: {
          status: 'ACTIVE',
          notes: null
        }
      });

      return trip;
    });
  }

  /**
   * Get trip analytics
   */
  static async getTripAnalytics(
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

    const trips = await prisma.trip.findMany({
      where: {
        vehicle: { tenantId },
        createdAt: { gte: startDate }
      },
      include: {
        tripStops: true
      }
    });

    const analytics = {
      totalTrips: trips.length,
      completedTrips: trips.filter(t => t.status === 'COMPLETED').length,
      cancelledTrips: trips.filter(t => t.status === 'CANCELLED').length,
      activeTrips: trips.filter(t => ['STARTED', 'IN_PROGRESS'].includes(t.status)).length,
      averageDelay: 0,
      onTimePerformance: 0,
      totalPassengers: trips.reduce((sum, t) => sum + (t.passengerCount || 0), 0)
    };

    // Calculate delay statistics
    const completedStops = trips.flatMap(t => t.tripStops).filter(s => s.arrivedAt);
    if (completedStops.length > 0) {
      const totalDelay = completedStops.reduce((sum, stop) => sum + stop.delay, 0);
      analytics.averageDelay = Math.round(totalDelay / completedStops.length);
      
      const onTimeStops = completedStops.filter(s => s.delay <= 5).length; // <= 5 min is on time
      analytics.onTimePerformance = Math.round((onTimeStops / completedStops.length) * 100);
    }

    return analytics;
  }

  /**
   * Calculate distance between two GPS coordinates (Haversine formula)
   */
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}