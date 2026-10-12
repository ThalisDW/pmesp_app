import { connectDB } from '../../utils/db'
import { VeiculoFrota } from '../../models/VeiculoFrota'
import { Viatura } from '../../models/Viatura'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  await connectDB()
  const [veiculos, viaturasAtivas] = await Promise.all([
    VeiculoFrota.find({ ativo: true }).select('modelo ano prefixos').lean(),
    Viatura.find({ status: 'ativa' }).select('prefixo').lean(),
  ])
  const emUso = new Set(viaturasAtivas.map((v) => v.prefixo))
  const prefixos: Array<{ prefixo: string; modelo: string; ano: number; veiculoId: unknown }> = []
  for (const v of veiculos) {
    for (const p of v.prefixos) {
      if (!emUso.has(p)) {
        prefixos.push({ prefixo: p, modelo: v.modelo, ano: v.ano, veiculoId: v._id })
      }
    }
  }
  prefixos.sort((a, b) => a.prefixo.localeCompare(b.prefixo))
  return { prefixos }
})
