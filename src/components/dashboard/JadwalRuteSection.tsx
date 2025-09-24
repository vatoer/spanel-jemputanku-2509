export function JadwalRuteSection() {
  const schedules = [
    {
      id: "BUS001",
      name: "Bus Jemputanku 01", 
      route: "Line 6 Bekasi Timur - Pejambon",
      departure: "07:00",
      status: "active",
      passengers: "24/50",
      driver: "Ahmad Susanto"
    },
    {
      id: "BUS002",
      name: "Bus Jemputanku 02",
      route: "Line 10 Bekasi Barat - Pejambon", 
      departure: "07:15",
      status: "waiting",
      passengers: "0/45",
      driver: "Budi Santoso"
    },
    {
      id: "BUS003", 
      name: "Bus Jemputanku 03",
      route: "Line 11 Cikarang - Pejambon",
      departure: "07:30", 
      status: "completed",
      passengers: "35/50",
      driver: "Cahyo Nugroho"
    },
    {
      id: "BUS004",
      name: "Bus Jemputanku 04",
      route: "Line 12 Bekasi Timur - Senayan",
      departure: "08:00",
      status: "maintenance", 
      passengers: "0/45",
      driver: "Dedi Kurniawan"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'waiting': 
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'maintenance':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Beroperasi';
      case 'waiting': return 'Menunggu';
      case 'completed': return 'Selesai';
      case 'maintenance': return 'Maintenance';
      default: return 'Unknown';
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🕐</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Jadwal & Rute Hari Ini</h2>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition">
            📅 Lihat Semua
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Bus & Driver</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rute</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Waktu</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Penumpang</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule, index) => (
                <tr key={schedule.id} className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                }`}>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{schedule.name}</div>
                      <div className="text-xs text-gray-600">👨‍✈️ {schedule.driver}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">{schedule.route}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm font-medium text-gray-900">{schedule.departure}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">{schedule.passengers}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(schedule.status)}`}>
                      {getStatusText(schedule.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-1">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded text-xs" title="Detail">
                        👁️
                      </button>
                      <button className="p-1 text-gray-600 hover:bg-gray-50 rounded text-xs" title="Edit">
                        ✏️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
