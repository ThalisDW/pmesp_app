import { connectDB } from '../../utils/db'
import { Viatura } from '../../models/Viatura'
import { requireAuth } from '../../utils/auth'

function isWeekday(date: Date): boolean {
  const dow = date.getDay()
  return dow !== 0 && dow !== 6
}

function countWeekdays(from: Date, to: Date): number {
  let count = 0
  const cur = new Date(from)
  cur.setHours(0, 0, 0, 0)
  const end = new Date(to)
  end.setHours(0, 0, 0, 0)
  while (cur <= end) {
    if (isWeekday(cur)) count++
    cur.setDate(cur.getDate() + 1)
  }
  return count
}

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)
  await connectDB()

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

  const viaturas = await Viatura.find({
    abertaEm: { $lte: today },
    $and: [
      { $or: [{ encerradaEm: null }, { encerradaEm: { $gte: monthStart } }] },
      { $or: [
        { motorista: payload.id },
        { chefeDeBarca: payload.id },
        { auxiliar1: payload.id },
        { auxiliar2: payload.id },
        { auxiliar3: payload.id },
      ]},
    ],
  })
    .select('abertaEm encerradaEm')
    .lean()

  const allDays = new Set<string>()
  const weekDays = new Set<string>()

  for (const v of viaturas as any[]) {
    const rangeStart = new Date(Math.max(new Date(v.abertaEm).getTime(), monthStart.getTime()))
    const rangeEnd = new Date(Math.min((v.encerradaEm ? new Date(v.encerradaEm) : now).getTime(), today.getTime()))

    const cur = new Date(rangeStart)
    cur.setHours(0, 0, 0, 0)
    const endDay = new Date(rangeEnd)
    endDay.setHours(0, 0, 0, 0)

    while (cur <= endDay) {
      const key = cur.toISOString().split('T')[0]
      allDays.add(key)
      if (isWeekday(cur)) weekDays.add(key)
      cur.setDate(cur.getDate() + 1)
    }
  }

  const totalWeekdays = countWeekdays(monthStart, today)
  const diasPatrulhados = allDays.size
  const diasUteisPatrulhados = weekDays.size
  const percentual = totalWeekdays > 0 ? Math.round((diasUteisPatrulhados / totalWeekdays) * 100) : 0
  const flag = percentual >= 60 ? 'apto' : percentual >= 40 ? 'ativo' : 'inativo'

  return { diasPatrulhados, diasUteisPatrulhados, totalWeekdays, percentual, flag }
})
