import { TenantMobileNav } from "@/components/tenant/TenantMobileNav";
import { TenantSidebar } from "@/components/tenant/TenantSidebar";
import { LayoutConfig } from "@/types/layout";
import { ReactNode } from "react";
import { OperationalSidebar } from "./OperationalSidebar";
import { UnifiedHeader } from "./UnifiedHeader";

interface UnifiedLayoutProps {
  config: LayoutConfig;
  children: ReactNode;
}

/**
 * Unified Layout System for Transport Management App
 * 
 * Provides consistent layout patterns across all routes while allowing
 * for specialized configurations based on operational needs.
 */
export function UnifiedLayout({ config, children }: UnifiedLayoutProps) {
  const { type, className = "" } = config;

  // Layout Renderer based on type
  const renderLayout = () => {
    switch (type) {
      case 'main':
        return <MainLayout config={config}>{children}</MainLayout>;
      
      case 'operational':
        return <OperationalLayout config={config}>{children}</OperationalLayout>;
      
      case 'fullscreen':
        return <FullscreenLayout config={config}>{children}</FullscreenLayout>;
      
      case 'modal':
        return <ModalLayout config={config}>{children}</ModalLayout>;
      
      default:
        return <MainLayout config={config}>{children}</MainLayout>;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {renderLayout()}
    </div>
  );
}

/**
 * MAIN LAYOUT
 * Standard layout for administrative pages (Dashboard, Settings, Reports)
 * Features: TenantSidebar + UnifiedHeader + Standard content area
 */
function MainLayout({ config, children }: { config: LayoutConfig; children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Standard Tenant Sidebar */}
      <TenantSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Navigation */}
        <div className="md:hidden p-4">
          <TenantMobileNav />
        </div>
        
        {/* Unified Header */}
        <UnifiedHeader config={config} />
        
        {/* Page Content */}
        <main className="flex-1 container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

/**
 * OPERATIONAL LAYOUT
 * Specialized layout for operational pages (Route Management, Fleet Tracking)
 * Features: Context sidebar + Enhanced header + Flexible content area
 */
function OperationalLayout({ config, children }: { config: LayoutConfig; children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Context-Specific Operational Sidebar */}
      {config.sidebarContent ? (
        <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0">
          {config.sidebarContent}
        </div>
      ) : (
        <OperationalSidebar config={config} />
      )}
      
      {/* Main Content Area with Enhanced Header */}
      <div className="flex-1 flex flex-col">
        <UnifiedHeader config={config} variant="operational" />
        
        {/* Flexible Content Area */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}

/**
 * FULLSCREEN LAYOUT
 * Immersive layout for maps and detailed views
 * Features: Minimal chrome + Floating controls + Maximum content space
 */
function FullscreenLayout({ config, children }: { config: LayoutConfig; children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Floating Header Controls */}
      {(config.showBackButton || config.headerActions) && (
        <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center">
          {config.showBackButton && (
            <UnifiedHeader config={config} variant="floating" />
          )}
          {config.headerActions && (
            <div className="flex gap-2">
              {config.headerActions}
            </div>
          )}
        </div>
      )}
      
      {/* Full-Screen Content */}
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}

/**
 * MODAL LAYOUT
 * Overlay layout for forms and detail views
 * Features: Centered content + Backdrop + Escape actions
 */
function ModalLayout({ config, children }: { config: LayoutConfig; children: ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <UnifiedHeader config={config} variant="modal" />
        
        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Layout Hook for easy usage in pages
 */
export function useLayout(layoutKey: string, customConfig?: Partial<LayoutConfig>) {
  // This would typically pull from LAYOUT_PRESETS and merge with customConfig
  // Implementation depends on your state management preference
  return {
    Layout: UnifiedLayout,
    config: customConfig || {}
  };
}