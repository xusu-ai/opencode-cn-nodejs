import { platform } from "os"

// Windows console mode utilities
// On non-Windows or non-bun runtimes, these are no-ops
const isWin = platform() === "win32"
let kernel: any = null

async function getKernel() {
  if (!isWin) return null
  if (kernel) return kernel
  try {
    const { dlopen } = await import("bun:ffi")
    kernel = dlopen("kernel32.dll", {
      GetStdHandle: { args: ["i32"], returns: "ptr" },
      GetConsoleMode: { args: ["ptr", "ptr"], returns: "i32" },
      SetConsoleMode: { args: ["ptr", "u32"], returns: "i32" },
      FlushConsoleInputBuffer: { args: ["ptr"], returns: "i32" },
    })
    return kernel
  } catch {
    kernel = null
    return null
  }
}

const STD_INPUT_HANDLE = -10
const ENABLE_PROCESSED_INPUT = 0x0001
const ENABLE_VIRTUAL_TERMINAL_INPUT = 0x0200

export async function win32Input() {
  const k = await getKernel()
  if (!k) return
  const stdin = k.GetStdHandle(STD_INPUT_HANDLE)
  const mode = Buffer.alloc(4)
  k.GetConsoleMode(stdin, mode)
  const currentMode = mode.readUint32LE()
  k.SetConsoleMode(stdin, currentMode | ENABLE_VIRTUAL_TERMINAL_INPUT)
}

export function win32DisableProcessedInput() {
  // No-op on Node.js
}

export function win32FlushInputBuffer() {
  // No-op on Node.js
}

export function win32InstallCtrlCGuard() {
  // No-op on Node.js
  return () => {}
}
