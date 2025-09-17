
import { Armada, armadaSchema } from "@/schema/armada";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function ArmadaForm({ onSubmit }: { onSubmit?: (data: Armada) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
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
  tanggalPajak: "",
    },
  });

  return (
    <form
      className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto flex flex-col gap-6 border border-gray-100"
      onSubmit={handleSubmit((data) => onSubmit?.(data))}
      autoComplete="off"
    >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plat Nomor</label>
          <input {...register("platNomor")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder:text-gray-400"
            placeholder="B 1234 CD" />
          {errors.platNomor && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.platNomor.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
          <select
            {...register("tipe")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition"
            defaultValue=""
          >
            <option value="" disabled>Pilih tipe armada</option>
            <option value="Bus Besar">Bus Besar</option>
            <option value="Bus Sedang">Bus Sedang</option>
            <option value="Bus Kecil">Bus Kecil</option>
            <option value="Mobil Besar">Mobil Besar</option>
            <option value="Mobil Kecil">Mobil Kecil</option>
            <option value="lainya">Lainnya</option>
          </select>
          {errors.tipe && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.tipe.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
          <input type="number" {...register("kapasitas")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder:text-gray-400"
            placeholder="Jumlah kursi" />
          {errors.kapasitas && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.kapasitas.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
          <input
            type="number"
            {...register("tahun")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder:text-gray-400"
            placeholder="Tahun pembelian"
            min={new Date().getFullYear() - 20}
            max={new Date().getFullYear()}
          />
          {errors.tahun && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.tahun.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Merk</label>
          <input {...register("merk")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder:text-gray-400"
            placeholder="Mercedes-Benz, Hino, dll" />
          {errors.merk && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.merk.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Warna</label>
          <input {...register("warna")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder:text-gray-400"
            placeholder="Putih, Biru, dll" />
          {errors.warna && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.warna.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status Armada</label>
          <select {...register("status")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition bg-white">
            <option value="Aktif">Aktif</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>
          {errors.status && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.status.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Rangka</label>
          <input {...register("nomorRangka")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder:text-gray-400"
            placeholder="Nomor rangka kendaraan" />
          {errors.nomorRangka && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.nomorRangka.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Mesin</label>
          <input {...register("nomorMesin")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder:text-gray-400"
            placeholder="Nomor mesin kendaraan" />
          {errors.nomorMesin && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.nomorMesin.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal STNK</label>
          <input type="date" {...register("tanggalStnk")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition" />
          {errors.tanggalStnk && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.tanggalStnk.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal KIR</label>
          <input type="date" {...register("tanggalKir")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition" />
          {errors.tanggalKir && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.tanggalKir.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pajak</label>
          <input type="date" {...register("tanggalPajak")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition" />
          {errors.tanggalPajak && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.tanggalPajak.message}</p>}
        </div>
      </div>  
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fitur Armada</label>
        <div className="flex flex-wrap gap-3">
          <label className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 cursor-pointer hover:bg-gray-100 transition">
            <input type="checkbox" value="AC" {...register("fitur")}/>
            <span className="text-gray-700">AC</span>
          </label>
          <label className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 cursor-pointer hover:bg-gray-100 transition">
            <input type="checkbox" value="WiFi" {...register("fitur")}/>
            <span className="text-gray-700">WiFi</span>
          </label>
          <label className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 cursor-pointer hover:bg-gray-100 transition">
            <input type="checkbox" value="Toilet" {...register("fitur")}/>
            <span className="text-gray-700">Toilet</span>
          </label>
          <label className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 cursor-pointer hover:bg-gray-100 transition">
            <input type="checkbox" value="Smoking Area" {...register("fitur")}/>
            <span className="text-gray-700">Smoking Area</span>
          </label>
        </div>
        {errors.fitur && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.fitur.message as string}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Catatan/Deskripsi</label>
        <textarea {...register("catatan")}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder:text-gray-400"
          placeholder="Catatan tambahan (opsional)" rows={2} maxLength={255} />
        {errors.catatan && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.catatan.message}</p>}
      </div>
  <button type="submit" className="bg-primary-600 text-white px-8 py-2.5 rounded-lg font-semibold shadow hover:bg-primary-700 transition mt-4 focus:outline-none focus:ring-2 focus:ring-primary-400">Simpan</button>
    </form>
  );
}
