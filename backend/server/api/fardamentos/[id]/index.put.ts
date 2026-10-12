import { connectDB } from '../../../utils/db'
import { Fardamento } from '../../../models/Fardamento'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = requireAuth(event)
  if (!payload.cargo.includes('p3') && payload.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Acesso negado' })
  }
  const id = getRouterParam(event, 'id')
  await connectDB()
  const body = await readBody(event)
  const { nome, descricao, foto, maos, jaqueta, mochila, acessorios, sapatos, chapeu, camisa, coletes, adesivos, calcas, mascara } = body ?? {}
  if (!nome?.trim()) throw createError({ statusCode: 400, message: 'Nome obrigatório' })

  const fardamento = await Fardamento.findByIdAndUpdate(
    id,
    {
      nome: nome.trim(),
      descricao: descricao ?? '',
      foto: foto ?? '',
      maos: maos ?? '',
      jaqueta: jaqueta ?? '',
      mochila: mochila ?? '',
      acessorios: acessorios ?? '',
      sapatos: sapatos ?? '',
      chapeu: chapeu ?? '',
      camisa: camisa ?? '',
      coletes: coletes ?? '',
      adesivos: adesivos ?? '',
      calcas: calcas ?? '',
      mascara: mascara ?? '',
    },
    { new: true }
  ).select('-__v').lean()

  if (!fardamento) throw createError({ statusCode: 404, message: 'Fardamento não encontrado' })
  return { fardamento }
})
