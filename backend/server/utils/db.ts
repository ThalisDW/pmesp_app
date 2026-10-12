import mongoose from 'mongoose'

let connected = false

export async function connectDB(): Promise<void> {
  if (connected) return

  const config = useRuntimeConfig()
  const uri = config.mongoUri

  if (!uri) throw new Error('MONGO_URI não configurado')

  await mongoose.connect(uri)
  connected = true
  console.log('[DB] Conectado ao MongoDB')
}
