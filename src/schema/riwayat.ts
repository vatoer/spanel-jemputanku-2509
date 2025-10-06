import { ServiceRecordWithVehicle } from "@/lib/services/serviceRecord";
import { z } from "zod";

// Enums matching Prisma schema
export const ServiceTypeEnum = z.enum(["MAINTENANCE", "REPAIR", "INSPECTION", "UPGRADE"]);
export const ServiceCategoryEnum = z.enum([
  "ENGINE", "TRANSMISSION", "BRAKES", "TIRES", "ELECTRICAL", 
  "AC_HEATING", "BODY", "INTERIOR", "SAFETY", "GENERAL"
]);
export const ServiceStatusEnum = z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "OVERDUE"]);

// Main VehicleServiceRecord schema (following vehicle naming pattern)
export const vehicleServiceRecordSchema = z.object({
  id: z.string().optional(),
  vehicleId: z.string().optional(),
  type: ServiceTypeEnum.default("MAINTENANCE"),
  category: ServiceCategoryEnum.default("GENERAL"),
  title: z.string().min(1, "Judul pemeliharaan dan perbaikan wajib diisi"),
  description: z.string().optional(),
  serviceDate: z.coerce.date(),
  cost: z.coerce.number().min(0, "Biaya harus 0 atau lebih").optional(),
  mileage: z.coerce.number().min(0, "Kilometer harus 0 atau lebih").optional(),
  status: ServiceStatusEnum.default("COMPLETED"),
  nextDueDate: z.coerce.date().optional(),
  vendor: z.string().optional(),
  invoice: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Schema for creating new service records (without id, vehicleId, and timestamps)
export const createVehicleServiceRecordSchema = vehicleServiceRecordSchema.omit({
  id: true,
  vehicleId: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for updating service records (id required, other fields optional)
export const updateVehicleServiceRecordSchema = vehicleServiceRecordSchema.partial().extend({
  id: z.string(),
});

// Type exports
export type VehicleServiceRecordData = z.infer<typeof vehicleServiceRecordSchema>;
export type CreateVehicleServiceRecordData = z.infer<typeof createVehicleServiceRecordSchema>;
export type UpdateVehicleServiceRecordData = z.infer<typeof updateVehicleServiceRecordSchema>;

// Type definitions for enums
export type ServiceType = z.infer<typeof ServiceTypeEnum>;
export type ServiceCategory = z.infer<typeof ServiceCategoryEnum>;
export type ServiceStatus = z.infer<typeof ServiceStatusEnum>;

// Display labels for enums
export const serviceTypeLabels: Record<ServiceType, string> = {
  MAINTENANCE: "Pemeliharaan",
  REPAIR: "Perbaikan",
  INSPECTION: "Inspeksi",
  UPGRADE: "Peningkatan"
};

export const serviceCategoryLabels: Record<ServiceCategory, string> = {
  ENGINE: "Mesin",
  TRANSMISSION: "Transmisi",
  BRAKES: "Rem",
  TIRES: "Ban",
  ELECTRICAL: "Kelistrikan",
  AC_HEATING: "AC/Pemanas",
  BODY: "Bodi",
  INTERIOR: "Interior",
  SAFETY: "Keselamatan",
  GENERAL: "Umum"
};

export const serviceStatusLabels: Record<ServiceStatus, string> = {
  SCHEDULED: "Terjadwal",
  IN_PROGRESS: "Sedang Dikerjakan",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
  OVERDUE: "Terlambat"
};

// Status helper functions (following vehicle schema pattern)
export const getServiceStatusLabel = (status: ServiceStatus): string => {
  return serviceStatusLabels[status] || serviceStatusLabels.COMPLETED;
};

export const getServiceStatusBadgeColor = (status: ServiceStatus): string => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700 border-green-200";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "SCHEDULED":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "OVERDUE":
      return "bg-red-100 text-red-700 border-red-200";
    case "CANCELLED":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-green-100 text-green-700 border-green-200";
  }
};

export const getServiceTypeLabel = (type: ServiceType): string => {
  return serviceTypeLabels[type] || serviceTypeLabels.MAINTENANCE;
};

export const getServiceCategoryLabel = (category: ServiceCategory): string => {
  return serviceCategoryLabels[category] || serviceCategoryLabels.GENERAL;
};

// Conversion functions (following vehicle schema pattern)
export const toVehicleServiceRecordData = (prismaRecord: ServiceRecordWithVehicle): VehicleServiceRecordData => {
  return {
    id: prismaRecord.id,
    vehicleId: prismaRecord.vehicleId,
    type: prismaRecord.type,
    category: prismaRecord.category,
    title: prismaRecord.title,
    description: prismaRecord.description || undefined,
    serviceDate: prismaRecord.serviceDate,
    cost: prismaRecord.cost || undefined,
    mileage: prismaRecord.mileage || undefined,
    status: prismaRecord.status,
    nextDueDate: prismaRecord.nextDueDate || undefined,
    vendor: prismaRecord.vendor || undefined,
    invoice: prismaRecord.invoice || undefined,
    createdAt: prismaRecord.createdAt,
    updatedAt: prismaRecord.updatedAt,
  };
};

export const toPrismaData = (recordData: VehicleServiceRecordData) => {
  return {
    ...recordData,
    id: recordData.id || "",
    vehicleId: recordData.vehicleId || "",
    description: recordData.description || null,
    cost: recordData.cost || null,
    mileage: recordData.mileage || null,
    nextDueDate: recordData.nextDueDate || null,
    vendor: recordData.vendor || null,
    invoice: recordData.invoice || null,
    createdAt: recordData.createdAt || new Date(),
    updatedAt: recordData.updatedAt || new Date(),
  };
};

// Backward compatibility exports (untuk existing code yang masih menggunakan old naming)
// export const vehicleServiceRecordFullSchema = vehicleServiceRecordSchema;
// export const vehicleServiceRecordDisplaySchema = vehicleServiceRecordSchema;
// export const riwayatSchema = vehicleServiceRecordSchema;

// Backward compatibility type exports
// export type VehicleServiceRecord = VehicleServiceRecordData;
// export type VehicleServiceRecordFull = VehicleServiceRecordData;
// export type Riwayat = VehicleServiceRecordData;
