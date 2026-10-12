import { connectDB } from '../../utils/db'
import { ConfigInstitucional } from '../../models/ConfigInstitucional'

export default defineEventHandler(async () => {
  await connectDB()
  const config = await ConfigInstitucional.findOneAndUpdate(
    {},
    {},
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
    .select('-__v')
    .lean()
  return { config }
})
