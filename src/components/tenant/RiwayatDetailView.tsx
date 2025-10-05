"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    serviceCategoryLabels,
    serviceStatusLabels,
    serviceTypeLabels,
    VehicleServiceRecord,
} from "@/schema/riwayat";

interface RiwayatDetailViewProps {
  serviceRecord: VehicleServiceRecord;
}

export function RiwayatDetailView({ serviceRecord }: RiwayatDetailViewProps) {
  const formatCurrency = (amount: number | undefined | null) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "SCHEDULED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      case "OVERDUE":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "MAINTENANCE":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "REPAIR":
        return "bg-red-100 text-red-800 border-red-200";
      case "INSPECTION":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "UPGRADE":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl font-bold">
                {serviceRecord.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getTypeBadgeColor(serviceRecord.type)}`}>
                  {serviceTypeLabels[serviceRecord.type as keyof typeof serviceTypeLabels]}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getStatusBadgeColor(serviceRecord.status)}`}>
                  {serviceStatusLabels[serviceRecord.status as keyof typeof serviceStatusLabels]}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Tanggal Pemeliharaan dan Perbaikan</p>
              <p className="text-base">{formatDate(serviceRecord.serviceDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Kategori</p>
              <p className="text-base">{serviceCategoryLabels[serviceRecord.category as keyof typeof serviceCategoryLabels]}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Biaya</p>
              <p className="text-base font-semibold">{formatCurrency(serviceRecord.cost)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Pemeliharaan dan Perbaikan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceRecord.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Deskripsi</p>
                  <p className="text-sm leading-relaxed">{serviceRecord.description}</p>
                </div>
              )}
              
              {serviceRecord.mileage && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Kilometer</p>
                  <p className="text-sm">{serviceRecord.mileage?.toLocaleString("id-ID")} km</p>
                </div>
              )}

              {serviceRecord.vendor && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Vendor/Bengkel</p>
                  <p className="text-sm">{serviceRecord.vendor}</p>
                </div>
              )}

              {serviceRecord.invoice && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">No. Invoice</p>
                  <p className="text-sm font-mono">{serviceRecord.invoice}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Jadwal & Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Tanggal Dibuat</p>
                <p className="text-sm">{new Date(serviceRecord.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Terakhir Diperbarui</p>
                <p className="text-sm">{new Date(serviceRecord.updatedAt).toLocaleDateString("id-ID", {
                  year: "numeric", 
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}</p>
              </div>

              {serviceRecord.nextDueDate && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Pemeliharaan dan Perbaikan Berikutnya</p>
                  <p className="text-sm">{formatDate(serviceRecord.nextDueDate)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats - if we want to add some stats later */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ringkasan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{serviceRecord.cost ? formatCurrency(serviceRecord.cost) : "-"}</p>
              <p className="text-sm text-blue-600">Total Biaya</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{serviceRecord.mileage ? `${serviceRecord.mileage?.toLocaleString("id-ID")} km` : "-"}</p>
              <p className="text-sm text-green-600">Kilometer</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {serviceRecord.nextDueDate 
                  ? Math.ceil((new Date(serviceRecord.nextDueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  : "-"
                }
              </p>
              <p className="text-sm text-purple-600">Hari ke Pemeliharaan dan Perbaikan Berikutnya</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}