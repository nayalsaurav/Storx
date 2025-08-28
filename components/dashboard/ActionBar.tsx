// components/dashboard/ActionBar.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { FolderPlus, Upload, Grid3X3, List, Loader2 } from "lucide-react";

import { ViewMode } from "@/types/types";
import { CreateFolderDialog } from "./CreateFolderDialog";

interface ActionBarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isUploading: boolean;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  createFolder: (name: string) => Promise<boolean>;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  viewMode,
  setViewMode,
  isUploading,
  handleFileUpload,
  createFolder,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <CreateFolderDialog onCreateFolder={createFolder} />

        <Button
          variant="outline"
          disabled={isUploading}
          className="rounded-lg hover:bg-gray-50 transition-colors"
        >
          {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <Upload className="w-4 h-4 mr-2" />
          <label className="cursor-pointer">
            {isUploading ? "Uploading..." : "Upload"}
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,application/pdf,video/*,.doc,.docx"
              disabled={isUploading}
            />
          </label>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("grid")}
          className="rounded-lg"
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("list")}
          className="rounded-lg"
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
