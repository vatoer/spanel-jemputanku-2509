export function ArmadaSummary() {
  return (
    <section className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-8 items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-blue-700 mb-2">Ringkasan Armada</h2>
        <p className="text-gray-600 mb-4">Pantau jumlah armada, status operasional, dan kapasitas bus secara real-time.</p>
        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-700">12</div>
            <div className="text-gray-500">Total Bus</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">10</div>
            <div className="text-gray-500">Aktif</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">2</div>
            <div className="text-gray-500">Maintenance</div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/3 mt-8 md:mt-0">
        <img src="/bus-dashboard.svg" alt="Armada" className="w-full h-auto" />
      </div>
    </section>
  );
}
