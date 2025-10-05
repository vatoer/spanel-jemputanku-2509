"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Armada } from "@/schema/armada";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";

type ArmadaDetailProps = {
  platNomor: string;
};

// Dummy data, replace with real fetch logic as needed
const dummyData: Armada = {
  platNomor: "B 1234 CD",
  tipe: "Bus Besar",
  kapasitas: 45,
  status: "Aktif",
  tahun: 2021,
  merk: "Mercedes-Benz",
  warna: "Putih",
  nomorRangka: "MB1234567890",
  nomorMesin: "EN9876543210",
  tanggalStnk: "2025-01-10",
  tanggalKir: "2025-06-15",
  tanggalPajak: "2025-12-20", // Added missing required field
  fitur: ["AC", "WiFi"],
  catatan: "Terakhir service: 1 bulan lalu."
};

const dummyPhotos = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", // bus di pegunungan
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80", // bus malam hari
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80"  // mobil van
];

const dummyDriver = {
  nama: "Budi Santoso",
  foto: "https://randomuser.me/api/portraits/men/32.jpg",
  kontak: "0812-3456-7890",
  sim: "B1 Aktif",
  status: "Aktif"
};

const dummyDriverList = [
  dummyDriver,
  { nama: "Andi Wijaya", foto: "https://randomuser.me/api/portraits/men/33.jpg", kontak: "0813-2222-3333", sim: "B1 Aktif", status: "Aktif" },
  { nama: "Siti Aminah", foto: "https://randomuser.me/api/portraits/women/32.jpg", kontak: "0812-8888-9999", sim: "B1 Expired", status: "Tidak Aktif" }
];

export function ArmadaDetail({ platNomor }: ArmadaDetailProps) {
  // Ganti dengan fetch data by platNomor
  const [data, setData] = useState<Armada>(dummyData);
  const router = useRouter();
  const [photoIdx, setPhotoIdx] = useState(0);
  const [photos, setPhotos] = useState(dummyPhotos);
  const [assignOpen, setAssignOpen] = useState(false);
  const [driver, setDriver] = useState(dummyDriver);



  function handlePhotoNext() {
    setPhotoIdx((idx) => (idx + 1) % photos.length);
  }
  function handlePhotoPrev() {
    setPhotoIdx((idx) => (idx - 1 + photos.length) % photos.length);
  }
  function handleAssignDriver(d: any) {
    setDriver(d);
    setAssignOpen(false);
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">{/* Improved shadow and spacing */}

      {/* Gallery Foto Armada */}
      <div className="mb-6">
        <div className="relative w-full h-56 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
          <img src={photos[photoIdx]} alt="Foto Armada" className="object-cover w-full h-full" />
          {photos.length > 1 && (
            <>
              <button onClick={handlePhotoPrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"><FaChevronLeft /></button>
              <button onClick={handlePhotoNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"><FaChevronRight /></button>
            </>
          )}
          <button className="absolute bottom-2 right-2 bg-blue-600 text-white rounded px-3 py-1 text-xs flex items-center gap-1 hover:bg-blue-700">
            <FaPlus /> Tambah Foto
          </button>
        </div>
        <div className="flex gap-2 mt-2 justify-center">
          {photos.map((p, i) => (
            <img key={i} src={p} alt="thumb" className={`w-12 h-12 object-cover rounded border-2 ${i === photoIdx ? "border-blue-600" : "border-transparent"}`} onClick={() => setPhotoIdx(i)} />
          ))}
        </div>
      </div>

      {/* Data Armada - Clean layout tanpa duplicate actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">{/* Improved spacing */}
        <div>
          <div className="text-gray-500 text-sm">Plat Nomor</div>
          <div className="font-semibold text-lg">{data.platNomor}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Tipe</div>
          <div className="font-semibold text-lg">{data.tipe}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Kapasitas</div>
          <div className="font-semibold text-lg">{data.kapasitas} penumpang</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Status</div>
          <div className={`font-semibold text-lg ${data.status === "Aktif" ? "text-green-600" : data.status === "Maintenance" ? "text-yellow-500" : "text-gray-500"}`}>{data.status}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Tahun</div>
          <div className="font-semibold text-lg">{data.tahun}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Merk</div>
          <div className="font-semibold text-lg">{data.merk}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Warna</div>
          <div className="font-semibold text-lg">{data.warna}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Nomor Rangka</div>
          <div className="font-semibold text-lg">{data.nomorRangka}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Nomor Mesin</div>
          <div className="font-semibold text-lg">{data.nomorMesin}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Tanggal STNK</div>
          <div className="font-semibold text-lg">{data.tanggalStnk}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Tanggal KIR</div>
          <div className="font-semibold text-lg">{data.tanggalKir}</div>
        </div>
        <div className="md:col-span-2">
          <div className="text-gray-500 text-sm">Fitur Armada</div>
          <div className="flex flex-wrap gap-2 mt-1">
            {data.fitur && data.fitur.length > 0 ? data.fitur.map(f => (
              <span key={f} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">{f}</span>
            )) : <span className="text-gray-400">-</span>}
          </div>
        </div>
      </div>
      <div className="bg-blue-50 rounded p-4 text-blue-700 mb-4">
        <div className="font-semibold mb-1">Catatan</div>
        <div>{data.catatan || <span className="text-gray-400">-</span>}</div>
      </div>

      {/* Section Pengemudi yang ditugaskan*/}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-blue-700">Pengemudi yang Ditugaskan</div>
          <Button size="sm" variant="outline" onClick={() => setAssignOpen(true)}>
            {driver ? "Ganti Pengemudi" : "Tugaskan Pengemudi"}
          </Button>
        </div>
        {driver ? (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img src={driver.foto} alt={driver.nama} className="w-16 h-16 rounded-full object-cover border-2 border-blue-200" />
            <div>
              <div className="font-semibold text-lg">{driver.nama}</div>
              <div className="text-gray-600 text-sm">{driver.kontak}</div>
              <div className="text-gray-500 text-xs">SIM: {driver.sim}</div>
              <div className={`text-xs font-medium ${driver.status === "Aktif" ? "text-green-600" : "text-gray-400"}`}>{driver.status}</div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 italic">Belum ada driver yang di-assign.</div>
        )}
      </div>

      {/* Modal Assign Driver */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Pilih Driver</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            {dummyDriverList.map((d, i) => (
              <div key={i} className="flex items-center gap-4 p-2 rounded hover:bg-blue-50 cursor-pointer" onClick={() => handleAssignDriver(d)}>
                <img src={d.foto} alt={d.nama} className="w-12 h-12 rounded-full object-cover border-2 border-blue-200" />
                <div className="flex-1">
                  <div className="font-semibold">{d.nama}</div>
                  <div className="text-gray-600 text-xs">{d.kontak}</div>
                  <div className="text-gray-500 text-xs">SIM: {d.sim}</div>
                </div>
                <div className={`text-xs font-medium ${d.status === "Aktif" ? "text-green-600" : "text-gray-400"}`}>{d.status}</div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Detail Armada dihapus, edit sekarang di halaman baru */}
    </section>
  );
}
