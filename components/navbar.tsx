"use client"

import Link from "next/link"
import { Send } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import { MobileSidebar } from "./mobile-sidebar"

export function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-2">
        <MobileSidebar />
        <Link href="/" className="flex items-center">
          <Send className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold ml-2 hidden sm:inline-block">SwiftShare</h1>
        </Link>
      </div>
      <ModeToggle />
    </div>
  )
}