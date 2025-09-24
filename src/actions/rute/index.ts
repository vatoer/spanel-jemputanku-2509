
interface Rute {
  id: string;
  name: string;
  // Tambahkan properti lain yang diperlukan
}

export const simpanRute = async (params: Rute) => {
  // Implementasi logika untuk menyimpan rute
}
export const hapusRute = async (id: string) => {
  // Implementasi logika untuk menghapus rute
}

export const tambahStop = async (ruteId: string, stop: { lat: number; lng: number; name: string }) => {
  // Implementasi logika untuk menambah stop pada rute
}

export const hapusStop = async (ruteId: string, stopId: string) => {
  // Implementasi logika untuk menghapus stop dari rute
}