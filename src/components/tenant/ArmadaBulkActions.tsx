export function ArmadaBulkActions({ selectedCount }: { selectedCount: number }) {
  if (selectedCount === 0) return null;
  return (
    <div className="flex gap-2 mb-4">
      <span className="text-gray-600">{selectedCount} armada dipilih</span>
      <button className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700">Hapus</button>
      <button className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Ubah Status</button>
    </div>
  );
}
