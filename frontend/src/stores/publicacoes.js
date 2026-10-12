import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'

const SEEN_AVISOS_KEY = 'pmesp_seen_avisos'
const SEEN_BOLETINS_KEY = 'pmesp_seen_boletins'

export const usePublicacoesStore = defineStore('publicacoes', {
  state: () => ({
    avisos: [],
    boletins: [],
    loading: false,
    error: null,
    submitting: false,
    submitError: null,
    lastSeenAvisos: localStorage.getItem(SEEN_AVISOS_KEY) || null,
    lastSeenBoletins: localStorage.getItem(SEEN_BOLETINS_KEY) || null,
  }),

  getters: {
    hasUnseenAvisos: (state) => {
      if (!state.avisos.length) return false
      if (!state.lastSeenAvisos) return true
      return new Date(state.avisos[0].createdAt) > new Date(state.lastSeenAvisos)
    },
    hasUnseenBoletins: (state) => {
      if (!state.boletins.length) return false
      if (!state.lastSeenBoletins) return true
      return new Date(state.boletins[0].createdAt) > new Date(state.lastSeenBoletins)
    },
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const data = await api.get('/api/publicacoes')
        this.avisos = data.avisos ?? []
        this.boletins = data.boletins ?? []
      } catch (err) {
        this.error = err.message || 'Erro ao carregar publicações'
      } finally {
        this.loading = false
      }
    },

    async criarPublicacao(payload) {
      this.submitting = true
      this.submitError = null
      try {
        const api = useApi()
        const data = await api.post('/api/publicacoes', payload)
        if (payload.tipo === 'aviso') {
          this.avisos.unshift(data.publicacao)
        } else {
          this.boletins.unshift(data.publicacao)
        }
        return data.publicacao
      } catch (err) {
        this.submitError = err.message || 'Erro ao emitir publicação'
        throw err
      } finally {
        this.submitting = false
      }
    },

    markAvisosRead() {
      const now = new Date().toISOString()
      this.lastSeenAvisos = now
      localStorage.setItem(SEEN_AVISOS_KEY, now)
    },

    markBoletinsRead() {
      const now = new Date().toISOString()
      this.lastSeenBoletins = now
      localStorage.setItem(SEEN_BOLETINS_KEY, now)
    },
  },
})
