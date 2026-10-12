import { verifyToken } from './jwt'

export function requireAuth(event: Parameters<typeof getHeader>[0]) {
  const header = getHeader(event, 'authorization')
  if (!header?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Não autorizado' })
  }
  const config = useRuntimeConfig()
  try {
    return verifyToken(header.slice(7), config.jwtSecret)
  } catch {
    throw createError({ statusCode: 401, message: 'Token inválido ou expirado' })
  }
}
