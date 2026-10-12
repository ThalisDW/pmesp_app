import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import { CARGO_VALUES, GRADUACAO_VALUES } from '../constants/graduacoes'

export interface IAdvertencia {
  descricao: string
  data: Date
  aplicadoPor: mongoose.Types.ObjectId | null
}

export interface IUser extends Document {
  username: string
  password: string
  name: string
  rg: string
  role: 'admin' | 'supervisor' | 'officer'
  cargo: string[]
  graduacao: string
  dataPromocao: Date | null
  cursos: mongoose.Types.ObjectId[]
  advertencias: IAdvertencia[]
  patrulhando: boolean
  ultimaPatrulha: Date | null
  badge: string
  firstAccess: boolean
  active: boolean
  ausente: boolean
  comparePassword(password: string): Promise<boolean>
}

const AdvertenciaSchema = new Schema<IAdvertencia>(
  {
    descricao: { type: String, required: true },
    data: { type: Date, default: Date.now },
    aplicadoPor: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { _id: true }
)

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    rg: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'supervisor', 'officer'], default: 'officer' },
    cargo: { type: [String], enum: CARGO_VALUES, default: ['padrao'], validate: { validator: (v: string[]) => v.length > 0, message: 'Cargo não pode ser vazio' } },
    graduacao: { type: String, enum: GRADUACAO_VALUES, default: '14' },
    dataPromocao: { type: Date, default: null },
    cursos: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    advertencias: {
      type: [AdvertenciaSchema],
      default: [],
      validate: {
        validator: (v: IAdvertencia[]) => v.length <= 3,
        message: 'Máximo de 3 advertências (PAD) por policial',
      },
    },
    patrulhando: { type: Boolean, default: false },
    ultimaPatrulha: { type: Date, default: null },
    badge: { type: String, default: '' },
    firstAccess: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
    ausente: { type: Boolean, default: false },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password)
}

if (mongoose.models['User']) {
  delete (mongoose.models as Record<string, unknown>)['User']
}
export const User = mongoose.model<IUser>('User', UserSchema)
