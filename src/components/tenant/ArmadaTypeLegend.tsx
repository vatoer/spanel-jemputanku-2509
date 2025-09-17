const typeList = [
  { label: "Bus Besar" },
  { label: "Bus Sedang" },
  { label: "Elf" },
  { label: "Hiace" },
];

export function ArmadaTypeLegend() {
  return (
    <div className="flex gap-2 mb-4 items-center">
      <span className="text-gray-500 mr-2">Tipe:</span>
      {typeList.map((t) => (
        <span key={t.label} className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
          {t.label}
        </span>
      ))}
    </div>
  );
}
