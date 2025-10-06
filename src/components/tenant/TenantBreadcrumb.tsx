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
import { useEffect, useState } from "react";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  armada: "Armada",
  jadwal: "Jadwal & Rute",
  penumpang: "Penumpang",
  driver: "Driver",
  laporan: "Laporan",
  pengaturan: "Pengaturan",
  tambah: "Tambah",
  edit: "Edit",
  riwayat: "Riwayat"
};

export function TenantBreadcrumb() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <BreadcrumbPlaceholder />;
  }

  const segments = pathname.split("/").filter(Boolean);

  // breadcrumb hanya menerima alphanumeric, spasi, & karakter umum - atau _
  const sanitizedSegments = segments.map(seg => seg.replace(/[^a-zA-Z0-9 ]/g, '_'));

  // Build breadcrumb items
  const items = sanitizedSegments.map((seg, idx) => {
    const href = "/" + sanitizedSegments.slice(0, idx + 1).join("/");
    // Decode URL encoded segments (untuk plat nomor)
    const decodedSeg = decodeURIComponent(seg);
    const label = labelMap[seg] || decodedSeg;
    const isLast = idx === sanitizedSegments.length - 1;
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
        {sanitizedSegments.length > 0 && <BreadcrumbSeparator />}
        {items.flatMap((item, idx) =>
          idx < items.length - 1
            ? [item, <BreadcrumbSeparator key={"sep-" + idx} />]
            : [item]
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const BreadcrumbPlaceholder = () => {
  return (
    <Breadcrumb className="mb-4 sticky top-0 z-20 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100">
      <BreadcrumbList>
        <BreadcrumbItem>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
