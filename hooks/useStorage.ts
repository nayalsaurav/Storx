// hooks/useStorage.ts
import { StorageInfo } from "@/types/types";
import { useState, useCallback } from "react";

export const useStorage = (userId: string) => {
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    used: 0,
    total: 15 * 1024 * 1024 * 1024, // 15GB
    percentage: 0,
  });

  const fetchStorageInfo = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/storage?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setStorageInfo(data);
      }
    } catch (error) {
      console.error("Error fetching storage info:", error);
    }
  }, [userId]);

  return { storageInfo, fetchStorageInfo };
};
