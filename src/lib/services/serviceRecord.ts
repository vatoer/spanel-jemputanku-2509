import { prisma } from "@/lib/prisma";
import {
  CreateVehicleServiceRecordData,
  UpdateVehicleServiceRecordData
} from "@/schema/riwayat";


/**
 * Get all service records for a specific vehicle
 */
export async function getServiceRecordsByVehicleId(vehicleId: string) {
  return await prisma.vehicleServiceRecord.findMany({
    where: { vehicleId },
    orderBy: { serviceDate: 'desc' },
    include: {
      vehicle: {
        select: {
          licensePlate: true,
          model: true,
        }
      }
    }
  });
}

/**
 * Get all service records for a vehicle by license plate
 */
export async function getServiceRecordsByLicensePlate(licensePlate: string) {
  return await prisma.vehicleServiceRecord.findMany({
    where: { 
      vehicle: { 
        licensePlate: {
          equals: licensePlate,
          mode: 'insensitive'
        }
      } 
    },
    orderBy: { serviceDate: 'desc' },
    include: {
      vehicle: {
        select: {
          id: true,
          licensePlate: true,
          model: true,
        }
      }
    }
  });
}

/**
 * Get a single service record by ID
 */
export async function getServiceRecordById(id: string) {
  return await prisma.vehicleServiceRecord.findUnique({
    where: { id },
    include: {
      vehicle: {
        select: {
          id: true,
          licensePlate: true,
          model: true,
          manufacturer: true,
        }
      }
    }
  });
}

/**
 * Create a new service record
 */
export async function createServiceRecord(
  vehicleId: string,
  data: CreateVehicleServiceRecordData
) {
  return await prisma.vehicleServiceRecord.create({
    data: {
      ...data,
      vehicleId,
    },
    include: {
      vehicle: {
        select: {
          licensePlate: true,
          model: true,
        }
      }
    }
  });
}

/**
 * Update an existing service record
 */
export async function updateServiceRecord(
  id: string,
  data: UpdateVehicleServiceRecordData
) {
  return await prisma.vehicleServiceRecord.update({
    where: { id },
    data,
    include: {
      vehicle: {
        select: {
          licensePlate: true,
          model: true,
        }
      }
    }
  });
}

/**
 * Delete a service record
 */
export async function deleteServiceRecord(id: string) {
  return await prisma.vehicleServiceRecord.delete({
    where: { id }
  });
}

/**
 * Get upcoming service due dates for a vehicle
 */
export async function getUpcomingServicesByLicensePlate(
  licensePlate: string,
  daysAhead: number = 30
) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

  return await prisma.vehicleServiceRecord.findMany({
    where: {
      vehicle: { licensePlate },
      nextDueDate: {
        lte: cutoffDate,
        gte: new Date()
      },
      status: {
        not: 'COMPLETED'
      }
    },
    orderBy: { nextDueDate: 'asc' },
    include: {
      vehicle: {
        select: {
          licensePlate: true,
          model: true,
        }
      }
    }
  });
}

/**
 * Get service records statistics for a vehicle
 */
export async function getServiceRecordsStatsByLicensePlate(licensePlate: string) {
  const records = await prisma.vehicleServiceRecord.findMany({
    where: {
      vehicle: { licensePlate }
    },
    select: {
      cost: true,
      serviceDate: true,
      nextDueDate: true,
      status: true,
      type: true,
    }
  });

  const totalRecords = records.length;
  const totalCost = records.reduce((sum, record) => sum + (record.cost || 0), 0);
  
  const lastService = records.length > 0 
    ? records.reduce((latest, record) => 
        !latest || record.serviceDate > latest ? record.serviceDate : latest, null as Date | null)
    : null;

  const nextDueService = records
    .filter(record => record.nextDueDate && record.nextDueDate > new Date())
    .reduce((earliest, record) => 
      !earliest || (record.nextDueDate && record.nextDueDate < earliest) 
        ? record.nextDueDate : earliest, null as Date | null);

  const recordsByStatus = records.reduce((acc, record) => {
    acc[record.status] = (acc[record.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recordsByType = records.reduce((acc, record) => {
    acc[record.type] = (acc[record.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalRecords,
    totalCost,
    lastService,
    nextDueService,
    recordsByStatus,
    recordsByType,
  };
}


/**
 * Check if service record exists
 */
export async function serviceRecordExists(id: string) {
  const record = await prisma.vehicleServiceRecord.findUnique({
    where: { id },
    select: { id: true }
  });
  return !!record;
}

/**
 * Get service record with vehicle info for revalidation
 */
export async function getServiceRecordWithVehicle(id: string) {
  return await prisma.vehicleServiceRecord.findUnique({
    where: { id },
    include: {
      vehicle: {
        select: {
          licensePlate: true
        }
      }
    }
  });
}

