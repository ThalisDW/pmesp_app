import { connectDB } from '../../utils/db'
import { VeiculoFrota } from '../../models/VeiculoFrota'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  await connectDB()
  const veiculos = await VeiculoFrota.find({ ativo: true }).select('-__v').sort({ modelo: 1 }).lean()
  return { veiculos }
})
