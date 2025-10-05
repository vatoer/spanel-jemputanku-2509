import { z } from "zod";

// Enums matching Prisma schema
export const ServiceTypeEnum = z.enum(["MAINTENANCE", "REPAIR", "INSPECTION", "UPGRADE"]);
export const ServiceCategoryEnum = z.enum([
  "ENGINE", "TRANSMISSION", "BRAKES", "TIRES", "ELECTRICAL", 
  "AC_HEATING", "BODY", "INTERIOR", "SAFETY", "GENERAL"
]);
export const ServiceStatusEnum = z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "OVERDUE"]);

// Main form schema for creating/updating service records
export const vehicleServiceRecordSchema = z.object({
  type: ServiceTypeEnum,
  category: ServiceCategoryEnum,
  title: z.string().min(1, "Judul pemeliharaan dan perbaikan wajib diisi"),
  description: z.string().optional(),
  serviceDate: z.string().min(1, "Tanggal pemeliharaan dan perbaikan wajib diisi"),
  cost: z.coerce.number().min(0, "Biaya harus 0 atau lebih").optional(),
  mileage: z.coerce.number().min(0, "Kilometer harus 0 atau lebih").optional(),
  status: ServiceStatusEnum,
  nextDueDate: z.string().optional(),
  vendor: z.string().optional(),
  invoice: z.string().optional(),
});

// Schema for display/read operations (includes id and timestamps)
export const vehicleServiceRecordDisplaySchema = vehicleServiceRecordSchema.extend({
  id: z.string(),
  vehicleId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Form values type
export type VehicleServiceRecordFormValues = z.infer<typeof vehicleServiceRecordSchema>;
export type VehicleServiceRecord = z.infer<typeof vehicleServiceRecordDisplaySchema>;

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

// Legacy schema for backward compatibility
export const riwayatSchema = vehicleServiceRecordSchema;
export type Riwayat = VehicleServiceRecord;
export type RiwayatFormValues = VehicleServiceRecordFormValues;
