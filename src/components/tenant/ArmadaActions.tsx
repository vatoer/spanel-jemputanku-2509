"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

const quickAddSchema = z.object({
  platNomor: z.string().min(5, "Plat nomor wajib diisi").max(12),
  tipe: z.string().min(2, "Tipe bus wajib diisi"),
  kapasitas: z.coerce.number().min(1, "Kapasitas minimal 1"),
  status: z.enum(["Aktif", "Maintenance", "Tidak Aktif"]),
});

export function ArmadaActions() {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quickAddSchema),
    defaultValues: {
      platNomor: "",
      tipe: "",
      kapasitas: 30,
      status: "Aktif",
    },
  });

  function onSubmit(data) {
    // TODO: Integrasi ke backend/optimistic update
    setSuccess(true);
    setTimeout(() => {
      setOpen(false);
      setSuccess(false);
      reset();
    }, 1200);
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setOpen(true)}>
        Tambah Armada
      </Button>
      <Button variant="outline">Export Data</Button>
      <Button variant="outline">Import Data</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Armada</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
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
              <label className="block text-sm font-medium text-blue-700 mb-1">Status Armada</label>
              <select {...register("status")}
                className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="Aktif">Aktif</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
              {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>}
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 w-full mt-2">
                {success ? "Tersimpan!" : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
