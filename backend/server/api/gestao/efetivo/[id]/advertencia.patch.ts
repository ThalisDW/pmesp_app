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
  const body = await readBody(event)
  const { descricao } = body ?? {}

  if (!descricao?.trim()) {
    throw createError({ statusCode: 400, message: 'Descrição da advertência é obrigatória' })
  }

  await connectDB()

  const user = await User.findOne({ _id: id, active: true, role: { $ne: 'admin' } })
  if (!user) {
    throw createError({ statusCode: 404, message: 'Policial não encontrado' })
  }

  if (user.advertencias.length >= 3) {
    throw createError({ statusCode: 400, message: 'Policial já possui 3 advertências (máximo PAD)' })
  }

  user.advertencias.push({
    descricao: descricao.trim(),
    data: new Date(),
    aplicadoPor: payload.id as unknown as import('mongoose').Types.ObjectId,
  })
  await user.save()

  const updated = await User.findById(id).select('-password -__v').lean()
  return { officer: updated }
})
