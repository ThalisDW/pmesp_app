import { connectDB } from '../../../utils/db'
import { Viatura } from '../../../models/Viatura'
import { User } from '../../../models/User'
import { verifyToken } from '../../../utils/jwt'

const CREW_SELECT = 'name rg graduacao cargo username'
const CREW_KEYS = ['motorista', 'chefeDeBarca', 'auxiliar1', 'auxiliar2', 'auxiliar3'] as const

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

  const currentCrewIds = CREW_KEYS
    .map((k) => viatura[k]?.toString())
    .filter(Boolean) as string[]

  const body = await readBody(event)
  const { motorista, chefeDeBarca, auxiliar1, auxiliar2, auxiliar3 } = body ?? {}

  if (!motorista) throw createError({ statusCode: 400, message: 'Motorista obrigatório' })
  if (!chefeDeBarca) throw createError({ statusCode: 400, message: 'Chefe de barca obrigatório' })

  const newIds = [motorista, chefeDeBarca, auxiliar1, auxiliar2, auxiliar3].filter(Boolean) as string[]
  if (new Set(newIds).size !== newIds.length) {
    throw createError({ statusCode: 400, message: 'Mesmo policial em mais de um cargo da barca' })
  }

  // Officers truly new to this viatura (not already in current crew)
  const addedIds = newIds.filter((uid) => !currentCrewIds.includes(uid))
  const removedIds = currentCrewIds.filter((uid) => !newIds.includes(uid))

  if (addedIds.length > 0) {
    const busy = await User.find({ _id: { $in: addedIds }, patrulhando: true }).select('name').lean()
    if (busy.length > 0) {
      const names = busy.map((u) => u.name).join(', ')
      throw createError({ statusCode: 400, message: `Já em serviço: ${names}` })
    }
  }

  if (removedIds.length > 0) {
    await User.updateMany({ _id: { $in: removedIds } }, { patrulhando: false })
  }
  if (addedIds.length > 0) {
    await User.updateMany({ _id: { $in: addedIds } }, { patrulhando: true, ultimaPatrulha: new Date() })
  }

  const updated = await Viatura.findByIdAndUpdate(
    id,
    {
      motorista,
      chefeDeBarca,
      auxiliar1: auxiliar1 || null,
      auxiliar2: auxiliar2 || null,
      auxiliar3: auxiliar3 || null,
    },
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
