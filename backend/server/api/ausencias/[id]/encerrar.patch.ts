import { connectDB } from '../../../utils/db'
import { Ausencia } from '../../../models/Ausencia'
import { User } from '../../../models/User'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)
  const id = getRouterParam(event, 'id')
  await connectDB()

  const ausencia = await Ausencia.findById(id)
  if (!ausencia) throw createError({ statusCode: 404, message: 'Ausência não encontrada' })

  const isP1OrAdmin = payload.cargo.includes('p1') || payload.role === 'admin'
  if (ausencia.usuarioId.toString() !== payload.id && !isP1OrAdmin) {
    throw createError({ statusCode: 403, message: 'Acesso negado' })
  }

  if (ausencia.status === 'encerrada') {
    throw createError({ statusCode: 400, message: 'Ausência já encerrada' })
  }

  ausencia.status = 'encerrada'
  ausencia.encerradaEm = new Date()
  await ausencia.save()

  await User.findByIdAndUpdate(ausencia.usuarioId, { ausente: false })

  return { success: true }
})
