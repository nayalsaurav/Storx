// lib/file-utils.ts
import React from "react";
import { FileItem } from "@/types/types";
import { FolderOpen, Image, FileText, Play, Archive, File } from "lucide-react";

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileIcon = (file: FileItem): React.ReactElement => {
  if (file.isFolder) {
    return React.createElement(FolderOpen, {
      className: "w-8 h-8 text-blue-500",
    });
  }

  if (file.type.startsWith("image/")) {
    return React.createElement(Image, { className: "w-8 h-8 text-green-500" });
  } else if (file.type.includes("pdf") || file.type.includes("document")) {
    return React.createElement(FileText, { className: "w-8 h-8 text-red-500" });
  } else if (file.type.startsWith("video/")) {
    return React.createElement(Play, { className: "w-8 h-8 text-purple-500" });
  } else if (file.type.includes("zip") || file.type.includes("archive")) {
    return React.createElement(Archive, {
      className: "w-8 h-8 text-orange-500",
    });
  }

  return React.createElement(File, { className: "w-8 h-8 text-gray-400" });
};
