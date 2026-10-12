import { connectDB } from '../../utils/db'
import { User } from '../../models/User'
import { verifyToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Não autorizado' })
  }

  const config = useRuntimeConfig()
  let payload: ReturnType<typeof verifyToken>
  try {
    payload = verifyToken(authHeader.slice(7), config.jwtSecret)
  } catch {
    throw createError({ statusCode: 401, message: 'Token inválido ou expirado' })
  }

  await connectDB()

  const isP1 = payload.cargo.includes('p1') || payload.role === 'admin'

  const membros = await User.find({ active: true, cargo: 'rocam' })
    .select('_id name rg')
    .sort({ name: 1 })
    .lean()

  let avaliadores: any[] = []
  if (isP1) {
    avaliadores = await User.find({ active: true, cargo: { $in: ['bracal_rocam', 'p1'] }, role: { $ne: 'admin' } })
      .select('_id name rg')
      .sort({ name: 1 })
      .lean()
  }

  return { membros, avaliadores }
})
