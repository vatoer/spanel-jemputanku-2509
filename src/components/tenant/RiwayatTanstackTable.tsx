"use client";
import { Button } from "@/components/ui/button";
import { ServiceRecord } from "@/lib/services/serviceRecord";
import { serviceCategoryLabels, serviceStatusLabels, serviceTypeLabels } from "@/schema/riwayat";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

interface RiwayatTanstackTableProps {
  data: ServiceRecord[];
  platNomor?: string;
}

export function RiwayatTanstackTable({ data, platNomor }: RiwayatTanstackTableProps) {
  const router = useRouter();

  const formatCurrency = (amount: number | undefined | null) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      COMPLETED: "bg-green-100 text-green-800 border-green-200",
      IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200", 
      SCHEDULED: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
      OVERDUE: "bg-orange-100 text-orange-800 border-orange-200"
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
        {serviceStatusLabels[status as keyof typeof serviceStatusLabels] || status}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeClasses = {
      MAINTENANCE: "bg-blue-100 text-blue-700",
      REPAIR: "bg-red-100 text-red-700", 
      INSPECTION: "bg-yellow-100 text-yellow-700",
      UPGRADE: "bg-purple-100 text-purple-700"
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${typeClasses[type as keyof typeof typeClasses] || "bg-gray-100 text-gray-700"}`}>
        {serviceTypeLabels[type as keyof typeof serviceTypeLabels] || type}
      </span>
    );
  };

  const handleRowClick = (record: ServiceRecord) => {
    if (platNomor) {
      router.push(`/armada/${platNomor}/riwayat/${record.id}`);
    }
  };

  const handleViewDetail = (e: React.MouseEvent, record: ServiceRecord) => {
    e.stopPropagation(); // Prevent row click
    if (platNomor) {
      router.push(`/armada/${platNomor}/riwayat/${record.id}`);
    }
  };

  const columns: ColumnDef<ServiceRecord>[] = [
    {
      header: "Tanggal",
      accessorKey: "serviceDate",
      cell: ({ row }) => (
        <div className="font-medium">
          {formatDate(row.original.serviceDate)}
        </div>
      ),
    },
    {
      header: "Pemeliharaan dan Perbaikan",
      accessorKey: "title",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900 truncate">
            {row.original.title}
          </div>
          <div className="flex items-center gap-2">
            {getTypeBadge(row.original.type)}
            <span className="text-xs text-gray-500">
              {serviceCategoryLabels[row.original.category as keyof typeof serviceCategoryLabels]}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Deskripsi", 
      accessorKey: "description",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 overflow-hidden" 
             style={{
               display: '-webkit-box',
               WebkitLineClamp: 2,
               WebkitBoxOrient: 'vertical',
               textOverflow: 'ellipsis'
             }}
             title={row.original.description || ""}>
            {row.original.description || "-"}
          </p>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status", 
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      header: "Biaya",
      accessorKey: "cost",
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatCurrency(row.original.cost)}
        </div>
      ),
    },
    {
      header: "Aksi",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
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
        </div>
      ),
    },
  ];

  const table = useReactTable({ 
    data, 
    columns, 
    getCoreRowModel: getCoreRowModel() 
  });

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Riwayat Pemeliharaan dan Perbaikan</h3>
        <p className="text-gray-500 mb-4">Mulai dengan menambahkan catatan pemeliharaan dan perbaikan pertama untuk kendaraan ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={`py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 ${
                      header.column.id === "cost" ? "text-right" : ""
                    } ${header.column.id === "actions" ? "text-center" : ""}`}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr 
                key={row.id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => handleRowClick(row.original)}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className={`py-4 px-4 whitespace-nowrap text-sm ${
                      cell.column.id === "cost" ? "text-right" : ""
                    } ${cell.column.id === "actions" ? "text-center" : ""}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.map((record) => (
          <div
            key={record.id}
            onClick={() => handleRowClick(record)}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900 truncate">{record.title}</h4>
                <p className="text-sm text-gray-500">{formatDate(record.serviceDate)}</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                {getStatusBadge(record.status)}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleViewDetail(e, record)}
                  className="h-6 px-2 text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              {getTypeBadge(record.type)}
              <span className="text-xs text-gray-500">
                {serviceCategoryLabels[record.category as keyof typeof serviceCategoryLabels]}
              </span>
            </div>

            {record.description && (
              <p className="text-sm text-gray-600 overflow-hidden mb-2"
                 style={{
                   display: '-webkit-box',
                   WebkitLineClamp: 2,
                   WebkitBoxOrient: 'vertical',
                   textOverflow: 'ellipsis'
                 }}>
                {record.description}
              </p>
            )}
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Biaya:</span>
              <span className="font-medium text-gray-900">{formatCurrency(record.cost)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
