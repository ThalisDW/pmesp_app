import { readFile, stat } from 'node:fs/promises'
import { extname, join, resolve, sep } from 'node:path'
import type { H3Event } from 'h3'

// Serve o build do frontend (Vue SPA) quando SPA_DIR está definido.
// Só ativo na imagem unificada (Dockerfile da raiz); em dev SPA_DIR não existe e nada muda.
const SPA_DIR = process.env.SPA_DIR ? resolve(process.env.SPA_DIR) : ''

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

async function sendFile(event: H3Event, file: string, immutable: boolean) {
  setResponseHeader(event, 'Content-Type', MIME[extname(file).toLowerCase()] ?? 'application/octet-stream')
  setResponseHeader(event, 'Cache-Control', immutable ? 'public, max-age=31536000, immutable' : 'no-cache')
  return readFile(file)
}

export default defineEventHandler(async (event) => {
  if (!SPA_DIR) return

  const method = getMethod(event)
  if (method !== 'GET' && method !== 'HEAD') return

  const path = decodeURIComponent((event.path ?? '/').split('?')[0])
  if (path.startsWith('/api/')) return

  // Arquivo estático existente (bloqueia path traversal para fora de SPA_DIR)
  const file = resolve(join(SPA_DIR, path))
  if (file.startsWith(SPA_DIR + sep)) {
    const info = await stat(file).catch(() => null)
    if (info?.isFile()) return sendFile(event, file, path.startsWith('/assets/'))
  }

  // Fallback do history mode do vue-router
  return sendFile(event, join(SPA_DIR, 'index.html'), false)
})
