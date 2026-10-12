import { connectDB } from '../../utils/db'
import { Publicacao } from '../../models/Publicacao'
import { verifyToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Não autorizado' })
  }

  const config = useRuntimeConfig()
  try {
    verifyToken(authHeader.slice(7), config.jwtSecret)
  } catch {
    throw createError({ statusCode: 401, message: 'Token inválido ou expirado' })
  }

  await connectDB()

  const [avisos, boletins] = await Promise.all([
    Publicacao.find({ tipo: 'aviso', ativo: true }).select('-__v').sort({ createdAt: -1 }).limit(50).lean(),
    Publicacao.find({ tipo: 'boletim', ativo: true }).select('-__v').sort({ createdAt: -1 }).limit(20).lean(),
  ])

  return { avisos, boletins }
})
