import { requireAuth } from '../../utils/auth'
import { ApreensaoService } from '../../services/ApreensaoService'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)
  if (!payload.cargo.includes('p3') && payload.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Acesso negado' })
  }
  return { viaturas: await ApreensaoService.getRelatorio() }
})
