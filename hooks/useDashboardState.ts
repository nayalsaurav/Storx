// hooks/useDashboardState.ts
import { useState } from "react";
import { Breadcrumb, ViewMode } from "@/types/types";

export const useDashboardState = () => {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([
    { id: null, name: "Home" },
  ]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolder(folderId);
    setBreadcrumbs((prev) => [...prev, { id: folderId, name: folderName }]);
  };

  const navigateToBreadcrumb = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    const targetFolder = newBreadcrumbs[newBreadcrumbs.length - 1];

    setBreadcrumbs(newBreadcrumbs);
    setCurrentFolder(targetFolder.id);
  };

  return {
    currentFolder,
    breadcrumbs,
    viewMode,
    searchQuery,
    selectedFiles,
    sidebarOpen,
    setViewMode,
    setSearchQuery,
    setSidebarOpen,
    navigateToFolder,
    navigateToBreadcrumb,
  };
};
