import { prisma } from "@/lib/prisma";
import { AssignDriverToVehicleResult, CreateDriverResult, GetAvailableDriversResult, GetDriverPerformanceResult, GetDriversByTenantResult, GetDriverStatsResult, SearchDriversResult, ToggleDriverStatusResult, UnassignDriverFromVehicleResult, UpdateDriverResult } from "@/types/user.types";




/**
 * Get all drivers for a tenant
 */
export async function getDriversByTenant(tenantId: string): Promise<GetDriversByTenantResult> {
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
 * Get driver statistics
 */
export async function getDriverStats(tenantId: string, timeframe: 'week' | 'month' | 'year' = 'month'): Promise<GetDriverStatsResult> {
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
   * Get driver detail by ID with all related data
   */
  export async function getDriverDetailById(driverId: string, tenantId: string) {
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
    export async function createDriver(data: {
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
export async function updateDriver(driverId: string, data: {
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
export async function assignDriverToVehicle(driverId: string, vehicleId: string): Promise<AssignDriverToVehicleResult> {
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
export async function unassignDriverFromVehicle(vehicleId: string): Promise<UnassignDriverFromVehicleResult> {
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
export async function getAvailableDrivers(tenantId: string): Promise<GetAvailableDriversResult> {
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
export async function getDriverById(driverId: string, tenantId: string) {
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
export async function searchDrivers(tenantId: string, searchTerm: string): Promise<SearchDriversResult> {
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
export async function getDriverPerformance(driverId: string, days: number = 30): Promise<GetDriverPerformanceResult> {
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
export async function toggleDriverStatus(driverId: string, isActive: boolean): Promise<ToggleDriverStatusResult> {
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
