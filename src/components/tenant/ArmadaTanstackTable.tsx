"use client";

import { Button } from "@/components/ui/button";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// Vehicle interface based on Prisma schema
interface Vehicle {
  id: string;
  tenantId: string;
  licensePlate: string; // plat nomor
  model: string;
  manufacturer: string; // merk
  year: number;
  color: string;
  capacity: number;
  status: string;
  chassisNumber?: string | null; // nomor rangka
  engineNumber?: string | null; // nomor mesin
  stnkDate?: string | null; // tanggal STNK
  kirDate?: string | null; // tanggal KIR
  taxDate?: string | null; // tanggal pajak
  features?: string[]; // fitur
  notes?: string | null; // catatan
  driverId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ArmadaTanstackTableProps {
  data?: Vehicle[];
}

const defaultData: Vehicle[] = [
  {
    id: "1",
    tenantId: "tenant1",
    licensePlate: "B 1234 CD",
    model: "Sprinter 515 CDI",
    manufacturer: "Mercedes",
    year: 2020,
    color: "Putih",
    capacity: 45,
    driverId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "ACTIVE",
    chassisNumber: "WDBVF1EA1GV123456",
    engineNumber: "OM651123456",
    stnkDate: "2025-06-15",
    kirDate: "2025-08-20",
    taxDate: "2025-12-31",
    features: ["AC", "WiFi", "USB Charger", "GPS"],
    notes: "Unit unggulan dengan kondisi prima"
  },
  {
    id: "2",
    tenantId: "tenant1", 
    licensePlate: "B 5678 EF",
    model: "Elf NMR 71",
    manufacturer: "Isuzu",
    year: 2019,
    color: "Biru",
    capacity: 30,
    driverId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "MAINTENANCE",
    chassisNumber: "JALMFA1E50H123456",
    engineNumber: "4HK1TCN40",
    stnkDate: "2025-03-10",
    kirDate: "2025-05-15",
    taxDate: "2025-09-30",
    features: ["AC", "GPS"],
    notes: "Sedang dalam perawatan rutin"
  },
  {
    id: "3",
    tenantId: "tenant1",
    licensePlate: "B 9012 GH", 
    model: "Colt Diesel FE 74",
    manufacturer: "Mitsubishi",
    year: 2018,
    color: "Hijau",
    capacity: 20,
    driverId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "INACTIVE",
    chassisNumber: "MMBJNKA30GH123456",
    engineNumber: "4M40T",
    stnkDate: "2024-12-20",
    kirDate: "2025-02-28",
    taxDate: "2025-06-15",
    features: ["AC"],
    notes: "Perlu perbaikan sistem transmisi"
  }
];

export function ArmadaTanstackTable({ data = defaultData }: ArmadaTanstackTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      "ACTIVE": "bg-green-100 text-green-800 border-green-200",
      "MAINTENANCE": "bg-yellow-100 text-yellow-800 border-yellow-200", 
      "INACTIVE": "bg-red-100 text-red-800 border-red-200"
    };
    
    const statusLabels = {
      "ACTIVE": "Active",
      "MAINTENANCE": "Maintenance",
      "INACTIVE": "Inactive"
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    );
  };

  const handleRowClick = (vehicle: Vehicle) => {
    const platNomor = vehicle.licensePlate.replace(/\s/g, "");
    router.push(`/armada/${platNomor}`);
  };



  const handleViewDetail = (e: React.MouseEvent, vehicle: Vehicle) => {
    e.stopPropagation();
    const platNomor = vehicle.licensePlate.replace(/\s/g, "");
    router.push(`/armada/${platNomor}`);
  };

  const handleEdit = (e: React.MouseEvent, vehicle: Vehicle) => {
    e.stopPropagation();
    const platNomor = vehicle.licensePlate.replace(/\s/g, "");
    router.push(`/armada/${platNomor}/edit`);
  };

  const handleDelete = async (e: React.MouseEvent, vehicle: Vehicle) => {
    e.stopPropagation();
    if (confirm(`Apakah Anda yakin ingin menghapus armada ${vehicle.licensePlate}?`)) {
      try {
        console.log("Deleting vehicle:", vehicle.licensePlate);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Error deleting vehicle:", error);
      }
    }
  };

  const columns: ColumnDef<Vehicle>[] = [
    {
      header: "Kendaraan",
      accessorKey: "licensePlate",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900">
            {row.original.licensePlate}
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700">
              {row.original.model}
            </span>
            <span className="text-xs text-gray-500">
              {row.original.manufacturer} • {row.original.year}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Spesifikasi",
      accessorKey: "capacity",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900">
            {row.original.capacity} penumpang
          </div>
          <div className="text-xs text-gray-500">
            {row.original.color} • {row.original.features?.length || 0} fitur
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status", 
      cell: ({ row }) => getStatusBadge(row.original.status || "ACTIVE"),
    },
    {
      header: "Aksi",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleViewDetail(e, row.original)}
            className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            title="Lihat Detail"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="sr-only">Lihat Detail</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleEdit(e, row.original)}
            className="h-8 px-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleDelete(e, row.original)}
            className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
            title="Hapus"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="sr-only">Hapus</span>
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Belum ada data armada</h3>
            <p className="text-gray-500 max-w-sm">
              Mulai dengan menambahkan kendaraan pertama ke armada Anda
            </p>
          </div>
          <Button 
            onClick={() => router.push('/armada/tambah')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Tambah Armada Pertama
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {table.getHeaderGroups()[0]?.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (
                        <span className="text-gray-400">
                          {header.column.getIsSorted() === 'desc' ? '↓' : '↑'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map(row => (
                <tr 
                  key={row.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {table.getRowModel().rows.map(row => (
          <div 
            key={row.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleRowClick(row.original)}
          >
            <div className="space-y-3">
              {/* Header with plat nomor and status */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="font-medium text-gray-900 text-lg">
                    {row.original.licensePlate}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700">
                      {row.original.model}
                    </span>
                  </div>
                </div>
                {getStatusBadge(row.original.status || "ACTIVE")}
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-gray-500 block">Merk</span>
                  <span className="font-medium">{row.original.manufacturer}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-500 block">Tahun</span>
                  <span className="font-medium">{row.original.year}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-500 block">Kapasitas</span>
                  <span className="font-medium">{row.original.capacity} penumpang</span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-500 block">Warna</span>
                  <span className="font-medium">{row.original.color}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  {row.original.features?.length || 0} fitur tersedia
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleViewDetail(e, row.original)}
                    className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleEdit(e, row.original)}
                    className="h-8 px-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDelete(e, row.original)}
                    className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>
              Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1"
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
