import mongoose, { Document, Schema } from 'mongoose'

export interface IViatura extends Document {
  prefixo: string
  observacao: string
  status: 'ativa' | 'encerrada'
  motorista: mongoose.Types.ObjectId
  chefeDeBarca: mongoose.Types.ObjectId
  auxiliar1: mongoose.Types.ObjectId | null
  auxiliar2: mongoose.Types.ObjectId | null
  auxiliar3: mongoose.Types.ObjectId | null
  abertaPor: mongoose.Types.ObjectId
  encerradaPor: mongoose.Types.ObjectId | null
  abertaEm: Date
  encerradaEm: Date | null
}

const ViaturaSchema = new Schema<IViatura>(
  {
    prefixo: { type: String, required: true, trim: true },
    observacao: { type: String, default: '' },
    status: { type: String, enum: ['ativa', 'encerrada'], default: 'ativa' },
    motorista: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    chefeDeBarca: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    auxiliar1: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    auxiliar2: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    auxiliar3: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    abertaPor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    encerradaPor: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    abertaEm: { type: Date, default: Date.now },
    encerradaEm: { type: Date, default: null },
  },
  { timestamps: true }
)

if (mongoose.models['Viatura']) {
  delete (mongoose.models as Record<string, unknown>)['Viatura']
}
export const Viatura = mongoose.model<IViatura>('Viatura', ViaturaSchema)
