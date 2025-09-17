"use client";
import { RiwayatTanstackTable } from "@/components/tenant/RiwayatTanstackTable";
import { TambahRiwayatModal } from "@/components/tenant/TambahRiwayatModal";
import { Riwayat } from "@/schema/riwayat";
import * as React from "react";

export interface RiwayatContainerProps {
  platNomor: string;
}

export function RiwayatContainer({ platNomor }: RiwayatContainerProps) {
  const [riwayat, setRiwayat] = React.useState<Riwayat[]>([
    {
      tanggal: "2025-01-10", jenis: ["Service Berkala"], keterangan: "Ganti oli, filter udara", biaya: 500000,
      tempatService: "",
      fileBukti: undefined
    },
    {
      tanggal: "2025-03-15", jenis: ["Perbaikan"], keterangan: "Ganti kampas rem", biaya: 750000,
      tempatService: "",
      fileBukti: undefined
    },
    {
      tanggal: "2025-06-01", jenis: ["Service Berkala"], keterangan: "Tune up mesin", biaya: 600000,
      tempatService: "",
      fileBukti: undefined
    },
  ]);
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleTambahRiwayat = (data: {
    tanggal: string;
    jenis: string[];
    keterangan: string;
    biaya: number | string;
    tempatService?: string;
    fileBukti?: File[];
  }) => {
    // Only map fields needed for Riwayat type
    const newRiwayat: Riwayat = {
      tanggal: data.tanggal,
      jenis: data.jenis,
      keterangan: data.keterangan,
      biaya: Number(data.biaya),
      tempatService: "",
      fileBukti: undefined
    };
    setRiwayat(prev => [...prev, newRiwayat]);
  };

  return (
    <>
      <RiwayatTanstackTable data={riwayat} />
      <div className="mt-6">
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
          onClick={() => setModalOpen(true)}
        >
          + Tambah Riwayat
        </button>
      </div>
      <TambahRiwayatModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleTambahRiwayat}
      />
    </>
  );
}
