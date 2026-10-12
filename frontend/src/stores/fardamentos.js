import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'

export const useFardamentosStore = defineStore('fardamentos', {
  state: () => ({
    fardamentos: [],
    loading: false,
    error: null,
    actionLoading: false,
    actionError: null,
  }),

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const data = await api.get('/api/fardamentos')
        this.fardamentos = data.fardamentos
      } catch (e) {
        this.error = e.message || 'Erro ao carregar fardamentos'
      } finally {
        this.loading = false
      }
    },

    async criar(payload) {
      this.actionLoading = true
      this.actionError = null
      try {
        const api = useApi()
        const data = await api.post('/api/fardamentos', payload)
        this.fardamentos.push(data.fardamento)
        return data.fardamento
      } catch (e) {
        this.actionError = e.message || 'Erro ao criar fardamento'
        throw e
      } finally {
        this.actionLoading = false
      }
    },

    async atualizar(id, payload) {
      this.actionLoading = true
      this.actionError = null
      try {
        const api = useApi()
        const data = await api.put(`/api/fardamentos/${id}`, payload)
        const idx = this.fardamentos.findIndex(f => f._id === id)
        if (idx !== -1) this.fardamentos[idx] = data.fardamento
        return data.fardamento
      } catch (e) {
        this.actionError = e.message || 'Erro ao atualizar fardamento'
        throw e
      } finally {
        this.actionLoading = false
      }
    },

    async remover(id) {
      this.actionLoading = true
      this.actionError = null
      try {
        const api = useApi()
        await api.delete(`/api/fardamentos/${id}`)
        this.fardamentos = this.fardamentos.filter(f => f._id !== id)
      } catch (e) {
        this.actionError = e.message || 'Erro ao remover fardamento'
        throw e
      } finally {
        this.actionLoading = false
      }
    },

    async mover(id, direcao) {
      const idx = this.fardamentos.findIndex(f => f._id === id)
      if (idx === -1) return
      const swapIdx = direcao === 'cima' ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= this.fardamentos.length) return

      const arr = [...this.fardamentos]
      ;[arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]]
      this.fardamentos = arr

      try {
        const api = useApi()
        await api.patch(`/api/fardamentos/${id}/mover`, { direcao })
      } catch {
        this.fetchAll()
      }
    },
  },
})
