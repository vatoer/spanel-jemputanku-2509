import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const armadaSchema = z.object({
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
  fitur: z.array(z.string()).optional(),
  catatan: z.string().max(255, "Catatan maksimal 255 karakter").optional(),
});

export type ArmadaFormValues = z.infer<typeof armadaSchema>;

export function ArmadaForm({ onSubmit }: { onSubmit?: (data: ArmadaFormValues) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArmadaFormValues>({
    resolver: zodResolver(armadaSchema),
    defaultValues: {
      platNomor: "",
      tipe: "",
      kapasitas: 30,
      tahun: new Date().getFullYear(),
      merk: "",
      warna: "",
      status: "Aktif",
      nomorRangka: "",
      nomorMesin: "",
      tanggalStnk: "",
      tanggalKir: "",
      fitur: [],
      catatan: "",
    },
  });

  return (
    <form
      className="bg-white rounded-xl shadow p-8 max-w-2xl mx-auto flex flex-col gap-4"
      onSubmit={handleSubmit((data) => onSubmit?.(data))}
      autoComplete="off"
    >
      <h2 className="text-xl font-bold text-blue-700 mb-2">Tambah Bus/Armada</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">Plat Nomor</label>
          <input {...register("platNomor")}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="B 1234 CD" />
          {errors.platNomor && <p className="text-red-600 text-sm mt-1">{errors.platNomor.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">Tipe</label>
          <input {...register("tipe")}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Bus Besar/Sedang/Kecil" />
          {errors.tipe && <p className="text-red-600 text-sm mt-1">{errors.tipe.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">Kapasitas</label>
          <input type="number" {...register("kapasitas")}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Jumlah kursi" />
          {errors.kapasitas && <p className="text-red-600 text-sm mt-1">{errors.kapasitas.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">Tahun</label>
          <input type="number" {...register("tahun")}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Tahun pembelian" />
          {errors.tahun && <p className="text-red-600 text-sm mt-1">{errors.tahun.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">Merk</label>
          <input {...register("merk")}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Mercedes-Benz, Hino, dll" />
          {errors.merk && <p className="text-red-600 text-sm mt-1">{errors.merk.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">Warna</label>
          <input {...register("warna")}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Putih, Biru, dll" />
          {errors.warna && <p className="text-red-600 text-sm mt-1">{errors.warna.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">Status Armada</label>
          <select {...register("status")}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="Aktif">Aktif</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>
          {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">Nomor Rangka</label>
          <input {...register("nomorRangka")}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nomor rangka kendaraan" />
          {errors.nomorRangka && <p className="text-red-600 text-sm mt-1">{errors.nomorRangka.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">Nomor Mesin</label>
          <input {...register("nomorMesin")}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nomor mesin kendaraan" />
          {errors.nomorMesin && <p className="text-red-600 text-sm mt-1">{errors.nomorMesin.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">Tanggal STNK</label>
          <input type="date" {...register("tanggalStnk")}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          {errors.tanggalStnk && <p className="text-red-600 text-sm mt-1">{errors.tanggalStnk.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">Tanggal KIR</label>
          <input type="date" {...register("tanggalKir")}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          {errors.tanggalKir && <p className="text-red-600 text-sm mt-1">{errors.tanggalKir.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">Fitur Armada</label>
        <div className="flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" value="AC" {...register("fitur")}/>
            <span>AC</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" value="WiFi" {...register("fitur")}/>
            <span>WiFi</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" value="Toilet" {...register("fitur")}/>
            <span>Toilet</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" value="Smoking Area" {...register("fitur")}/>
            <span>Smoking Area</span>
          </label>
        </div>
        {errors.fitur && <p className="text-red-600 text-sm mt-1">{errors.fitur.message as string}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">Catatan/Deskripsi</label>
        <textarea {...register("catatan")}
          className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Catatan tambahan (opsional)" rows={2} maxLength={255} />
        {errors.catatan && <p className="text-red-600 text-sm mt-1">{errors.catatan.message}</p>}
      </div>
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition mt-2">Simpan</button>
    </form>
  );
}
