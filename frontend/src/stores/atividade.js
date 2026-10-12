import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'

export const useAtividadeStore = defineStore('atividade', {
  state: () => ({
    efetivo: [],
    totalWeekdays: 0,
    mes: null,
    loading: false,
    error: null,
    minhaAtividade: null,
    minhaAtividadeLoading: false,
  }),

  actions: {
    async fetchAll(mes, ano) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const params = mes && ano ? `?mes=${mes}&ano=${ano}` : ''
        const data = await api.get(`/api/atividade${params}`)
        this.efetivo = data.efetivo
        this.totalWeekdays = data.totalWeekdays
        this.mes = data.mes
      } catch (e) {
        this.error = e.message ?? 'Erro ao carregar registro de atividade'
      } finally {
        this.loading = false
      }
    },

    async fetchMinha() {
      this.minhaAtividadeLoading = true
      try {
        const api = useApi()
        const data = await api.get('/api/atividade/minha')
        this.minhaAtividade = data
      } catch {
        this.minhaAtividade = null
      } finally {
        this.minhaAtividadeLoading = false
      }
    },
  },
})
