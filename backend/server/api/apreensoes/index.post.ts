import { requireAuth } from '../../utils/auth'
import { ApreensaoService } from '../../services/ApreensaoService'

const ITEM_KEYS = ['armasFogo', 'drogas', 'explosivos', 'itensRoubados', 'armasBrancas', 'dinheiroSujo', 'municao']

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)
  const body = await readBody(event)
  const { viaturaId, origem, ...rest } = body ?? {}

  if (!viaturaId) throw createError({ statusCode: 400, message: 'Viatura obrigatória' })

  const items: Record<string, number> = {}
  for (const k of ITEM_KEYS) {
    const v = Number(rest[k] ?? 0)
    items[k] = isNaN(v) || v < 0 ? 0 : Math.floor(v)
  }

  const total = Object.values(items).reduce((a, b) => a + b, 0)
  if (total === 0) throw createError({ statusCode: 400, message: 'Adicione ao menos um item apreendido' })

  const apreensao = await ApreensaoService.create({
    viaturaId,
    userId: payload.id,
    items,
    origem: origem?.trim() ?? '',
  })

  return { apreensao }
})
