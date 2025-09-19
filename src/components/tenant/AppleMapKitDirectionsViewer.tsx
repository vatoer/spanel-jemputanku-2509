import { useEffect, useRef, useState } from "react";

// Types for the directions JSON
export type Route = {
  name: string;
  distanceMeters: number;
  durationSeconds: number;
  transportType: string;
  hasTolls: boolean;
  stepIndexes: number[];
};
export type Step = {
  stepPathIndex: number;
  distanceMeters: number;
  durationSeconds: number;
  instruction?: string;
}
export type StepPath = Array<{ latitude: number; longitude: number }>;
export type DirectionsJson = {
  polyline: {
    origin: { coordinate: { latitude: number; longitude: number } };
    destination: { coordinate: { latitude: number; longitude: number } };
    routes: Route[];
    steps: Step[];
    stepPaths: StepPath[];
  };
};


export function AppleMapKitDirectionsViewer({ directions }: { directions: DirectionsJson }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [mapkitReady, setMapkitReady] = useState(!!(typeof window !== "undefined" && window.mapkit));
  // Store region bounds to restrict panning/zooming
  const regionBounds = useRef<any>(null);
  // Guard to prevent infinite recursion on region reset
  const isResettingRegion = useRef(false);

  // Inject MapKit JS script if not present
  useEffect(() => {
    if (!window || !mapRef.current) return;
    if (!window.mapkit) {
      const script = document.createElement("script");
      script.src = "https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js";
      script.async = true;
      script.onload = () => setMapkitReady(true);
      document.body.appendChild(script);
    } else {
      setMapkitReady(true);
    }
  }, []);

  // Initialize map if needed, then always draw overlays/markers after mapInstance is ready
  useEffect(() => {
    if (!window.mapkit || !mapRef.current || !directions) return;
    // Always init MapKit with JWT before creating map
    window.mapkit.init({
      authorizationCallback: function(done: any) {
        fetch("/api/mapkit-token").then(res => res.text()).then(token => {
          done(token);
        });
      },
    });
    // Calculate bounds to fit both origin and destination
    const origin = directions.polyline.origin.coordinate;
    const dest = directions.polyline.destination.coordinate;
    const minLat = Math.min(origin.latitude, dest.latitude);
    const maxLat = Math.max(origin.latitude, dest.latitude);
    const minLng = Math.min(origin.longitude, dest.longitude);
    const maxLng = Math.max(origin.longitude, dest.longitude);
    // Add some padding to bounds
    const latPad = (maxLat - minLat) * 0.7 || 0.05;
    const lngPad = (maxLng - minLng) * 0.7 || 0.05;
    const region = new window.mapkit.CoordinateRegion(
      new window.mapkit.Coordinate((minLat + maxLat) / 2, (minLng + maxLng) / 2),
      new window.mapkit.CoordinateSpan((maxLat - minLat) + latPad, (maxLng - minLng) + lngPad)
    );
    // Store bounds for later restriction
    regionBounds.current = {
      minLat: minLat - latPad,
      maxLat: maxLat + latPad,
      minLng: minLng - lngPad,
      maxLng: maxLng + lngPad,
    };
    // Init map if not already
    if (!mapInstance.current) {
      mapInstance.current = new window.mapkit.Map(mapRef.current, {
        region,
        showsUserLocationControl: true,
        mapType: window.mapkit.Map.MapTypes.standard,
        isZoomEnabled: true,
        isScrollEnabled: true,
        isRotationEnabled: false,
      });
      // Prevent user from panning/zooming away from route
      mapInstance.current.addEventListener("region-change-end", () => {
        const map = mapInstance.current;
        const bounds = regionBounds.current;
        if (!map || !bounds) return;
        if (isResettingRegion.current) {
          isResettingRegion.current = false;
          return;
        }
        const center = map.region.center;
        const span = map.region.span;
        // Clamp center
        let clampedLat = Math.max(bounds.minLat, Math.min(center.latitude, bounds.maxLat));
        let clampedLng = Math.max(bounds.minLng, Math.min(center.longitude, bounds.maxLng));
        // Clamp zoom out (span)
        const maxSpanLat = bounds.maxLat - bounds.minLat;
        const maxSpanLng = bounds.maxLng - bounds.minLng;
        let clampedSpanLat = Math.min(span.latitudeDelta, maxSpanLat);
        let clampedSpanLng = Math.min(span.longitudeDelta, maxSpanLng);
        // If out of bounds, reset region
        if (
          center.latitude !== clampedLat ||
          center.longitude !== clampedLng ||
          span.latitudeDelta !== clampedSpanLat ||
          span.longitudeDelta !== clampedSpanLng
        ) {
          isResettingRegion.current = true;
          map.region = new window.mapkit.CoordinateRegion(
            new window.mapkit.Coordinate(clampedLat, clampedLng),
            new window.mapkit.CoordinateSpan(clampedSpanLat, clampedSpanLng)
          );
        }
      });
    } else {
      // Always reset region to fit route
      mapInstance.current.region = region;
    }
    // Remove overlays/annotations
    mapInstance.current.removeOverlays(mapInstance.current.overlays);
    mapInstance.current.removeAnnotations(mapInstance.current.annotations);
    // Draw route polyline(s)
    if (directions.polyline && directions.polyline.stepPaths) {
      directions.polyline.stepPaths.forEach((stepPath) => {
        if (stepPath.length > 1) {
          const coords = stepPath.map((p) => new window.mapkit.Coordinate(p.latitude, p.longitude));
          const polyline = new window.mapkit.PolylineOverlay(coords);
          polyline.style = new window.mapkit.Style({
            lineWidth: 5,
            strokeColor: "#2563eb",
            opacity: 0.9,
          });
          mapInstance.current.addOverlay(polyline);
        }
      });
    }
    // Add origin/destination markers
    mapInstance.current.addAnnotation(new window.mapkit.MarkerAnnotation(
      new window.mapkit.Coordinate(origin.latitude, origin.longitude),
      { title: "Origin", color: "#22c55e" }
    ));
    mapInstance.current.addAnnotation(new window.mapkit.MarkerAnnotation(
      new window.mapkit.Coordinate(dest.latitude, dest.longitude),
      { title: "Destination", color: "#ef4444" }
    ));
  }, [mapkitReady, directions]);

  return <div ref={mapRef} style={{ width: "100%", height: 500 }} />;
}
