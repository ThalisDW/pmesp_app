<template>
  <div class="layout">
    <AppSidebar
      :current-path="route.path"
      :is-admin="auth.isAdmin"
      :is-rh="auth.isRh"
      :is-p3="auth.isP3"
      :can-emitir="auth.canEmitir"
      :initials="initials"
      :user-name="auth.user?.name || ''"
      :user-rank="auth.graduacaoInfo?.label || roleLabel"
      @logout="logout"
    />

    <div class="main">
      <AppTopbar
        title="Ausências"
        breadcrumb="Operacional / Ausências"
        :current-date="currentDate"
        :current-time="currentTime"
        :initials="initials"
        :user-name="auth.user?.name || ''"
        :role-label="roleLabel"
      />

      <main class="content">
        <div v-if="ausenciaAtivaPropria" class="alert-ausente">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div class="alert-text">
            <strong>Ausência ativa</strong>
            <span>{{ formatDate(ausenciaAtivaPropria.dataInicio) }} até {{ formatDate(ausenciaAtivaPropria.dataFim) }} — {{ ausenciaAtivaPropria.motivo }}</span>
          </div>
          <button class="btn-retirar" :disabled="store.actionLoading" @click="onEncerrar(ausenciaAtivaPropria._id)">
            {{ store.actionLoading ? 'Retirando...' : 'Retirar Ausência' }}
          </button>
        </div>

        <div class="page-card">
          <div class="card-header">
            <div class="header-text">
              <h3 class="card-title">{{ auth.isRh ? 'Ausências do Efetivo' : 'Minhas Ausências' }}</h3>
              <span class="card-subtitle">
                {{ store.loading ? 'Carregando...' : `${ausenciasExibidas.length} registro(s)` }}
              </span>
            </div>
            <button
              class="btn-open"
              :disabled="!!ausenciaAtivaPropria"
              :title="ausenciaAtivaPropria ? 'Já existe uma ausência ativa' : ''"
              @click="modalSolicitar = true"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Solicitar Ausência
            </button>
          </div>

          <div v-if="auth.isRh" class="filters">
            <select v-model="filtroUsuarioId" class="filter-select">
              <option value="">Todos os policiais</option>
              <option v-for="u in usuariosUnicos" :key="u.id" :value="u.id">{{ u.nome }}</option>
            </select>
            <div class="filter-range">
              <input v-model="filtroDataInicio" type="date" class="filter-date" title="Período — início" />
              <span class="filter-sep">até</span>
              <input v-model="filtroDataFim" type="date" class="filter-date" :min="filtroDataInicio" title="Período — fim" />
            </div>
            <button class="btn-clear" @click="limparFiltros">Limpar</button>
          </div>

          <div class="table-wrap">
            <div v-if="store.loading" class="table-feedback">
              <div class="spinner" />
              Carregando ausências...
            </div>
            <div v-else-if="store.error" class="table-error">{{ store.error }}</div>
            <div v-else-if="ausenciasExibidas.length === 0" class="table-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Nenhuma ausência registrada.
            </div>
            <table v-else class="table">
              <thead>
                <tr>
                  <th v-if="auth.isRh">Policial</th>
                  <th>Período</th>
                  <th>Motivo</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="a in ausenciasExibidas" :key="a._id">
                  <td v-if="auth.isRh">
                    <div class="td-policial">
                      <span class="officer-name">{{ a.usuarioNome }}</span>
                      <span class="officer-rg">RG {{ a.usuarioRg }}</span>
                    </div>
                  </td>
                  <td class="td-date">{{ formatDate(a.dataInicio) }} — {{ formatDate(a.dataFim) }}</td>
                  <td class="td-motivo">{{ a.motivo }}</td>
                  <td>
                    <span class="badge-status" :class="a.status">
                      {{ a.status === 'ativa' ? 'Ativa' : 'Encerrada' }}
                    </span>
                  </td>
                  <td>
                    <button
                      v-if="a.status === 'ativa'"
                      class="btn-encerrar"
                      :disabled="store.actionLoading"
                      @click="onEncerrar(a._id)"
                    >
                      Retirar
                    </button>
                    <span v-else class="no-action">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>

  <SolicitarAusenciaModal
    :open="modalSolicitar"
    :loading="store.actionLoading"
    :error="store.actionError || ''"
    @close="fecharModal"
    @confirm="onSolicitar"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAusenciasStore } from '@/stores/ausencias'
