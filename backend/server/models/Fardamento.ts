import mongoose from 'mongoose'

const FardamentoSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  descricao: { type: String, default: '' },
  foto: { type: String, default: '' },
  ordem: { type: Number, required: true },
  maos: { type: String, default: '' },
  jaqueta: { type: String, default: '' },
  mochila: { type: String, default: '' },
  acessorios: { type: String, default: '' },
  sapatos: { type: String, default: '' },
  chapeu: { type: String, default: '' },
  camisa: { type: String, default: '' },
  coletes: { type: String, default: '' },
  adesivos: { type: String, default: '' },
  calcas: { type: String, default: '' },
  mascara: { type: String, default: '' },
  ativo: { type: Boolean, default: true },
}, { timestamps: true })

FardamentoSchema.index({ ativo: 1, ordem: 1 })

export const Fardamento = mongoose.models.Fardamento || mongoose.model('Fardamento', FardamentoSchema)
