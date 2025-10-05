"use client";
import { CreateVehicleData, createVehicleSchema } from "@/schema/vehicle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

interface ArmadaFormProps {
  onSubmit?: (data: CreateVehicleData) => void;
  isLoading?: boolean;
  initialData?: Partial<CreateVehicleData>;
}

export function ArmadaForm({ onSubmit, isLoading = false, initialData }: ArmadaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(createVehicleSchema),
    defaultValues: {
      licensePlate: initialData?.licensePlate || "",
      model: initialData?.model || "",
      capacity: initialData?.capacity || 30,
      year: initialData?.year || new Date().getFullYear(),
      manufacturer: initialData?.manufacturer || "",
      color: initialData?.color || "",
      status: initialData?.status || "ACTIVE",
      chassisNumber: initialData?.chassisNumber || "",
      engineNumber: initialData?.engineNumber || "",
      stnkDate: initialData?.stnkDate || "",
      kirDate: initialData?.kirDate || "",
      taxDate: initialData?.taxDate || "",
      features: initialData?.features || [],
      notes: initialData?.notes || "",
    },
  });

  const features = watch("features") || [];
  
  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setValue("features", [...features, feature]);
    } else {
      setValue("features", features.filter((f: string) => f !== feature));
    }
  };

  return (
    <form
      className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto flex flex-col gap-6 border border-gray-100"
      onSubmit={handleSubmit((data) => onSubmit?.(data))}
      autoComplete="off"
    >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plat Nomor</label>
          <input {...register("licensePlate")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder:text-gray-400"
            placeholder="B 1234 CD" />
          {errors.licensePlate && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.licensePlate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model Kendaraan</label>
          <select
            {...register("model")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition"
            defaultValue=""
          >
            <option value="" disabled>Pilih model kendaraan</option>
            <option value="Bus Besar">Bus Besar</option>
            <option value="Bus Sedang">Bus Sedang</option>
            <option value="Bus Kecil">Bus Kecil</option>
            <option value="Mobil Besar">Mobil Besar</option>
            <option value="Mobil Kecil">Mobil Kecil</option>
            <option value="Lainnya">Lainnya</option>
          </select>
          {errors.model && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.model.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
          <input type="number" {...register("capacity")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder:text-gray-400"
            placeholder="Jumlah kursi" />
          {errors.capacity && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.capacity.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
          <input
            type="number"
            {...register("year")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder:text-gray-400"
            placeholder="Tahun pembuatan"
            min={new Date().getFullYear() - 20}
            max={new Date().getFullYear()}
          />
          {errors.year && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.year.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Merk</label>
          <input {...register("manufacturer")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder:text-gray-400"
            placeholder="Mercedes-Benz, Hino, dll" />
          {errors.manufacturer && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.manufacturer.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Warna</label>
          <input {...register("color")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder:text-gray-400"
            placeholder="Putih, Biru, dll" />
          {errors.color && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.color.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status Armada</label>
          <select {...register("status")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition bg-white">
            <option value="ACTIVE">Aktif</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="INACTIVE">Tidak Aktif</option>
          </select>
          {errors.status && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.status.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Rangka</label>
          <input {...register("chassisNumber")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder:text-gray-400"
            placeholder="Nomor rangka kendaraan" />
          {errors.chassisNumber && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.chassisNumber.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Mesin</label>
          <input {...register("engineNumber")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition placeholder:text-gray-400"
            placeholder="Nomor mesin kendaraan" />
          {errors.engineNumber && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.engineNumber.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal STNK</label>
          <input type="date" {...register("stnkDate")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition" />
          {errors.stnkDate && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.stnkDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal KIR</label>
          <input type="date" {...register("kirDate")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition" />
          {errors.kirDate && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.kirDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pajak</label>
          <input type="date" {...register("taxDate")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition" />
          {errors.taxDate && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.taxDate.message}</p>}
        </div>
      </div>  

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Fitur Armada</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={features.includes("WiFi Hotspot")}
              onChange={(e) => handleFeatureChange("WiFi Hotspot", e.target.checked)}
              className="rounded border-gray-300" 
            />
            <span>WiFi Hotspot</span>
          </label>
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={features.includes("GPS")}
              onChange={(e) => handleFeatureChange("GPS", e.target.checked)}
              className="rounded border-gray-300" 
            />
            <span>GPS</span>
          </label>
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={features.includes("Dashcam")}
              onChange={(e) => handleFeatureChange("Dashcam", e.target.checked)}
              className="rounded border-gray-300" 
            />
            <span>Dashcam</span>
          </label>
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={features.includes("Karaoke")}
              onChange={(e) => handleFeatureChange("Karaoke", e.target.checked)}
              className="rounded border-gray-300" 
            />
            <span>Karaoke</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Catatan/Deskripsi</label>
        <textarea {...register("notes")} rows={3}
          placeholder="Masukkan catatan atau deskripsi tambahan"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition resize-none" />
        {errors.notes && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.notes.message}</p>}
      </div>
          <Button type="submit" disabled={isLoading}>
        {isLoading ? (initialData ? "Memperbarui..." : "Membuat...") : (initialData ? "Perbarui Armada" : "Simpan Armada")}
      </Button>
    </form>
  );
}
