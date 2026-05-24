import { defineConfig } from "drizzle-kit"
import path from "path"
import os from "os"

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/**/*.sql.ts",
  out: "./migration",
  dbCredentials: {
    url: process.env.OPENCODE_DB_PATH ?? path.join(os.homedir(), ".local/share/opencode/opencode.db"),
  },
})
