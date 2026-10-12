import { ApreensaoService } from '../../services/ApreensaoService'

export default defineEventHandler(async () => {
  const now = new Date()
  const mes = now.getMonth() + 1
  const ano = now.getFullYear()
  const { totais } = await ApreensaoService.getStats(mes, ano)
  return { totais, mes, ano }
})
