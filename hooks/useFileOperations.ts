import { FileItem } from "@/types/types";
import { useState, useCallback } from "react";
import { toast } from "sonner";

export const useFileOperations = (userId: string) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchFiles = useCallback(
    async (parentId: string | null = null) => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          userId,
          ...(parentId && { parentId }),
        });

        const response = await fetch(`/api/files?${params}`);
        if (response.ok) {
          const data = await response.json();
          setFiles(data.files || []);
          return data;
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Failed to load files");
        }
      } catch (error) {
        console.error("Error fetching files:", error);
        toast.error("Failed to load files");
      } finally {
        setIsLoading(false);
      }
    },
    [userId],
  );

  const uploadFile = async (file: File, parentId: string | null) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    if (parentId) {
      formData.append("parentId", parentId);
    }

    try {
      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("File uploaded successfully");
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to upload file");
        return false;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
      return false;
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    currentFolder: string | null,
    onSuccess: () => void,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const fileArray = Array.from(files);
    let successCount = 0;

    for (const file of fileArray) {
      const success = await uploadFile(file, currentFolder);
      if (success) successCount++;
    }

    setIsUploading(false);
    event.target.value = "";

    if (successCount > 0) {
      onSuccess();
    }

    if (successCount < fileArray.length) {
      toast.error(`${fileArray.length - successCount} files failed to upload`);
    }
  };

  const handleStarToggle = async (
    fileId: string,
    isCurrentlyStarred: boolean,
  ) => {
    try {
      const response = await fetch(`/api/files/${fileId}/star`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isStarred: !isCurrentlyStarred,
          userId,
        }),
      });

      if (response.ok) {
        toast.success(isCurrentlyStarred ? "File unstarred" : "File starred");
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update file");
        return false;
      }
    } catch (error) {
      console.error("Error updating star status:", error);
      toast.error("Failed to update file");
      return false;
    }
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`))
      return false;

    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        toast.success("File deleted successfully");
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to delete file");
        return false;
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
      return false;
    }
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const response = await fetch(
        `/api/files/${fileId}/download?userId=${userId}`,
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Download started");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to download file");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const createFolder = async (name: string, parentId: string | null) => {
    if (!name.trim()) return false;

    try {
      const response = await fetch("/api/folders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          userId,
          parentId,
        }),
      });

      if (response.ok) {
        toast.success("Folder created successfully");
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to create folder");
        return false;
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder");
      return false;
    }
  };

  return {
    files,
    isLoading,
    isUploading,
    fetchFiles,
    handleFileUpload,
    handleStarToggle,
    handleDelete,
    handleDownload,
    createFolder,
  };
};
