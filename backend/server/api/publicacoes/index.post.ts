import { connectDB } from '../../utils/db'
import { Publicacao } from '../../models/Publicacao'
import { User } from '../../models/User'
import { verifyToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Não autorizado' })
  }

  const config = useRuntimeConfig()
  let payload
  try {
    payload = verifyToken(authHeader.slice(7), config.jwtSecret)
  } catch {
    throw createError({ statusCode: 401, message: 'Token inválido ou expirado' })
  }

  const body = await readBody(event)
  const { tipo } = body ?? {}

  if (!tipo || !['aviso', 'boletim'].includes(tipo)) {
    throw createError({ statusCode: 400, message: 'Tipo inválido (aviso ou boletim)' })
  }

  const isAdmin = payload.role === 'admin'

  if (tipo === 'aviso') {
    const gradNum = parseInt(payload.graduacao)
    if (!isAdmin && (isNaN(gradNum) || gradNum > 7)) {
      throw createError({ statusCode: 403, message: 'Apenas oficiais (graduação 1-7) podem emitir avisos' })
    }
    const { titulo, conteudo } = body
    if (!titulo?.trim() || !conteudo?.trim()) {
      throw createError({ statusCode: 400, message: 'Título e conteúdo são obrigatórios' })
    }
  }

  if (tipo === 'boletim') {
    if (!isAdmin && !payload.cargo.includes('p1')) {
      throw createError({ statusCode: 403, message: 'Apenas P1 pode emitir boletins internos' })
    }
  }

  await connectDB()

  const autor = await User.findById(payload.id).select('name rg graduacao cargo').lean()
  if (!autor) {
    throw createError({ statusCode: 401, message: 'Usuário não encontrado' })
  }

  const data: Record<string, unknown> = {
    tipo,
    autorId: payload.id,
    autorNome: autor.name,
    autorRg: autor.rg,
    autorGraduacao: autor.graduacao,
    autorCargo: autor.cargo,
  }

  if (tipo === 'aviso') {
    data.titulo = body.titulo.trim()
    data.conteudo = body.conteudo.trim()
  } else {
    data.parte1 = body.parte1?.trim() || 'Sem alterações.'
    data.parte2 = body.parte2?.trim() || 'Sem alterações.'
    data.parte3 = body.parte3?.trim() || 'Sem alterações.'
    data.parte4 = body.parte4?.trim() || 'Sem alterações.'
  }

  const publicacao = await Publicacao.create(data)
  return { publicacao }
})
