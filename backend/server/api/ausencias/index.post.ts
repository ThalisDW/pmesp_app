import { connectDB } from '../../utils/db'
import { Ausencia } from '../../models/Ausencia'
import { User } from '../../models/User'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)
  await connectDB()

  const body = await readBody(event)
  if (!body?.dataInicio || !body?.dataFim || !body?.motivo?.trim()) {
    throw createError({ statusCode: 400, message: 'Período e motivo são obrigatórios' })
  }

  const [anoI, mesI, diaI] = (body.dataInicio as string).split('-').map(Number)
  const [anoF, mesF, diaF] = (body.dataFim as string).split('-').map(Number)
  // Armazena meio-dia UTC para garantir que nenhum fuso horário deslocará o dia
  const inicio = new Date(Date.UTC(anoI, mesI - 1, diaI, 12, 0, 0, 0))
  const fim = new Date(Date.UTC(anoF, mesF - 1, diaF, 12, 0, 0, 0))
  if (fim < inicio) {
    throw createError({ statusCode: 400, message: 'Data fim deve ser igual ou posterior à data início' })
  }

  const existing = await Ausencia.exists({ usuarioId: payload.id, status: 'ativa' })
  if (existing) {
    throw createError({ statusCode: 409, message: 'Já existe uma ausência ativa' })
  }

  const user = await User.findById(payload.id).select('name rg graduacao').lean()
  if (!user) throw createError({ statusCode: 404, message: 'Usuário não encontrado' })

  const ausencia = await Ausencia.create({
    usuarioId: payload.id,
    usuarioNome: user.name,
    usuarioRg: user.rg,
    usuarioGraduacao: user.graduacao,
    dataInicio: inicio,
    dataFim: fim,
    motivo: body.motivo.trim(),
  })

  await User.findByIdAndUpdate(payload.id, { ausente: true })

  return { ausencia }
})
