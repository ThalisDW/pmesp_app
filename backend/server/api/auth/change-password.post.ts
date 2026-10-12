import bcrypt from 'bcryptjs'
import { connectDB } from '../../utils/db'
import { User } from '../../models/User'
import { verifyToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  await connectDB()

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Token não fornecido' })
  }

  const config = useRuntimeConfig()
  let payload
  try {
    payload = verifyToken(authHeader.slice(7), config.jwtSecret)
  } catch {
    throw createError({ statusCode: 401, message: 'Token inválido ou expirado' })
  }

  const { newPassword, confirmPassword } = await readBody(event)

  if (!newPassword || newPassword.length < 8) {
    throw createError({ statusCode: 400, message: 'A senha deve ter no mínimo 8 caracteres' })
  }

  if (newPassword !== confirmPassword) {
    throw createError({ statusCode: 400, message: 'As senhas não coincidem' })
  }

  const hashed = await bcrypt.hash(newPassword, 12)
  await User.findByIdAndUpdate(payload.id, { password: hashed, firstAccess: false })

  return { success: true, message: 'Senha alterada com sucesso' }
})
