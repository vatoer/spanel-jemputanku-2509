"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateVehicleServiceRecordData,
  createVehicleServiceRecordSchema,
  ServiceCategory,
  ServiceCategoryEnum,
  serviceCategoryLabels,
  ServiceStatus,
  ServiceStatusEnum,
  serviceStatusLabels,
  ServiceType,
  ServiceTypeEnum,
  serviceTypeLabels
} from "@/schema/riwayat";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface ArmadaRiwayatFormProps {
  onSubmit?: (data: CreateVehicleServiceRecordData) => void;
  isLoading?: boolean;
  initialData?: Partial<CreateVehicleServiceRecordData>;
  platNomor: string;
}

export function ArmadaRiwayatForm({ 
  onSubmit, 
  isLoading = false, 
  initialData,
  platNomor
  }: ArmadaRiwayatFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(createVehicleServiceRecordSchema),
    defaultValues: {
      type: initialData?.type || "MAINTENANCE",
      category: initialData?.category || "GENERAL",
      title: initialData?.title || "",
      description: initialData?.description || "",
      serviceDate: initialData?.serviceDate || new Date(),
      cost: initialData?.cost || undefined,
      mileage: initialData?.mileage || undefined,
      status: initialData?.status || "COMPLETED",
      nextDueDate: initialData?.nextDueDate || undefined,
      vendor: initialData?.vendor || "",
      invoice: initialData?.invoice || "",
    },
  });

  const formatDateForInput = (date: Date | undefined | null): string => {
    if (!date) return "";
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return new Date(date).toISOString().split('T')[0];
  };

  const serviceDate = watch("serviceDate") as Date;
  const nextDueDate = watch("nextDueDate") as Date | undefined;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      
      <CardContent>
        <form 
          onSubmit={handleSubmit((data) => onSubmit?.(data))}
          className="space-y-6"
        >
          {/* Type & Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Jenis Pemeliharaan dan Perbaikan</Label>
              <Select
                value={watch("type")}
                onValueChange={(value) => setValue("type", value as ServiceType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  {ServiceTypeEnum.options.map((type) => (
                    <SelectItem key={type} value={type}>
                      {serviceTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={watch("category")}
                onValueChange={(value) => setValue("category", value as ServiceCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {ServiceCategoryEnum.options.map((category) => (
                    <SelectItem key={category} value={category}>
                      {serviceCategoryLabels[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Judul Pemeliharaan dan Perbaikan</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Contoh: Ganti oli mesin, Perbaikan rem depan, dll"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Berikan detail tambahan mengenai pemeliharaan dan perbaikan yang dilakukan..."
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Service Date & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceDate">Tanggal Pemeliharaan dan Perbaikan</Label>
              <Input
                id="serviceDate"
                type="date"
                value={formatDateForInput(serviceDate)}
                onChange={(e) => setValue("serviceDate", new Date(e.target.value))}
              />
              {errors.serviceDate && (
                <p className="text-sm text-red-600">{errors.serviceDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value as ServiceStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {ServiceStatusEnum.options.map((status) => (
                    <SelectItem key={status} value={status}>
                      {serviceStatusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>

          {/* Cost & Mileage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Biaya (Opsional)</Label>
              <Input
                id="cost"
                type="number"
                {...register("cost", { valueAsNumber: true })}
                placeholder="0"
                min="0"
                step="1000"
              />
              {errors.cost && (
                <p className="text-sm text-red-600">{errors.cost.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Kilometer Saat Ini (Opsional)</Label>
              <Input
                id="mileage"
                type="number"
                {...register("mileage", { valueAsNumber: true })}
                placeholder="0"
                min="0"
              />
              {errors.mileage && (
                <p className="text-sm text-red-600">{errors.mileage.message}</p>
              )}
            </div>
          </div>

          {/* Next Due Date */}
          <div className="space-y-2">
            <Label htmlFor="nextDueDate">Tanggal Pemeliharaan Berikutnya (Opsional)</Label>
            <Input
              id="nextDueDate"
              type="date"
              value={formatDateForInput(nextDueDate)}
              onChange={(e) => setValue("nextDueDate", e.target.value ? new Date(e.target.value) : undefined)}
            />
            {errors.nextDueDate && (
              <p className="text-sm text-red-600">{errors.nextDueDate.message}</p>
            )}
          </div>

          {/* Vendor & Invoice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor">Bengkel/Vendor (Opsional)</Label>
              <Input
                id="vendor"
                {...register("vendor")}
                placeholder="Nama bengkel atau vendor"
              />
              {errors.vendor && (
                <p className="text-sm text-red-600">{errors.vendor.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice">Nomor Invoice (Opsional)</Label>
              <Input
                id="invoice"
                {...register("invoice")}
                placeholder="Nomor invoice atau referensi"
              />
              {errors.invoice && (
                <p className="text-sm text-red-600">{errors.invoice.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {initialData ? "Memperbarui..." : "Menyimpan..."}
                </>
              ) : (
                initialData ? "Perbarui Riwayat" : "Simpan Riwayat"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}