import { LayoutConfig } from "@/types/layout";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

interface OperationalSidebarProps {
  config: LayoutConfig;
  children?: ReactNode;
}

/**
 * Operational Sidebar Component
 * 
 * Context-specific sidebar for operational pages like Route Management
 * and Fleet Tracking. Provides relevant controls and information.
 */
export function OperationalSidebar({ config, children }: OperationalSidebarProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Determine sidebar content based on current module
  const renderSidebarContent = () => {
    if (children) return children;

    switch (config.navigation?.currentSubModule) {
      case 'routes':
        return <RouteManagementSidebar />;
      case 'tracking':
        return <FleetTrackingSidebar />;
      default:
        return <DefaultOperationalSidebar />;
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-80'} bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-200`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-lg">🎛️</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Control Panel</h3>
                <p className="text-xs text-gray-600">Operational Controls</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <span className={`transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}>
              ⟨
            </span>
          </button>
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto">
        {renderSidebarContent()}
      </div>

      {/* Quick Navigation Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg py-3 px-4 transition-all duration-200 text-sm font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Route Management Sidebar
 */
function RouteManagementSidebar() {
  const [selectedRoute, setSelectedRoute] = useState('all');
  
  const routes = [
    { code: "6", name: "Line 6 Bekasi Timur - Pejambon", status: "active" },
    { code: "10", name: "Line 10 Bekasi Barat - Pejambon", status: "active" },
    { code: "11", name: "Line 11 Cikarang - Pejambon", status: "maintenance" },
    { code: "12", name: "Line 12 Bekasi Timur - Senayan", status: "active" }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Route Selection */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Route Selection</h4>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedRoute('all')}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selectedRoute === 'all' 
                ? 'bg-blue-100 border border-blue-300 text-blue-700' 
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            }`}
          >
            <span className="font-medium">All Routes</span>
            <span className="block text-xs text-gray-500 mt-1">{routes.length} total routes</span>
          </button>
          
          {routes.map((route) => (
            <button
              key={route.code}
              onClick={() => setSelectedRoute(route.code)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedRoute === route.code 
                  ? 'bg-blue-100 border border-blue-300 text-blue-700' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Line {route.code}</span>
                <span className={`w-2 h-2 rounded-full ${
                  route.status === 'active' ? 'bg-green-400' : 'bg-amber-400'
                }`} />
              </div>
              <span className="block text-xs text-gray-500 mt-1">{route.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Route Actions */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Actions</h4>
        <div className="space-y-2">
          <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg py-2 px-4 transition-all text-sm font-medium">
            + Add New Route
          </button>
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg py-2 px-4 transition-all text-sm font-medium">
            🗺️ Optimize Routes
          </button>
          <button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg py-2 px-4 transition-all text-sm font-medium">
            📊 Route Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Fleet Tracking Sidebar
 */
function FleetTrackingSidebar() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const filters = [
    { key: 'all', label: 'All Vehicles', count: 12, color: 'gray' },
    { key: 'active', label: 'Active', count: 8, color: 'green' },
    { key: 'idle', label: 'Idle', count: 3, color: 'amber' },
    { key: 'maintenance', label: 'Maintenance', count: 1, color: 'red' }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Fleet Overview Stats */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Fleet Status</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-emerald-700">8</div>
            <div className="text-xs text-emerald-600">Active</div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-700">12</div>
            <div className="text-xs text-blue-600">Total Fleet</div>
          </div>
        </div>
      </div>

      {/* Vehicle Filters */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Filter Vehicles</h4>
        <div className="space-y-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedFilter === filter.key 
                  ? 'bg-blue-100 border border-blue-300 text-blue-700' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{filter.label}</span>
                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {filter.count}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg py-2 px-4 transition-all text-sm font-medium">
            📍 Center Map
          </button>
          <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg py-2 px-4 transition-all text-sm font-medium">
            🔄 Refresh All
          </button>
          <button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg py-2 px-4 transition-all text-sm font-medium">
            📊 Fleet Report
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Default Operational Sidebar
 */
function DefaultOperationalSidebar() {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Operations</h4>
        <p className="text-sm text-gray-500">Select an operational module to see relevant controls.</p>
      </div>
    </div>
  );
}