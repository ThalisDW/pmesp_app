import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'

export const useApreensaoStore = defineStore('apreensoes', {
  state: () => ({
    totais: null,
    rankGeral: [],
    rankPorItem: {},
    rankPatrulha: [],
    rankDias: [],
    meusTurnos: null,
    loading: false,
    error: null,
    actionLoading: false,
    actionError: null,
    relatorio: [],
    relatorioLoading: false,
    semanalStats: null,
    semanalLoading: false,
    semanalError: null,
  }),

  actions: {
    async fetchStats(mes, ano) {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const [statsData, patrulhaData, diasData] = await Promise.all([
          api.get(`/api/apreensoes?mes=${mes}&ano=${ano}`),
          api.get(`/api/apreensoes/rank-patrulha?mes=${mes}&ano=${ano}`),
          api.get(`/api/apreensoes/rank-dias?mes=${mes}&ano=${ano}`),
        ])
        this.totais = statsData.totais
        this.rankGeral = statsData.rankGeral
        this.rankPorItem = statsData.rankPorItem
        this.rankPatrulha = patrulhaData.rank
        this.rankDias = diasData.rank
      } catch (e) {
        this.error = e.message || 'Erro ao carregar dados'
      } finally {
        this.loading = false
      }
    },

    async fetchMeusTurnos(mes, ano) {
      try {
        const api = useApi()
        const data = await api.get(`/api/viaturas/meus-turnos?mes=${mes}&ano=${ano}`)
        this.meusTurnos = data.turnos
      } catch {
        this.meusTurnos = 0
      }
    },

    async registrar(payload) {
      this.actionLoading = true
      this.actionError = null
      try {
        const api = useApi()
        const data = await api.post('/api/apreensoes', payload)
        return data.apreensao
      } catch (e) {
        this.actionError = e.message || 'Erro ao registrar apreensão'
        throw e
      } finally {
        this.actionLoading = false
      }
    },

    async fetchRelatorio() {
      this.relatorioLoading = true
      try {
        const api = useApi()
        const data = await api.get('/api/apreensoes/relatorio')
        this.relatorio = data.viaturas
      } catch (e) {
        throw e
      } finally {
        this.relatorioLoading = false
      }
    },

    async fetchSemanal(inicio, fim) {
      this.semanalLoading = true
      this.semanalError = null
      this.semanalStats = null
      try {
        const api = useApi()
        const data = await api.get(`/api/apreensoes/relatorio-semanal?inicio=${inicio}&fim=${fim}`)
        this.semanalStats = data
      } catch (e) {
        this.semanalError = e.message || 'Erro ao carregar relatório semanal'
        throw e
      } finally {
        this.semanalLoading = false
      }
    },
  },
})
