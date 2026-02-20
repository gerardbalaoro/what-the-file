export interface DetectionResult {
  mime: string | undefined
  extension: string | undefined
}

export async function detect(file: File): Promise<DetectionResult> {
  const { FileTypeParser } = await import("file-type")
  const { detectXml } = await import("@file-type/xml")
  const { detectAv } = await import("@file-type/av")
  const { detectCfbf } = await import("@file-type/cfbf")
  const { detectPdf } = await import("@file-type/pdf")

  // detectAv matches any file with 'ftyp' at offset 4 (MP4, M4A, HEIC, etc.) and
  // delegates to music-metadata, which throws for image/* types. Wrap it so those
  // errors return undefined and let file-type's built-in detectors handle the file.
  const safeDetectAv: typeof detectAv = {
    ...detectAv,
    detect: async (...args) => {
      try {
        return await detectAv.detect(...args)
      } catch {
        return undefined
      }
    },
  }

  const parser = new FileTypeParser({
    customDetectors: [detectXml, safeDetectAv, detectCfbf, detectPdf],
  })
  const type = await parser.fromBlob(file)

  return { mime: type?.mime, extension: type?.ext }
}
