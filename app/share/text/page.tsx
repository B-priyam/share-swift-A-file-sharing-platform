"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShareCodeDisplay } from "@/components/share-code-display";
import { useUpload } from "@/hooks/use-upload";
import { ShareType } from "@prisma/client";
import { toast } from "sonner";

const MAX_TEXT_LENGTH = 50000; // 50KB text limit

export default function ShareTextPage() {
  const [text, setText] = useState("");
  const { upload, isUploading, shareCode } = useUpload();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= MAX_TEXT_LENGTH) {
      setText(newText);
    } else {
      toast("Text too long Maximum text length is 50,000 characters");
    }
  };

  const handleShare = async () => {
    if (text.trim()) {
      await upload(text, ShareType.TEXT);
    } else {
      toast("Empty text Please enter some text to share");
    }
  };

  return (
    <div className="container py-8 px-10">
      <PageHeader
        title="Share Text"
        description="Enter your text and get a 4-digit code to share."
      />
      <div className="grid gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your text here..."
              className="min-h-[200px] mb-4"
              value={text}
              onChange={handleTextChange}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {text.length}/{MAX_TEXT_LENGTH} characters
              </span>
              <Button
                onClick={handleShare}
                disabled={isUploading || !text.trim()}
              >
                {isUploading ? "Generating Code..." : "Generate Sharing Code"}
              </Button>
            </div>
          </div>
        </Card>
        {shareCode && <ShareCodeDisplay code={shareCode} />}
      </div>
    </div>
  );
}
