interface Window {
  count: number
  resetAt: number
}

const store = new Map<string, Window>()

// Limpa entradas expiradas a cada 10 minutos para não vazar memória
setInterval(() => {
  const now = Date.now()
  for (const [key, win] of store) {
    if (win.resetAt <= now) store.delete(key)
  }
}, 10 * 60 * 1000)

export function checkRate(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  let win = store.get(key)

  if (!win || win.resetAt <= now) {
    win = { count: 0, resetAt: now + windowMs }
    store.set(key, win)
  }

  win.count++

  return {
    allowed: win.count <= limit,
    remaining: Math.max(0, limit - win.count),
    resetAt: win.resetAt,
    retryAfter: win.count > limit ? Math.ceil((win.resetAt - now) / 1000) : 0,
  }
}
