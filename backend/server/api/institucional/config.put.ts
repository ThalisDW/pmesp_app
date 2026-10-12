import { connectDB } from '../../utils/db'
import { ConfigInstitucional } from '../../models/ConfigInstitucional'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)
  if (payload.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Acesso negado' })
  }

  const body = await readBody(event)

  const allowed: Record<string, unknown> = {}
  if ('imagemHero' in body) allowed.imagemHero = body.imagemHero ?? ''
  if ('fotosCarrossel' in body) allowed.fotosCarrossel = Array.isArray(body.fotosCarrossel) ? body.fotosCarrossel : []
  if ('militarDestaque' in body) allowed.militarDestaque = body.militarDestaque ?? {}

  await connectDB()

  await ConfigInstitucional.updateOne({}, { $set: allowed }, { upsert: true })

  return { success: true }
})
