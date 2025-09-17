"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  armada: "Armada",
  jadwal: "Jadwal & Rute",
  penumpang: "Penumpang",
  driver: "Driver",
  laporan: "Laporan",
  pengaturan: "Pengaturan",
  tambah: "Tambah",
  edit: "Edit"
};

export function TenantBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Build breadcrumb items
  const items = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = labelMap[seg] || seg;
    const isLast = idx === segments.length - 1;
    return (
      <BreadcrumbItem key={href}>
        {isLast ? (
          <BreadcrumbPage>{label}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
        )}
      </BreadcrumbItem>
    );
  });

  return (
    <Breadcrumb className="mb-4 sticky top-0 z-20 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100">
      <BreadcrumbList>
        {/* <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem> */}
        {segments.length > 0 && <BreadcrumbSeparator />}
        {items.flatMap((item, idx) =>
          idx < items.length - 1
            ? [item, <BreadcrumbSeparator key={"sep-" + idx} />]
            : [item]
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
