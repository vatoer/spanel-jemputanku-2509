"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox";
import { Textarea } from "@/components/ui/textarea";
import { riwayatSchema } from "@/schema/riwayat";
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
    resolver: zodResolver(riwayatSchema),
    mode: "onTouched",
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const submitHandler = async (data: any) => {
    // Convert jenis to array (for multi-select)
    const jenis = Array.isArray(data.jenis)
      ? data.jenis
      : typeof data.jenis === "string"
        ? Array.from(document.querySelectorAll('select[name="jenis"] option:checked')).map(opt => (opt as HTMLOptionElement).value)
        : [];
    // Convert fileBukti to array of File
    let fileBukti: File[] = [];
    if (data.fileBukti && data.fileBukti instanceof FileList) {
      fileBukti = Array.from(data.fileBukti);
    }
    onSubmit({ ...data, jenis, fileBukti });
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
              <Input type="date" {...register("tanggal")} />
              {errors.tanggal?.message && <p className="text-red-500 text-xs mt-1">{String(errors.tanggal.message)}</p>}
            </div>
            <div className="flex flex-col gap-1 max-w-xs mx-auto w-full relative">
              <Controller
                name="jenis"
                control={control}
                render={({ field }) => (
                  <MultiSelectCombobox
                    label="Jenis"
                    options={[
                      { value: "Service Berkala", label: "Service Berkala" },
                      { value: "Ganti Oli", label: "Ganti Oli" },
                      { value: "Tune Up", label: "Tune Up" },
                      { value: "Ganti Ban", label: "Ganti Ban" },
                      { value: "Ganti Kampas Rem", label: "Ganti Kampas Rem" },
                      { value: "Perbaikan Mesin", label: "Perbaikan Mesin" },
                      { value: "Perbaikan AC", label: "Perbaikan AC" },
                      { value: "Perbaikan Body/Karoseri", label: "Perbaikan Body/Karoseri" },
                      { value: "Penggantian Aki", label: "Penggantian Aki" },
                      { value: "Perbaikan Kelistrikan", label: "Perbaikan Kelistrikan" },
                      { value: "Lainnya", label: "Lainnya" },
                    ]}
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Pilih jenis pemeliharaan/perbaikan"
                    error={errors.jenis?.message as string}
                  />
                )}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Biaya (Rp)</label>
              <Input type="number" min={0} {...register("biaya")} />
              {errors.biaya?.message && <p className="text-red-500 text-xs mt-1">{String(errors.biaya.message)}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Tempat Service</label>
              <Input placeholder="Nama bengkel / tempat service" {...register("tempatService")} />
              {errors.tempatService?.message && <p className="text-red-500 text-xs mt-1">{String(errors.tempatService.message)}</p>}
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Keterangan</label>
            <Textarea placeholder="Keterangan" {...register("keterangan")} />
            {errors.keterangan?.message && <p className="text-red-500 text-xs mt-1">{String(errors.keterangan.message)}</p>}
          </div>
          <div>
            <label className="block font-medium mb-1">Upload Bukti (PDF/Gambar)</label>
            <Input type="file" accept="application/pdf,image/*" multiple {...register("fileBukti")} />
            {errors.fileBukti?.message && <p className="text-red-500 text-xs mt-1">{String(errors.fileBukti.message)}</p>}
            <p className="text-xs text-gray-500 mt-1">Bisa upload lebih dari satu file sekaligus.</p>
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
