"use client"

import { useCallback, useState, useRef } from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}

export function FileDropZone({ onFilesSelected, disabled }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      if (disabled) return

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        onFilesSelected(files)
      }
    },
    [onFilesSelected, disabled]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length > 0) {
        onFilesSelected(files)
      }
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    },
    [onFilesSelected]
  )

  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-12 transition-colors",
        isDragging
          ? "border-foreground/40 bg-muted/60"
          : "border-border hover:border-foreground/25 hover:bg-muted/40",
        disabled && "pointer-events-none opacity-50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      aria-label="Drop files here or click to browse"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Upload className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1 text-center">
        <p className="text-sm font-medium text-foreground">
          Drop files here or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Detects file type by reading magic bytes (binary signatures)
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="sr-only"
        onChange={handleFileInput}
        tabIndex={-1}
        aria-hidden="true"
      />
    </button>
  )
}
