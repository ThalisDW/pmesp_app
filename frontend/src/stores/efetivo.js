import { defineStore } from 'pinia'
import { useApi } from '../composables/useApi'

export const useEfetivoStore = defineStore('efetivo', {
  state: () => ({
    officers: [],
    loading: false,
    error: null,
  }),

  getters: {
    total: (state) => state.officers?.length ?? 0,
    emPatrulha: (state) => (state.officers ?? []).filter((o) => o.patrulhando).length,
    foraDe: (state) => (state.officers ?? []).filter((o) => !o.patrulhando).length,
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const data = await api.get('/api/efetivo')
        this.officers = Array.isArray(data?.officers) ? data.officers : []
      } catch (err) {
        this.error = err.message || 'Erro ao carregar efetivo'
      } finally {
        this.loading = false
      }
    },

    clear() {
      this.officers = []
      this.error = null
      this.loading = false
    },
  },
})
