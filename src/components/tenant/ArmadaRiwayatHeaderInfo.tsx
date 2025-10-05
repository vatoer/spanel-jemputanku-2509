"use client";

interface ArmadaRiwayatHeaderInfoProps {
  platNomor: string;
  title?: string;
  description?: string;
}

export function ArmadaRiwayatHeaderInfo({ 
  platNomor, 
  title = "Riwayat Pemeliharaan & Perbaikan",
  description 
}: ArmadaRiwayatHeaderInfoProps) {
  // Decode URL-encoded plat nomor untuk display
  const decodedPlatNomor = decodeURIComponent(platNomor);
  
  return (
    <div className="flex items-start gap-3 flex-1 min-w-0">
      {/* Icon - Visual anchor point untuk riwayat */}
      <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-blue-600 text-lg">📊</span>
      </div>
      
      {/* Title & Meta - Left aligned, informational */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <h1 className="text-xl font-bold text-gray-900 truncate mb-1">
          {title}
        </h1>
        
        {/* Meta info dengan plat nomor */}
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">
            Armada <span className="font-semibold text-gray-700">{decodedPlatNomor}</span>
          </p>
        </div>
        
        {description && (
          <p className="text-xs text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}