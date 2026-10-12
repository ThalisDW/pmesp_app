import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'

export const useGestaoEfetivoStore = defineStore('gestaoEfetivo', {
  state: () => ({
    ativos: [],
    exonerados: [],
    loadingAtivos: false,
    loadingExonerados: false,
    actionLoading: false,
    actionError: null,
  }),

  actions: {
    async fetchAtivos() {
      this.loadingAtivos = true
      try {
        const api = useApi()
        const data = await api.get('/api/gestao/efetivo')
        this.ativos = data.officers ?? []
      } finally {
        this.loadingAtivos = false
      }
    },

    async fetchExonerados() {
      this.loadingExonerados = true
      try {
        const api = useApi()
        const data = await api.get('/api/gestao/efetivo?exonerado=1')
        this.exonerados = data.officers ?? []
      } finally {
        this.loadingExonerados = false
      }
    },

    async promover(id, graduacao) {
      this.actionLoading = true
      this.actionError = null
      try {
        const api = useApi()
        const data = await api.patch(`/api/gestao/efetivo/${id}/promover`, { graduacao })
        this._replaceAtivo(data.officer)
        return data.officer
      } catch (err) {
        this.actionError = err.message || 'Erro ao promover'
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    async darAdvertencia(id, descricao) {
      this.actionLoading = true
      this.actionError = null
      try {
        const api = useApi()
        const data = await api.patch(`/api/gestao/efetivo/${id}/advertencia`, { descricao })
        this._replaceAtivo(data.officer)
        return data.officer
      } catch (err) {
        this.actionError = err.message || 'Erro ao registrar advertência'
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    async editarCargo(id, cargo) {
      this.actionLoading = true
      this.actionError = null
      try {
        const api = useApi()
        const data = await api.patch(`/api/gestao/efetivo/${id}/cargo`, { cargo })
        this._replaceAtivo(data.officer)
        return data.officer
      } catch (err) {
        this.actionError = err.message || 'Erro ao alterar cargo'
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    async exonerar(id) {
      this.actionLoading = true
      this.actionError = null
      try {
        const api = useApi()
        const data = await api.patch(`/api/gestao/efetivo/${id}/exonerar`, {})
        this.ativos = this.ativos.filter((o) => o._id !== id)
        this.exonerados.unshift(data.officer)
        return data.officer
      } catch (err) {
        this.actionError = err.message || 'Erro ao exonerar'
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    _replaceAtivo(officer) {
      const idx = this.ativos.findIndex((o) => o._id === officer._id)
      if (idx !== -1) this.ativos.splice(idx, 1, officer)
    },
  },
})
