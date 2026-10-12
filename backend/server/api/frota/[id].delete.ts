import { connectDB } from '../../utils/db'
import { VeiculoFrota } from '../../models/VeiculoFrota'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)
  if (!payload.cargo.includes('p3') && payload.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Acesso negado' })
  }
  const id = getRouterParam(event, 'id')
  await connectDB()
  const veiculo = await VeiculoFrota.findByIdAndUpdate(id, { ativo: false }).lean()
  if (!veiculo) throw createError({ statusCode: 404, message: 'Veículo não encontrado' })
  return { success: true }
})
