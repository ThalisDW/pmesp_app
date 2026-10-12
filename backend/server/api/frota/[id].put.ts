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
  const body = await readBody(event)
  const { modelo, ano, foto, prefixos } = body ?? {}
  if (!modelo?.trim()) throw createError({ statusCode: 400, message: 'Modelo obrigatório' })
  const anoNum = Number(ano)
  if (!ano || isNaN(anoNum) || anoNum < 1900) throw createError({ statusCode: 400, message: 'Ano inválido' })
  const veiculo = await VeiculoFrota.findByIdAndUpdate(
    id,
    {
      modelo: modelo.trim(),
      ano: anoNum,
      foto: foto ?? '',
      prefixos: Array.isArray(prefixos) ? prefixos.map((p: string) => p.trim()).filter(Boolean) : [],
    },
    { new: true },
  ).select('-__v').lean()
  if (!veiculo) throw createError({ statusCode: 404, message: 'Veículo não encontrado' })
  return { veiculo }
})