import { useToastStore } from '@/stores/toast'
import { useClock } from '@/composables/useClock'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import SolicitarAusenciaModal from '@/components/ausencias/SolicitarAusenciaModal.vue'

const auth = useAuthStore()
const store = useAusenciasStore()
const toast = useToastStore()
const route = useRoute()
const router = useRouter()
const { currentTime, currentDate } = useClock()

const modalSolicitar = ref(false)
const filtroUsuarioId = ref('')
const filtroDataInicio = ref('')
const filtroDataFim = ref('')

const initials = computed(() => {
  const parts = (auth.user?.name || 'U').split(' ')
  return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0]
})

const roleLabel = computed(() => {
  const map = { admin: 'Administrador', supervisor: 'Supervisor', officer: 'Policial Militar' }
  return map[auth.user?.role] || ''
})

const ausenciaAtivaPropria = computed(() =>
  store.ausencias.find((a) => a.status === 'ativa' && a.usuarioId?.toString() === auth.user?.id?.toString()) ?? null
)

const usuariosUnicos = computed(() => {
  const map = new Map()
  store.ausencias.forEach((a) => {
    if (!map.has(a.usuarioId)) map.set(a.usuarioId, { id: a.usuarioId, nome: a.usuarioNome })
  })
  return [...map.values()].sort((a, b) => a.nome.localeCompare(b.nome))
})

const ausenciasExibidas = computed(() => {
  let list = store.ausencias
  if (auth.isRh) {
    if (filtroUsuarioId.value) list = list.filter((a) => a.usuarioId?.toString() === filtroUsuarioId.value)
    if (filtroDataInicio.value) {
      const [y, m, d] = filtroDataInicio.value.split('-').map(Number)
      const ini = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0))
      list = list.filter((a) => new Date(a.dataFim) >= ini)
    }
    if (filtroDataFim.value) {
      const [y, m, d] = filtroDataFim.value.split('-').map(Number)
      const fim = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999))
      list = list.filter((a) => new Date(a.dataInicio) <= fim)
    }
  }
  return list
})

onMounted(() => store.fetchAll())

function fecharModal() {
  modalSolicitar.value = false
  store.actionError = null
}

async function onSolicitar(payload) {
  try {
    await store.solicitar(payload)
    fecharModal()
    toast.show('Ausência registrada com sucesso.')
  } catch {}
}

async function onEncerrar(id) {
  try {
    await store.encerrar(id)
    toast.show('Ausência retirada.')
  } catch (e) {
    toast.show(e.message ?? 'Erro ao retirar ausência.', 'error')
  }
}

function limparFiltros() {
  filtroUsuarioId.value = ''
  filtroDataInicio.value = ''
  filtroDataFim.value = ''
}

function formatDate(d) {
  if (!d) return '—'
  const dt = new Date(d)
  const day = String(dt.getUTCDate()).padStart(2, '0')
  const month = String(dt.getUTCMonth() + 1).padStart(2, '0')
  const year = dt.getUTCFullYear()
  return `${day}/${month}/${year}`
}

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout { display: flex; min-height: 100vh; background: var(--bg-light); }
.main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.content { padding: 2rem 1.75rem; flex: 1; display: flex; flex-direction: column; gap: 1rem; }

.alert-ausente {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.25rem;
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 10px;
  color: #92400e;
}

