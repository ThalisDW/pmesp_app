import { connectDB } from '../../utils/db'
import { Viatura } from '../../models/Viatura'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)
  const query = getQuery(event)
  const now = new Date()
  const mes = Number(query.mes) || now.getMonth() + 1
  const ano = Number(query.ano) || now.getFullYear()

  const start = new Date(ano, mes - 1, 1)
  const end = new Date(ano, mes, 0, 23, 59, 59, 999)

  await connectDB()

  const count = await Viatura.countDocuments({
    $and: [
      {
        abertaEm: { $lte: end },
        $or: [{ encerradaEm: null }, { encerradaEm: { $gte: start } }],
      },
      {
        $or: [
          { motorista: payload.id },
          { chefeDeBarca: payload.id },
          { auxiliar1: payload.id },
          { auxiliar2: payload.id },
          { auxiliar3: payload.id },
        ],
      },
    ],
  })

  return { turnos: count }
})
