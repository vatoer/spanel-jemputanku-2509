import { z } from "zod";

export const ruteSchema = z.object({
  nama: z.string().min(3, "Nama rute wajib diisi").max(50, "Nama rute maksimal 50 karakter"),
  deskripsi: z.string().max(255, "Deskripsi maksimal 255 karakter").optional(),
  pemberhentian: z.array(z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    nomor: z.number().min(0),
    name: z.string().min(2).max(100)
  })).optional(),
  origin: z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }).optional(),
  destination: z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }).optional(),
});