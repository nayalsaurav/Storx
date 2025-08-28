// components/dashboard/LoadingSkeleton.tsx
import React from "react";

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="w-full h-4 bg-gray-200 rounded"></div>
              <div className="w-16 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
