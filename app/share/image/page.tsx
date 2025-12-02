"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import { FileUploadZone } from "@/components/file-upload-zone";
import { ShareCodeDisplay } from "@/components/share-code-display";
import { useUpload } from "@/hooks/use-upload";
import { ShareType } from "@prisma/client";
import { toast } from "sonner";

const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
};

export default function ShareImagePage() {
  const { upload, isUploading, shareCode } = useUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = async (file: File) => {
    // Check file size (20MB limit for images)
    if (file.size > 10 * 1024 * 1024) {
      toast("File too large");
      return;
    }

    setSelectedFile(file);
    await upload(file, ShareType.IMAGE);
  };

  return (
    <div className="container py-8 px-10">
      <PageHeader
        title="Share Images"
        description="Upload images and get a 4-digit code to share."
      />
      <div className="grid gap-6">
        <Card className="p-6">
          <FileUploadZone
            onFileSelect={handleFileSelect}
            icon={ImageIcon}
            accept={ACCEPTED_TYPES}
            maxSize={20 * 1024 * 1024}
            title={isUploading ? "Uploading..." : "Drop your images here"}
            description="Supports: JPG, PNG, GIF, WebP (Max size: 10MB)"
          />
        </Card>
        {shareCode && <ShareCodeDisplay code={shareCode} />}
      </div>
    </div>
  );
}
