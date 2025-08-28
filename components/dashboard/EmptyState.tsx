// components/dashboard/EmptyState.tsx (improved version)
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Folder, FolderPlus, Upload } from "lucide-react";
import { CreateFolderDialog } from "./CreateFolderDialog";

interface EmptyStateProps {
  onCreateFolder: (name: string) => Promise<boolean>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateFolder }) => {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        <Folder className="w-12 h-12 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No files yet</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Upload files or create folders to get started with your storage
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <CreateFolderDialog onCreateFolder={onCreateFolder} />
        <Button
          variant="outline"
          className="rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Upload className="w-4 h-4 mr-2" />
          <label className="cursor-pointer">
            Upload Files
            <input
              type="file"
              multiple
              className="hidden"
              accept="image/*,application/pdf,video/*,.doc,.docx"
            />
          </label>
        </Button>
      </div>
    </div>
  );
};
