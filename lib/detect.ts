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

  const parser = new FileTypeParser({
    customDetectors: [detectXml, detectAv, detectCfbf, detectPdf],
  })

  const type = await parser.fromBlob(file)
  return { mime: type?.mime, extension: type?.ext }
}
