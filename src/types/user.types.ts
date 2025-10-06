import type {
  DriverShift,
  DriverVehicle,
  Prisma,
  Ride,
  Role,
  Route,
  Tenant,
  User,
  UserRole,
  UserTenant,
  Vehicle
} from "@prisma/client";

// Base User with common relations
export interface UserWithRelations extends User {
  UserRole: (UserRole & {
    role: Role;
  })[];
  UserTenant: (UserTenant & {
    tenant: Tenant;
  })[];
}

// User with vehicles included
export interface UserWithVehicles extends User {
  DriverVehicle: DriverVehicle[];
  VehicleDriver: Vehicle[];
}

// Driver with full details for tenant operations
export interface DriverWithDetails extends User {
  UserRole: (UserRole & {
    role: Role;
  })[];
  UserTenant: (UserTenant & {
    tenant: Tenant;
  })[];
  VehicleDriver: DriverVehicle[];
  Ride: (Ride & {
    route?: Route;
  })[];
  driverShifts?: DriverShift[];
}

// Driver list item for tenant view
export interface DriverListItem {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  VehicleDriver: DriverVehicle[];
  Ride: Ride[];
}

// Driver with statistics
export interface DriverWithStats extends User {
  VehicleDriver: DriverVehicle[];
  Ride: Ride[];
  _count: {
    Ride: number;
    VehicleDriver: number;
  };
  stats: {
    totalRides: number;
    ridesLast30Days: number;
    hasAssignedVehicle: boolean;
    averageRidesPerDay: number;
  };
}

// Available driver (simplified for selection)
export interface AvailableDriver {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
}

// Driver statistics for tenant overview
export interface DriverStatsItem {
  id: string;
  name: string | null;
  email: string;
  assignedVehicles: number;
  completedRides: number;
  lastRide: Date | null;
}

// Driver search result
export interface DriverSearchResult extends User {
  VehicleDriver: DriverVehicle[];
  _count: {
    Ride: number;
  };
}

// Driver performance metrics
export interface DriverPerformance {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  completionRate: number;
  ridesPerDay: number;
}

// Vehicle assignment result
export interface VehicleAssignment extends Vehicle {
  driver: User | null;
}

// User creation result
export interface CreatedUser extends User {
  UserRole: (UserRole & {
    role: Role;
  })[];
  UserTenant: (UserTenant & {
    tenant: Tenant;
  })[];
}

// User with permissions (for authorization)
export interface UserWithPermissions extends User {
  UserRole: (UserRole & {
    role: Role & {
      RolePermission: Array<{
        permission: {
          resource: string;
          action: string;
        };
      }>;
    };
  })[];
}

// Tenant assignment result
export interface TenantAssignmentResult {
  removedFromVehicles: number;
}

// User activity item
export interface UserActivityItem extends Ride {
  route?: Route;
}

// Prisma-based function return types using actual query return types
export type GetUsersByTenantResult = Prisma.UserGetPayload<{
  include: {
    UserRole: boolean;
    DriverVehicle: boolean;
    UserTenant: {
      include: {
        tenant: true;
      };
    };
  };
}>[];

export type GetDriversByTenantResult = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    image: true;
    status: true;
    createdAt: true;
    updatedAt: true;
    VehicleDriver: true;
    Ride: true;
  };
}>[];

export type GetDriverByIdResult = (Prisma.UserGetPayload<{
  include: {
    VehicleDriver: true;
    Ride: true;
    _count: {
      select: {
        Ride: true;
        VehicleDriver: true;
      };
    };
  };
}> & {
  stats: {
    totalRides: number;
    ridesLast30Days: number;
    hasAssignedVehicle: boolean;
    averageRidesPerDay: number;
  };
}) | null;

export type CreateDriverResult = Prisma.UserGetPayload<{
  include: {
    UserRole: {
      include: {
        role: true;
      };
    };
    UserTenant: {
      include: {
        tenant: true;
      };
    };
  };
}> | null;

export type UpdateDriverResult = Prisma.UserGetPayload<{
  include: {
    UserRole: {
      include: {
        role: true;
      };
    };
    VehicleDriver: true;
  };
}>;

export type AssignDriverToVehicleResult = Prisma.VehicleGetPayload<{
  include: {
    driver: true;
  };
}> | null;

export type UnassignDriverFromVehicleResult = Prisma.VehicleGetPayload<{
  include: {
    driver: true;
  };
}>;

export type GetAvailableDriversResult = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    image: true;
    createdAt: true;
  };
}>[];

export type GetDriverStatsResult = Array<{
  id: string;
  name: string | null;
  email: string;
  assignedVehicles: number;
  completedRides: number;
  lastRide: Date | null;
}>;

export type SearchDriversResult = Prisma.UserGetPayload<{
  include: {
    VehicleDriver: true;
    _count: {
      select: {
        Ride: true;
      };
    };
  };
}>[];

export type GetDriverPerformanceResult = {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  completionRate: number;
  ridesPerDay: number;
};

export type ToggleDriverStatusResult = User;

export type CreateUserResult = Prisma.UserGetPayload<{
  include: {
    UserRole: true;
    UserTenant: true;
  };
}> | null;

export type AssignUserToTenantResult = Prisma.UserGetPayload<{
  include: {
    UserRole: true;
    UserTenant: true;
  };
}> | null;

export type RemoveUserFromTenantResult = {
  removedFromVehicles: number;
};

export type UpdateUserRoleResult = Prisma.UserGetPayload<{
  include: {
    UserRole: true;
  };
}> | null;

export type GetUserPermissionsResult = Array<{
  resource: string;
  action: string;
}>;

export type CheckUserPermissionResult = boolean;

export type GetUserActivityResult = Array<{
  id: string;
  type: string;
  action: string;
  details: string;
  vehicle: string;
  timestamp: Date;
}>;