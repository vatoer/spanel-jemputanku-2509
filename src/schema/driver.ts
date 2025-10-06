import { z } from "zod";

// Driver creation schema
export const createDriverSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  image: z.string().url().optional(),
  licenseNumber: z.string().min(5, "License number required").optional(),
  phone: z.string().min(10, "Valid phone number required").optional(),
});

// Driver update schema
export const updateDriverSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
  image: z.string().url().optional(),
  licenseNumber: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
});

// Driver assignment schema
export const assignDriverSchema = z.object({
  driverId: z.string().cuid("Invalid driver ID"),
  vehicleId: z.string().cuid("Invalid vehicle ID"),
});

// Type exports
export type CreateDriverData = z.infer<typeof createDriverSchema>;
export type UpdateDriverData = z.infer<typeof updateDriverSchema>;
export type AssignDriverData = z.infer<typeof assignDriverSchema>;