import { ReactNode } from "react";

/**
 * Transport Management App Layout System
 * 
 * Best Practices Implemented:
 * 1. Consistent Navigation Hierarchy
 * 2. Context-Aware Sidebars (Main Navigation vs Feature-Specific)
 * 3. Responsive Design with Mobile-First Approach
 * 4. Unified Header System with Breadcrumbs
 * 5. Proper Information Architecture for Fleet Operations
 */

// Layout Types for Different Contexts
export type LayoutType = 
  | 'main'        // Standard layout with TenantSidebar (Dashboard, Settings, etc.)
  | 'operational' // Specialized layout for operations (Route Management, Fleet Tracking)
  | 'fullscreen'  // Immersive layout for maps and detailed views
  | 'modal';      // Overlay layout for forms and details

// Navigation Context for Active State Management
export interface NavigationContext {
  currentModule: string;
  currentSubModule?: string;
  breadcrumbs: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

// Layout Configuration
export interface LayoutConfig {
  type: LayoutType;
  title: string;
  description?: string;
  showBackButton?: boolean;
  backButtonHref?: string;
  headerActions?: ReactNode;
  sidebarContent?: ReactNode;
  navigation?: NavigationContext;
  className?: string;
}

/**
 * Unified Layout Principles for Transport Management:
 * 
 * 1. MAIN LAYOUT (Dashboard, Reports, Settings)
 *    - Always visible TenantSidebar for primary navigation
 *    - Consistent header with user context
 *    - Standard page structure with breadcrumbs
 * 
 * 2. OPERATIONAL LAYOUT (Route Planning, Fleet Tracking)
 *    - Context-specific sidebar with operational controls
 *    - Enhanced header with real-time status
 *    - Flexible content area for maps and data views
 * 
 * 3. FULLSCREEN LAYOUT (Route Details, Live Tracking)
 *    - Minimal chrome to maximize content area
 *    - Floating navigation controls
 *    - Optimized for map interfaces and data visualization
 * 
 * 4. RESPONSIVE STRATEGY:
 *    - Mobile: Collapsible navigation, priority to content
 *    - Tablet: Adaptive sidebar, context-aware actions
 *    - Desktop: Full feature access, multi-panel views
 */

export const LAYOUT_PRESETS: Record<string, LayoutConfig> = {
  // Standard administrative pages
  dashboard: {
    type: 'main',
    title: 'Dashboard',
    description: 'Transport Management Overview',
    navigation: {
      currentModule: 'dashboard',
      breadcrumbs: [{ label: 'Dashboard', active: true }]
    }
  },
  
  // Administrative routes using main layout
  jadwal: {
    type: 'main',
    title: 'Schedule Management',
    description: 'Manage transport schedules and timetables',
    navigation: {
      currentModule: 'schedule',
      breadcrumbs: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Schedule Management', active: true }
      ]
    }
  },

  armada: {
    type: 'main',
    title: 'Fleet Management',
    description: 'Manage vehicles and fleet operations',
    navigation: {
      currentModule: 'fleet',
      breadcrumbs: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Fleet Management', active: true }
      ]
    }
  },

  driver: {
    type: 'main',
    title: 'Driver Management',
    description: 'Manage drivers and personnel',
    navigation: {
      currentModule: 'drivers',
      breadcrumbs: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Driver Management', active: true }
      ]
    }
  },

  penumpang: {
    type: 'main',
    title: 'Passenger Management',
    description: 'Manage passenger data and services',
    navigation: {
      currentModule: 'passengers',
      breadcrumbs: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Passenger Management', active: true }
      ]
    }
  },

  laporan: {
    type: 'main',
    title: 'Reports & Analytics',
    description: 'View reports and performance analytics',
    navigation: {
      currentModule: 'reports',
      breadcrumbs: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Reports & Analytics', active: true }
      ]
    }
  },

  pengaturan: {
    type: 'main',
    title: 'Settings',
    description: 'System configuration and preferences',
    navigation: {
      currentModule: 'settings',
      breadcrumbs: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Settings', active: true }
      ]
    }
  },
  
  // Operational management pages
  routeManagement: {
    type: 'operational',
    title: 'Route Management',
    description: 'Plan and optimize transport routes',
    showBackButton: true,
    backButtonHref: '/dashboard',
    navigation: {
      currentModule: 'operations',
      currentSubModule: 'routes',
      breadcrumbs: [
        { label: 'Operations', href: '/dashboard' },
        { label: 'Route Management', active: true }
      ]
    }
  },
  
  fleetTracking: {
    type: 'operational',
    title: 'Fleet Tracking',
    description: 'Real-time vehicle monitoring and control',
    showBackButton: true,
    backButtonHref: '/dashboard',
    navigation: {
      currentModule: 'operations',
      currentSubModule: 'tracking',
      breadcrumbs: [
        { label: 'Operations', href: '/dashboard' },
        { label: 'Fleet Tracking', active: true }
      ]
    }
  },
  
  // Immersive experiences
  routeDetails: {
    type: 'fullscreen',
    title: 'Route Details',
    showBackButton: true,
    backButtonHref: '/rute'
  }
};

/**
 * Navigation Hierarchy Best Practices:
 * 
 * Level 1: Primary Modules (TenantSidebar)
 *   - Dashboard & Analytics
 *   - Operations Management
 *   - Fleet & Vehicle Management
 *   - User & Access Management
 *   - Settings & Configuration
 * 
 * Level 2: Feature Areas (Context Sidebars)
 *   - Route Planning & Optimization
 *   - Real-time Fleet Tracking
 *   - Schedule Management
 *   - Maintenance & Reports
 * 
 * Level 3: Detailed Views (Content Areas)
 *   - Individual route configuration
 *   - Live vehicle monitoring
 *   - Driver performance details
 *   - Historical analytics
 */