// components/dashboard/FileList.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Star, Download, Share, Trash2, MoreVertical } from "lucide-react";
import { FileItem } from "@/types/types";
import { getFileIcon, formatFileSize } from "@/lib/file-utils";
import { cn } from "@/lib/utils";

interface FileListProps {
  files: FileItem[];
  onFolderClick: (folderId: string, folderName: string) => void;
  onStarToggle: (fileId: string, isStarred: boolean) => void;
  onDelete: (fileId: string, fileName: string) => void;
  onDownload: (fileId: string, fileName: string) => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onFolderClick,
  onStarToggle,
  onDelete,
  onDownload,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border-0 shadow-lg overflow-hidden">
      <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50/80 border-b font-medium text-sm text-gray-700">
        <div className="col-span-5">Name</div>
        <div className="col-span-2">Size</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Modified</div>
        <div className="col-span-1">Actions</div>
      </div>
      {files.map((file, index) => (
        <div
          key={file.id}
          className={cn(
            "grid grid-cols-1 md:grid-cols-12 gap-4 p-4 hover:bg-blue-50/50 transition-colors border-b border-gray-100 last:border-b-0",
            index % 2 === 0 ? "bg-white/50" : "bg-gray-50/30",
          )}
        >
          <div
            className="col-span-1 md:col-span-5 flex items-center space-x-3 cursor-pointer group"
            onClick={() => file.isFolder && onFolderClick(file.id, file.name)}
          >
            <div className="flex-shrink-0">
              {file.thumbnailUrl ? (
                <img
                  src={file.thumbnailUrl}
                  alt={file.name}
                  className="w-8 h-8 object-cover rounded-lg"
                />
              ) : (
                getFileIcon(file)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-gray-900 truncate block group-hover:text-blue-700 transition-colors">
                {file.name}
              </span>
              <div className="md:hidden text-xs text-gray-500 mt-1">
                {!file.isFolder && formatFileSize(file.size)} •{" "}
                {file.isFolder
                  ? "Folder"
                  : file.type.split("/")[1]?.toUpperCase() || "File"}
              </div>
            </div>
            {file.isStarred && (
              <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
            )}
          </div>
          <div className="hidden md:block md:col-span-2 text-sm text-gray-600">
            {file.isFolder ? "—" : formatFileSize(file.size)}
          </div>
          <div className="hidden md:block md:col-span-2">
            <Badge
              variant="secondary"
              className="text-xs rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {file.isFolder
                ? "Folder"
                : file.type.split("/")[1]?.toUpperCase() || "File"}
            </Badge>
          </div>
          <div className="hidden md:block md:col-span-2 text-sm text-gray-600">
            {file.updatedAt
              ? new Date(file.updatedAt).toLocaleDateString()
              : new Date().toLocaleDateString()}
          </div>
          <div className="md:col-span-1 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {!file.isFolder && (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => onDownload(file.id, file.name)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => onStarToggle(file.id, file.isStarred)}
                >
                  <Star className="w-4 h-4 mr-2" />
                  {file.isStarred ? "Unstar" : "Star"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={() => onDelete(file.id, file.name)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
};
