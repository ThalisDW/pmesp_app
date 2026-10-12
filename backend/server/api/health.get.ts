import { connectDB } from '../utils/db'

export default defineEventHandler(async () => {
  await connectDB()
  return { status: 'ok', timestamp: new Date() }
})
