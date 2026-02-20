"use client"

import { useCallback, useState } from "react"
import { FileDropZone } from "@/components/file-drop-zone"
import { FileResults, type FileResult } from "@/components/file-results"

export default function Home() {
  const [results, setResults] = useState<FileResult[]>([])

  const handleFilesSelected = useCallback(async (files: File[]) => {
    const newResults: FileResult[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      status: "pending" as const,
    }))

    setResults((prev) => [...newResults, ...prev])

    for (const file of files) {
      const resultId = newResults.find((r) => r.name === file.name && r.size === file.size)?.id
      if (!resultId) continue

      setResults((prev) =>
        prev.map((r) => (r.id === resultId ? { ...r, status: "detecting" } : r))
      )

      try {
        const { FileTypeParser } = await import("file-type")
        const { detectXml } = await import("@file-type/xml")
        const { detectAv } = await import("@file-type/av")
        const { detectCfbf } = await import("@file-type/cfbf")
        const { detectPdf } = await import("@file-type/pdf")
        const parser = new FileTypeParser({ customDetectors: [detectXml, detectAv, detectCfbf, detectPdf] })
        const type = await parser.fromBlob(file)

        setResults((prev) =>
          prev.map((r) =>
            r.id === resultId
              ? {
                  ...r,
                  status: "done",
                  detectedExt: type?.ext,
                  detectedMime: type?.mime,
                }
              : r
          )
        )
      } catch (err) {
        setResults((prev) =>
          prev.map((r) =>
            r.id === resultId
              ? {
                  ...r,
                  status: "error",
                  error: err instanceof Error ? err.message : "Unknown error",
                }
              : r
          )
        )
      }
    }
  }, [])

  const handleClear = useCallback(() => {
    setResults([])
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-16">
      <main className="flex w-full max-w-xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            what the <span className="bg-foreground text-background px-1.5 py-0.5 rounded-sm">file</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Detect the true file type by reading magic bytes — entirely
            client-side, nothing is uploaded.
          </p>
        </div>

        <FileDropZone onFilesSelected={handleFilesSelected} />
        <FileResults results={results} onClear={handleClear} />
      </main>
    </div>
  )
}
