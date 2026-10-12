import { connectDB } from '../../../../utils/db'
import { User } from '../../../../models/User'
import { verifyToken } from '../../../../utils/jwt'

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

  const id = getRouterParam(event, 'id')

  if (id === payload.id) {
    throw createError({ statusCode: 400, message: 'Não é possível exonerar a si mesmo' })
  }

  await connectDB()

  const user = await User.findOneAndUpdate(
    { _id: id, active: true, role: { $ne: 'admin' } },
    { active: false },
    { new: true }
  ).select('-password -__v').lean()

  if (!user) {
    throw createError({ statusCode: 404, message: 'Policial não encontrado ou já exonerado' })
  }

  return { officer: user }
})
