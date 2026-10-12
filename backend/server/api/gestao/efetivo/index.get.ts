import { connectDB } from '../../../utils/db'
import { User } from '../../../models/User'
import { verifyToken } from '../../../utils/jwt'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Não autorizado' })
  }

  const config = useRuntimeConfig()
  let payload
  try {
    payload = verifyToken(authHeader.slice(7), config.jwtSecret)
  } catch {
    throw createError({ statusCode: 401, message: 'Token inválido ou expirado' })
  }

  if (!payload.cargo.includes('p1') && payload.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Acesso negado' })
  }

  await connectDB()

  const query = getQuery(event)
  const isExonerado = query.exonerado === '1'

  const officers = await User.find({ active: !isExonerado, role: { $ne: 'admin' } })
    .select('-password -__v')
    .lean()

  officers.sort((a, b) => {
    const diff = parseInt(a.graduacao) - parseInt(b.graduacao)
    return diff !== 0 ? diff : a.name.localeCompare(b.name, 'pt-BR')
  })

  return { officers }
})
