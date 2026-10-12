import { connectDB } from '../../utils/db'
import { AvaliacaoRocam } from '../../models/AvaliacaoRocam'
import { verifyToken } from '../../utils/jwt'

const PAGE_SIZE = 20

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Não autorizado' })
  }

  const config = useRuntimeConfig()
  let payload: ReturnType<typeof verifyToken>
  try {
    payload = verifyToken(authHeader.slice(7), config.jwtSecret)
  } catch {
    throw createError({ statusCode: 401, message: 'Token inválido ou expirado' })
  }

  await connectDB()

  const q = getQuery(event)
  const page = Math.max(1, Number(q.page) || 1)
  const skip = (page - 1) * PAGE_SIZE

  const isP1 = payload.cargo.includes('p1') || payload.role === 'admin'
  const isRocam = payload.cargo.includes('rocam') && !payload.cargo.includes('bracal_rocam') && !isP1

  const filter: Record<string, any> = {}

  if (isRocam) {
    filter.avaliadoId = payload.id
  } else if (!isP1) {
    filter.avaliadorId = payload.id
  }

  if (q.dataInicio || q.dataFim) {
    filter.createdAt = {}
    if (q.dataInicio) filter.createdAt.$gte = new Date(q.dataInicio as string)
    if (q.dataFim) {
      const fim = new Date(q.dataFim as string)
      fim.setHours(23, 59, 59, 999)
      filter.createdAt.$lte = fim
    }
  }

  if (isP1) {
    if (q.nota_min !== undefined && q.nota_min !== '') {
      filter.nota = { ...filter.nota, $gte: Number(q.nota_min) }
    }
    if (q.nota_max !== undefined && q.nota_max !== '') {
      filter.nota = { ...filter.nota, $lte: Number(q.nota_max) }
    }
    if (q.avaliadorId) filter.avaliadorId = String(q.avaliadorId)
    if (q.avaliadoId) filter.avaliadoId = String(q.avaliadoId)
  }

  const [docs, total] = await Promise.all([
    AvaliacaoRocam.find(filter).sort({ createdAt: -1 }).skip(skip).limit(PAGE_SIZE).lean(),
    AvaliacaoRocam.countDocuments(filter),
  ])

  const avaliacoes = isRocam
    ? docs.map(({ avaliadorId: _ai, avaliadorNome: _an, avaliadorRg: _ar, ...rest }: any) => rest)
    : docs

  return {
    avaliacoes,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  }
})
