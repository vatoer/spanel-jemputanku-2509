export function JadwalRuteSection() {
  return (
    <section className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold text-blue-700 mb-4">Jadwal & Rute Hari Ini</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-blue-100">
            <th className="py-2 px-3">Bus</th>
            <th className="py-2 px-3">Rute</th>
            <th className="py-2 px-3">Waktu Berangkat</th>
            <th className="py-2 px-3">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-3">Bus 01</td>
            <td className="py-2 px-3">Kantor Pusat - Terminal A</td>
            <td className="py-2 px-3">07:00</td>
            <td className="py-2 px-3 text-green-600 font-semibold">Berangkat</td>
          </tr>
          <tr>
            <td className="py-2 px-3">Bus 02</td>
            <td className="py-2 px-3">Kantor Pusat - Terminal B</td>
            <td className="py-2 px-3">07:15</td>
            <td className="py-2 px-3 text-yellow-500 font-semibold">Menunggu</td>
          </tr>
          <tr>
            <td className="py-2 px-3">Bus 03</td>
            <td className="py-2 px-3">Kantor Pusat - Terminal C</td>
            <td className="py-2 px-3">07:30</td>
            <td className="py-2 px-3 text-gray-500 font-semibold">Selesai</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
