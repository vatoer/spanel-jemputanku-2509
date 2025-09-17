export function PengaturanForm() {
  return (
    <form className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto flex flex-col gap-4">
      <h2 className="text-xl font-bold text-blue-700 mb-2">Pengaturan Tenant</h2>
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">Nama Instansi/Organisasi</label>
        <input type="text" className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Nama Instansi" />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">Email Admin</label>
        <input type="email" className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="admin@email.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700 mb-1">Telepon</label>
        <input type="tel" className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="08xxxxxxxxxx" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition">Simpan Perubahan</button>
    </form>
  );
}
