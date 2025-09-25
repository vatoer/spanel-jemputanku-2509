"use client";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    mapkit: any;
  }
}

type Marker = { 
  lat: number; 
  lng: number; 
  title?: string; 
};

interface FleetMapKitMapProps {
  markers: Marker[];
}

export default function FleetMapKitMap({ markers }: FleetMapKitMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [mapkitReady, setMapkitReady] = useState(!!(typeof window !== "undefined" && window.mapkit));

  console.log("[FleetMapKit] Component rendered with", markers.length, "markers:", markers);

  // Check if MapKit is available
  useEffect(() => {
    if (typeof window !== "undefined" && window.mapkit) {
      console.log("[FleetMapKit] MapKit already available");
      setMapkitReady(true);
    }
  }, []);

  useEffect(() => {
    if (!window || !mapRef.current || !window.mapkit || !mapkitReady || !markers.length) return;
    console.log("[FleetMapKit] mapkit found, initializing...");
    
    window.mapkit.init({
      authorizationCallback: function(done: any) {
        fetch("/api/mapkit-token").then(res => res.text()).then(token => {
          console.log("[FleetMapKit] got token", token.slice(0, 20) + "...");
          done(token);
        });
      },
    });

    if (!mapInstance.current) {
      // Center to first marker
      const center = new window.mapkit.Coordinate(markers[0].lat, markers[0].lng);
      mapInstance.current = new window.mapkit.Map(mapRef.current, {
        center,
        showsUserLocationControl: true,
      });
      const region = new window.mapkit.CoordinateRegion(
        center,
        new window.mapkit.CoordinateSpan(0.3, 0.5)
      );
      mapInstance.current.region = region;
      console.log("[FleetMapKit] Map instance created");
    }

    // Add markers after map is created
    if (mapInstance.current) {
      console.log("[FleetMapKit] Adding", markers.length, "markers");
      mapInstance.current.removeAnnotations(mapInstance.current.annotations);
      markers.forEach((m) => {
        const annotation = new window.mapkit.MarkerAnnotation(
          new window.mapkit.Coordinate(m.lat, m.lng),
          { 
            title: m.title || "Vehicle", 
            color: "#3B82F6",
            glyphText: "🚐",
            glyphColor: "#FFFFFF"
          }
        );
        mapInstance.current.addAnnotation(annotation);
      });
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) mapRef.current.innerHTML = "";
      mapInstance.current = null;
    };
    // eslint-disable-next-line
  }, [mapkitReady, markers]);

  if (!mapkitReady) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-blue-600 font-medium">Loading Fleet Map...</div>
          <div className="text-blue-500 text-sm mt-1">Powered by Apple MapKit JS</div>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} style={{ width: "100%", height: "100%", minHeight: "400px" }} />;
}