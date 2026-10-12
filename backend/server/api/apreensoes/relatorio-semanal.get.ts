import { requireAuth } from '../../utils/auth'
import { ApreensaoService } from '../../services/ApreensaoService'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)
  if (!payload.cargo.includes('p3') && payload.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Acesso negado' })
  }

  const query = getQuery(event) as { inicio?: string; fim?: string }
  const { inicio, fim } = query

  if (!inicio || !fim) {
    throw createError({ statusCode: 400, message: 'Parâmetros inicio e fim são obrigatórios (YYYY-MM-DD)' })
  }

  const [anoI, mesI, diaI] = inicio.split('-').map(Number)
  const [anoF, mesF, diaF] = fim.split('-').map(Number)

  if (!anoI || !mesI || !diaI || !anoF || !mesF || !diaF) {
    throw createError({ statusCode: 400, message: 'Formato de data inválido. Use YYYY-MM-DD' })
  }

  // Use local Date constructor (same pattern as monthRange) to avoid UTC offset issues
  const start = new Date(anoI, mesI - 1, diaI, 0, 0, 0, 0)
  const end = new Date(anoF, mesF - 1, diaF, 23, 59, 59, 999)

  if (end < start) {
    throw createError({ statusCode: 400, message: 'fim deve ser posterior a inicio' })
  }

  const [stats, rankPatrulha, rankDias] = await Promise.all([
    ApreensaoService.getStatsByRange(start, end),
    ApreensaoService.getPatrulhaRankByRange(start, end),
    ApreensaoService.getDiasPatrulhadosRankByRange(start, end),
  ])

  return {
    totais: stats.totais,
    rankGeral: stats.rankGeral,
    rankPorItem: stats.rankPorItem,
    rankPatrulha,
    rankDias,
  }
})
