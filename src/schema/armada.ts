import { z } from "zod";

export const armadaSchema = z.object({
  platNomor: z.string().min(5, "Plat nomor wajib diisi").max(12),
  tipe: z.string().min(2, "Tipe bus wajib diisi"),
  kapasitas: z.coerce.number().min(1, "Kapasitas minimal 1"),
  tahun: z.coerce.number().min(2000, "Tahun minimal 2000").max(new Date().getFullYear()),
  merk: z.string().min(2, "Merk wajib diisi"),
  warna: z.string().min(2, "Warna wajib diisi"),
  status: z.enum(["Aktif", "Maintenance", "Tidak Aktif"]),
  nomorRangka: z.string().min(5, "Nomor rangka wajib diisi"),
  nomorMesin: z.string().min(5, "Nomor mesin wajib diisi"),
  tanggalStnk: z.string().min(8, "Tanggal STNK wajib diisi"),
  tanggalKir: z.string().min(8, "Tanggal KIR wajib diisi"),
  tanggalPajak: z.string().min(8, "Tanggal Pajak wajib diisi"),
  fitur: z.array(z.string()).optional(),
  catatan: z.string().max(255, "Catatan maksimal 255 karakter").optional(),
});

export type Armada = z.infer<typeof armadaSchema>;
