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

// Driver interface based on Prisma User model with DRIVER role
interface Driver {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  VehicleDriver: any[]; // Assigned vehicles
  Ride: any[]; // Recent rides
}

interface DriverTanstackTableProps {
  data?: Driver[];
}

const defaultData: Driver[] = [
  {
    id: "1",
    name: "Ahmad Wijaya",
    email: "ahmad.wijaya@example.com",
    image: null,
    status: "ACTIVE",
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    VehicleDriver: [{ id: "v1", licensePlate: "B 1234 CD" }],
    Ride: [
      { id: "r1", status: "COMPLETED", createdAt: new Date() },
      { id: "r2", status: "COMPLETED", createdAt: new Date() }
    ]
  },
  {
    id: "2", 
    name: "Budi Santoso",
    email: "budi.santoso@example.com",
    image: null,
    status: "ACTIVE",
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date(),
    VehicleDriver: [{ id: "v2", licensePlate: "B 5678 EF" }],
    Ride: [
      { id: "r3", status: "COMPLETED", createdAt: new Date() }
    ]
  },
  {
    id: "3",
    name: "Candra Putra",
    email: "candra.putra@example.com", 
    image: null,
    status: "INACTIVE",
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date(),
    VehicleDriver: [],
    Ride: []
  }
];

export function DriverTanstackTable({ data = defaultData }: DriverTanstackTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      "ACTIVE": "bg-green-100 text-green-800 border-green-200",
      "INACTIVE": "bg-gray-100 text-gray-800 border-gray-200", 
      "SUSPENDED": "bg-red-100 text-red-800 border-red-200"
    };
    
    const statusLabels = {
      "ACTIVE": "Aktif",
      "INACTIVE": "Tidak Aktif",
      "SUSPENDED": "Ditangguhkan"
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    );
  };

  const handleRowClick = (driver: Driver) => {
    router.push(`/driver/${driver.id}`);
  };

  const handleViewDetail = (e: React.MouseEvent, driver: Driver) => {
    e.stopPropagation();
    router.push(`/driver/${driver.id}`);
  };

  const handleEdit = (e: React.MouseEvent, driver: Driver) => {
    e.stopPropagation();
    router.push(`/driver/${driver.id}/edit`);
  };

  const handleDelete = async (e: React.MouseEvent, driver: Driver) => {
    e.stopPropagation();
    if (confirm(`Apakah Anda yakin ingin menghapus driver ${driver.name}?`)) {
      try {
        console.log("Deleting driver:", driver.name);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Error deleting driver:", error);
      }
    }
  };

  const columns: ColumnDef<Driver>[] = [
    {
      header: "Driver",
      accessorKey: "name",
      cell: ({ row }) => {
        const driver = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              {driver.image ? (
                <img 
                  src={driver.image} 
                  alt={driver.name || "Driver"} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-blue-600 font-medium text-sm">
                  {driver.name?.charAt(0) || "?"}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <div className="font-medium text-gray-900">
                {driver.name || "Nama tidak tersedia"}
              </div>
              <div className="text-sm text-gray-500">{driver.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Kendaraan",
      accessorKey: "VehicleDriver",
      cell: ({ row }) => {
        const vehicles = row.original.VehicleDriver;
        return (
          <div className="space-y-1">
            {vehicles.length > 0 ? (
              <>
                <div className="font-medium text-gray-900">
                  {vehicles[0]?.licensePlate}
                </div>
                {vehicles.length > 1 && (
                  <div className="text-xs text-gray-500">
                    +{vehicles.length - 1} kendaraan lainnya
                  </div>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-500 italic">
                Belum ditugaskan
              </span>
            )}
          </div>
        );
      },
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Belum ada data driver</h3>
            <p className="text-gray-500 max-w-sm">
              Mulai dengan menambahkan driver pertama ke sistem Anda
            </p>
          </div>
          <Button 
            onClick={() => router.push('/driver/tambah')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Tambah Driver Pertama
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
              {/* Header with driver info and status */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {row.original.image ? (
                      <img 
                        src={row.original.image} 
                        alt={row.original.name || "Driver"} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-blue-600 font-medium text-sm">
                        {row.original.name?.charAt(0) || "?"}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900 text-lg">
                      {row.original.name || "Nama tidak tersedia"}
                    </div>
                    <div className="text-sm text-gray-500">{row.original.email}</div>
                  </div>
                </div>
                {getStatusBadge(row.original.status || "ACTIVE")}
              </div>

              {/* Driver Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-gray-500 block">Kendaraan</span>
                  <span className="font-medium">
                    {row.original.VehicleDriver.length > 0 
                      ? `${row.original.VehicleDriver[0]?.licensePlate}${row.original.VehicleDriver.length > 1 ? ` +${row.original.VehicleDriver.length - 1}` : ''}`
                      : "Belum ditugaskan"
                    }
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-500 block">Perjalanan</span>
                  <span className="font-medium">{row.original.Ride.length} selesai</span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-500 block">Bergabung</span>
                  <span className="font-medium">{formatDate(row.original.createdAt)}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-500 block">Status</span>
                  <span className="font-medium">{row.original.status}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Driver ID: {row.original.id}
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