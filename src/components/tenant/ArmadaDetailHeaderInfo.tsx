"use client";

import { ArmadaHeaderProps, ArmadaStatus, StatusColorScheme } from "@/types/armada-header.types";

interface ArmadaDetailHeaderInfoProps extends ArmadaHeaderProps {
  // Include status untuk display information
}

export function ArmadaDetailHeaderInfo({ 
  platNomor, 
  status = "Aktif",
  title = "Detail & Informasi Armada",
  description 
}: ArmadaDetailHeaderInfoProps) {
  // Decode URL-encoded plat nomor untuk display
  const decodedPlatNomor = decodeURIComponent(platNomor);
  
  const getStatusColor = (status: ArmadaStatus): StatusColorScheme => {
    switch (status) {
      case "Aktif":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          dot: "bg-green-500",
          text: "text-green-700"
        };
      case "Maintenance":
        return {
          bg: "bg-yellow-50", 
          border: "border-yellow-200",
          dot: "bg-yellow-500",
          text: "text-yellow-700"
        };
      case "Tidak Aktif":
        return {
          bg: "bg-red-50",
          border: "border-red-200", 
          dot: "bg-red-500",
          text: "text-red-700"
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          dot: "bg-gray-500", 
          text: "text-gray-700"
        };
    }
  };

  const statusColors = getStatusColor(status);
  
  return (
    <div className="flex items-start gap-3 flex-1 min-w-0">
      {/* Icon - Visual anchor point */}
      <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-emerald-600 text-lg">🚌</span>
      </div>
      
      {/* Title, Meta, & Status - Left aligned, informational */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <h1 className="text-xl font-bold text-gray-900 truncate mb-1">
          {decodedPlatNomor}
        </h1>
        
        {/* Meta info dengan status */}
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm text-gray-500">
            {title}
          </p>
          {/* Status Badge - Clean informational display */}
          <div className={`inline-flex items-center gap-1.5 px-2 py-1 ${statusColors.bg} border ${statusColors.border} rounded-full`}>
            <div className={`w-1.5 h-1.5 ${statusColors.dot} rounded-full ${status === "Aktif" ? "animate-pulse" : ""}`}></div>
            <span className={`text-xs font-medium ${statusColors.text}`}>{status}</span>
          </div>
        </div>
        
        {description && (
          <p className="text-xs text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}