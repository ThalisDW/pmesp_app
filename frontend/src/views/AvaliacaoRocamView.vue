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
        title="Avaliações ROCAM"
        :breadcrumb="breadcrumb"
        :current-date="currentDate"
        :current-time="currentTime"
        :initials="initials"
        :user-name="auth.user?.name || ''"
        :role-label="roleLabel"
      />

      <main class="content">
        <div class="page-card">

          <!-- Header -->
          <div class="card-header">
            <div>
              <h3 class="card-title">Avaliações ROCAM</h3>
              <p class="card-sub">{{ cardSubtitle }}</p>
            </div>
            <button v-if="canCreateRocam" class="btn-criar" @click="openCriar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Criar Avaliação
            </button>
          </div>

          <!-- Filtros (não rocam) -->
          <div v-if="!isRocam" class="filters-bar">
            <div class="filter-group">
              <label class="filter-label">De:</label>
              <input type="date" v-model="filters.dataInicio" class="filter-input" />
              <label class="filter-label">Até:</label>
              <input type="date" v-model="filters.dataFim" class="filter-input" />
            </div>

            <template v-if="isP1">
              <div class="filter-group">
                <label class="filter-label">Nota:</label>
                <input
                  type="number"
                  min="0" max="10"
                  v-model.number="filters.nota_min"
                  placeholder="Mín"
                  class="filter-input filter-input-sm"
                />
                <span class="filter-sep">–</span>
                <input
                  type="number"
                  min="0" max="10"
                  v-model.number="filters.nota_max"
                  placeholder="Máx"
                  class="filter-input filter-input-sm"
                />
              </div>

              <div class="filter-group">
                <select v-model="filters.avaliadorId" class="filter-select">
                  <option value="">Todos avaliadores</option>
                  <option v-for="a in store.avaliadores" :key="a._id" :value="a._id">{{ a.name }}</option>
                </select>
                <select v-model="filters.avaliadoId" class="filter-select">
                  <option value="">Todos os ROCAM</option>
                  <option v-for="m in store.membros" :key="m._id" :value="m._id">{{ m.name }}</option>
                </select>
              </div>
            </template>

            <button class="btn-limpar" @click="limparFiltros">Limpar</button>
          </div>

          <!-- Tabela -->
          <BaseTable
            :loading="store.loading"
            :is-empty="!store.loading && store.avaliacoes.length === 0"
            loading-text="Carregando avaliações..."
            empty-text="Nenhuma avaliação encontrada."
          >
            <template #empty-icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </template>

            <template #head>
              <th>Data</th>
              <th v-if="isP1">Avaliador</th>
              <th v-if="!isRocam">Avaliado</th>
              <th class="col-center">Nota</th>
              <th>Avaliação</th>
              <th>Ponto de Atenção</th>
            </template>

            <template #body>
              <tr v-for="av in store.avaliacoes" :key="av._id">
                <td class="td-date">{{ formatDate(av.createdAt) }}</td>
                <td v-if="isP1">
                  <div class="person-cell">
                    <span class="person-name">{{ av.avaliadorNome }}</span>
                    <span class="person-rg">RG {{ av.avaliadorRg }}</span>
                  </div>
                </td>
                <td v-if="!isRocam">
                  <div class="person-cell">
                    <span class="person-name">{{ av.avaliadoNome }}</span>
                    <span class="person-rg">RG {{ av.avaliadoRg }}</span>
                  </div>
                </td>
                <td class="col-center">
                  <span class="nota-badge" :class="notaBadgeClass(av.nota)">{{ av.nota }}</span>
                </td>
                <td class="td-trunc" :title="av.avaliacao">{{ av.avaliacao || '—' }}</td>
                <td class="td-trunc" :title="av.pontoAtencao">{{ av.pontoAtencao || '—' }}</td>
              </tr>
            </template>
          </BaseTable>

          <!-- Paginação -->
          <div v-if="store.pages > 1" class="pagination">
            <button class="page-btn" :disabled="store.page <= 1" @click="goPage(store.page - 1)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Anterior
            </button>
            <span class="page-info">
              Página {{ store.page }} de {{ store.pages }}
              <span class="page-total">({{ store.total }} registros)</span>
            </span>
            <button class="page-btn" :disabled="store.page >= store.pages" @click="goPage(store.page + 1)">
              Próxima
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

        </div>
      </main>
    </div>
  </div>

  <CriarAvaliacaoRocamModal
    :open="modalCriar"
    :membros="store.membros"
    :loading="store.actionLoading"
    :error="store.actionError"
    @close="modalCriar = false"
    @confirm="onCriar"
  />
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAvaliacaoRocamStore } from '@/stores/avaliacaoRocam'
import { useToastStore } from '@/stores/toast'
import { useClock } from '@/composables/useClock'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import CriarAvaliacaoRocamModal from '@/components/gestao/CriarAvaliacaoRocamModal.vue'

const auth = useAuthStore()
const store = useAvaliacaoRocamStore()
const toast = useToastStore()
const route = useRoute()
const router = useRouter()
const { currentTime, currentDate } = useClock()

