"use client";
import { useState } from "react";
import { DriverTanstackTable } from "./DriverTanstackTable";

// Driver interface matching Prisma User model with DRIVER role
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

interface DriverTableContainerProps {
  drivers?: Driver[];
}

// Sample data for drivers
const dummyDrivers: Driver[] = [
  {
    id: "1",
    name: "Ahmad Wijaya",
    email: "ahmad.wijaya@example.com",
    image: null,
    status: "ACTIVE",
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    VehicleDriver: [
      { id: "v1", licensePlate: "B 1234 CD" }
    ],
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
    VehicleDriver: [
      { id: "v2", licensePlate: "B 5678 EF" }
    ],
    Ride: [
      { id: "r3", status: "COMPLETED", createdAt: new Date() },
      { id: "r4", status: "COMPLETED", createdAt: new Date() },
      { id: "r5", status: "COMPLETED", createdAt: new Date() }
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
  },
  {
    id: "4",
    name: "Dedi Kurniawan",
    email: "dedi.kurniawan@example.com",
    image: null,
    status: "ACTIVE",
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date(),
    VehicleDriver: [
      { id: "v3", licensePlate: "B 9012 GH" },
      { id: "v4", licensePlate: "B 3456 IJ" }
    ],
    Ride: [
      { id: "r6", status: "COMPLETED", createdAt: new Date() }
    ]
  },
  {
    id: "5",
    name: "Eko Prasetyo",
    email: "eko.prasetyo@example.com",
    image: null,
    status: "SUSPENDED",
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date(),
    VehicleDriver: [],
    Ride: []
  }
];

export function DriverTableContainer({ drivers = dummyDrivers }: DriverTableContainerProps) {
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter drivers based on status and search term
  const filteredDrivers = drivers.filter(driver => {
    const matchesStatus = filterStatus === "ALL" || driver.status === filterStatus;
    const matchesSearch = !searchTerm || 
      driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleBulkAction = (action: string) => {
    if (selectedDrivers.length === 0) {
      alert("Pilih driver terlebih dahulu");
      return;
    }
    
    switch (action) {
      case "activate":
        console.log("Aktivasi driver:", selectedDrivers);
        // TODO: Implement bulk activation
        break;
      case "deactivate":
        console.log("Nonaktifkan driver:", selectedDrivers);
        // TODO: Implement bulk deactivation
        break;
      case "delete":
        if (confirm(`Apakah Anda yakin ingin menghapus ${selectedDrivers.length} driver?`)) {
          console.log("Hapus driver:", selectedDrivers);
          // TODO: Implement bulk deletion
        }
        break;
      default:
        break;
    }
  };

  const getStatsData = () => {
    const total = drivers.length;
    const active = drivers.filter(d => d.status === "ACTIVE").length;
    const inactive = drivers.filter(d => d.status === "INACTIVE").length;
    const suspended = drivers.filter(d => d.status === "SUSPENDED").length;
    
    return { total, active, inactive, suspended };
  };

  const stats = getStatsData();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Driver</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600">👨‍✈️</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600">✅</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tidak Aktif</p>
              <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-600">⏸️</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ditangguhkan</p>
              <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600">🚫</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Cari nama atau email driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[250px]"
            />
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Semua Status</option>
              <option value="ACTIVE">Aktif</option>
              <option value="INACTIVE">Tidak Aktif</option>
              <option value="SUSPENDED">Ditangguhkan</option>
            </select>
          </div>

          {selectedDrivers.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("activate")}
                className="px-3 py-2 text-sm bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium transition"
              >
                ✅ Aktifkan ({selectedDrivers.length})
              </button>
              <button
                onClick={() => handleBulkAction("deactivate")}
                className="px-3 py-2 text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition"
              >
                ⏸️ Nonaktifkan ({selectedDrivers.length})
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-3 py-2 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium transition"
              >
                🗑️ Hapus ({selectedDrivers.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <DriverTanstackTable data={filteredDrivers} />
      </div>
    </div>
  );
}