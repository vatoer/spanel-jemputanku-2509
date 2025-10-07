import { Prisma } from "@prisma/client";

// Base service record types
export type ServiceRecord = Prisma.VehicleServiceRecordGetPayload<{}>;

export type ServiceRecordWithVehicle = Prisma.VehicleServiceRecordGetPayload<{
  include: {
    vehicle: {
      select: {
        id: true;
        licensePlate: true;
        model: true;
        manufacturer: true;
      };
    };
  };
}>;

export type ServiceRecordWithBasicVehicle = Prisma.VehicleServiceRecordGetPayload<{
  include: {
    vehicle: {
      select: {
        id: true;
        licensePlate: true;
        model: true;
      };
    };
  };
}>;

export type ServiceRecordWithLicensePlate = Prisma.VehicleServiceRecordGetPayload<{
  include: {
    vehicle: {
      select: {
        licensePlate: true;
      };
    };
  };
}>;

// Return types for service functions
export type GetServiceRecordsByVehicleIdResult = ServiceRecordWithBasicVehicle[];

export type GetServiceRecordsByLicensePlateResult = ServiceRecordWithBasicVehicle[];

export type GetServiceRecordByIdResult = ServiceRecordWithVehicle | null;

export type CreateServiceRecordResult = ServiceRecordWithBasicVehicle;

export type UpdateServiceRecordResult = ServiceRecordWithBasicVehicle;

export type DeleteServiceRecordResult = ServiceRecord;

export type GetUpcomingServicesByLicensePlateResult = Prisma.VehicleServiceRecordGetPayload<{
  include: {
    vehicle: {
      select: {
        licensePlate: true;
        model: true;
      };
    };
  };
}>[];

export type ServiceRecordsStats = {
  totalRecords: number;
  totalCost: number;
  lastService: Date | null;
  nextDueService: Date | null;
  recordsByStatus: Record<string, number>;
  recordsByType: Record<string, number>;
};

export type GetServiceRecordsStatsByLicensePlateResult = ServiceRecordsStats;

export type ServiceRecordExistsResult = boolean;

export type GetServiceRecordWithVehicleResult = Prisma.VehicleServiceRecordGetPayload<{
  include: {
    vehicle: {
      select: {
        licensePlate: true;
      };
    };
  };
}> | null;

// Additional utility types
export type ServiceRecordSelect = Prisma.VehicleServiceRecordSelect;
export type ServiceRecordInclude = Prisma.VehicleServiceRecordInclude;
export type ServiceRecordWhereInput = Prisma.VehicleServiceRecordWhereInput;
export type ServiceRecordOrderByInput = Prisma.VehicleServiceRecordOrderByWithRelationInput;

// Aggregation and grouping types
export type ServiceRecordCountResult = Prisma.GetVehicleServiceRecordAggregateType<{
  _count: true;
}>;

export type ServiceRecordSumResult = Prisma.GetVehicleServiceRecordAggregateType<{
  _sum: {
    cost: true;
    mileage: true;
  };
}>;

export type ServiceRecordAvgResult = Prisma.GetVehicleServiceRecordAggregateType<{
  _avg: {
    cost: true;
    mileage: true;
  };
}>;

// Filter and search types
export type ServiceRecordFilters = {
  vehicleId?: string;
  licensePlate?: string;
  status?: string;
  type?: string;
  dateFrom?: Date;
  dateTo?: Date;
  costMin?: number;
  costMax?: number;
};

export type ServiceRecordSearchResult = {
  records: ServiceRecordWithBasicVehicle[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
};