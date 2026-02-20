"use client"

import { FileCheck, FileQuestion, FileWarning, Loader2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface FileResult {
  id: string
  name: string
  size: number
  status: "pending" | "detecting" | "done" | "error"
  detectedExt?: string
  detectedMime?: string
  error?: string
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function getExtensionFromName(name: string): string | null {
  const parts = name.split(".")
  if (parts.length > 1) return parts.pop()!.toLowerCase()
  return null
}

/** Groups of extensions that are equivalent for the same MIME type. */
const equivalentExtensions: string[][] = [
  ["jpg", "jpeg"],
  ["tif", "tiff"],
  ["htm", "html"],
  ["mpg", "mpeg"],
  // Windows PE format covers exe, dll, sys, ocx, scr — all detected as exe
  ["exe", "dll", "sys", "ocx", "scr"],
]

function areExtensionsEquivalent(a: string, b: string): boolean {
  if (a === b) return true
  return equivalentExtensions.some(
    (group) => group.includes(a) && group.includes(b)
  )
}

interface FileResultsProps {
  results: FileResult[]
  onClear: () => void
}

export function FileResults({ results, onClear }: FileResultsProps) {
  if (results.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">
          Results ({results.length} {results.length === 1 ? "file" : "files"})
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-7 gap-1 px-2 text-xs text-muted-foreground"
        >
          <X className="h-3 w-3" />
          Clear
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {results.map((result) => (
          <FileResultRow key={result.id} result={result} />
        ))}
      </div>
    </div>
  )
}

function FileResultRow({ result }: { result: FileResult }) {
  const nameExt = getExtensionFromName(result.name)
  const mismatch =
    result.status === "done" &&
    result.detectedExt &&
    nameExt &&
    !areExtensionsEquivalent(nameExt, result.detectedExt)

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 transition-colors",
        result.status === "error" && "border-destructive/30 bg-destructive/5",
        mismatch && "border-chart-1/30 bg-chart-1/5"
      )}
    >
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
        {result.status === "detecting" ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : result.status === "done" && result.detectedMime && mismatch ? (
          <FileWarning className="h-4 w-4 text-chart-1" />
        ) : result.status === "done" && result.detectedMime ? (
          <FileCheck className="h-4 w-4 text-foreground" />
        ) : (
          <FileQuestion className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {result.name}
          </p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatBytes(result.size)}
          </span>
        </div>

        {result.status === "detecting" && (
          <p className="text-xs text-muted-foreground">Detecting...</p>
        )}

        {result.status === "done" && result.detectedMime && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-xs">
              {result.detectedMime}
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              .{result.detectedExt}
            </Badge>
          </div>
        )}

        {result.status === "done" && !result.detectedMime && (
          <p className="text-xs text-muted-foreground">
            Unknown type — could be a text-based format (e.g. .txt, .csv, .svg)
          </p>
        )}

        {result.status === "error" && (
          <p className="text-xs text-destructive-foreground">
            {result.error || "Failed to detect file type"}
          </p>
        )}
      </div>
    </div>
  )
}
