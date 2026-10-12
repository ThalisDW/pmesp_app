import { connectDB } from '../../utils/db'
import { Fardamento } from '../../models/Fardamento'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  await connectDB()
  const fardamentos = await Fardamento.find({ ativo: true }).sort({ ordem: 1 }).select('-__v').lean()
  return { fardamentos }
})
