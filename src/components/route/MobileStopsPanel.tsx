import { Stop } from "@/components/route";

interface MobileStopsPanelProps {
  selectedRoute: {
    name: string;
    code: string;
  };
  stops: Stop[];
  showStops: boolean;
  onToggleStops: () => void;
}

export function MobileStopsPanel({ 
  selectedRoute, 
  stops, 
  showStops, 
  onToggleStops 
}: MobileStopsPanelProps) {
  if (!showStops) {
    return (
      <div className="p-4 bg-white border-t border-gray-200">
        <button
          onClick={onToggleStops}
          className="w-full py-3 text-sm bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition"
        >
          🚏 Show Route Stops ({stops.length})
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-t border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 text-sm">Route Stops</h3>
          <button
            onClick={onToggleStops}
            className="text-xs px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-700"
          >
            Hide
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{selectedRoute.name}</span>
        </div>
      </div>
      <div className="max-h-48 overflow-y-auto p-3">
        <div className="space-y-2">
          {stops.map((stop, index) => (
            <div key={stop.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${
                  index === 0 || index === stops.length - 1 ? 'bg-blue-500' : 'bg-gray-400'
                }`}></div>
                {index < stops.length - 1 && (
                  <div className="w-0.5 h-5 bg-gray-300 mt-1"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-xs truncate">{stop.name}</div>
                <div className="text-xs text-gray-500">
                  {stop.time} • #{stop.order}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}