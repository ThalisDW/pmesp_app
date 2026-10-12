import { connectDB } from '../../utils/db'
import { Ausencia } from '../../models/Ausencia'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)
  await connectDB()

  const { usuarioId, dataInicio, dataFim } = getQuery(event)
  const isP1OrAdmin = payload.cargo.includes('p1') || payload.role === 'admin'

  const filter: Record<string, unknown> = {}

  if (!isP1OrAdmin) {
    filter.usuarioId = payload.id
  } else {
    if (usuarioId) filter.usuarioId = usuarioId
    if (dataInicio || dataFim) {
      // ausencias que se sobrepõem ao período filtrado
      if (dataInicio) {
        const [y, m, d] = (dataInicio as string).split('-').map(Number)
        filter.dataFim = { $gte: new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0)) }
      }
      if (dataFim) {
        const [y, m, d] = (dataFim as string).split('-').map(Number)
        filter.dataInicio = { ...(filter.dataInicio as object ?? {}), $lte: new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999)) }
      }
    }
  }

  const ausencias = await Ausencia.find(filter).sort({ createdAt: -1 }).lean()
  return { ausencias }
})
