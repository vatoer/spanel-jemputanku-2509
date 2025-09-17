"use client";
import Link from "next/link";
import { useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

const dummyRows = [
  {
    platNomor: "B 1234 CD",
    tipe: "Bus Besar",
    kapasitas: 45,
    status: "Aktif"
  },
  {
    platNomor: "B 5678 EF",
    tipe: "Bus Sedang",
    kapasitas: 30,
    status: "Maintenance"
  }
];

export function ArmadaTable() {
  const [deletePlat, setDeletePlat] = useState<string|null>(null);

  function handleDelete(platNomor: string) {
    setDeletePlat(platNomor);
  }
  function confirmDelete() {
    // TODO: Integrasi hapus ke backend
    alert(`Armada ${deletePlat} dihapus!`);
    setDeletePlat(null);
  }
  function cancelDelete() {
    setDeletePlat(null);
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow">
        <thead className="bg-blue-100">
          <tr>
            <th className="py-2 px-4 text-left">No Polisi</th>
            <th className="py-2 px-4 text-left">Tipe</th>
            <th className="py-2 px-4 text-left">Kapasitas</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dummyRows.map((row) => (
            <tr key={row.platNomor}>
              <td className="py-2 px-4">{row.platNomor}</td>
              <td className="py-2 px-4">{row.tipe}</td>
              <td className="py-2 px-4">{row.kapasitas}</td>
              <td className={
                `py-2 px-4 font-semibold ` +
                (row.status === "Aktif"
                  ? "text-green-600"
                  : row.status === "Maintenance"
                  ? "text-yellow-500"
                  : "text-gray-500")
              }>{row.status}</td>
              <td className="py-2 px-4">
                <div className="flex gap-2 items-center">
                  <Link href={`/armada/${row.platNomor.replace(/\s/g, "")}`}>
                    <button title="Detail" className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition cursor-pointer">
                      <FaEye />
                    </button>
                  </Link>
                  <Link href={`/armada/${row.platNomor.replace(/\s/g, "")}/edit`}>
                    <button title="Edit" className="text-yellow-500 hover:text-yellow-700 p-1 rounded hover:bg-yellow-50 transition cursor-pointer">
                      <FaEdit />
                    </button>
                  </Link>
                  <button
                    title="Hapus"
                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition cursor-pointer"
                    onClick={() => handleDelete(row.platNomor)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Konfirmasi hapus */}
      {deletePlat && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
            <div className="font-bold text-lg mb-2 text-red-700">Konfirmasi Hapus</div>
            <div className="mb-4">Yakin ingin menghapus armada <span className="font-semibold">{deletePlat}</span>?</div>
            <div className="flex gap-2 justify-end">
              <button onClick={cancelDelete} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Batal</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
