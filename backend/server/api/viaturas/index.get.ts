import { connectDB } from '../../utils/db'
import { Viatura } from '../../models/Viatura'
import { verifyToken } from '../../utils/jwt'

const CREW_SELECT = 'name rg graduacao cargo username'

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

  const viaturas = await Viatura.find({ status: 'ativa' })
    .populate('motorista', CREW_SELECT)
    .populate('chefeDeBarca', CREW_SELECT)
    .populate('auxiliar1', CREW_SELECT)
    .populate('auxiliar2', CREW_SELECT)
    .populate('auxiliar3', CREW_SELECT)
    .sort({ abertaEm: -1 })
    .lean()

  return { viaturas }
})
