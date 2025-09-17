import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Armada", href: "/armada" },
  { label: "Jadwal & Rute", href: "/jadwal" },
  { label: "Penumpang", href: "/penumpang" },
  { label: "Driver", href: "/driver" },
  { label: "Laporan", href: "/laporan" },
  { label: "Pengaturan", href: "/pengaturan" },
];

export function TenantSidebar() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  return (
    <aside className="bg-white shadow h-screen w-64 flex-shrink-0 hidden md:flex flex-col sticky top-0 z-40">
      <div className="h-20 flex items-center justify-center border-b">
        <span className="font-bold text-xl text-blue-700 tracking-tight">Jemputanku</span>
      </div>
      <nav className="flex-1 py-6 px-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-4 py-2 font-medium transition text-left ${pathname.startsWith(item.href) ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-blue-50"}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
