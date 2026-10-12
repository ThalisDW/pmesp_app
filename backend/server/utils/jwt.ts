import jwt from 'jsonwebtoken'

export interface JwtPayload {
  id: string
  username: string
  role: string
  cargo: string[]
  graduacao: string
}

export function signToken(payload: JwtPayload, secret: string): string {
  return jwt.sign(payload, secret, { expiresIn: '8h' })
}

export function verifyToken(token: string, secret: string): JwtPayload {
  return jwt.verify(token, secret) as JwtPayload
}
