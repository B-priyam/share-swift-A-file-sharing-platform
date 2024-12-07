"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { FileUploadZone } from "@/components/file-upload-zone";
import { ShareCodeDisplay } from "@/components/share-code-display";
import { useUpload } from "@/hooks/use-upload";
import { ShareType } from "@prisma/client";
import { toast } from "sonner";

export default function ShareFilePage() {
  const { upload, isUploading, shareCode } = useUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = async (file: File) => {
    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      toast("File too large");
      return;
    }

    setSelectedFile(file);
    await upload(file, ShareType.FILE);
  };

  return (
    <div className="container py-8 px-10">
      <PageHeader
        title="Share Files"
        description="Upload any type of file and get a 4-digit code to share."
      />
      <div className="grid gap-6">
        <Card className="p-6">
          <FileUploadZone
            onFileSelect={handleFileSelect}
            icon={Upload}
            title={isUploading ? "Uploading..." : "Drop your files here"}
            description="or click to browse (Max size: 100MB)"
            maxSize={100 * 1024 * 1024}
          />
        </Card>
        {shareCode && <ShareCodeDisplay code={shareCode} />}
      </div>
    </div>
  );
}
