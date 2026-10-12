import mongoose, { Document, Schema } from 'mongoose'

export interface IAvaliacaoRocam extends Document {
  avaliadorId: mongoose.Types.ObjectId
  avaliadorNome: string
  avaliadorRg: string
  avaliadoId: mongoose.Types.ObjectId
  avaliadoNome: string
  avaliadoRg: string
  avaliacao: string
  pontoAtencao: string
  nota: number
  createdAt: Date
  updatedAt: Date
}

const AvaliacaoRocamSchema = new Schema<IAvaliacaoRocam>(
  {
    avaliadorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    avaliadorNome: { type: String, required: true },
    avaliadorRg: { type: String, default: '' },
    avaliadoId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    avaliadoNome: { type: String, required: true },
    avaliadoRg: { type: String, default: '' },
    avaliacao: { type: String, required: true, trim: true },
    pontoAtencao: { type: String, default: '', trim: true },
    nota: { type: Number, required: true, min: 0, max: 10 },
  },
  { timestamps: true }
)

if (mongoose.models['AvaliacaoRocam']) {
  delete (mongoose.models as Record<string, unknown>)['AvaliacaoRocam']
}

export const AvaliacaoRocam = mongoose.model<IAvaliacaoRocam>('AvaliacaoRocam', AvaliacaoRocamSchema)
