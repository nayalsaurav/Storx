// components/dashboard/FileGrid.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { FileItem } from "@/types/types";
import { formatFileSize, getFileIcon } from "@/lib/file-utils";

interface FileGridProps {
  files: FileItem[];
  onFolderClick: (folderId: string, folderName: string) => void;
}

export const FileGrid: React.FC<FileGridProps> = ({ files, onFolderClick }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {files.map((file) => (
        <Card
          key={file.id}
          className="group cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl overflow-hidden"
          onClick={() => file.isFolder && onFolderClick(file.id, file.name)}
        >
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3 group-hover:scale-110 transition-transform duration-300">
                {file.thumbnailUrl ? (
                  <div className="relative">
                    <img
                      src={file.thumbnailUrl}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded-lg shadow-md"
                    />
                    {file.isStarred && (
                      <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    {getFileIcon(file)}
                    {file.isStarred && (
                      <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                )}
              </div>
              <h4
                className="text-sm font-medium text-gray-900 truncate w-full group-hover:text-blue-700 transition-colors"
                title={file.name}
              >
                {file.name}
              </h4>
              {!file.isFolder && (
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(file.size)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
