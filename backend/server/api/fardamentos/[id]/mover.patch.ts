import { connectDB } from '../../../utils/db'
import { Fardamento } from '../../../models/Fardamento'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)
  if (!payload.cargo.includes('p3') && payload.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Acesso negado' })
  }
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { direcao } = body ?? {}
  if (direcao !== 'cima' && direcao !== 'baixo') {
    throw createError({ statusCode: 400, message: 'Direção inválida' })
  }

  await connectDB()

  const current = await Fardamento.findOne({ _id: id, ativo: true }).lean() as any
  if (!current) throw createError({ statusCode: 404, message: 'Fardamento não encontrado' })

  let adjacent: any
  if (direcao === 'cima') {
    adjacent = await Fardamento.findOne({ ativo: true, ordem: { $lt: current.ordem } }).sort({ ordem: -1 }).lean()
  } else {
    adjacent = await Fardamento.findOne({ ativo: true, ordem: { $gt: current.ordem } }).sort({ ordem: 1 }).lean()
  }

  if (!adjacent) return { success: true }

  await Promise.all([
    Fardamento.findByIdAndUpdate(id, { ordem: adjacent.ordem }),
    Fardamento.findByIdAndUpdate(adjacent._id, { ordem: current.ordem }),
  ])

  return { success: true }
})
