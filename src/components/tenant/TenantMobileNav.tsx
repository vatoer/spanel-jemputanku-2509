import { Menu } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Armada", href: "/armada" },
  { label: "Jadwal & Rute", href: "/jadwal" },
  { label: "Penumpang", href: "/penumpang" },
  { label: "Driver", href: "/driver" },
  { label: "Laporan", href: "/laporan" },
  { label: "Pengaturan", href: "/pengaturan" },
];

export function TenantMobileNav() {
  return (
    <div className="md:hidden flex items-center">
      <Sheet>
        <SheetTrigger asChild>
          <button className="p-2 rounded hover:bg-blue-100">
            <Menu className="w-6 h-6 text-blue-700" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b font-bold text-xl text-blue-700">Jemputanku</div>
            <nav className="flex flex-col gap-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded px-4 py-2 font-medium text-gray-700 hover:bg-blue-50 transition"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
