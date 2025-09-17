export function ProductsSection() {
  return (
    <section id="products" className="py-16 px-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10 text-blue-700">Products Jemputanku</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <img src="/globe.svg" alt="Panel Admin" className="w-14 h-14 mb-4" />
          <h3 className="font-semibold text-lg mb-2 text-blue-600">Panel Admin Tenant</h3>
          <p className="text-gray-700 text-center">Kelola armada, jadwal, pengguna, dan laporan secara terpusat untuk setiap instansi/organisasi.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <img src="/window.svg" alt="Aplikasi Penumpang" className="w-14 h-14 mb-4" />
          <h3 className="font-semibold text-lg mb-2 text-blue-600">Aplikasi Penumpang</h3>
          <p className="text-gray-700 text-center">Pesan kursi, cek jadwal, dan tracking bus secara real-time melalui aplikasi mobile/web.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <img src="/file.svg" alt="Aplikasi Driver" className="w-14 h-14 mb-4" />
          <h3 className="font-semibold text-lg mb-2 text-blue-600">Aplikasi Driver</h3>
          <p className="text-gray-700 text-center">Kelola jadwal, absensi, dan komunikasi dengan admin serta penumpang secara efisien.</p>
        </div>
      </div>
    </section>
  );
}
