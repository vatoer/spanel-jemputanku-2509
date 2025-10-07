import { Vehicle } from "@prisma/client";
import { z } from "zod";

// Schema Zod untuk Vehicle (menggunakan nama field yang sama dengan Prisma)
export const vehicleSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().optional(),
  licensePlate: z.string().min(5, "License plate is required").max(12, "License plate max 12 characters"),
  model: z.string().min(2, "Model is required").max(50, "Model max 50 characters"),
  manufacturer: z.string().min(2, "Manufacturer is required").max(50, "Manufacturer max 50 characters"),
  year: z.coerce.number().min(2000, "Year minimum 2000").max(new Date().getFullYear(), "Year cannot exceed current year"),
  color: z.string().min(2, "Color is required").max(30, "Color max 30 characters"),
  capacity: z.coerce.number().min(1, "Capacity minimum 1 passenger").max(100, "Capacity max 100 passengers"),
  driverId: z.string().nullable().optional(),
  status: z.enum(["ACTIVE", "MAINTENANCE", "INACTIVE"]).default("ACTIVE"),
  
  // Additional vehicle document fields
  chassisNumber: z.string().min(5, "Chassis number is required").max(20, "Chassis number max 20 characters").optional(),
  engineNumber: z.string().min(5, "Engine number is required").max(20, "Engine number max 20 characters").optional(),
  stnkDate: z.string().min(8, "STNK date is required").optional(),
  kirDate: z.string().min(8, "KIR date is required").optional(),
  taxDate: z.string().min(8, "Tax date is required").optional(),
  
  // Optional fields
  features: z.array(z.string()).default([]),
  notes: z.string().max(255, "Notes max 255 characters").optional(),
  
  // Timestamps (usually handled automatically)
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Schema for create (without id and timestamps)
export const createVehicleSchema = vehicleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for update (id required, other fields optional)
export const updateVehicleSchema = vehicleSchema.partial().extend({
  id: z.string(),
});

// Type exports
export type VehicleData = z.infer<typeof vehicleSchema>;
export type CreateVehicleData = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleData = z.infer<typeof updateVehicleSchema>;


// Status helpers (simplified since names match)
export const getStatusLabel = (status: "ACTIVE" | "MAINTENANCE" | "INACTIVE"): string => {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "MAINTENANCE":
      return "Maintenance";
    case "INACTIVE":
      return "Inactive";
    default:
      return "Active";
  }
};

export const getStatusBadgeColor = (status: "ACTIVE" | "MAINTENANCE" | "INACTIVE"): string => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-700 border-green-200";
    case "MAINTENANCE":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "INACTIVE":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-green-100 text-green-700 border-green-200";
  }
};

// Simplified conversion functions (no field mapping needed)
export const toVehicleData = (prismaVehicle: Vehicle): VehicleData => {
  return {
    id: prismaVehicle.id,
    tenantId: prismaVehicle.tenantId,
    licensePlate: prismaVehicle.licensePlate,
    model: prismaVehicle.model,
    manufacturer: prismaVehicle.manufacturer,
    year: prismaVehicle.year,
    color: prismaVehicle.color,
    capacity: prismaVehicle.capacity,
    status: prismaVehicle.status as "ACTIVE" | "MAINTENANCE" | "INACTIVE",
    // Convert null to undefined for optional fields
    chassisNumber: prismaVehicle.chassisNumber || undefined,
    engineNumber: prismaVehicle.engineNumber || undefined,
    stnkDate: prismaVehicle.stnkDate || undefined,
    kirDate: prismaVehicle.kirDate || undefined,
    taxDate: prismaVehicle.taxDate || undefined,
    features: prismaVehicle.features || [],
    notes: prismaVehicle.notes || undefined,
    driverId: prismaVehicle.driverId || undefined,
    createdAt: prismaVehicle.createdAt,
    updatedAt: prismaVehicle.updatedAt,
  };
};

export const toPrismaData = (vehicleData: VehicleData) => {
  return {
    ...vehicleData,
    id: vehicleData.id || "",
    tenantId: vehicleData.tenantId || "",
    driverId: vehicleData.driverId || null,
    createdAt: vehicleData.createdAt || new Date(),
    updatedAt: vehicleData.updatedAt || new Date(),
  };
};
