import mongoose, { Document, Schema } from 'mongoose'

export interface IAusencia extends Document {
  usuarioId: mongoose.Types.ObjectId
  usuarioNome: string
  usuarioRg: string
  usuarioGraduacao: string
  dataInicio: Date
  dataFim: Date
  motivo: string
  status: 'ativa' | 'encerrada'
  encerradaEm: Date | null
}

const AusenciaSchema = new Schema<IAusencia>(
  {
    usuarioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    usuarioNome: { type: String, required: true },
    usuarioRg: { type: String, default: '' },
    usuarioGraduacao: { type: String, default: '' },
    dataInicio: { type: Date, required: true },
    dataFim: { type: Date, required: true },
    motivo: { type: String, required: true, trim: true },
    status: { type: String, enum: ['ativa', 'encerrada'], default: 'ativa' },
    encerradaEm: { type: Date, default: null },
  },
  { timestamps: true }
)

AusenciaSchema.index({ usuarioId: 1, status: 1 })
AusenciaSchema.index({ status: 1, dataInicio: -1 })

export const Ausencia = mongoose.models.Ausencia ?? mongoose.model<IAusencia>('Ausencia', AusenciaSchema)
