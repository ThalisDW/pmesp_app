import { connectDB } from '../../utils/db'
import { User } from '../../models/User'
import { verifyToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  await connectDB()

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

  if (payload.role !== 'admin' && !payload.cargo.includes('p1')) {
    throw createError({ statusCode: 403, message: 'Acesso negado' })
  }

  const { username, name, rg, role, cargo, graduacao, dataPromocao, badge } = await readBody(event)

  if (!username?.trim() || !name?.trim()) {
    throw createError({ statusCode: 400, message: 'Usuário e nome são obrigatórios' })
  }

  const exists = await User.findOne({ username: username.trim().toLowerCase() })
  if (exists) {
    throw createError({ statusCode: 409, message: 'Usuário já cadastrado' })
  }

  const randomSuffix = Math.random().toString(36).slice(-6).toUpperCase()
  const user = await User.create({
    username: username.trim().toLowerCase(),
    password: `Pmesp@${randomSuffix}`,
    name: name.trim(),
    rg: rg?.trim() || '',
    role: role || 'officer',
    cargo: cargo ? (Array.isArray(cargo) ? cargo : [cargo]) : ['padrao'],
    graduacao: graduacao || 'pm',
    dataPromocao: dataPromocao || null,
    badge: badge?.trim() || '',
    firstAccess: true,
    active: true,
  })

  return {
    user: {
      id: user._id,
      username: user.username,
      name: user.name,
      rg: user.rg,
      role: user.role,
      cargo: user.cargo,
      graduacao: user.graduacao,
      dataPromocao: user.dataPromocao,
      patrulhando: user.patrulhando,
      badge: user.badge,
      firstAccess: user.firstAccess,
    },
    tempPassword: `Pmesp@${randomSuffix}`,
  }
})
