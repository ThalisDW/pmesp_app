import { defineStore } from 'pinia'
import { useApi } from '../composables/useApi'

export const useGestaoStore = defineStore('gestao', {
  state: () => ({
    loading: false,
    error: null,
    lastCreated: null,
  }),

  actions: {
    async criarUsuario(data) {
      this.loading = true
      this.error = null
      this.lastCreated = null
      try {
        const api = useApi()
        const result = await api.post('/api/users', data)
        this.lastCreated = result
      } catch (err) {
        this.error = err.message || 'Erro ao criar policial'
      } finally {
        this.loading = false
      }
    },

    resetLastCreated() {
      this.lastCreated = null
      this.error = null
    },
  },
})
