export function ArmadaStatusSummary() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-blue-100 rounded-xl p-4 flex flex-col items-center">
        <div className="text-2xl font-bold text-blue-700">12</div>
        <div className="text-gray-600">Total Bus</div>
      </div>
      <div className="bg-green-100 rounded-xl p-4 flex flex-col items-center">
        <div className="text-2xl font-bold text-green-700">10</div>
        <div className="text-gray-600">Aktif</div>
      </div>
      <div className="bg-yellow-100 rounded-xl p-4 flex flex-col items-center">
        <div className="text-2xl font-bold text-yellow-700">2</div>
        <div className="text-gray-600">Maintenance</div>
      </div>
      <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center">
        <div className="text-2xl font-bold text-gray-700">0</div>
        <div className="text-gray-600">Tidak Aktif</div>
      </div>
    </div>
  );
}
