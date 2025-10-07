"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateDriverData, createDriverSchema } from "@/schema/driver";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { DriverLicenseFields } from "./DriverLicenseFields";

interface DriverFormProps {
  onSubmit: (data: CreateDriverData) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<CreateDriverData>;
  isEdit?: boolean;
}

export function DriverForm({ onSubmit, isLoading = false, initialData, isEdit = false }: DriverFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

  const form = useForm<CreateDriverData>({
    // @ts-ignore - z.coerce.date() infers as unknown but works correctly at runtime
    resolver: zodResolver(createDriverSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      image: initialData?.image || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      bloodType: initialData?.bloodType || 'A',
      birthDate: initialData?.birthDate || new Date(),
      licenses: initialData?.licenses || [],
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control
  } = form;

  const imageUrl = watch("image");



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setValue("image", url);
    setImagePreview(url || null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-700">
            {isEdit ? "Edit Driver" : "Tambah Driver Baru"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? "Update informasi driver" : "Masukkan informasi driver yang akan ditambahkan ke sistem"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          {/* Photo Section */}
          <div className="space-y-4">
            <Label htmlFor="image" className="text-sm font-medium text-gray-700">
              Foto Driver (URL)
            </Label>
            <div className="flex flex-col gap-4">
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/photo.jpg"
                {...register("image")}
                onChange={handleImageChange}
                className="max-w-md"
              />
              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image.message}</p>
              )}
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Preview Foto
                  </Label>
                  <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImagePreview(null)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 required">
                Nama Lengkap *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Masukkan nama lengkap driver"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 required">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="driver@example.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
                disabled={isEdit} // Email shouldn't be editable
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
              {isEdit && (
                <p className="text-gray-500 text-xs">Email tidak dapat diubah</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Nomor Telepon
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0812-3456-7890"
                {...register("phone")}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700 required">
                Tanggal Lahir *
              </Label>
              <Input
                id="birthDate"
                type="date"
                {...register("birthDate", {
                  setValueAs: (value: string) => value ? new Date(value) : undefined,
                })}
                defaultValue={
                  initialData?.birthDate instanceof Date 
                    ? initialData.birthDate.toISOString().split('T')[0]
                    : initialData?.birthDate || new Date().toISOString().split('T')[0]
                }
                className={errors.birthDate ? "border-red-500" : ""}
              />
              {errors.birthDate && (
                <p className="text-red-500 text-sm">{errors.birthDate.message}</p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bloodType" className="text-sm font-medium text-gray-700 required">
                Golongan Darah *
              </Label>
              <select
                id="bloodType"
                {...register("bloodType")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.bloodType ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
              {errors.bloodType && (
                <p className="text-red-500 text-sm">{errors.bloodType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-gray-700 required">
                Alamat *
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="Masukkan alamat lengkap"
                {...register("address")}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>
          </div>

          {/* Driver License Fields */}
          <DriverLicenseFields form={form as any} />

          {/* Form Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Informasi:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Driver akan secara otomatis terdaftar sebagai user dengan role DRIVER</li>
                  <li>• Email akan digunakan sebagai username untuk login</li>
                  <li>• Field yang bertanda (*) wajib diisi</li>
                  <li>• Foto driver bersifat opsional</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{isEdit ? "Memperbarui..." : "Menyimpan..."}</span>
                </div>
              ) : (
                <span>{isEdit ? "Perbarui Driver" : "Simpan Driver"}</span>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => window.history.back()}
              className="px-8 py-2.5 rounded-lg font-medium"
            >
              Batal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}