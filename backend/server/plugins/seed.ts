import { connectDB } from '../utils/db'
import { User } from '../models/User'

export default defineNitroPlugin(async () => {
  try {
    await connectDB()

    const exists = await User.findOne({ username: 'admin' })
    if (!exists) {
      await User.create({
        username: 'admin',
        password: 'Admin@123',
        name: 'Administrador Sistema',
        rg: '00001',
        role: 'admin',
        cargo: ['p1'],
        graduacao: '4',
        dataPromocao: null,
        badge: '00001',
        firstAccess: true,
        active: true,
      })
      console.log('[SEED] Usuário admin criado → login: admin / senha: Admin@123')
      console.log('[SEED] O admin deverá alterar a senha no primeiro acesso.')
    }
  } catch (err) {
    console.error('[SEED] Erro ao inicializar:', err)
  }
})
