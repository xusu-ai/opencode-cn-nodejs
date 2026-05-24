import { marked, type Tokens } from "marked"

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

const renderer = new marked.Renderer()

renderer.link = ({ href, title, text }: Tokens.Link) => {
  try {
    const url = new URL(href)
    if (url.protocol !== "http:" && url.protocol !== "https:") return text
  } catch {
    return escapeHtml(text)
  }
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : ""
  return `<a href="${escapeHtml(href)}"${titleAttr} class="external-link" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`
}

export function parseMarkdown(input: string) {
  return marked(input, {
    renderer,
    breaks: false,
    gfm: true,
  })
}
