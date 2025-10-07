"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VehicleDetailResult } from "@/lib/services/vehicle";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";

type ArmadaDetailProps = {
  platNomor: string;
  armadaData?: VehicleDetailResult; // Optional armadaData prop
  driver?: User | null;
  drivers?: User[] | null;
};

const dummyPhotos = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=800&q=80"
];


export function ArmadaDetail({ platNomor, armadaData, driver, drivers }: ArmadaDetailProps) {
  // Ganti dengan fetch data by platNomor
  const [data, setData] = useState<VehicleDetailResult | undefined>(armadaData);
  const router = useRouter();
  const [photoIdx, setPhotoIdx] = useState(0);
  const [photos, setPhotos] = useState(dummyPhotos);
  const [assignOpen, setAssignOpen] = useState(false);
  // const [driver, setDriver] = useState(dummyDriver);



  function handlePhotoNext() {
    setPhotoIdx((idx) => (idx + 1) % photos.length);
  }
  function handlePhotoPrev() {
    setPhotoIdx((idx) => (idx - 1 + photos.length) % photos.length);
  }

  function handleAssignDriver(d: string) {
    // const selectedDriver = drivers.find(dr => dr.id === d) || null;
    // setDriver(selectedDriver);
    // setAssignOpen(false);
    alert(`Driver dengan ID ${d} dipilih (fungsi assign belum diimplementasi).`);
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
          <div className="font-semibold text-lg">{data?.licensePlate}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Model</div>
          <div className="font-semibold text-lg">{data?.model}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Kapasitas</div>
          <div className="font-semibold text-lg">{data?.capacity} penumpang</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Status</div>
          <div className={`font-semibold text-lg ${data?.status === "ACTIVE" ? "text-green-600" : data?.status === "MAINTENANCE" ? "text-yellow-500" : "text-gray-500"}`}>{data?.status}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Tahun</div>
          <div className="font-semibold text-lg">{data?.year}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Merk</div>
          <div className="font-semibold text-lg">{data?.manufacturer}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Warna</div>
          <div className="font-semibold text-lg">{data?.color}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Nomor Rangka</div>
          <div className="font-semibold text-lg">{data?.chassisNumber}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Nomor Mesin</div>
          <div className="font-semibold text-lg">{data?.engineNumber}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Tanggal STNK</div>
          <div className="font-semibold text-lg">{data?.stnkDate}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Tanggal KIR</div>
          <div className="font-semibold text-lg">{data?.kirDate}</div>
        </div>
        <div className="md:col-span-2">
          <div className="text-gray-500 text-sm">Fitur Armada</div>
          <div className="flex flex-wrap gap-2 mt-1">
            {data?.features && data?.features.length > 0 ? data?.features.map(f => (
              <span key={f} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">{f}</span>
            )) : <span className="text-gray-400">-</span>}
          </div>
        </div>
      </div>
      <div className="bg-blue-50 rounded p-4 text-blue-700 mb-4">
        <div className="font-semibold mb-1">Catatan</div>
        <div>{data?.notes || <span className="text-gray-400">-</span>}</div>
      </div>

      {/* Section Pengemudi yang ditugaskan*/}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-blue-700">Pengemudi yang Ditugaskan</div>
          <Button size="sm" variant="outline" onClick={() => setAssignOpen(true)}>
            {armadaData?.driver ? "Ganti Pengemudi" : "Tugaskan Pengemudi"}
          </Button>
        </div>
        {armadaData?.driver ? (
          <PengemudiYangDitugaskan driver={armadaData.driver} />
        ) : (
          <div className="text-gray-400 italic">Belum ada driver yang di-assign.</div>
        )}
      </div>

      {/* Modal Assign Driver */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContentPengemudi drivers={drivers} onAssign={handleAssignDriver} />
      </Dialog>

      {/* Modal Edit Detail Armada dihapus, edit sekarang di halaman baru */}
    </section>
  );
}


interface DialogContentPengemudiProps {
  drivers?: User[] | null;
  onAssign: (driverId: string) => void;
}
const DialogContentPengemudi = ({ drivers, onAssign }: DialogContentPengemudiProps) => {
    function handleAssignDriver(d: string) {
    onAssign(d);
  }
return (<DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Pilih Driver</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            {drivers?.map((d, i) => (
              <div key={i} className="flex items-center gap-4 p-2 rounded hover:bg-blue-50 cursor-pointer" onClick={() => handleAssignDriver(d.id)}>
                <img src={d.image || "https://via.placeholder.com/150"} alt={d.name || ""} className="w-12 h-12 rounded-full object-cover border-2 border-blue-200" />
                <div className="flex-1">
                  <div className="font-semibold">{d.name}</div>
                  <div className="text-gray-600 text-xs">{d.email}</div>
                </div>
                <div className={`text-xs font-medium ${d.status === "ACTIVE" ? "text-green-600" : "text-gray-400"}`}>{d.status}</div>
              </div>
            ))}
          </div>
        </DialogContent>)
}

const PengemudiYangDitugaskan = ({ driver }: { driver: User | null }) => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
      <div className="font-semibold text-lg">Pengemudi yang Ditugaskan</div>
      <div className="mt-4">
        {driver ? (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img src={driver.image || undefined} alt={driver.name || ""} className="w-16 h-16 rounded-full object-cover border-2 border-blue-200" />
            <div>
              <div className="font-semibold text-lg">{driver.name}</div>
              <div className="text-gray-600 text-sm">{driver.email}</div>
              <div className="text-gray-500 text-xs">SIM: Aktif</div>
              <div className="text-xs font-medium text-green-600">ACTIVE</div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 italic">Belum ada driver yang di-assign.</div>
        )}
      </div>
    </section>
  );
}
