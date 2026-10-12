import { connectDB } from '../../../../utils/db'
import { User } from '../../../../models/User'
import { verifyToken } from '../../../../utils/jwt'
import { GRADUACAO_VALUES } from '../../../../constants/graduacoes'

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
  const body = await readBody(event)
  const { graduacao } = body ?? {}

  if (!graduacao || !GRADUACAO_VALUES.includes(graduacao)) {
    throw createError({ statusCode: 400, message: 'Graduação inválida' })
  }

  await connectDB()

  const user = await User.findOneAndUpdate(
    { _id: id, active: true, role: { $ne: 'admin' } },
    { graduacao, dataPromocao: new Date() },
    { new: true }
  ).select('-password -__v').lean()

  if (!user) {
    throw createError({ statusCode: 404, message: 'Policial não encontrado' })
  }

  return { officer: user }
})
