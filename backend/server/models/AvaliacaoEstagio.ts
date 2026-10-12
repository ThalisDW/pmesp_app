import mongoose, { Document, Schema } from 'mongoose'

export interface IAvaliacaoEstagio extends Document {
  avaliadorId: mongoose.Types.ObjectId
  avaliadorNome: string
  avaliadorRg: string
  estagiarioId: mongoose.Types.ObjectId
  estagiarioNome: string
  estagiarioRg: string
  avaliacao: string
  pontoAtencao: string
  nota: number
  createdAt: Date
  updatedAt: Date
}

const AvaliacaoEstagioSchema = new Schema<IAvaliacaoEstagio>(
  {
    avaliadorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    avaliadorNome: { type: String, required: true },
    avaliadorRg: { type: String, default: '' },
    estagiarioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    estagiarioNome: { type: String, required: true },
    estagiarioRg: { type: String, default: '' },
    avaliacao: { type: String, required: true, trim: true },
    pontoAtencao: { type: String, default: '', trim: true },
    nota: { type: Number, required: true, min: 0, max: 10 },
  },
  { timestamps: true }
)

if (mongoose.models['AvaliacaoEstagio']) {
  delete (mongoose.models as Record<string, unknown>)['AvaliacaoEstagio']
}

export const AvaliacaoEstagio = mongoose.model<IAvaliacaoEstagio>('AvaliacaoEstagio', AvaliacaoEstagioSchema)
