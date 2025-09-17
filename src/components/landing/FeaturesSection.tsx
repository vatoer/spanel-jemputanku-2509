export function FeaturesSection() {
  return (
    <section id="features" className="py-16 px-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10 text-blue-700">Features Unggulan Jemputanku</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg mb-2 text-blue-600">Manajemen Armada & Jadwal</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>Pengelolaan bus, rute, dan jadwal penjemputan secara terpusat</li>
            <li>Penjadwalan otomatis & notifikasi real-time</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg mb-2 text-blue-600">Dashboard Analitik</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>Laporan penggunaan, performa armada, dan statistik penumpang</li>
            <li>Visualisasi data untuk pengambilan keputusan</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg mb-2 text-blue-600">Manajemen Pengguna & Hak Akses</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>Multi-level admin: tenant, driver, dan penumpang</li>
            <li>Kontrol akses dan keamanan data</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg mb-2 text-blue-600">Integrasi & Notifikasi</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>Integrasi absensi, payroll, dan sistem internal organisasi</li>
            <li>Notifikasi WhatsApp, email, dan push notification</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
