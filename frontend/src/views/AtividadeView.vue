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
        title="Registro de Atividade"
        breadcrumb="Gestão de Pessoal / Registro de Atividade"
        :current-date="currentDate"
        :current-time="currentTime"
        :initials="initials"
        :user-name="auth.user?.name || ''"
        :role-label="roleLabel"
      />

      <main class="content">
        <div class="page-card">
          <div class="card-header">
            <div class="header-text">
              <h3 class="card-title">Registro de Atividade</h3>
              <span v-if="!store.loading" class="card-subtitle">
                {{ mesLabel }} · {{ store.totalWeekdays }} dias úteis contabilizados
              </span>
            </div>
            <div class="header-actions">
              <select v-model="filterMonth" class="filter-select">
                <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
              </select>
              <button class="btn-refresh" :disabled="store.loading" @click="store.fetchAll(parsedMonth.mes, parsedMonth.ano)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                Atualizar
              </button>
            </div>
          </div>

          <div class="legend">
            <span class="leg-item">
              <span class="badge-flag apto">Apto para Promoção</span>
              ≥ 60% dos dias úteis
            </span>
            <span class="leg-item">
              <span class="badge-flag ativo">Ativo</span>
              40% – 59%
            </span>
            <span class="leg-item">
              <span class="badge-flag inativo">Inativo</span>
              &lt; 40%
            </span>
          </div>

          <div v-if="store.loading" class="table-feedback">
            <div class="spinner" />
            Carregando registro de atividade...
          </div>
          <div v-else-if="store.error" class="table-error">{{ store.error }}</div>
          <div v-else-if="store.efetivo.length === 0" class="table-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            Nenhum policial ativo cadastrado.
          </div>
          <div v-else class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Policial</th>
                  <th>Graduação</th>
                  <th>Cargo</th>
                  <th class="col-center">Dias Patrulhados</th>
                  <th class="col-center">Ausência</th>
                  <th>Cumprimento</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="o in sortedEfetivo" :key="o._id">
                  <td class="td-policial">
                    <div class="officer-name-row">
                      <span class="officer-name">{{ o.name }}</span>
                      <span v-if="o.ausente" class="badge-ausente">Ausente</span>
                    </div>
                    <span class="officer-rg">RG {{ o.rg }}</span>
                  </td>
                  <td>
                    <div class="grad-cell">
                      <span class="grad-prefix">{{ getGraduacaoPrefix(o.graduacao) }}</span>
                      <span class="grad-label">{{ getGraduacaoLabel(o.graduacao) }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="cargo-badges">
                      <span
                        v-for="c in normalizeCargo(o.cargo)"
                        :key="c"
                        class="cargo-badge"
                        :class="`cargo-${c}`"
                      >{{ getCargoLabel(c) }}</span>
                    </div>
                  </td>
                  <td class="col-center">
                    <div class="days-cell">
                      <span class="days-count">{{ o.diasPatrulhados }}</span>
                      <span
                        v-if="o.diasPatrulhados > o.diasUteisPatrulhados"
                        class="days-bonus"
                        :title="`${o.diasPatrulhados - o.diasUteisPatrulhados} dia(s) de fim de semana`"
                      >
                        +{{ o.diasPatrulhados - o.diasUteisPatrulhados }} FDS
                      </span>
                    </div>
                    <span class="days-meta">{{ o.diasUteisPatrulhados }} úteis / {{ o.totalWeekdays }}</span>
                  </td>
                  <td class="col-center">
                    <span v-if="o.diasAusencia > 0" class="ausencia-count">{{ o.diasAusencia }}d</span>
                    <span v-else class="days-none">—</span>
                  </td>
                  <td class="td-progress">
                    <div class="progress-wrap">
                      <div class="progress-bar">
                        <div
                          class="progress-fill"
                          :class="o.flag"
                          :style="{ width: `${Math.min(o.percentual, 100)}%` }"
                        />
                      </div>
                      <span class="progress-pct">{{ o.percentual }}%</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge-flag" :class="o.flag">
                      {{ flagLabel(o.flag) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAtividadeStore } from '@/stores/atividade'
import { useClock } from '@/composables/useClock'
import { GRADUACOES, CARGOS } from '@/constants/graduacoes'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'

const auth = useAuthStore()
const store = useAtividadeStore()
const route = useRoute()
const router = useRouter()
const { currentTime, currentDate } = useClock()

const now = new Date()
const filterMonth = ref(`${now.getMonth() + 1}-${now.getFullYear()}`)

const months = computed(() => {
  const result = []
  const d = new Date()
  for (let i = 0; i < 13; i++) {
    const date = new Date(d.getFullYear(), d.getMonth() - i, 1)
    const mes = date.getMonth() + 1
    const ano = date.getFullYear()
    result.push({
      value: `${mes}-${ano}`,
      label: date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      mes,
      ano,
    })
  }
  return result
})

const parsedMonth = computed(() => {
  const [mes, ano] = filterMonth.value.split('-').map(Number)
  return { mes, ano }
})

const initials = computed(() => {
  const parts = (auth.user?.name || 'U').split(' ')
  return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0]
})

const roleLabel = computed(() => {
  const map = { admin: 'Administrador', supervisor: 'Supervisor', officer: 'Policial Militar' }
  return map[auth.user?.role] || ''
})

const mesLabel = computed(() => {
  const { mes, ano } = parsedMonth.value
  return new Date(ano, mes - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
})

const sortedEfetivo = computed(() => {
  return [...(store.efetivo ?? [])].sort((a, b) => {
    const ga = parseInt(a.graduacao) || 99
    const gb = parseInt(b.graduacao) || 99
    if (ga !== gb) return ga - gb
    return a.name.localeCompare(b.name)
  })
})

function getGraduacaoLabel(v) { return GRADUACOES.find((g) => g.value === v)?.label ?? v }
function getGraduacaoPrefix(v) { return GRADUACOES.find((g) => g.value === v)?.nickPrefix ?? '' }
function getCargoLabel(v) { return CARGOS.find((c) => c.value === v)?.label ?? (v || 'Padrão') }
function normalizeCargo(cargo) { return Array.isArray(cargo) ? cargo : [cargo] }

function flagLabel(flag) {
  if (flag === 'apto') return 'Apto para Promoção'
  if (flag === 'ativo') return 'Ativo'
  return 'Inativo'
}

watch(filterMonth, () => {
  const { mes, ano } = parsedMonth.value
  store.fetchAll(mes, ano)
})

onMounted(() => {
  const { mes, ano } = parsedMonth.value
  store.fetchAll(mes, ano)
})

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout { display: flex; min-height: 100vh; background: var(--bg-light); }
.main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.content { padding: 2rem 1.75rem; flex: 1; display: flex; flex-direction: column; gap: 1rem; }

.page-card { background: var(--surface); border: 1px solid var(--border-soft); border-radius: 12px; overflow: hidden; }

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);
  gap: 1rem;
}

