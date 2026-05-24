import Store from "electron-store"

import { SETTINGS_STORE } from "./constants"

const cache = new Map<string, Store>()

function isValidStoreName(name: string): boolean {
  if (!name || name.includes("..") || name.includes("/") || name.includes("\\") || name.includes("\0")) return false
  return true
}

export function getStore(name = SETTINGS_STORE) {
  if (!isValidStoreName(name)) throw new Error(`Invalid store name: ${name}`)
  const cached = cache.get(name)
  if (cached) return cached
  const next = new Store({ name, fileExtension: "", accessPropertiesByDotNotation: false })
  cache.set(name, next)
  return next
}
