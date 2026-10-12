import { connectDB } from '../../utils/db'
import { AvaliacaoEstagio } from '../../models/AvaliacaoEstagio'
import { User } from '../../models/User'
import { verifyToken } from '../../utils/jwt'

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

  const ACTIVE_CARGOS = ['padrao', 'p1', 'p3', 'p5']
  const isActiveOfficer = payload.cargo.some((c: string) => ACTIVE_CARGOS.includes(c)) || payload.role === 'admin'
  if (!isActiveOfficer) {
    throw createError({ statusCode: 403, message: 'Estagiários não podem criar avaliações' })
  }

  const body = await readBody(event)
  const { estagiarioId, avaliacao, pontoAtencao, nota } = body ?? {}

  if (!estagiarioId || !avaliacao?.trim()) {
    throw createError({ statusCode: 400, message: 'Estagiário e avaliação são obrigatórios' })
  }

  const notaNum = Math.round(Number(nota))
  if (isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
    throw createError({ statusCode: 400, message: 'Nota deve ser de 0 a 10' })
  }

  await connectDB()

  const [estagiario, avaliador] = await Promise.all([
    User.findOne({ _id: estagiarioId, active: true, cargo: 'estagio' }).select('name rg').lean(),
    User.findById(payload.id).select('name rg').lean(),
  ])

  if (!estagiario) {
    throw createError({ statusCode: 404, message: 'Estagiário não encontrado' })
  }

  if (!avaliador) {
    throw createError({ statusCode: 401, message: 'Avaliador não encontrado' })
  }

  const doc = await AvaliacaoEstagio.create({
    avaliadorId: payload.id,
    avaliadorNome: avaliador.name,
    avaliadorRg: avaliador.rg ?? '',
    estagiarioId,
    estagiarioNome: estagiario.name,
    estagiarioRg: estagiario.rg ?? '',
    avaliacao: avaliacao.trim(),
    pontoAtencao: pontoAtencao?.trim() ?? '',
    nota: notaNum,
  })

  return { avaliacao: doc.toObject() }
})
