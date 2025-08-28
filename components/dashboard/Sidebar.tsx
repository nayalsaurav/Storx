// components/dashboard/Sidebar.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, Star, Trash2, Settings, Cloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { StorageInfo } from "@/types/types";
import { StorageIndicator } from "./StorageIndicator";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  storageInfo: StorageInfo;
  navigateToBreadcrumb: (index: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  storageInfo,
  navigateToBreadcrumb,
}) => {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
        <div className="flex items-center space-x-2">
          <Cloud className="w-6 h-6 text-blue-600" />
          <span className="text-lg font-bold text-gray-900">StorageX</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
          onClick={() => navigateToBreadcrumb(0)}
        >
          <Home className="w-4 h-4 mr-3" />
          Home
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-lg hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
        >
          <Star className="w-4 h-4 mr-3" />
          Starred
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-3" />
          Trash
        </Button>
        <Separator className="my-4" />
        <Button
          variant="ghost"
          className="w-full justify-start rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </Button>
      </div>

      <StorageIndicator storageInfo={storageInfo} />
    </aside>
  );
};
