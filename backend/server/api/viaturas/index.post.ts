import { connectDB } from '../../utils/db'
import { Viatura } from '../../models/Viatura'
import { User } from '../../models/User'
import { verifyToken } from '../../utils/jwt'

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

  const body = await readBody(event)
  const { prefixo, observacao, motorista, chefeDeBarca, auxiliar1, auxiliar2, auxiliar3 } = body ?? {}

  if (!prefixo?.trim()) throw createError({ statusCode: 400, message: 'Prefixo obrigatório' })
  if (!motorista) throw createError({ statusCode: 400, message: 'Motorista obrigatório' })
  if (!chefeDeBarca) throw createError({ statusCode: 400, message: 'Chefe de barca obrigatório' })

  const ids = [motorista, chefeDeBarca, auxiliar1, auxiliar2, auxiliar3].filter(Boolean) as string[]
  if (new Set(ids).size !== ids.length) {
    throw createError({ statusCode: 400, message: 'Mesmo policial em mais de um cargo da barca' })
  }

  const busy = await User.find({ _id: { $in: ids }, patrulhando: true }).select('name').lean()
  if (busy.length > 0) {
    const names = busy.map((u) => u.name).join(', ')
    throw createError({ statusCode: 400, message: `Já em serviço: ${names}` })
  }

  const viatura = await Viatura.create({
    prefixo: prefixo.trim(),
    observacao: observacao?.trim() ?? '',
    motorista,
    chefeDeBarca,
    auxiliar1: auxiliar1 || null,
    auxiliar2: auxiliar2 || null,
    auxiliar3: auxiliar3 || null,
    abertaPor: payload.id,
    abertaEm: new Date(),
  })

  await User.updateMany(
    { _id: { $in: ids } },
    { patrulhando: true, ultimaPatrulha: new Date() }
  )

  const populated = await Viatura.findById(viatura._id)
    .populate('motorista', CREW_SELECT)
    .populate('chefeDeBarca', CREW_SELECT)
    .populate('auxiliar1', CREW_SELECT)
    .populate('auxiliar2', CREW_SELECT)
    .populate('auxiliar3', CREW_SELECT)
    .lean()

  return { viatura: populated }
})
