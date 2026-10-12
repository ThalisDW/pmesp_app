import mongoose, { Document, Schema } from 'mongoose'

export interface IPublicacao extends Document {
  tipo: 'aviso' | 'boletim'
  titulo: string
  conteudo: string
  parte1: string
  parte2: string
  parte3: string
  parte4: string
  autorId: mongoose.Types.ObjectId
  autorNome: string
  autorRg: string
  autorGraduacao: string
  autorCargo: string
  ativo: boolean
}

const PublicacaoSchema = new Schema<IPublicacao>(
  {
    tipo: { type: String, enum: ['aviso', 'boletim'], required: true },
    titulo: { type: String, default: '' },
    conteudo: { type: String, default: '' },
    parte1: { type: String, default: 'Sem alterações.' },
    parte2: { type: String, default: 'Sem alterações.' },
    parte3: { type: String, default: 'Sem alterações.' },
    parte4: { type: String, default: 'Sem alterações.' },
    autorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    autorNome: { type: String, required: true },
    autorRg: { type: String, default: '' },
    autorGraduacao: { type: String, default: '' },
    autorCargo: { type: String, default: '' },
    ativo: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const Publicacao =
  mongoose.models['Publicacao'] || mongoose.model<IPublicacao>('Publicacao', PublicacaoSchema)
