"use client";
import type { Riwayat } from "@/schema/riwayat";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

export function RiwayatTanstackTable({ data }: { data: Riwayat[] }) {
  const columns: ColumnDef<Riwayat>[] = [
  { header: "Tanggal", accessorKey: "tanggal", cell: info => info.getValue() },
  { header: "Jenis", accessorKey: "jenis", cell: info => (info.getValue() as string[]).join(", ") },
  { header: "Keterangan", accessorKey: "keterangan", cell: info => info.getValue() },
    {
      header: "Biaya (Rp)",
      accessorKey: "biaya",
      cell: info => <span className="text-right block">{Number(info.getValue()).toLocaleString()}</span>,
    },
  ];
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow border">
        <thead className="bg-blue-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className={`py-2 px-4 font-semibold border-b border-blue-200 ${header.column.id === "biaya" ? "text-right" : "text-left"}`}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-blue-50 transition">
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className={`py-2 px-4 border-b border-gray-100 ${cell.column.id === "biaya" ? "text-right" : ""}`}
                >
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
