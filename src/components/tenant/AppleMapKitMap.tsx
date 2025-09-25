"use client";
import { useEffect, useRef, useState } from "react";

// Apple MapKit JS types for window
declare global {
  interface Window {
    mapkit: any;
  }
}

// Props: armada = [{ id, nama, lat, lng, rute: [{lat, lng, nama}] }]

type Marker = { lat: number; lng: number; title?: string; icon?: string };
type Route = { from: string; to: string; polyline: { lat: number; lng: number }[] };

export function AppleMapKitMap({ markers, routes }: { markers: Marker[]; routes?: Route[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [mapkitReady, setMapkitReady] = useState(!!(typeof window !== "undefined" && window.mapkit));

  // Inject MapKit JS script if not present
  useEffect(() => {
    if (!window || !mapRef.current) return;
    if (!window.mapkit) {
      console.log("[MapKit] mapkit not found, injecting script...");
      const script = document.createElement("script");
      script.src = "https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js";
      script.async = true;
      script.onload = () => {
        console.log("[MapKit] mapkit.js loaded");
        setMapkitReady(true);
      };
      document.body.appendChild(script);
    } else {
      setMapkitReady(true);
    }
  }, []);

  // Initialize map when mapkitReady or markers change
  useEffect(() => {
    if (!window || !mapRef.current || !window.mapkit || !mapkitReady || !markers.length) return;
    console.log("[MapKit] mapkit found, initializing...");
    window.mapkit.init({
      authorizationCallback: function(done: any) {
        fetch("/api/mapkit-token").then(res => res.text()).then(token => {
          console.log("[MapKit] got token", token.slice(0, 20) + "...");
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
    }
    // Cleanup on unmount
    return () => {
      if (mapRef.current) mapRef.current.innerHTML = "";
      mapInstance.current = null;
    };
    // eslint-disable-next-line
  }, [mapkitReady, markers]);

  useEffect(() => {
    if (!window.mapkit || !mapInstance.current) {
      console.log("[MapKit] Marker effect: mapkit or mapInstance not ready");
      return;
    }
    mapInstance.current.removeAnnotations(mapInstance.current.annotations);
    markers.forEach((m) => {
      const markerOptions: any = { 
        title: m.title || "Titik", 
        color: "#2563eb" 
      };
      
      // Use custom icon if provided
      if (m.icon) {
        markerOptions.glyphText = m.icon;
        markerOptions.glyphColor = "#FFFFFF";
      }
      
      const annotation = new window.mapkit.MarkerAnnotation(
        new window.mapkit.Coordinate(m.lat, m.lng),
        markerOptions
      );
      mapInstance.current.addAnnotation(annotation);
    });
    // Draw polylines for each route
    if (routes && routes.length) {
      mapInstance.current.removeOverlays(mapInstance.current.overlays);
      routes.forEach((route) => {
        if (route.polyline && route.polyline.length > 1) {
          const coords = route.polyline.map((p) => new window.mapkit.Coordinate(p.lat, p.lng));
          const polyline = new window.mapkit.PolylineOverlay(coords);
          polyline.style = new window.mapkit.Style({
            lineWidth: 4,
            strokeColor: "#22c55e",
            lineJoin: "round",
            lineCap: "round",
            opacity: 0.85,
          });
          mapInstance.current.addOverlay(polyline);
        }
      });
    }
  }, [mapkitReady, markers, routes]);

  return <div ref={mapRef} style={{ width: "100%", height: 500 }} />;
}
