import z from "zod"
import { Effect } from "effect"
import * as Tool from "./tool"
import path from "path"
import { LSP } from "../lsp"
const DESCRIPTION = `Interact with Language Server Protocol (LSP) servers to get code intelligence features.

Supported operations:
- goToDefinition: Find where a symbol is defined
- findReferences: Find all references to a symbol
- hover: Get hover information (documentation, type info) for a symbol
- documentSymbol: Get all symbols (functions, classes, variables) in a document
- workspaceSymbol: Search for symbols across the entire workspace
- goToImplementation: Find implementations of an interface or abstract method
- prepareCallHierarchy: Get call hierarchy item at a position (functions/methods)
- incomingCalls: Find all functions/methods that call the function at a position
- outgoingCalls: Find all functions/methods called by the function at a position

All operations require:
- filePath: The file to operate on
- line: The line number (1-based, as shown in editors)
- character: The character offset (1-based, as shown in editors)

Note: LSP servers must be configured for the file type. If no server is available, an error will be returned.
`
import { Instance } from "../project/instance"
import { pathToFileURL } from "url"
import { assertExternalDirectoryEffect } from "./external-directory"
import { AppFileSystem } from "@opencode-ai/shared/filesystem"

const operations = [
  "goToDefinition",
  "findReferences",
  "hover",
  "documentSymbol",
  "workspaceSymbol",
  "goToImplementation",
  "prepareCallHierarchy",
  "incomingCalls",
  "outgoingCalls",
] as const

export const LspTool = Tool.define(
  "lsp",
  Effect.gen(function* () {
    const lsp = yield* LSP.Service
    const fs = yield* AppFileSystem.Service

    return {
      description: DESCRIPTION,
      parameters: z.object({
        operation: z.enum(operations).describe("The LSP operation to perform"),
        filePath: z.string().describe("The absolute or relative path to the file"),
        line: z.number().int().min(1).describe("The line number (1-based, as shown in editors)"),
        character: z.number().int().min(1).describe("The character offset (1-based, as shown in editors)"),
      }),
      execute: (
        args: { operation: (typeof operations)[number]; filePath: string; line: number; character: number },
        ctx: Tool.Context,
      ) =>
        Effect.gen(function* () {
          const file = path.isAbsolute(args.filePath) ? args.filePath : path.join(Instance.directory, args.filePath)
          yield* assertExternalDirectoryEffect(ctx, file)
          yield* ctx.ask({ permission: "lsp", patterns: ["*"], always: ["*"], metadata: {} })

          const uri = pathToFileURL(file).href
          const position = { file, line: args.line - 1, character: args.character - 1 }
          const relPath = path.relative(Instance.worktree, file)
          const title = `${args.operation} ${relPath}:${args.line}:${args.character}`

          const exists = yield* fs.existsSafe(file)
          if (!exists) throw new Error(`File not found: ${file}`)

          const available = yield* lsp.hasClients(file)
          if (!available) throw new Error("No LSP server available for this file type.")

          yield* lsp.touchFile(file, "document")

          const result: unknown[] = yield* (() => {
            switch (args.operation) {
              case "goToDefinition":
                return lsp.definition(position)
              case "findReferences":
                return lsp.references(position)
              case "hover":
                return lsp.hover(position)
              case "documentSymbol":
                return lsp.documentSymbol(uri)
              case "workspaceSymbol":
                return lsp.workspaceSymbol("")
              case "goToImplementation":
                return lsp.implementation(position)
              case "prepareCallHierarchy":
                return lsp.prepareCallHierarchy(position)
              case "incomingCalls":
                return lsp.incomingCalls(position)
              case "outgoingCalls":
                return lsp.outgoingCalls(position)
            }
          })()

          return {
            title,
            metadata: { result },
            output: result.length === 0 ? `No results found for ${args.operation}` : JSON.stringify(result, null, 2),
          }
        }),
    }
  }),
)
