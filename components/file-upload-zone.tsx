"use client"

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  icon: LucideIcon
  accept?: Record<string, string[]>
  maxSize?: number
  title: string
  description: string
}

export function FileUploadZone({
  onFileSelect,
  icon: Icon,
  accept,
  maxSize = 100 * 1024 * 1024, // 100MB default
  title,
  description,
}: FileUploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-colors cursor-pointer",
        isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-border"
      )}
    >
      <input {...getInputProps()} />
      <Icon className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
    </div>
  )
}