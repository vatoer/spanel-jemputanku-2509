"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { createVehicleServiceRecordSchema } from "@/schema/riwayat";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";


export interface TambahRiwayatModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function TambahRiwayatModal({ open, onClose, onSubmit }: TambahRiwayatModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createVehicleServiceRecordSchema),
    mode: "onTouched",
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const submitHandler = async (data: any) => {
    // File upload will be implemented later
    const { files, ...serviceData } = data;
    
    onSubmit(serviceData);
    handleClose();
  };

  return (
  <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Riwayat Pemeliharaan/Perbaikan</DialogTitle>
        </DialogHeader>

  <form onSubmit={handleSubmit(submitHandler as any)} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">Tanggal</label>
              <Input type="date" {...register("serviceDate")} />
              {errors.serviceDate?.message && <p className="text-red-500 text-xs mt-1">{String(errors.serviceDate.message)}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Jenis Pemeliharaan</label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <select 
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih jenis pemeliharaan</option>
                    <option value="MAINTENANCE">Pemeliharaan</option>
                    <option value="REPAIR">Perbaikan</option>
                    <option value="INSPECTION">Inspeksi</option>
                    <option value="UPGRADE">Upgrade</option>
                  </select>
                )}
              />
              {errors.type?.message && <p className="text-red-500 text-xs mt-1">{String(errors.type.message)}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Kategori</label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <select 
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih kategori</option>
                    <option value="ENGINE">Mesin</option>
                    <option value="TRANSMISSION">Transmisi</option>
                    <option value="BRAKES">Rem</option>
                    <option value="TIRES">Ban</option>
                    <option value="ELECTRICAL">Kelistrikan</option>
                    <option value="AC_HEATING">AC/Pemanas</option>
                    <option value="BODY">Body/Karoseri</option>
                    <option value="INTERIOR">Interior</option>
                    <option value="SAFETY">Keamanan</option>
                    <option value="GENERAL">Umum</option>
                  </select>
                )}
              />
              {errors.category?.message && <p className="text-red-500 text-xs mt-1">{String(errors.category.message)}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Judul</label>
              <Input placeholder="Judul pemeliharaan/perbaikan" {...register("title")} />
              {errors.title?.message && <p className="text-red-500 text-xs mt-1">{String(errors.title.message)}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Biaya (Rp)</label>
              <Input type="number" min={0} {...register("cost")} />
              {errors.cost?.message && <p className="text-red-500 text-xs mt-1">{String(errors.cost.message)}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Tempat Service</label>
              <Input placeholder="Nama bengkel / tempat service" {...register("vendor")} />
              {errors.vendor?.message && <p className="text-red-500 text-xs mt-1">{String(errors.vendor.message)}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Kilometer</label>
              <Input type="number" min={0} placeholder="Kilometer saat service" {...register("mileage")} />
              {errors.mileage?.message && <p className="text-red-500 text-xs mt-1">{String(errors.mileage.message)}</p>}
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Keterangan</label>
            <Textarea placeholder="Keterangan" {...register("description")} />
            {errors.description?.message && <p className="text-red-500 text-xs mt-1">{String(errors.description.message)}</p>}
          </div>
          <div>
            <label className="block font-medium mb-1">Upload Bukti (PDF/Gambar)</label>
            <Input type="file" accept="application/pdf,image/*" multiple {...register("files")} />
            {errors.files?.message && <p className="text-red-500 text-xs mt-1">{String(errors.files.message)}</p>}
            <p className="text-xs text-gray-500 mt-1">Bisa upload lebih dari satu file sekaligus. (akan diimplementasikan nanti)</p>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>Batal</Button>
            <Button type="submit" disabled={isSubmitting}>Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
