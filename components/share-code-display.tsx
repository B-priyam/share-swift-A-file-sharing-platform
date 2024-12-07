"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface ShareCodeDisplayProps {
  code: string;
}

export function ShareCodeDisplay({ code }: ShareCodeDisplayProps) {
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    toast("The share code has been copied to your clipboard.");
  };

  return (
    <Card className="p-6 text-center">
      <h3 className="text-lg font-semibold mb-4">Your Share Code</h3>
      <div className="text-4xl font-bold tracking-widest mb-4">{code}</div>
      <p className="text-sm text-muted-foreground mb-4">
        Share this code with others to give them access to your content. The
        content will be available for 24 hours.
      </p>
      <Button onClick={copyToClipboard} className="w-full">
        <Copy className="mr-2 h-4 w-4" />
        Copy Code
      </Button>
    </Card>
  );
}
