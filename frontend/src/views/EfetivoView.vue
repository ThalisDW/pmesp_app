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
        title="Hierarquia"
        breadcrumb="Operacional / Efetivo"
        :current-date="currentDate"
        :current-time="currentTime"
        :initials="initials"
        :user-name="auth.user?.name || ''"
        :role-label="roleLabel"
      />

      <main class="content">

        <!-- Stats -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-icon blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ efetivo.total }}</span>
              <span class="stat-label">Total do Efetivo</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ efetivo.emPatrulha }}</span>
              <span class="stat-label">Em Patrulha</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon muted">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ efetivo.foraDe }}</span>
              <span class="stat-label">Fora de Serviço</span>
            </div>
          </div>
        </div>

        <!-- Table card -->
        <div class="table-card">
          <div class="table-toolbar">
            <div class="toolbar-left">
              <h3 class="table-title">Policiais Cadastrados</h3>
            </div>
            <div class="toolbar-right">
              <div class="search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  v-model="search"
                  type="text"
                  placeholder="Buscar por nome ou RG..."
                  class="search-input"
                />
              </div>

              <select v-model="filterCargo" class="filter-select">
                <option value="">Todos os cargos</option>
                <option v-for="cargo in CARGOS" :key="cargo.value" :value="cargo.value">
                  {{ cargo.label }}
                </option>
              </select>

              <select v-model="filterStatus" class="filter-select">
                <option value="">Todos os status</option>
                <option value="patrulhando">Em Patrulha</option>
                <option value="fora">Fora de Serviço</option>
              </select>
            </div>
          </div>

          <EfetivoTable :officers="filteredOfficers" :loading="efetivo.loading" />

          <div v-if="!efetivo.loading && efetivo.error" class="error-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {{ efetivo.error }}
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
import { useEfetivoStore } from '@/stores/efetivo'
import { useClock } from '@/composables/useClock'
import { CARGOS } from '@/constants/graduacoes'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import EfetivoTable from '@/components/efetivo/EfetivoTable.vue'

const auth = useAuthStore()
const efetivo = useEfetivoStore()
const route = useRoute()
const router = useRouter()
const { currentTime, currentDate } = useClock()

const search = ref('')
const filterCargo = ref('')
const filterStatus = ref('')

const initials = computed(() => {
  const parts = (auth.user?.name || 'U').split(' ')
  return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0]
})

const roleLabel = computed(() => {
  const map = { admin: 'Administrador', supervisor: 'Supervisor', officer: 'Policial Militar' }
  return map[auth.user?.role] || ''
})

const filteredOfficers = computed(() => {
  return (efetivo.officers ?? []).filter((o) => {
    const q = search.value.toLowerCase()
    const matchSearch =
      !q || o.name.toLowerCase().includes(q) || (o.rg || '').toLowerCase().includes(q)

    const matchCargo = !filterCargo.value || (Array.isArray(o.cargo) ? o.cargo.includes(filterCargo.value) : o.cargo === filterCargo.value)

    const matchStatus =
      !filterStatus.value ||
      (filterStatus.value === 'patrulhando' && o.patrulhando) ||
      (filterStatus.value === 'fora' && !o.patrulhando)

    return matchSearch && matchCargo && matchStatus
  })
})

function logout() {
  efetivo.clear()
  auth.logout()
  router.push('/login')
}

onMounted(() => efetivo.fetchAll())

watch(
  () => route.path,
  (path) => { if (path === '/efetivo') efetivo.fetchAll() }
)
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-light);
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.content {
  padding: 2rem 1.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Stats row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: var(--surface);
  border-radius: 12px;
  padding: 1.1rem 1.4rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-sm);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 20px;
  height: 20px;
}

.stat-icon.blue { background: var(--surface-info-soft); color: var(--primary); }
.stat-icon.green { background: var(--success-bg); color: var(--success); }
.stat-icon.muted { background: var(--surface-subtle); color: var(--text-muted); }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  line-height: 1;
  margin-bottom: 0.2rem;
}

.stat-label {
  font-size: var(--fs-sm);
  color: var(--text-faint);
}

/* Table card */
.table-card {
  background: var(--surface);
  border-radius: 12px;
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid var(--border-soft);
}

.table-title {
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

/* Search */
.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--surface-soft);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.4rem 0.75rem;
  transition: border-color 0.15s;
}

.search-box:focus-within {
  border-color: var(--primary-light);
}

.search-box svg {
  width: 14px;
  height: 14px;
  color: var(--text-faint);
  flex-shrink: 0;
}

.search-input {
  border: none;
  outline: none;
  background: transparent;
  color: var(--text);
  font-size: var(--fs-sm);
  width: 180px;
}

.search-input::placeholder {
  color: var(--text-faint);
}

/* Selects */
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
}

.filter-select:focus {
  border-color: var(--primary-light);
}

/* Error */
.error-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.25rem;
  background: var(--danger-soft);
  color: var(--error);
  font-size: var(--fs-sm);
  border-top: 1px solid var(--border-soft);
}

.error-bar svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .toolbar-right { width: 100%; }
  .search-input { width: 100%; }
}
</style>
