import { Button } from "@/components/ui/button";
import { Send, Download } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-3xl space-y-6 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
          Share Files Securely with
          <span className="text-blue-600"> SwiftShare</span>
        </h1>
        <p className="mx-auto max-w-[700px] text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-lg">
          Upload files, share text, or send media. Get a 4-digit code instantly.
          Your files automatically delete after 24 hours for maximum privacy.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link href="/share/text" className="w-full sm:w-auto">
            <Button size="lg" className="w-full">
              <Send className="mr-2 h-5 w-5" />
              Start Sharing
            </Button>
          </Link>
          <Link href="/receive" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full">
              <Download className="mr-2 h-5 w-5" />
              Receive Files
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16 lg:mt-20 max-w-5xl mx-auto p-4">
        <div className="p-4 sm:p-6 rounded-lg border bg-card">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Secure Sharing
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            End-to-end encryption ensures your files remain private and secure.
          </p>
        </div>
        <div className="p-4 sm:p-6 rounded-lg border bg-card">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            24-Hour Expiry
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Files automatically delete after 24 hours for enhanced privacy.
          </p>
        </div>
        <div className="p-4 sm:p-6 rounded-lg border bg-card">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Simple 4-Digit Codes
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Share files easily with generated 4-digit access codes.
          </p>
        </div>
      </div>
    </div>
  );
}
