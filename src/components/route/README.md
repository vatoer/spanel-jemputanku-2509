# Route Management Components

This directory contains modular, reusable components for the route management system.

## Components Overview

### `RouteHeader`
**Purpose**: Responsive header with route statistics and actions
- Displays total and active route counts
- Add route button with responsive text
- Mobile-optimized layout with compact stats

**Props**:
- `totalRoutes`: number - Total number of routes
- `activeRoutes`: number - Number of active routes  
- `onAddRoute?`: () => void - Callback for add route action

### `RouteCarousel` 
**Purpose**: Draggable carousel for route selection with full touch/mouse support
- Horizontal scrolling with drag functionality
- Mouse and touch event handlers
- Route cards with actions (View, Edit)
- Add new route card
- Responsive sizing and interactions

**Props**:
- `routes`: Route[] - Array of route objects
- `selectedRoute`: Route - Currently selected route
- `onRouteSelect`: (route: Route) => void - Route selection callback
- `onEditRoute?`: (route: Route) => void - Edit action callback
- `onViewRoute?`: (route: Route) => void - View action callback
- `onAddRoute?`: () => void - Add route callback

### `StopsPanel` (Desktop Only)
**Purpose**: Side panel displaying route stops with toggle functionality
- Vertical list of route stops with visual timeline
- Toggle visibility controls
- Scrollable container for long routes

**Props**:
- `selectedRoute`: Route - Current route data
- `stops`: Stop[] - Array of stop objects
- `showStops`: boolean - Visibility state
- `onToggleStops`: () => void - Toggle callback

### `MobileOverlay` (Mobile Only) 
**Purpose**: Overlay information panel for mobile route display
- Compact route information display
- Collapsible stops grid
- Touch-friendly interactions
- Auto-hides on desktop

**Props**:
- `selectedRoute`: Route - Current route data
- `stops`: Stop[] - Array of stop objects  
- `showStops`: boolean - Visibility state
- `onToggleStops`: () => void - Toggle callback

### `MapContainer`
**Purpose**: Map wrapper with Apple MapKit integration
- Handles map rendering with directions
- Fallback placeholder when no directions available
- Children prop for overlays (like MobileOverlay)

**Props**:
- `selectedRoute`: Route - Current route for display
- `directions`: DirectionsJson | null - Map directions data
- `children?`: React.ReactNode - Overlay components

## Type Definitions

### `Route`
```typescript
interface Route {
  code: string;
  name: string; 
  origin: string;
  destination: string;
  status: 'active' | 'maintenance';
}
```

### `Stop`
```typescript
interface Stop {
  id: number;
  name: string;
  time: string;
  order: number;
}
```

## Usage Example

```tsx
import { 
  RouteHeader, 
  RouteCarousel, 
  StopsPanel, 
  MobileOverlay, 
  MapContainer,
  type Route,
  type Stop 
} from '@/components/route';

export default function RutePage() {
  const [selected, setSelected] = useState<Route>(routes[0]);
  const [showStops, setShowStops] = useState(true);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <RouteHeader 
        totalRoutes={routes.length}
        activeRoutes={activeCount}
        onAddRoute={handleAdd}
      />
      
      <RouteCarousel 
        routes={routes}
        selectedRoute={selected}
        onRouteSelect={setSelected}
      />
      
      <div className="flex-1 flex">
        <MapContainer selectedRoute={selected} directions={directions}>
          <MobileOverlay 
            selectedRoute={selected}
            stops={stops}
            showStops={showStops}
            onToggleStops={() => setShowStops(!showStops)}
          />
        </MapContainer>
        
        {!isMobile && (
          <StopsPanel 
            selectedRoute={selected}
            stops={stops}
            showStops={showStops}
            onToggleStops={() => setShowStops(!showStops)}
          />
        )}
      </div>
    </div>
  );
}
```

## Features

- ✅ **Fully Responsive**: Mobile-first design with desktop enhancements
- ✅ **Drag Functionality**: Smooth scrolling carousel with mouse and touch support
- ✅ **TypeScript**: Full type safety with proper interfaces
- ✅ **Modular**: Reusable components with clean separation of concerns
- ✅ **Accessible**: Proper ARIA attributes and keyboard navigation
- ✅ **Modern UI/UX**: Clean gradients, animations, and interactions