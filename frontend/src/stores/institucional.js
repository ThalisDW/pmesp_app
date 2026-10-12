import { defineStore } from 'pinia'

function baseUrl() {
  return import.meta.env.VITE_API_URL || 'http://localhost:4000'
}

export const useInstitucionalStore = defineStore('institucional', {
  state: () => ({
    config: null,
    stats: null,
    mes: null,
    ano: null,
    loading: false,
    error: null,
    saving: false,
    saveError: null,
  }),

  actions: {
    async fetchConfig() {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${baseUrl()}/api/institucional/config`)
        if (!res.ok) throw new Error('Erro ao carregar')
        const data = await res.json()
        this.config = data.config
      } catch {
        this.error = 'Erro ao carregar configurações'
      } finally {
        this.loading = false
      }
    },

    async fetchStats() {
      try {
        const res = await fetch(`${baseUrl()}/api/institucional/stats`)
        if (!res.ok) return
        const data = await res.json()
        this.stats = data.totais
        this.mes = data.mes
        this.ano = data.ano
      } catch { /* silent */ }
    },

    async saveConfig(updates) {
      this.saving = true
      this.saveError = null
      try {
        const { useAuthStore } = await import('./auth')
        const auth = useAuthStore()
        const res = await fetch(`${baseUrl()}/api/institucional/config`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(updates),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.message || 'Erro ao salvar')
        }
        this.config = { ...this.config, ...updates }
        return true
      } catch (e) {
        this.saveError = e.message || 'Erro ao salvar'
        return false
      } finally {
        this.saving = false
      }
    },
  },
})
