export function AktivitasSection() {
  return (
    <section className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold text-blue-700 mb-4">Aktivitas Terbaru</h2>
      <ul className="divide-y divide-blue-100">
        <li className="py-3 flex items-center justify-between">
          <span className="text-gray-700">Bus 01 selesai perjalanan</span>
          <span className="text-xs text-gray-500">08:30</span>
        </li>
        <li className="py-3 flex items-center justify-between">
          <span className="text-gray-700">Bus 02 mulai perjalanan</span>
          <span className="text-xs text-gray-500">07:15</span>
        </li>
        <li className="py-3 flex items-center justify-between">
          <span className="text-gray-700">Bus 03 maintenance terjadwal</span>
          <span className="text-xs text-gray-500">06:00</span>
        </li>
      </ul>
    </section>
  );
}
