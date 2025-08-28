// components/dashboard/StorageIndicator.tsx
import React from "react";
import { StorageInfo } from "@/types/types";
import { formatFileSize } from "@/lib/file-utils";

interface StorageIndicatorProps {
  storageInfo: StorageInfo;
}

export const StorageIndicator: React.FC<StorageIndicatorProps> = ({
  storageInfo,
}) => {
  return (
    <div className="absolute bottom-4 left-4 right-4">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Storage</span>
          <span className="text-xs text-gray-500">
            {formatFileSize(storageInfo.used)} /{" "}
            {formatFileSize(storageInfo.total)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
