import { z } from "zod";

// Driver License Type enum
export const driverLicenseTypeSchema = z.enum(["A", "A1", "B", "B1", "B2", "C", "D"]);

// Driver License schema
export const driverLicenseSchema = z.object({
  licenseType: driverLicenseTypeSchema,
  licenseNumber: z.string().min(5, "License number must be at least 5 characters"),
  issuedDate: z.coerce.date(),
  expiresAt: z.coerce.date(),
  issuingAuthority: z.string().optional(),
  notes: z.string().optional(),
});

// Create Driver License schema
export const createDriverLicenseSchema = driverLicenseSchema.refine(
  (data) => data.expiresAt > data.issuedDate,
  {
    message: "Expiry date must be after issued date",
    path: ["expiresAt"],
  }
);

// Driver creation schema
export const createDriverSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email format"),
  image: z.url().optional(),
  phone: z.string().min(10, "Valid phone number required").optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  bloodType: z.enum(["A", "B", "AB", "O"]),
  birthDate: z.coerce.date().optional(),
  licenses: z.array(createDriverLicenseSchema).min(1, "At least one license is required"),
});

// Driver update schema
export const updateDriverSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
  image: z.string().url().optional(),
  phone: z.string().optional(),
  address: z.string().min(5, "Address must be at least 5 characters").optional(),
  bloodType: z.enum(["A", "B", "AB", "O"]).optional(),
  birthDate: z.coerce.date().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
  licenses: z.array(createDriverLicenseSchema).optional(),
});

// Driver assignment schema
export const assignDriverSchema = z.object({
  driverId: z.string().cuid("Invalid driver ID"),
  vehicleId: z.string().cuid("Invalid vehicle ID"),
});

// License management schemas
export const addLicenseToDriverSchema = z.object({
  driverId: z.string().cuid("Invalid driver ID"),
  license: createDriverLicenseSchema,
});

export const updateDriverLicenseSchema = z.object({
  licenseId: z.string().cuid("Invalid license ID"),
  licenseNumber: z.string().min(5, "License number must be at least 5 characters").optional(),
  issuedDate: z.coerce.date().optional(),
  expiresAt: z.coerce.date().optional(),
  issuingAuthority: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
});

// Type exports
export type DriverLicenseType = z.infer<typeof driverLicenseTypeSchema>;
export type DriverLicense = z.infer<typeof driverLicenseSchema>;
export type CreateDriverLicenseData = z.infer<typeof createDriverLicenseSchema>;
export type CreateDriverData = z.infer<typeof createDriverSchema>;
export type UpdateDriverData = z.infer<typeof updateDriverSchema>;
export type AssignDriverData = z.infer<typeof assignDriverSchema>;