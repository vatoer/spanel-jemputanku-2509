export function DashboardHeader() {
  return (
    <header className="bg-white shadow-sm py-4 px-4 sticky top-0 z-30 flex items-center gap-4 border-b">
      <div className="flex-1">
        <h1 className="text-xl md:text-2xl font-bold text-blue-700">Dashboard Tenant</h1>
        <p className="text-gray-600 text-sm md:text-base">Selamat datang di panel manajemen armada dan jadwal bus jemputan Anda.</p>
      </div>
      {/* Tempatkan avatar user, notifikasi, dsb. di sini jika perlu */}
    </header>
  );
}
