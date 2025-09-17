export function ArmadaSummaryStats({ stats }: { stats: { total: number; aktif: number; maintenance: number; nonaktif: number } }) {
  return (
    <div className="flex gap-4 mb-4">
      <div className="flex-1 bg-white rounded-lg shadow p-4 text-center">
        <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
        <div className="text-gray-500">Total Armada</div>
      </div>
      <div className="flex-1 bg-white rounded-lg shadow p-4 text-center">
        <div className="text-2xl font-bold text-green-600">{stats.aktif}</div>
        <div className="text-gray-500">Aktif</div>
      </div>
      <div className="flex-1 bg-white rounded-lg shadow p-4 text-center">
        <div className="text-2xl font-bold text-yellow-500">{stats.maintenance}</div>
        <div className="text-gray-500">Maintenance</div>
      </div>
      <div className="flex-1 bg-white rounded-lg shadow p-4 text-center">
        <div className="text-2xl font-bold text-gray-400">{stats.nonaktif}</div>
        <div className="text-gray-500">Tidak Aktif</div>
      </div>
    </div>
  );
}
