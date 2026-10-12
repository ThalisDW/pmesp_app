import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'

export const useAvaliacaoEstagioStore = defineStore('avaliacaoEstagio', {
  state: () => ({
    avaliacoes: [],
    total: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null,
    actionLoading: false,
    actionError: null,
    estagiarios: [],
    avaliadores: [],
    membrosLoading: false,
  }),

  actions: {
    async fetchAvaliacoes(params = {}) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const q = new URLSearchParams()
        Object.entries(params).forEach(([k, v]) => {
          if (v !== '' && v !== null && v !== undefined) q.set(k, String(v))
        })
        const data = await api.get(`/api/avaliacoes-estagio?${q}`)
        this.avaliacoes = data.avaliacoes ?? []
        this.total = data.total ?? 0
        this.page = data.page ?? 1
        this.pages = data.pages ?? 1
      } catch (err) {
        this.error = err.message || 'Erro ao carregar avaliações'
      } finally {
        this.loading = false
      }
    },

    async fetchMembros() {
      this.membrosLoading = true
      try {
        const api = useApi()
        const data = await api.get('/api/avaliacoes-estagio/membros')
        this.estagiarios = data.estagiarios ?? []
        this.avaliadores = data.avaliadores ?? []
      } catch (err) {
        console.error('[avaliacaoEstagio] fetchMembros falhou:', err)
        this.estagiarios = []
        this.avaliadores = []
      } finally {
        this.membrosLoading = false
      }
    },

    async criar(payload) {
      this.actionLoading = true
      this.actionError = null
      try {
        const api = useApi()
        const data = await api.post('/api/avaliacoes-estagio', payload)
        return data.avaliacao
      } catch (err) {
        this.actionError = err.message || 'Erro ao criar avaliação'
        throw err
      } finally {
        this.actionLoading = false
      }
    },
  },
})
