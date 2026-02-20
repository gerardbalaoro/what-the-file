"use client"

import { useEffect, useState } from "react"

export function RegisterSW() {
  const [waitingSW, setWaitingSW] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((registration) => {
        // A new SW is already waiting (e.g. page was refreshed after update installed)
        if (registration.waiting) {
          setWaitingSW(registration.waiting)
        }

        // A new SW finishes installing while this page is open
        registration.addEventListener("updatefound", () => {
          const newSW = registration.installing
          if (!newSW) return
          newSW.addEventListener("statechange", () => {
            if (newSW.state === "installed" && navigator.serviceWorker.controller) {
              setWaitingSW(newSW)
            }
          })
        })
      })
      .catch(() => {
        // Service worker registration failed — not critical
      })
  }, [])

  function reload() {
    if (!waitingSW) return
    // Tell the waiting SW to take control, then reload once it does
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload()
    })
    waitingSW.postMessage("skipWaiting")
  }

  if (!waitingSW) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg border bg-background px-4 py-3 shadow-lg text-sm">
      <span>Update available.</span>
      <button
        onClick={reload}
        className="font-medium underline underline-offset-2 hover:no-underline focus:outline-none"
      >
        Reload
      </button>
    </div>
  )
}
