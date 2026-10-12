import mongoose from 'mongoose'

const VeiculoFrotaSchema = new mongoose.Schema({
  modelo: { type: String, required: true, trim: true },
  ano: { type: Number, required: true },
  foto: { type: String, default: '' },
  prefixos: { type: [String], default: [] },
  ativo: { type: Boolean, default: true },
}, { timestamps: true })

VeiculoFrotaSchema.index({ ativo: 1 })

export const VeiculoFrota = mongoose.models.VeiculoFrota || mongoose.model('VeiculoFrota', VeiculoFrotaSchema)
