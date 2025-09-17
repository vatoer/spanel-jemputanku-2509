import { z } from "zod";

export const riwayatSchema = z.object({
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  jenis: z.array(z.string().min(1)).min(1, "Pilih minimal satu jenis perbaikan/pemeliharaan"),
  keterangan: z.string().min(1, "Keterangan wajib diisi"),
  biaya: z.coerce.number().min(0, "Biaya wajib diisi"),
  tempatService: z.string().min(1, "Tempat service wajib diisi"),
  fileBukti: z
    .any()
    .refine(
      (files) => {
        if (!files || !(files instanceof FileList) || files.length === 0) return false;
        const allowedTypes = [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/webp",
        ];
        for (let i = 0; i < files.length; i++) {
          if (!allowedTypes.includes(files[i].type)) return false;
        }
        return true;
      },
      { message: "Semua file harus berupa PDF atau gambar (jpg, png, webp)" }
    ),
});

export type Riwayat = z.infer<typeof riwayatSchema>;
export type RiwayatFormValues = z.infer<typeof riwayatSchema>;
