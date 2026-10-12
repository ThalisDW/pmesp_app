import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth'

export const useAusenciasStore = defineStore('ausencias', {
  state: () => ({
    ausencias: [],
    loading: false,
    error: null,
    actionLoading: false,
    actionError: null,
  }),

  getters: {
    ativa: (state) => state.ausencias.find((a) => a.status === 'ativa') ?? null,
  },

  actions: {
    async fetchAll(params = {}) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const qs = new URLSearchParams(
          Object.fromEntries(Object.entries(params).filter(([, v]) => v))
        ).toString()
        const data = await api.get(`/api/ausencias${qs ? '?' + qs : ''}`)
        this.ausencias = data.ausencias
      } catch (e) {
        this.error = e.message ?? 'Erro ao carregar ausências'
      } finally {
        this.loading = false
      }
    },

    async solicitar(payload) {
      this.actionLoading = true
      this.actionError = null
      try {
        const api = useApi()
        const data = await api.post('/api/ausencias', payload)
        this.ausencias.unshift(data.ausencia)
        useAuthStore().setAusente(true)
        return data.ausencia
      } catch (e) {
        this.actionError = e.message ?? 'Erro ao solicitar ausência'
        throw e
      } finally {
        this.actionLoading = false
      }
    },

    async encerrar(id) {
      this.actionLoading = true
      this.actionError = null
      try {
        const api = useApi()
        await api.patch(`/api/ausencias/${id}/encerrar`)
        const idx = this.ausencias.findIndex((a) => a._id === id)
        if (idx !== -1) {
          this.ausencias[idx] = {
            ...this.ausencias[idx],
            status: 'encerrada',
            encerradaEm: new Date().toISOString(),
          }
        }
        useAuthStore().setAusente(false)
      } catch (e) {
        this.actionError = e.message ?? 'Erro ao encerrar ausência'
        throw e
      } finally {
        this.actionLoading = false
      }
    },
  },
})
