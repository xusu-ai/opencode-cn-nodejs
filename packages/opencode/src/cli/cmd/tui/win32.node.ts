import { platform } from "os"

// Node.js compatible stub for Windows console
// On non-Windows, this is a no-op

export function isWindows(): boolean {
  return platform() === "win32"
}

export function enableRawMode(): void {
  if (platform() !== "win32") return
  console.warn("[win32] raw mode not available on Node.js, only bun:ffi")
}
