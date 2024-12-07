"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Clipboard,
  ClipboardCopy,
  ClipboardCopyIcon,
  ClipboardEdit,
  ClipboardListIcon,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { ShareType } from "@prisma/client";

export default function ReceivePage() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/share/${code}`);

      if (!response.ok) {
        throw new Error("Invalid code or content expired");
      }

      const data = await response.json();
      setContent(data.share);
    } catch (error) {
      toast("Invalid code or content has expired");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (!content) return null;

    console.log(content);

    switch (content.type) {
      case ShareType.TEXT:
        return (
          <Card className="pl-6 py-6 mt-6 flex items-start">
            <pre className="whitespace-pre-wrap w-full">{content.content}</pre>
            <div
              className="cursor-pointer justify-end py-2 hover:bg-white/80 rounded-md mr-1 hover:text-black/80"
              onClick={() => {
                navigator.clipboard.writeText(content.content);
                toast("copied to clipboard");
              }}
            >
              <Clipboard size={20} className="mx-2 h-full " />
            </div>
          </Card>
        );
      case ShareType.IMAGE:
        return (
          <div className="flex flex-col items-center">
            <Card className="p-6 mt-6">
              <img
                src={content.content}
                alt="Shared content"
                className="max-w-full"
              />
            </Card>
            <Button className="mt-2 w-36">
              <a href={"/"} download={content.content}>
                Download
              </a>
            </Button>
          </div>
        );
      case ShareType.VIDEO:
        return (
          <Card className="p-6 mt-6">
            <video controls className="w-full">
              <source src={content.content} type={content.mimeType} />
            </video>
          </Card>
        );
      case ShareType.AUDIO:
        return (
          <Card className="p-6 mt-6">
            <audio controls className="w-full">
              <source src={content.content} type={content.mimeType} />
            </audio>
          </Card>
        );
      default:
        return (
          <>
            <Card className="p-6 mt-6">
              <Button asChild className="w-full">
                <a href={content.content} download>
                  <Download className="mr-2 h-4 w-4" />
                  Download File
                </a>
              </Button>
            </Card>
          </>
        );
    }
  };

  return (
    <div className="container py-8 px-10 items-center">
      <PageHeader
        title="Receive Files"
        description="Enter the 4-digit code to access shared content."
      />
      <Card className="p-6 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Enter 4-digit code"
              className="text-center text-xl md:text-2xl tracking-widest"
              value={code}
              maxLength={4}
              inputMode="numeric"
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={code.length !== 4 || isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isLoading ? "Loading..." : "Access Content"}
          </Button>
        </form>
      </Card>
      {renderContent()}
    </div>
  );
}