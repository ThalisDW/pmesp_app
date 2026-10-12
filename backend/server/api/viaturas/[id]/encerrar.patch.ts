import { connectDB } from '../../../utils/db'
import { Viatura } from '../../../models/Viatura'
import { User } from '../../../models/User'
import { verifyToken } from '../../../utils/jwt'

const CREW_SELECT = 'name rg graduacao cargo username'

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

  await connectDB()

  const id = getRouterParam(event, 'id')
  const viatura = await Viatura.findById(id).lean()
  if (!viatura) throw createError({ statusCode: 404, message: 'Viatura não encontrada' })
  if (viatura.status !== 'ativa') throw createError({ statusCode: 400, message: 'Viatura já encerrada' })

  const crewIds = [
    viatura.motorista,
    viatura.chefeDeBarca,
    viatura.auxiliar1,
    viatura.auxiliar2,
    viatura.auxiliar3,
  ].filter(Boolean).map((oid) => oid.toString())

  await User.updateMany({ _id: { $in: crewIds } }, { patrulhando: false })

  const updated = await Viatura.findByIdAndUpdate(
    id,
    { status: 'encerrada', encerradaPor: payload.id, encerradaEm: new Date() },
    { new: true }
  )
    .populate('motorista', CREW_SELECT)
    .populate('chefeDeBarca', CREW_SELECT)
    .populate('auxiliar1', CREW_SELECT)
    .populate('auxiliar2', CREW_SELECT)
    .populate('auxiliar3', CREW_SELECT)
    .lean()

  return { viatura: updated }
})
