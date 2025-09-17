const statusList = [
  { label: "Semua", value: "all" },
  { label: "Aktif", value: "aktif" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Tidak Aktif", value: "nonaktif" },
];

export function ArmadaStatusTabs({ selected, onSelect }: { selected: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex gap-2 mb-4">
      {statusList.map((s) => (
        <button
          key={s.value}
          className={`px-4 py-2 rounded-lg border transition font-medium ${selected === s.value ? "bg-blue-600 text-white" : "bg-white text-blue-600 hover:bg-blue-50"}`}
          onClick={() => onSelect(s.value)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
