// components/dashboard/Dashboard.tsx
"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ActionBar } from "./ActionBar";
import { FileGrid } from "./FileGrid";

import { useFileOperations } from "@/hooks/useFileOperations";
import { useStorage } from "@/hooks/useStorage";
import { useDashboardState } from "@/hooks/useDashboardState";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import { FileList } from "./FileList";

export default function Dashboard() {
  const { user } = useUser();
  const userId = user?.id ?? "123";

  const {
    currentFolder,
    breadcrumbs,
    viewMode,
    searchQuery,
    sidebarOpen,
    setViewMode,
    setSearchQuery,
    setSidebarOpen,
    navigateToFolder,
    navigateToBreadcrumb,
  } = useDashboardState();

  const {
    files,
    isLoading,
    isUploading,
    fetchFiles,
    handleFileUpload,
    handleStarToggle,
    handleDelete,
    handleDownload,
    createFolder,
  } = useFileOperations(userId);

  const { storageInfo, fetchStorageInfo } = useStorage(userId);

  useEffect(() => {
    if (user?.id) {
      fetchFiles(currentFolder);
      fetchStorageInfo();
    }
  }, [user?.id, fetchFiles, fetchStorageInfo, currentFolder]);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleFileUploadWithRefresh = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleFileUpload(event, currentFolder, () => {
      fetchFiles(currentFolder);
      fetchStorageInfo();
    });
  };

  const handleCreateFolder = async (name: string) => {
    const success = await createFolder(name, currentFolder);
    if (success) {
      fetchFiles(currentFolder);
      fetchStorageInfo();
    }
    return success;
  };

  const handleStarToggleWithRefresh = async (
    fileId: string,
    isStarred: boolean,
  ) => {
    const success = await handleStarToggle(fileId, isStarred);
    if (success) fetchFiles(currentFolder);
  };

  const handleDeleteWithRefresh = async (fileId: string, fileName: string) => {
    const success = await handleDelete(fileId, fileName);
    if (success) {
      fetchFiles(currentFolder);
      fetchStorageInfo();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Header (fixed height) */}
      <Header
        breadcrumbs={breadcrumbs}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSidebarOpen={setSidebarOpen}
        navigateToBreadcrumb={navigateToBreadcrumb}
      />

      {/* Main (Sidebar + Content) */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          storageInfo={storageInfo}
          navigateToBreadcrumb={navigateToBreadcrumb}
        />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <ActionBar
            viewMode={viewMode}
            setViewMode={setViewMode}
            isUploading={isUploading}
            handleFileUpload={handleFileUploadWithRefresh}
            createFolder={handleCreateFolder}
          />

          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredFiles.length === 0 ? (
            <EmptyState onCreateFolder={handleCreateFolder} />
          ) : viewMode === "grid" ? (
            <FileGrid files={filteredFiles} onFolderClick={navigateToFolder} />
          ) : (
            <FileList
              files={filteredFiles}
              onFolderClick={navigateToFolder}
              onStarToggle={handleStarToggleWithRefresh}
              onDelete={handleDeleteWithRefresh}
              onDownload={handleDownload}
            />
          )}
        </main>
      </div>
    </div>
  );
}
