"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Music } from "lucide-react";
import { FileUploadZone } from "@/components/file-upload-zone";
import { ShareCodeDisplay } from "@/components/share-code-display";
import { useUpload } from "@/hooks/use-upload";
import { ShareType } from "@prisma/client";
import { toast } from "sonner";

const ACCEPTED_TYPES = {
  "audio/mpeg": [".mp3"],
  "audio/wav": [".wav"],
  "audio/ogg": [".ogg"],
  "audio/mp4": [".m4a"],
};

export default function ShareAudioPage() {
  const { upload, isUploading, shareCode } = useUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = async (file: File) => {
    // Check file size (50MB limit for audio)
    if (file.size > 50 * 1024 * 1024) {
      toast("File too large Maximum audio size is 50MB");
      return;
    }

    setSelectedFile(file);
    await upload(file, ShareType.AUDIO);
  };

  return (
    <div className="container py-8 px-10">
      <PageHeader
        title="Share Audio"
        description="Upload audio files and get a 4-digit code to share."
      />
      <div className="grid gap-6">
        <Card className="p-6">
          <FileUploadZone
            onFileSelect={handleFileSelect}
            icon={Music}
            accept={ACCEPTED_TYPES}
            maxSize={50 * 1024 * 1024}
            title={isUploading ? "Uploading..." : "Drop your audio files here"}
            description="Supports: MP3, WAV, OGG, M4A (Max size: 50MB)"
          />
        </Card>
        {shareCode && <ShareCodeDisplay code={shareCode} />}
      </div>
    </div>
  );
}
