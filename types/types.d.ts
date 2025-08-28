export interface FileItem {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
  fileUrl: string;
  thumbnailUrl?: string;
  userId: string;
  parentId?: string;
  isFolder: boolean;
  isStarred: boolean;
  isTrash: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StorageInfo {
  used: number;
  total: number;
  percentage: number;
}

export interface Breadcrumb {
  id: string | null;
  name: string;
}

export type ViewMode = "grid" | "list";