.alert-ausente svg { width: 20px; height: 20px; flex-shrink: 0; color: #d97706; }

.alert-text { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.alert-text strong { font-size: var(--fs-sm); font-weight: var(--fw-bold); }
.alert-text span { font-size: var(--fs-xs); }

.btn-retirar {
  padding: 0.45rem 0.875rem;
  background: #d97706;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: background 0.15s;
}
.btn-retirar:hover:not(:disabled) { background: #b45309; }
.btn-retirar:disabled { opacity: 0.6; cursor: not-allowed; }

.page-card { background: var(--surface); border: 1px solid var(--border-soft); border-radius: 12px; overflow: hidden; }

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);
}

.header-text { display: flex; flex-direction: column; gap: 2px; }
.card-title { font-size: var(--fs-lg); font-weight: var(--fw-bold); color: var(--text-strong); font-family: var(--font-family-display); }
.card-subtitle { font-size: var(--fs-sm); color: var(--text-muted); }

.btn-open {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  background: var(--primary);
  color: #fff;
  border: none;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
  white-space: nowrap;
}
.btn-open svg { width: 14px; height: 14px; }
.btn-open:hover:not(:disabled) { background: var(--primary-dark); }
.btn-open:disabled { opacity: 0.5; cursor: not-allowed; }

.filters {
  display: flex;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);
  background: var(--surface-subtle);
  flex-wrap: wrap;
}

.filter-select, .filter-date {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: var(--fs-sm);
  font-family: inherit;
  background: var(--surface);
  color: var(--text);
  min-width: 0;
  box-sizing: border-box;
}
.filter-select { flex: 1; min-width: 180px; }
.filter-date { flex: 1; }

.filter-range {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

.filter-sep {
  font-size: var(--fs-xs);
  color: var(--text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-clear {
  padding: 0.5rem 0.875rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: var(--fs-sm);
  cursor: pointer;
  font-family: inherit;
  color: var(--text-soft);
  transition: background 0.15s;
}
.btn-clear:hover { background: var(--surface-subtle); color: var(--text); }

.table-wrap { overflow-x: auto; }

.table-feedback {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 2.5rem;
  color: var(--text-faint);
  font-size: var(--fs-sm);
}

.table-error { padding: 1.5rem 2.5rem; color: var(--error); font-size: var(--fs-sm); }

.table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 3rem;
  color: var(--text-faint);
  font-size: var(--fs-sm);
}
.table-empty svg { width: 36px; height: 36px; color: var(--border); }

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

.table { width: 100%; border-collapse: collapse; font-size: var(--fs-sm); }

.table th {
  text-align: left;
  padding: 0.75rem 1.5rem;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-soft);
  white-space: nowrap;
}

.table td {
  padding: 0.875rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);
  color: var(--text);
  vertical-align: middle;
}
.table tr:last-child td { border-bottom: none; }
.table tr:hover td { background: var(--surface-subtle); }

.td-policial { display: flex; flex-direction: column; gap: 1px; }
.officer-name { font-weight: var(--fw-semibold); color: var(--text-strong); }
.officer-rg { font-size: var(--fs-xs); color: var(--text-faint); }

.td-date { white-space: nowrap; }
.td-motivo { max-width: 280px; }

.badge-status {
  display: inline-flex;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  white-space: nowrap;
}
.badge-status.ativa { background: #fffbeb; color: #d97706; border: 1px solid #fcd34d; }
.badge-status.encerrada { background: var(--success-bg); color: var(--success); border: 1px solid #bbf7d0; }

.btn-encerrar {
  padding: 0.3rem 0.65rem;
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fcd34d;
  border-radius: 6px;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  font-family: inherit;
  transition: background 0.12s;
  white-space: nowrap;
}
.btn-encerrar:hover:not(:disabled) { background: #d97706; color: #fff; }
.btn-encerrar:disabled { opacity: 0.5; cursor: not-allowed; }

.no-action { color: var(--text-faint); }

@media (max-width: 600px) {
  .content { padding: 1rem; }
  .alert-ausente { flex-wrap: wrap; }
  .filters { flex-direction: column; padding: 0.75rem 1rem; gap: 0.5rem; }
  .filter-select { min-width: unset; width: 100%; }
  .filter-range { width: 100%; }
  .btn-clear { width: 100%; justify-content: center; text-align: center; }
}
</style>
