"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Driver type based on our service function return
type DriverDetailData = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
  UserRole?: Array<{
    role: {
      id: string;
      name: string;
    };
  }>;
  UserTenant?: Array<{
    tenant: {
      id: string;
      name: string;
    };
  }>;
  DriverVehicle?: Array<{
    vehicle: {
      id: string;
      licensePlate: string;
      manufacturer: string;
      model: string;
      year: number;
      color: string;
      status: string;
    };
  }>;
  Ride?: Array<{
    id: string;
    startTime: Date;
    endTime: Date;
    status: string;
    vehicle: {
      id: string;
      licensePlate: string;
      manufacturer: string;
      model: string;
    };
    origin: any;
    destination: any;
  }>;
  _count?: {
    Ride: number;
    DriverVehicle: number;
  };
} | null;

type DriverDetailProps = {
  driverId: string;
  driverData?: DriverDetailData;
};

// Dummy photos for driver
const dummyPhotos = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80"
];

// Dummy vehicles for assignment
const dummyVehicleList = [
  {
    id: "1",
    licensePlate: "B 1234 ABC",
    manufacturer: "Toyota",
    model: "Hiace",
    year: 2022,
    color: "Putih",
    status: "ACTIVE"
  },
  {
    id: "2", 
    licensePlate: "B 5678 DEF",
    manufacturer: "Isuzu",
    model: "Elf",
    year: 2021,
    color: "Biru",
    status: "ACTIVE"
  },
  {
    id: "3",
    licensePlate: "B 9012 GHI", 
    manufacturer: "Mitsubishi",
    model: "Colt Diesel",
    year: 2020,
    color: "Merah",
    status: "MAINTENANCE"
  }
];

export function DriverDetail({ driverId, driverData }: DriverDetailProps) {
  const [data, setData] = useState<DriverDetailData | undefined>(driverData);
  const router = useRouter();
  const [photoIdx, setPhotoIdx] = useState(0);
  const [photos, setPhotos] = useState(dummyPhotos);
  const [assignOpen, setAssignOpen] = useState(false);

  function handlePhotoNext() {
    setPhotoIdx((idx) => (idx + 1) % photos.length);
  }
  
  function handlePhotoPrev() {
    setPhotoIdx((idx) => (idx - 1 + photos.length) % photos.length);
  }

  function handleAssignVehicle(vehicleId: string) {
    const selectedVehicle = dummyVehicleList.find(v => v.id === vehicleId) || null;
    alert(`Kendaraan dengan ID ${vehicleId} dipilih (fungsi assign belum diimplementasi).`);
    setAssignOpen(false);
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      "ACTIVE": "bg-green-100 text-green-800",
      "INACTIVE": "bg-gray-100 text-gray-800",
      "SUSPENDED": "bg-red-100 text-red-800"
    };
    
    const statusLabels = {
      "ACTIVE": "Aktif",
      "INACTIVE": "Tidak Aktif", 
      "SUSPENDED": "Ditangguhkan"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses] || statusClasses.INACTIVE}`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    );
  };

  const getRideStatusBadge = (status: string) => {
    const statusClasses = {
      "COMPLETED": "bg-green-100 text-green-800",
      "IN_PROGRESS": "bg-blue-100 text-blue-800",
      "CANCELLED": "bg-red-100 text-red-800",
      "BOOKED": "bg-yellow-100 text-yellow-800"
    };
    
    const statusLabels = {
      "COMPLETED": "Selesai",
      "IN_PROGRESS": "Berlangsung",
      "CANCELLED": "Dibatalkan",
      "BOOKED": "Dipesan"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses] || statusClasses.BOOKED}`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    );
  };

  return (
    <section className="space-y-6">
      {/* Driver Photos Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
        <div className="font-semibold text-lg text-blue-700 mb-4">Foto Driver</div>
        <div className="relative">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={data?.image || photos[photoIdx]} 
              alt="Driver" 
              className="w-full h-full object-cover"
            />
          </div>
          {photos.length > 1 && (
            <>
              <button 
                onClick={handlePhotoPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={handlePhotoNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
        {photos.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {photos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPhotoIdx(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === photoIdx ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Driver Info Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
        <div className="font-semibold text-lg text-blue-700 mb-4">Informasi Driver</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-gray-500 text-sm">Nama Lengkap</div>
            <div className="font-semibold text-lg">{data?.name || "Nama tidak tersedia"}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Email</div>
            <div className="font-semibold text-lg">{data?.email}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Status</div>
            <div className="font-semibold text-lg">{getStatusBadge(data?.status || "INACTIVE")}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Tanggal Bergabung</div>
            <div className="font-semibold text-lg">{data?.createdAt ? formatDate(data.createdAt) : "-"}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Total Perjalanan</div>
            <div className="font-semibold text-lg">{data?._count?.Ride || 0} perjalanan</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Kendaraan Ditugaskan</div>
            <div className="font-semibold text-lg">{data?._count?.DriverVehicle || 0} kendaraan</div>
          </div>
        </div>
      </div>

      {/* Assigned Vehicles Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg text-blue-700">Kendaraan yang Ditugaskan</div>
          <Button size="sm" variant="outline" onClick={() => setAssignOpen(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tugaskan Kendaraan
          </Button>
        </div>
        
        {data?.DriverVehicle && data.DriverVehicle.length > 0 ? (
          <div className="space-y-3">
            {data.DriverVehicle.map((dv, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{dv.vehicle.licensePlate}</div>
                  <div className="text-gray-600 text-sm">{dv.vehicle.manufacturer} {dv.vehicle.model} ({dv.vehicle.year})</div>
                  <div className="text-gray-500 text-xs">Warna: {dv.vehicle.color}</div>
                </div>
                <div className="text-right">
                  {getStatusBadge(dv.vehicle.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 italic text-center py-8">
            Belum ada kendaraan yang ditugaskan untuk driver ini.
          </div>
        )}
      </div>

      {/* Recent Rides Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
        <div className="font-semibold text-lg text-blue-700 mb-4">Perjalanan Terbaru</div>
        
        {data?.Ride && data.Ride.length > 0 ? (
          <div className="space-y-3">
            {data.Ride.map((ride, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{ride.vehicle.licensePlate}</div>
                  <div className="text-gray-600 text-sm">
                    {formatDate(ride.startTime)} - {formatDate(ride.endTime)}
                  </div>
                  <div className="text-gray-500 text-xs">{ride.vehicle.manufacturer} {ride.vehicle.model}</div>
                </div>
                <div className="text-right">
                  {getRideStatusBadge(ride.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 italic text-center py-8">
            Belum ada riwayat perjalanan untuk driver ini.
          </div>
        )}
      </div>

      {/* Modal Assign Vehicle */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Pilih Kendaraan</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            {dummyVehicleList.map((vehicle, i) => (
              <div 
                key={i} 
                className="flex items-center gap-4 p-3 rounded hover:bg-blue-50 cursor-pointer border border-gray-200" 
                onClick={() => handleAssignVehicle(vehicle.id)}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{vehicle.licensePlate}</div>
                  <div className="text-gray-600 text-sm">{vehicle.manufacturer} {vehicle.model} ({vehicle.year})</div>
                  <div className="text-gray-500 text-xs">Warna: {vehicle.color}</div>
                </div>
                <div className="text-xs font-medium">
                  {getStatusBadge(vehicle.status)}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}