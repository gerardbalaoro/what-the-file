# what the file

Detect the true type of any file by reading its magic bytes — entirely in your browser. Nothing is uploaded.

## How it works

Drop one or more files onto the page. The app reads the binary signature (magic bytes) at the start of each file and matches it against known formats using the [`file-type`](https://github.com/sindresorhus/file-type) library. The result includes the detected MIME type and extension, even if the filename or extension says otherwise.

## Stack

- [Next.js](https://nextjs.org/) (App Router)
- [file-type](https://github.com/sindresorhus/file-type) + custom plugins for PDF, XML, AV, CFBF
- Tailwind CSS, Radix UI, shadcn/ui
- PWA with offline support via service worker

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).
