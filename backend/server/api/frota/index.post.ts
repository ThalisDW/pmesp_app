import { connectDB } from '../../utils/db'
import { VeiculoFrota } from '../../models/VeiculoFrota'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)
  if (!payload.cargo.includes('p3') && payload.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Acesso negado' })
  }
  await connectDB()
  const body = await readBody(event)
  const { modelo, ano, foto, prefixos } = body ?? {}
  if (!modelo?.trim()) throw createError({ statusCode: 400, message: 'Modelo obrigatório' })
  const anoNum = Number(ano)
  if (!ano || isNaN(anoNum) || anoNum < 1900) throw createError({ statusCode: 400, message: 'Ano inválido' })
  const veiculo = await VeiculoFrota.create({
    modelo: modelo.trim(),
    ano: anoNum,
    foto: foto ?? '',
    prefixos: Array.isArray(prefixos) ? prefixos.map((p: string) => p.trim()).filter(Boolean) : [],
  })
  return { veiculo }
})
