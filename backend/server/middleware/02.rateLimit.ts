import { checkRate } from '../utils/rateLimit'

// Rotas de autenticação: 5 tentativas a cada 15 minutos (anti-brute-force)
const AUTH = { limit: 5, windowMs: 15 * 60 * 1000 }

// Demais rotas da API: 120 requisições por minuto
const API = { limit: 120, windowMs: 60 * 1000 }

export default defineEventHandler((event) => {
  const path = event.path ?? ''

  if (!path.startsWith('/api/')) return

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const isAuth = path.startsWith('/api/auth/')
  const { limit, windowMs } = isAuth ? AUTH : API

  // Chave por IP + rota exata (auth) ou IP + prefixo (geral)
  const key = isAuth ? `${ip}:${path}` : `${ip}:api`

  const result = checkRate(key, limit, windowMs)

  setResponseHeader(event, 'X-RateLimit-Limit', String(limit))
  setResponseHeader(event, 'X-RateLimit-Remaining', String(result.remaining))
  setResponseHeader(event, 'X-RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)))

  if (!result.allowed) {
    setResponseHeader(event, 'Retry-After', String(result.retryAfter))

    const minutes = Math.ceil(result.retryAfter / 60)
    const message = isAuth
      ? `Muitas tentativas de login. Tente novamente em ${minutes} minuto(s).`
      : 'Muitas requisições. Aguarde um momento e tente novamente.'

    throw createError({ statusCode: 429, message })
  }
})
