import { connectDB } from '../../utils/db'
import { User } from '../../models/User'
import { signToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  await connectDB()

  const body = await readBody(event)
  const { username, password } = body ?? {}

  if (!username?.trim() || !password) {
    throw createError({ statusCode: 400, message: 'Usuário e senha são obrigatórios' })
  }

  const user = await User.findOne({ username: username.trim().toLowerCase(), active: true })
  if (!user) {
    throw createError({ statusCode: 401, message: 'Credenciais inválidas' })
  }

  const valid = await user.comparePassword(password)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Credenciais inválidas' })
  }

  const config = useRuntimeConfig()
  const token = signToken(
    { id: user._id.toString(), username: user.username, role: user.role, cargo: user.cargo, graduacao: user.graduacao },
    config.jwtSecret
  )

  return {
    token,
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
      ausente: user.ausente,
    },
  }
})