.header-text { display: flex; flex-direction: column; gap: 2px; }
.card-title { font-size: var(--fs-lg); font-weight: var(--fw-bold); color: var(--text-strong); font-family: var(--font-family-display); }
.card-subtitle { font-size: var(--fs-sm); color: var(--text-muted); text-transform: capitalize; }

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.filter-select {
  border: 1px solid var(--border);
  background: var(--surface-soft);
  color: var(--text);
  font-size: var(--fs-sm);
  padding: 0.4rem 0.7rem;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;
  text-transform: capitalize;
}
.filter-select:focus { border-color: var(--primary-light); }

.cargo-badges { display: flex; flex-wrap: wrap; gap: 0.3rem; }

.btn-refresh {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.875rem;
  background: var(--surface-subtle);
  color: var(--text-soft);
  border: 1px solid var(--border);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
  white-space: nowrap;
  flex-shrink: 0;
}
.btn-refresh svg { width: 14px; height: 14px; }
.btn-refresh:hover:not(:disabled) { background: var(--surface); color: var(--text); }
.btn-refresh:disabled { opacity: 0.5; cursor: not-allowed; }

.legend {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);
  background: var(--surface-subtle);
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

.leg-item { display: flex; align-items: center; gap: 0.4rem; }

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

.table-wrap { overflow-x: auto; }

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

.col-center { text-align: center; }

.td-policial { display: flex; flex-direction: column; gap: 2px; }
.officer-name-row { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
.officer-name { font-weight: var(--fw-semibold); color: var(--text-strong); }
.officer-rg { font-size: var(--fs-xs); color: var(--text-faint); }

.badge-ausente {
  font-size: var(--fs-2xs);
  font-weight: var(--fw-semibold);
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fcd34d;
  white-space: nowrap;
}

.ausencia-count {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: #d97706;
}

.days-none { color: var(--text-faint); font-size: var(--fs-sm); }

.grad-cell { display: flex; align-items: center; gap: 0.35rem; white-space: nowrap; }
.grad-prefix { font-size: var(--fs-md); line-height: 1; }
.grad-label { font-size: var(--fs-sm); color: var(--text); }

.cargo-badge {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--border-soft);
  background: var(--surface-subtle);
  color: var(--text-soft);
  white-space: nowrap;
}
.cargo-badge.cargo-p1 { background: var(--surface-brand-soft); color: var(--primary); border-color: var(--primary-light); }
.cargo-badge.cargo-p3 { background: var(--warning-soft); color: var(--warning); border-color: var(--accent-light); }
.cargo-badge.cargo-p5 { background: var(--success-bg); color: var(--success); border-color: #bbf7d0; }
.cargo-badge.cargo-estagio { background: var(--danger-soft); color: var(--error); border-color: var(--error); }

.days-cell { display: flex; align-items: center; justify-content: center; gap: 0.35rem; }
.days-count { font-weight: var(--fw-bold); color: var(--text-strong); font-size: var(--fs-md); }
.days-bonus {
  font-size: var(--fs-2xs);
  font-weight: var(--fw-semibold);
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fcd34d;
  white-space: nowrap;
  cursor: default;
}
.days-meta { font-size: var(--fs-xs); color: var(--text-faint); display: block; margin-top: 1px; }

.td-progress { min-width: 140px; }

.progress-wrap { display: flex; align-items: center; gap: 0.5rem; }

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--surface-subtle);
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid var(--border-soft);
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}
.progress-fill.apto { background: var(--success); }
.progress-fill.ativo { background: var(--primary-light); }
.progress-fill.inativo { background: var(--error); }

.progress-pct { font-size: var(--fs-xs); color: var(--text-muted); white-space: nowrap; min-width: 32px; }

.badge-flag {
  display: inline-flex;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  white-space: nowrap;
}
.badge-flag.apto { background: var(--success-bg); color: var(--success); border: 1px solid #bbf7d0; }
.badge-flag.ativo { background: var(--surface-brand-soft); color: var(--primary); border: 1px solid var(--primary-light); }
.badge-flag.inativo { background: var(--error-bg); color: var(--error); border: 1px solid #fca5a5; }

@media (max-width: 600px) {
  .content { padding: 1rem; }
  .legend { gap: 0.75rem; padding: 0.75rem 1rem; }
}
</style>
