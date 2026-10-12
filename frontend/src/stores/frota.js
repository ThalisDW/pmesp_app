import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'

export const useFrotaStore = defineStore('frota', {
  state: () => ({
    veiculos: [],
    prefixosDisponiveis: [],
    loading: false,
    error: null,
    actionLoading: false,
    actionError: null,
  }),

  actions: {
    async fetchVeiculos() {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const data = await api.get('/api/frota')
        this.veiculos = data.veiculos
      } catch (e) {
        this.error = e.message || 'Erro ao carregar frota'
      } finally {
        this.loading = false
      }
    },

    async fetchPrefixosDisponiveis() {
      try {
        const api = useApi()
        const data = await api.get('/api/frota/prefixos-disponiveis')
        this.prefixosDisponiveis = data.prefixos
      } catch {}
    },

    async criar(payload) {
      this.actionLoading = true
      this.actionError = null
      try {
        const api = useApi()
        const data = await api.post('/api/frota', payload)
        this.veiculos.push(data.veiculo)
        this.veiculos.sort((a, b) => a.modelo.localeCompare(b.modelo))
        return data.veiculo
      } catch (e) {
        this.actionError = e.message || 'Erro ao cadastrar veículo'
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
        const data = await api.put(`/api/frota/${id}`, payload)
        const idx = this.veiculos.findIndex((v) => v._id === id)
        if (idx !== -1) this.veiculos[idx] = data.veiculo
        return data.veiculo
      } catch (e) {
        this.actionError = e.message || 'Erro ao atualizar veículo'
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
        await api.delete(`/api/frota/${id}`)
        this.veiculos = this.veiculos.filter((v) => v._id !== id)
      } catch (e) {
        this.actionError = e.message || 'Erro ao remover veículo'
        throw e
      } finally {
        this.actionLoading = false
      }
    },
  },
})
