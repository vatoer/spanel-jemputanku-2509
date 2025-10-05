"use client";
import { useState } from "react";
import { ArmadaBulkActions } from "./ArmadaBulkActions";
import { ArmadaEmptyState } from "./ArmadaEmptyState";
import { ArmadaFilterBar } from "./ArmadaFilterBar";
import { ArmadaPagination } from "./ArmadaPagination";
import { ArmadaTanstackTable } from "./ArmadaTanstackTable";

// Vehicle interface matching Prisma schema
interface Vehicle {
  id: string;
  tenantId: string;
  licensePlate: string;
  model: string;
  manufacturer: string;
  year: number;
  color: string;
  capacity: number;
  status: string;
  chassisNumber?: string | null;
  engineNumber?: string | null;
  stnkDate?: string | null;
  kirDate?: string | null;
  taxDate?: string | null;
  features?: string[];
  notes?: string | null;
  driverId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Sample data matching Prisma schema
const dummyVehicles: Vehicle[] = [
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
    licensePlate: "B 9999 ZZ",
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
  },
];

export function ArmadaTableContainer() {
  const [page, setPage] = useState(1);
  const [totalPages] = useState(3);
  const [selectedCount, setSelectedCount] = useState(0);
  const [filters, setFilters] = useState({ status: "all", tipe: "", search: "" });
  const [isEmpty, setIsEmpty] = useState(false); // Ganti true untuk lihat empty state

  // Handler untuk filter bar
  const handleFilterChange = (f: { status: string; tipe: string; search: string }) => {
    setFilters(f);
    // TODO: filter data sesuai f
  };
  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    // TODO: filter data sesuai search
  };

  // Handler untuk bulk actions (dummy)
  // TODO: Integrasi dengan ArmadaTable agar setSelectedCount berjalan

  return (
    <div>
      <ArmadaFilterBar onFilterChange={handleFilterChange} onSearchChange={handleSearchChange} />
      <ArmadaBulkActions selectedCount={selectedCount} />
      {isEmpty ? (
        <ArmadaEmptyState />
      ) : (
        <>
          <ArmadaTanstackTable data={dummyVehicles} />
          <ArmadaPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
