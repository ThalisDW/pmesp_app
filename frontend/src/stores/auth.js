import { defineStore } from 'pinia'
import { buildDisplayName, getGraduacao } from '../constants/graduacoes'

const TOKEN_KEY = 'pmesp_token'
const USER_KEY = 'pmesp_user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || null,
    user: (() => {
      try {
        return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
      } catch {
        return null
      }
    })(),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    isRh: (state) => state.user?.cargo?.includes('p1') || state.user?.role === 'admin',
    needsPasswordChange: (state) => !!state.user?.firstAccess,

    displayName: (state) => {
      if (!state.user) return ''
      return buildDisplayName(state.user.name, state.user.rg, state.user.graduacao)
    },

    graduacaoInfo: (state) => {
      if (!state.user) return null
      return getGraduacao(state.user.graduacao)
    },

    canPostAviso: (state) => {
      if (!state.user) return false
      if (state.user.role === 'admin') return true
      return parseInt(state.user.graduacao) <= 7
    },

    canPostBoletim: (state) => {
      if (!state.user) return false
      return state.user.cargo?.includes('p1') || state.user.role === 'admin'
    },

    canEmitir: (state) => {
      if (!state.user) return false
      if (state.user.role === 'admin') return true
      return parseInt(state.user.graduacao) <= 7 || state.user.cargo?.includes('p1')
    },

    isP3: (state) => state.user?.cargo?.includes('p3') || state.user?.role === 'admin',
  },

  actions: {
    setAuth(token, user) {
      this.token = token
      this.user = user
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    },

    markFirstAccessDone() {
      if (this.user) {
        this.user = { ...this.user, firstAccess: false }
        localStorage.setItem(USER_KEY, JSON.stringify(this.user))
      }
    },

    setAusente(value) {
      if (this.user) {
        this.user = { ...this.user, ausente: value }
        localStorage.setItem(USER_KEY, JSON.stringify(this.user))
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    },
  },
})
