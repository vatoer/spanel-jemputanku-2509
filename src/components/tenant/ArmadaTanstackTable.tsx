"use client";

import type { Armada } from "@/schema/armada";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";


// Dummy data
const data: Armada[] = [
  { platNomor: "B 1234 CD", tipe: "Bus Besar", kapasitas: 45, tahun: 2020, merk: "Mercedes", warna: "Biru", status: "Aktif", nomorRangka: "R12345", nomorMesin: "M12345", tanggalStnk: "2025-01-01", tanggalKir: "2025-01-01", fitur: ["AC"], catatan: "" },
  { platNomor: "B 5678 EF", tipe: "Bus Sedang", kapasitas: 30, tahun: 2019, merk: "Hino", warna: "Putih", status: "Maintenance", nomorRangka: "R56789", nomorMesin: "M56789", tanggalStnk: "2025-01-01", tanggalKir: "2025-01-01", fitur: ["TV"], catatan: "" },
  { platNomor: "B 9999 ZZ", tipe: "Bus Kecil", kapasitas: 20, tahun: 2018, merk: "Isuzu", warna: "Merah", status: "Tidak Aktif", nomorRangka: "R99999", nomorMesin: "M99999", tanggalStnk: "2025-01-01", tanggalKir: "2025-01-01", fitur: [], catatan: "" },
];

const columns: ColumnDef<Armada>[] = [
  {
    header: "No Polisi",
    accessorKey: "platNomor",
    cell: info => String(info.getValue()),
  },
  {
    header: "Tipe",
    accessorKey: "tipe",
    cell: info => String(info.getValue()),
  },
  {
    header: "Kapasitas",
    accessorKey: "kapasitas",
    cell: info => String(info.getValue()),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: info => {
      const value = String(info.getValue());
      return (
        <span
          className={
            value === "Aktif"
              ? "text-green-600 font-semibold"
              : value === "Maintenance"
              ? "text-yellow-500 font-semibold"
              : "text-gray-500 font-semibold"
          }
        >
          {value}
        </span>
      );
    },
  },
  {
    header: "Aksi",
    id: "aksi",
    cell: ({ row }) => {
      const platNomor = row.original.platNomor.replace(/\s/g, "");
      return (
        <div className="flex gap-2 items-center">
          <Link
            href={`/armada/${platNomor}`}
            className="text-gray-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition cursor-pointer"
            title="Detail"
            aria-label="Lihat Detail"
          >
            <FaEye />
          </Link>
          <Link
            href={`/armada/${platNomor}/edit`}
            className="text-gray-500 hover:text-yellow-600 p-1 rounded hover:bg-yellow-50 transition cursor-pointer"
            title="Edit"
            aria-label="Edit Armada"
          >
            <FaEdit />
          </Link>
          <button
            className="text-gray-500 hover:text-red-600 p-1 rounded hover:bg-red-50 transition cursor-pointer"
            title="Hapus"
            aria-label="Hapus Armada"
          >
            <FaTrash />
          </button>
        </div>
      );
    },
  },
];

export function ArmadaTanstackTable() {
  const table = useReactTable<Armada>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow border">
        <thead className="bg-blue-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="py-2 px-4 text-left font-semibold border-b border-blue-200"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-blue-50 transition">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="py-2 px-4 border-b border-gray-100">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
