import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'

export const useViaturasStore = defineStore('viaturas', {
  state: () => ({
    ativas: [],
    loading: false,
    error: null,
    actionLoading: false,
    actionError: null,
  }),

  getters: {
    count: (state) => state.ativas.length,
  },

  actions: {
    async fetchAtivas() {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const data = await api.get('/api/viaturas')
        this.ativas = data.viaturas ?? []
      } catch (err) {
        this.error = err.message || 'Erro ao carregar viaturas'
      } finally {
        this.loading = false
      }
    },

    async abrirViatura(payload) {
      this.actionLoading = true
      this.actionError = null
      try {
        const api = useApi()
        const data = await api.post('/api/viaturas', payload)
        this.ativas.unshift(data.viatura)
        return data.viatura
      } catch (err) {
        this.actionError = err.message || 'Erro ao abrir viatura'
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    async editarTripulacao(id, crew) {
      this.actionLoading = true
      this.actionError = null
      try {
        const api = useApi()
        const data = await api.patch(`/api/viaturas/${id}/tripulacao`, crew)
        const idx = this.ativas.findIndex((v) => v._id === id)
        if (idx !== -1) this.ativas.splice(idx, 1, data.viatura)
        return data.viatura
      } catch (err) {
        this.actionError = err.message || 'Erro ao editar tripulação'
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    async encerrarViatura(id) {
      this.actionLoading = true
      this.actionError = null
      try {
        const api = useApi()
        await api.patch(`/api/viaturas/${id}/encerrar`, {})
        this.ativas = this.ativas.filter((v) => v._id !== id)
      } catch (err) {
        this.actionError = err.message || 'Erro ao encerrar viatura'
        throw err
      } finally {
        this.actionLoading = false
      }
    },
  },
})
