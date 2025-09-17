export function JadwalTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow">
        <thead className="bg-blue-100">
          <tr>
            <th className="py-2 px-4 text-left">Bus</th>
            <th className="py-2 px-4 text-left">Rute</th>
            <th className="py-2 px-4 text-left">Waktu</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4">Bus 01</td>
            <td className="py-2 px-4">Kantor - Terminal A</td>
            <td className="py-2 px-4">07:00</td>
            <td className="py-2 px-4 text-green-600 font-semibold">Berangkat</td>
            <td className="py-2 px-4"><button className="text-blue-600 hover:underline">Detail</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
