import { LayoutConfig } from "@/types/layout";
import { useRouter } from "next/navigation";

interface UnifiedHeaderProps {
  config: LayoutConfig;
  variant?: 'default' | 'operational' | 'floating' | 'modal';
}

/**
 * Unified Header Component
 * 
 * Provides consistent header experience across all layout types
 * with context-aware styling and functionality.
 */
export function UnifiedHeader({ config, variant = 'default' }: UnifiedHeaderProps) {
  const router = useRouter();
  const { title, description, showBackButton, backButtonHref, headerActions, navigation } = config;

  const handleBack = () => {
    if (backButtonHref) {
      router.push(backButtonHref);
    } else {
      router.back();
    }
  };

  // Variant-specific styling
  const getVariantClasses = () => {
    switch (variant) {
      case 'operational':
        return "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg border-b-0";
      case 'floating':
        return "bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200";
      case 'modal':
        return "bg-gray-50 border-b border-gray-200 rounded-t-2xl";
      default:
        return "bg-white border-b border-gray-200 shadow-sm";
    }
  };

  const getContentClasses = () => {
    switch (variant) {
      case 'floating':
        return "px-4 py-3";
      case 'modal':
        return "px-6 py-4";
      default:
        return "px-6 py-4";
    }
  };

  return (
    <header className={`${getVariantClasses()}`}>
      <div className={`${getContentClasses()} flex items-center justify-between`}>
        {/* Left Section: Navigation & Title */}
        <div className="flex items-center gap-4">
          {/* Back Button */}
          {showBackButton && (
            <button
              onClick={handleBack}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 group
                ${variant === 'operational' 
                  ? 'bg-white/20 hover:bg-white/30 text-white' 
                  : variant === 'floating'
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
              `}
              title="Kembali"
            >
              <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
              {variant !== 'floating' && (
                <span className="text-sm font-medium hidden sm:inline">Kembali</span>
              )}
            </button>
          )}

          {/* Title Section */}
          <div className="flex items-center gap-3">
            {/* Module Icon (for operational layouts) */}
            {variant === 'operational' && (
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">
                  {navigation?.currentSubModule === 'routes' ? '🗺️' : 
                   navigation?.currentSubModule === 'tracking' ? '🚛' : '📊'}
                </span>
              </div>
            )}

            <div>
              {/* Breadcrumbs for main layout */}
              {variant === 'default' && navigation?.breadcrumbs && navigation.breadcrumbs.length > 1 && (
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  {navigation.breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {crumb.href ? (
                        <button 
                          onClick={() => router.push(crumb.href!)}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {crumb.label}
                        </button>
                      ) : (
                        <span className={crumb.active ? 'text-gray-900 font-medium' : ''}>
                          {crumb.label}
                        </span>
                      )}
                      {index < navigation.breadcrumbs.length - 1 && (
                        <span className="text-gray-300">/</span>
                      )}
                    </div>
                  ))}
                </nav>
              )}

              {/* Title */}
              <h1 className={`font-bold ${
                variant === 'floating' ? 'text-lg text-gray-900' :
                variant === 'operational' ? 'text-2xl text-white' :
                'text-2xl text-gray-900'
              }`}>
                {title}
              </h1>

              {/* Description */}
              {description && variant !== 'floating' && (
                <p className={`text-sm mt-1 ${
                  variant === 'operational' ? 'text-blue-100' : 'text-gray-600'
                }`}>
                  {description}
                </p>
              )}

              {/* Live Status for operational layouts */}
              {variant === 'operational' && navigation?.currentSubModule === 'tracking' && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-xs text-blue-100">
                    Live • Update: {new Date().toLocaleTimeString('id-ID')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Actions */}
        {headerActions && (
          <div className="flex items-center gap-3">
            {headerActions}
          </div>
        )}

        {/* Default Actions for operational layouts */}
        {variant === 'operational' && !headerActions && (
          <div className="flex items-center gap-3">
            <button
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              onClick={() => {/* Refresh/Reload functionality */}}
            >
              ⟳ Refresh
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              Dashboard
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

/**
 * Specialized header variants for common patterns
 */
export function DashboardHeader() {
  return (
    <UnifiedHeader 
      config={{
        type: 'main',
        title: 'Dashboard',
        description: 'Transport Management Overview',
        navigation: {
          currentModule: 'dashboard',
          breadcrumbs: [{ label: 'Dashboard', active: true }]
        }
      }} 
    />
  );
}

export function OperationalHeader({ 
  title, 
  module, 
  showLiveStatus = false 
}: { 
  title: string; 
  module: string; 
  showLiveStatus?: boolean; 
}) {
  return (
    <UnifiedHeader 
      config={{
        type: 'operational',
        title,
        showBackButton: true,
        backButtonHref: '/dashboard',
        navigation: {
          currentModule: 'operations',
          currentSubModule: module,
          breadcrumbs: [
            { label: 'Operations', href: '/dashboard' },
            { label: title, active: true }
          ]
        }
      }}
      variant="operational"
    />
  );
}