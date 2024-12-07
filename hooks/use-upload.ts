"use client";

import { useState } from "react";
import { ShareType } from "@prisma/client";
import { toast } from "sonner";

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [shareCode, setShareCode] = useState<string | null>(null);

  const upload = async (content: File | string, type: ShareType) => {
    try {
      setIsUploading(true);

      let processedContent: string;
      let mimeType = "";

      if (content instanceof File) {
        // Convert File to base64
        const base64 = await fileToBase64(content);
        processedContent = base64;
        mimeType = content.type;
      } else {
        processedContent = content;
      }

      const response = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          content: processedContent,
          mimeType,
        }),
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setShareCode(data.code);
      toast(`Upload Successful",
       Your share code is: ${data.code}`);
    } catch (error) {
      toast("Upload Failed");
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, shareCode };
}

// Helper function to convert File to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
