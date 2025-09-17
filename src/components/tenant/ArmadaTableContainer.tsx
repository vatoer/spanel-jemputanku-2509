"use client";
import { useState } from "react";
import { ArmadaBulkActions } from "./ArmadaBulkActions";
import { ArmadaEmptyState } from "./ArmadaEmptyState";
import { ArmadaFilterBar } from "./ArmadaFilterBar";
import { ArmadaPagination } from "./ArmadaPagination";
import { ArmadaTable } from "./ArmadaTable";

// Dummy data
const dummyRows = [
  { platNomor: "B 1234 CD", tipe: "Bus Besar", kapasitas: 45, status: "Aktif" },
  { platNomor: "B 5678 EF", tipe: "Bus Sedang", kapasitas: 30, status: "Maintenance" },
  { platNomor: "B 9999 ZZ", tipe: "Bus Kecil", kapasitas: 20, status: "Tidak Aktif" },
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
          <ArmadaTable />
          <ArmadaPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
