"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Organized navigation structure for transport management
const navSections = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "📊", description: "Main overview and analytics" }
    ]
  },
  {
    title: "Operations",
    items: [
      { label: "Route Management", href: "/rute", icon: "🗺️", description: "Plan and optimize routes" },
      { label: "Fleet Tracking", href: "/lacak-armada", icon: "🚛", description: "Real-time vehicle monitoring" },
      { label: "Schedule", href: "/jadwal", icon: "⏰", description: "Manage timetables" }
    ]
  },
  {
    title: "Management",
    items: [
      { label: "Fleet", href: "/armada", icon: "🚌", description: "Vehicle management" },
      { label: "Drivers", href: "/driver", icon: "👨‍✈️", description: "Driver management" },
      { label: "Passengers", href: "/penumpang", icon: "👥", description: "Passenger services" }
    ]
  },
  {
    title: "Analytics",
    items: [
      { label: "Reports", href: "/laporan", icon: "📈", description: "Performance analytics" }
    ]
  },
  {
    title: "System",
    items: [
      { label: "Settings", href: "/pengaturan", icon: "⚙️", description: "System configuration" }
    ]
  }
];

export function TenantSidebar() {
  const pathname = usePathname();
  
  return (
    <aside className="bg-white border-r border-gray-200 shadow-sm h-screen w-64 flex-shrink-0 hidden md:flex flex-col sticky top-0 z-40">
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-700">
        <div className="text-center">
          <span className="font-bold text-xl text-white tracking-tight">Jemputanku</span>
          <div className="text-xs text-blue-100 mt-1">Transport Management</div>
        </div>
      </div>
      
      {/* Enhanced Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="mb-6">
            {/* Section Header */}
            <div className="px-3 mb-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
            </div>
            
            {/* Section Items */}
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative rounded-xl px-4 py-3 transition-all duration-200 text-left block ${
                    pathname.startsWith(item.href) 
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-lg ${
                      pathname.startsWith(item.href) 
                        ? "text-blue-600" 
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}>
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium">{item.label}</span>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Active indicator */}
                  {pathname.startsWith(item.href) && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <div className="text-xs text-gray-500">Transport Management System</div>
          <div className="text-xs text-gray-400 mt-1">v2.5.0</div>
        </div>
      </div>
    </aside>
  );
}

// Legacy function for backward compatibility
function getNavIcon(label: string) {
  const iconMap: Record<string, string> = {
    "Dashboard": "📊",
    "Rute": "🗺️",
    "Route Management": "🗺️",
    "Armada": "🚌",
    "Fleet": "🚌",
    "Lacak Armada": "🚛",
    "Fleet Tracking": "🚛",
    "Jadwal": "⏰",
    "Schedule": "⏰",
    "Penumpang": "👥",
    "Passengers": "👥",
    "Driver": "👨‍✈️",
    "Drivers": "👨‍✈️",
    "Laporan": "📈",
    "Reports": "📈",
    "Pengaturan": "⚙️",
    "Settings": "⚙️"
  };
  return iconMap[label] || "📄";
}