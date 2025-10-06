"use client";

interface DriverStatus {
  ACTIVE: "Aktif";
  INACTIVE: "Tidak Aktif"; 
  SUSPENDED: "Ditangguhkan";
}

type DriverStatusKey = keyof DriverStatus;
type DriverStatusValue = DriverStatus[DriverStatusKey];

interface StatusColorScheme {
  bg: string;
  border: string;
  dot: string;
  text: string;
}

interface DriverDetailHeaderInfoProps {
  driverName: string;
  status?: DriverStatusValue;
  title?: string;
  description?: string;
}

export function DriverDetailHeaderInfo({ 
  driverName, 
  status = "Aktif",
  title = "Detail & Informasi Driver",
  description 
}: DriverDetailHeaderInfoProps) {
  
  const getStatusColor = (status: DriverStatusValue): StatusColorScheme => {
    switch (status) {
      case "Aktif":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          dot: "bg-green-500",
          text: "text-green-700"
        };
      case "Ditangguhkan":
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
    <div className="flex-1 min-w-0">
      {/* Header Info - Mobile optimized typography */}
      <div className="space-y-2">
        {/* Title & Primary Info */}
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-700 truncate">
              {driverName}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {title}
            </p>
          </div>
          
          {/* Status Badge - Prominent positioning */}
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.border} ${statusColors.text} flex-shrink-0`}>
            <div className={`w-2 h-2 rounded-full ${statusColors.dot}`}></div>
            <span>{status}</span>
          </div>
        </div>

        {/* Optional Description */}
        {description && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}