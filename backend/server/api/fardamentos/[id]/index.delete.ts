import { connectDB } from '../../../utils/db'
import { Fardamento } from '../../../models/Fardamento'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)
  if (!payload.cargo.includes('p3') && payload.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Acesso negado' })
  }
  const id = getRouterParam(event, 'id')
  await connectDB()
  const fardamento = await Fardamento.findByIdAndUpdate(id, { ativo: false }).lean()
  if (!fardamento) throw createError({ statusCode: 404, message: 'Fardamento não encontrado' })
  return { success: true }
})
