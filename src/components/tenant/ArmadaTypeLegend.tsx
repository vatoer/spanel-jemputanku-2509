const typeList = [
  { label: "Bus Besar", color: "bg-blue-200 text-blue-800" },
  { label: "Bus Sedang", color: "bg-green-200 text-green-800" },
  { label: "Elf", color: "bg-yellow-200 text-yellow-800" },
  { label: "Hiace", color: "bg-purple-200 text-purple-800" },
];

export function ArmadaTypeLegend() {
  return (
    <div className="flex gap-2 mb-4 items-center">
      <span className="text-gray-500 mr-2">Tipe:</span>
      {typeList.map((t) => (
        <span key={t.label} className={`px-2 py-1 rounded text-xs font-medium ${t.color}`}>{t.label}</span>
      ))}
    </div>
  );
}
