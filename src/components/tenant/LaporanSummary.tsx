export function LaporanSummary() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold text-blue-700 mb-4">Ringkasan Laporan</h2>
      <ul className="text-gray-700 space-y-2">
        <li>Total Perjalanan: <span className="font-semibold text-blue-700">120</span></li>
        <li>Total Penumpang: <span className="font-semibold text-blue-700">1.250</span></li>
        <li>Total Kilometer: <span className="font-semibold text-blue-700">8.500 km</span></li>
      </ul>
    </div>
  );
}
