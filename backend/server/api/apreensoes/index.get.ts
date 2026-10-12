import { requireAuth } from '../../utils/auth'
import { ApreensaoService } from '../../services/ApreensaoService'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const query = getQuery(event)
  const now = new Date()
  const mes = Number(query.mes) || now.getMonth() + 1
  const ano = Number(query.ano) || now.getFullYear()
  return ApreensaoService.getStats(mes, ano)
})
