export function PenumpangTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow">
        <thead className="bg-blue-100">
          <tr>
            <th className="py-2 px-4 text-left">Nama</th>
            <th className="py-2 px-4 text-left">NIP/NIK</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4">Andi Wijaya</td>
            <td className="py-2 px-4">123456789</td>
            <td className="py-2 px-4 text-green-600 font-semibold">Aktif</td>
            <td className="py-2 px-4"><button className="text-blue-600 hover:underline">Detail</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
