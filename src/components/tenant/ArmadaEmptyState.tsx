export function ArmadaEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <img src="/globe.svg" alt="Empty" className="w-32 h-32 mb-4 opacity-60" />
      <div className="text-xl font-semibold mb-2">Belum ada data armada</div>
      <div className="text-gray-500 mb-4">Tambahkan armada baru untuk mulai mengelola armada Anda.</div>
      <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Tambah Armada</button>
    </div>
  );
}
