"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Video } from "lucide-react";
import { FileUploadZone } from "@/components/file-upload-zone";
import { ShareCodeDisplay } from "@/components/share-code-display";
import { useUpload } from "@/hooks/use-upload";
import { ShareType } from "@prisma/client";
import { toast } from "sonner";

const ACCEPTED_TYPES = {
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
  "video/quicktime": [".mov"],
};

export default function ShareVideoPage() {
  const { upload, isUploading, shareCode } = useUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = async (file: File) => {
    // Check file size (100MB limit for videos)
    if (file.size > 100 * 1024 * 1024) {
      toast("File too large Maximum video size is 100MB");
      return;
    }

    setSelectedFile(file);
    await upload(file, ShareType.VIDEO);
  };

  return (
    <div className="container py-8 px-10">
      <PageHeader
        title="Share Videos"
        description="Upload videos and get a 4-digit code to share."
      />
      <div className="grid gap-6">
        <Card className="p-6">
          <FileUploadZone
            onFileSelect={handleFileSelect}
            icon={Video}
            accept={ACCEPTED_TYPES}
            maxSize={100 * 1024 * 1024}
            title={isUploading ? "Uploading..." : "Drop your videos here"}
            description="Supports: MP4, WebM, MOV (Max size: 100MB)"
          />
        </Card>
        {shareCode && <ShareCodeDisplay code={shareCode} />}
      </div>
    </div>
  );
}
