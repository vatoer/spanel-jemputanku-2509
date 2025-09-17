import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const statusOptions = [
  { label: "Semua Status", value: "all" },
  { label: "Aktif", value: "aktif" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Tidak Aktif", value: "nonaktif" },
];
const tipeOptions = [
  { label: "Bus Besar", value: "bus-besar" },
  { label: "Bus Sedang", value: "bus-sedang" },
  { label: "Bus Kecil", value: "bus-kecil" },
  { label: "Mobil Besar", value: "mobil-besar" },
  { label: "Mobil Kecil", value: "mobil-kecil" },
];

interface ArmadaFilterBarProps {
  filters?: {
    status?: string;
    tipe?: string;
  };
  onFilterChange?: (filters: { status: string; tipe: string; search: string }) => void;
  onSearchChange?: (search: string) => void;
}

export function ArmadaFilterBar({ filters, onFilterChange }: ArmadaFilterBarProps) {
  const [status, setStatus] = useState(filters?.status || "all");
  const [tipe, setTipe] = useState(filters?.tipe || "");
  const [search, setSearch] = useState("");
  const filterActive = status !== "all" || tipe !== "";

  const handleFilterChange = () => {
    onFilterChange?.({ status, tipe, search });
  };
  // Panggil handleFilterChange setiap kali filter berubah
  const onStatusChange = (value: string) => {
    setStatus(value);
    handleFilterChange();
  };
  const onTipeChange = (value: string) => {
    setTipe(value);
    handleFilterChange();
  };
  const onSearchChange = (value: string) => {
    setSearch(value);
    handleFilterChange();
  };
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
      <div className="flex-1 flex items-center gap-2">
        <span className="relative w-full">
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Cari plat nomor, tipe, driver..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
        </span>
        <select
          className={`px-3 py-2 rounded-lg border bg-white focus:outline-none ${status !== "all" ? "bg-blue-100 border-blue-400 text-blue-700 font-semibold" : "text-gray-700"}`}
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          className={`px-3 py-2 rounded-lg border bg-white focus:outline-none ${tipe !== "" ? "bg-blue-100 border-blue-400 text-blue-700 font-semibold" : "text-gray-700"}`}
          value={tipe}
          onChange={e => setTipe(e.target.value)}
        >
          <option value="">Semua Tipe</option>
          {tipeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Cari</button>
      </div>
    </div>
  );
}
