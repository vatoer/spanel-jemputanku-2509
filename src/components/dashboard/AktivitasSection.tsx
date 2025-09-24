export function AktivitasSection() {
  const activities = [
    {
      id: 1,
      type: "completed",
      icon: "✅",
      title: "Perjalanan Selesai",
      description: "Bus Jemputanku 01 telah menyelesaikan rute Line 6",
      time: "08:30",
      timeAgo: "2 jam yang lalu"
    },
    {
      id: 2, 
      type: "started",
      icon: "🚀",
      title: "Perjalanan Dimulai", 
      description: "Bus Jemputanku 02 memulai rute Line 10 dengan 18 penumpang",
      time: "07:15",
      timeAgo: "3 jam yang lalu"
    },
    {
      id: 3,
      type: "maintenance", 
      icon: "🔧",
      title: "Maintenance Terjadwal",
      description: "Bus Jemputanku 03 menjalani perawatan rutin berkala",
      time: "06:00", 
      timeAgo: "4 jam yang lalu"
    },
    {
      id: 4,
      type: "alert",
      icon: "⚠️", 
      title: "Keterlambatan",
      description: "Bus Jemputanku 04 mengalami keterlambatan 15 menit",
      time: "09:45",
      timeAgo: "30 menit yang lalu"
    },
    {
      id: 5,
      type: "passenger",
      icon: "👥",
      title: "Kapasitas Penuh",
      description: "Bus Jemputanku 05 mencapai kapasitas maksimum (50/50)",
      time: "10:00", 
      timeAgo: "15 menit yang lalu"
    }
  ];

  const getActivityStyle = (type: string) => {
    switch (type) {
      case 'completed':
        return 'bg-emerald-50 border-emerald-200 text-emerald-600';
      case 'started':
        return 'bg-blue-50 border-blue-200 text-blue-600';
      case 'maintenance':
        return 'bg-amber-50 border-amber-200 text-amber-600';
      case 'alert':
        return 'bg-red-50 border-red-200 text-red-600';
      case 'passenger':
        return 'bg-purple-50 border-purple-200 text-purple-600';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-600';
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📋</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Aktivitas Terbaru</h2>
              <p className="text-sm text-gray-600">Log aktivitas sistem real-time</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition">
            📜 Lihat Log
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200"
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getActivityStyle(activity.type)}`}>
                <span className="text-lg">{activity.icon}</span>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>🕒 {activity.time}</span>
                      <span>•</span>
                      <span>{activity.timeAgo}</span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button className="text-blue-600 hover:text-blue-700 text-xs font-medium hover:bg-blue-50 px-2 py-1 rounded transition">
                    Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-4 py-2 rounded-lg transition">
            Muat Lebih Banyak Aktivitas →
          </button>
        </div>
      </div>
    </section>
  );
}
