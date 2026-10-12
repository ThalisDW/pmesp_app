import mongoose from 'mongoose'

const MembroSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rg: { type: String, default: '' },
    graduacao: { type: String, default: '' },
  },
  { _id: false },
)

const ApreensaoSchema = new mongoose.Schema(
  {
    viaturaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Viatura', required: true },
    viaturaPrefixo: { type: String, required: true },
    membros: { type: [MembroSchema], required: true },
    armasFogo: { type: Number, default: 0, min: 0 },
    drogas: { type: Number, default: 0, min: 0 },
    explosivos: { type: Number, default: 0, min: 0 },
    itensRoubados: { type: Number, default: 0, min: 0 },
    armasBrancas: { type: Number, default: 0, min: 0 },
    dinheiroSujo: { type: Number, default: 0, min: 0 },
    municao: { type: Number, default: 0, min: 0 },
    origem: { type: String, default: '' },
    registradoPorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
)

ApreensaoSchema.index({ createdAt: -1 })
ApreensaoSchema.index({ viaturaId: 1 })

export const Apreensao = mongoose.models.Apreensao || mongoose.model('Apreensao', ApreensaoSchema)
