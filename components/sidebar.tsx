"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  FileText,
  Image,
  Music,
  Video,
  Upload,
  Download,
  Send,
} from "lucide-react";

const routes = [
  {
    label: "Share Text",
    icon: FileText,
    href: "/share/text",
    color: "text-green-500",
  },
  {
    label: "Share File",
    icon: Upload,
    href: "/share/file",
    color: "text-blue-500",
  },
  {
    label: "Share Image",
    icon: Image,
    href: "/share/image",
    color: "text-purple-500",
  },
  {
    label: "Share Audio",
    icon: Music,
    href: "/share/audio",
    color: "text-orange-500",
  },
  {
    label: "Share Video",
    icon: Video,
    href: "/share/video",
    color: "text-pink-500",
  },
  {
    label: "Receive",
    icon: Download,
    href: "/receive",
    color: "text-yellow-500",
  },
];

interface sideBarProps {
  isOpen?: Boolean;
  setisOpen?: (value: boolean) => void;
}

export function Sidebar({ setisOpen }: sideBarProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <Send className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold ml-2">SwiftShare</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setisOpen?.(false)}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-blue-600 hover:bg-blue-100/50 dark:hover:bg-blue-900/50 rounded-lg transition",
                pathname === route.href
                  ? "text-blue-600 bg-blue-100/50 dark:bg-blue-900/50"
                  : "text-slate-600 dark:text-slate-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
