export function ArmadaSummary() {
  const stats = [
    { 
      label: "Total Bus", 
      value: "12", 
      icon: "🚌", 
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    { 
      label: "Aktif", 
      value: "10", 
      icon: "✅", 
      color: "text-emerald-600",
      bgColor: "bg-emerald-50", 
      borderColor: "border-emerald-200"
    },
    { 
      label: "Maintenance", 
      value: "2", 
      icon: "🔧", 
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    { 
      label: "Kapasitas", 
      value: "87%", 
      icon: "👥", 
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    }
  ];

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🚌</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Ringkasan Armada</h2>
            <p className="text-sm text-gray-600">Monitoring real-time status operasional</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`${stat.bgColor} ${stat.borderColor} border-2 rounded-lg p-4 text-center hover:shadow-md transition-all duration-200`}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional Info */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
          <div className="flex-1 text-center sm:text-left">
            <div className="text-sm text-gray-600">Update terakhir</div>
            <div className="text-sm font-medium text-gray-900">
              {new Date().toLocaleTimeString('id-ID')} WIB
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition">
              🚛 Lacak Armada
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition border border-gray-300">
              📊 Detail Laporan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