const canCreateRocam = computed(() =>
  auth.user?.cargo?.includes('bracal_rocam') || auth.isRh
)
const isRocam = computed(() =>
  auth.user?.cargo?.includes('rocam') && !auth.user?.cargo?.includes('bracal_rocam') && !auth.isRh
)
const isP1 = computed(() => auth.isRh)

const modalCriar = ref(false)

const filters = reactive({
  dataInicio: '',
  dataFim: '',
  nota_min: '',
  nota_max: '',
  avaliadorId: '',
  avaliadoId: '',
})

let debounceTimer = null
watch(
  filters,
  () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => store.fetchAvaliacoes({ page: 1, ...filters }), 350)
  },
  { deep: true }
)

watch(() => store.actionError, (err) => { if (err) toast.show(err, 'error') })

const initials = computed(() => {
  const parts = (auth.user?.name || 'U').split(' ')
  return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0]
})

const roleLabel = computed(() => {
  const map = { admin: 'Administrador', supervisor: 'Supervisor', officer: 'Policial Militar' }
  return map[auth.user?.role] || ''
})

const breadcrumb = computed(() => {
  if (isRocam.value) return 'ROCAM / Minhas Avaliações'
  if (isP1.value) return 'Gestão de Pessoal / Avaliações ROCAM'
  return 'ROCAM / Avaliações Realizadas'
})

const cardSubtitle = computed(() => {
  if (isRocam.value) return 'Suas avaliações recebidas como Estágio ROCAM.'
  if (isP1.value) return 'Todas as avaliações ROCAM do efetivo.'
  return 'Avaliações ROCAM que você realizou como Braçal.'
})

onMounted(async () => {
  await Promise.all([
    store.fetchAvaliacoes({ page: 1 }),
    store.fetchMembros(),
  ])
})

function goPage(p) {
  store.fetchAvaliacoes({ page: p, ...filters })
}

function limparFiltros() {
  Object.assign(filters, { dataInicio: '', dataFim: '', nota_min: '', nota_max: '', avaliadorId: '', avaliadoId: '' })
}

function openCriar() {
  store.actionError = null
  modalCriar.value = true
}

async function onCriar(payload) {
  try {
    await store.criar(payload)
    modalCriar.value = false
    toast.show('Avaliação registrada com sucesso.')
    store.fetchAvaliacoes({ page: 1, ...filters })
  } catch {}
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function notaBadgeClass(nota) {
  if (nota <= 3) return 'badge-danger'
  if (nota <= 6) return 'badge-warning'
  return 'badge-success'
}

function logout() {
  auth.logout()
  router.push('/login')
}
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
  gap: 1rem;
}

.page-card {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem 1rem;
}

.card-title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
}

.card-sub {
  font-size: var(--fs-sm);
  color: var(--text-faint);
  margin-top: 0.2rem;
}

.btn-criar {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.1rem;
  background: var(--primary);
  color: #fff;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-criar svg { width: 15px; height: 15px; }
.btn-criar:hover { background: var(--primary-light); }

/* Filters */
.filters-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-top: 1px solid var(--border-soft);
  border-bottom: 1px solid var(--border-soft);
  background: var(--surface-subtle);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.filter-label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--text-soft);
  white-space: nowrap;
}

.filter-sep {
  color: var(--text-faint);
  font-size: var(--fs-sm);
}

.filter-input {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: var(--fs-sm);
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  outline: none;
  font-family: inherit;
}

.filter-input:focus { border-color: var(--primary-light); }

.filter-input-sm { width: 70px; }

.filter-select {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: var(--fs-sm);
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  outline: none;
  font-family: inherit;
  max-width: 200px;
}

.filter-select:focus { border-color: var(--primary-light); }

.btn-limpar {
  margin-left: auto;
  padding: 0.35rem 0.8rem;
  background: none;
  border: 1px solid var(--border);
  color: var(--text-soft);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
}

.btn-limpar:hover { background: var(--surface); }

/* Table cells */
.td-date {
  white-space: nowrap;
  color: var(--text-soft);
  font-size: var(--fs-sm);
}

.person-cell {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.person-name {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

.person-rg {
  font-size: var(--fs-xs);
  color: var(--text-faint);
}

.col-center { text-align: center; }

.nota-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: var(--fs-sm);
  font-weight: var(--fw-bold);
}

.nota-badge.badge-danger { background: var(--danger-soft); color: var(--error); }
.nota-badge.badge-warning { background: var(--warning-soft); color: var(--warning); }
.nota-badge.badge-success { background: var(--success-bg); color: var(--success); }

.td-trunc {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--fs-sm);
  color: var(--text);
  cursor: default;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-soft);
}

.page-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.8rem;
  background: none;
  border: 1px solid var(--border);
  color: var(--text-soft);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
}

.page-btn svg { width: 14px; height: 14px; }
.page-btn:hover:not(:disabled) { background: var(--surface-subtle); color: var(--text-strong); }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.page-info {
  font-size: var(--fs-sm);
  color: var(--text-soft);
}

.page-total {
  font-size: var(--fs-xs);
  color: var(--text-faint);
  margin-left: 0.3rem;
}
</style>
