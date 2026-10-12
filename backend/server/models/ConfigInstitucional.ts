import mongoose from 'mongoose'

const MilitarDestaqueSchema = new mongoose.Schema(
  {
    nome: { type: String, default: '' },
    foto: { type: String, default: '' },
    descricao: { type: String, default: '' },
  },
  { _id: false }
)

const ConfigInstitucionalSchema = new mongoose.Schema(
  {
    imagemHero: { type: String, default: '' },
    fotosCarrossel: { type: [String], default: [] },
    militarDestaque: { type: MilitarDestaqueSchema, default: () => ({}) },
  },
  { timestamps: true }
)

export const ConfigInstitucional =
  mongoose.models.ConfigInstitucional ||
  mongoose.model('ConfigInstitucional', ConfigInstitucionalSchema)
