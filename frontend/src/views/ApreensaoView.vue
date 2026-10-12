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
        title="Apreensões"
        breadcrumb="Operacional / Apreensões"
        :current-date="currentDate"
        :current-time="currentTime"
        :initials="initials"
        :user-name="auth.user?.name || ''"
        :role-label="roleLabel"
      />

      <main class="content">
        <TotaisCard :totais="store.totais" :loading="store.loading" :mes-label="periodoLabel" />

        <div class="ranks-section">
          <div class="section-heading">
            <h3 class="section-title">Rankings</h3>
            <div class="section-controls">
              <select v-model="selectedPeriodo" class="mes-select">
                <option v-for="opt in opcoesMes" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
              <button v-if="auth.isP3" class="btn-relatorio" @click="openRelatorio">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Relatório
              </button>
              <button v-if="auth.isP3" class="btn-relatorio" @click="modalSemanal = true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Relatório Semanal
              </button>
              <button class="btn-add" @click="modalAdicionar = true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Registrar Apreensão
              </button>
            </div>
          </div>

          <div class="ranks-top">
            <div class="page-card rank-card">
              <div class="card-header">
                <span class="card-title">Ranking Geral de Apreensões</span>
              </div>
              <RankList :items="store.rankGeral" :loading="store.loading" />
            </div>

            <div class="page-card rank-card">
              <div class="card-header">
                <span class="card-title">Ranking de Horas Patrulhadas</span>
              </div>
              <RankList :items="store.rankPatrulha" :loading="store.loading" :formatter="formatMinutos" />
            </div>

            <div class="page-card rank-card">
              <div class="card-header">
                <span class="card-title">Ranking de Dias Patrulhados</span>
              </div>
              <RankList :items="store.rankDias" :loading="store.loading" :formatter="formatDias" />
            </div>
          </div>

          <div class="ranks-items">
            <div v-for="item in ITENS_APREENSAO" :key="item.key" class="page-card rank-card">
              <div class="card-header">
                <span class="card-title">{{ item.label }}</span>
              </div>
              <RankList :items="store.rankPorItem[item.key]" :loading="store.loading" />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

  <AdicionarApreensaoModal
    :open="modalAdicionar"
    :loading="store.actionLoading"
    :user-viatura="userViatura"
    :error="store.actionError || ''"
    @close="modalAdicionar = false"
    @confirm="onRegistrar"
  />

  <RelatorioViaturasModal
    :open="modalRelatorio"
    :viaturas="store.relatorio"
    :loading="store.relatorioLoading"
    @close="modalRelatorio = false"
  />

  <RelatorioSemanalModal
    :open="modalSemanal"
    @close="modalSemanal = false"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useApreensaoStore } from '@/stores/apreensoes'
import { useViaturasStore } from '@/stores/viaturas'
import { useToastStore } from '@/stores/toast'
import { useClock } from '@/composables/useClock'
import { ITENS_APREENSAO } from '@/constants/apreensoes'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import TotaisCard from '@/components/apreensoes/TotaisCard.vue'
import RankList from '@/components/apreensoes/RankList.vue'
import AdicionarApreensaoModal from '@/components/apreensoes/AdicionarApreensaoModal.vue'
import RelatorioViaturasModal from '@/components/apreensoes/RelatorioViaturasModal.vue'
import RelatorioSemanalModal from '@/components/apreensoes/RelatorioSemanalModal.vue'

const auth = useAuthStore()
const store = useApreensaoStore()
const viaturas = useViaturasStore()
const toast = useToastStore()
const route = useRoute()
const router = useRouter()
const { currentTime, currentDate } = useClock()

const modalAdicionar = ref(false)
const modalRelatorio = ref(false)
const modalSemanal = ref(false)

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

const opcoesMes = computed(() => {
  const opts = []
  const now = new Date()
  for (let i = 0; i < 13; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    opts.push({
      value: `${d.getFullYear()}-${d.getMonth() + 1}`,
      label: `${MESES[d.getMonth()]} ${d.getFullYear()}`,
      mes: d.getMonth() + 1,
      ano: d.getFullYear(),
    })
  }
  return opts
})

const now = new Date()
const selectedPeriodo = ref(`${now.getFullYear()}-${now.getMonth() + 1}`)

const selectedOpt = computed(() => opcoesMes.value.find((o) => o.value === selectedPeriodo.value) ?? opcoesMes.value[0])
const periodoLabel = computed(() => selectedOpt.value.label)

watch(() => store.actionError, (err) => {
  if (err) toast.show(err, 'error')
})

watch(selectedPeriodo, () => {
  store.fetchStats(selectedOpt.value.mes, selectedOpt.value.ano)
})

const initials = computed(() => {
  const parts = (auth.user?.name || 'U').split(' ')
  return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0]
})

const roleLabel = computed(() => {
  const map = { admin: 'Administrador', supervisor: 'Supervisor', officer: 'Policial Militar' }
  return map[auth.user?.role] || ''
})

const userViatura = computed(() => {
  const uid = auth.user?.id
  if (!uid) return null
  return viaturas.ativas.find((v) =>
    ['motorista', 'chefeDeBarca', 'auxiliar1', 'auxiliar2', 'auxiliar3']
      .some((k) => v[k] && (v[k]._id ?? v[k]).toString() === uid),
  ) ?? null
})

function formatMinutos(mins) {
  const total = Math.round(mins)
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h > 0 && m > 0) return `${h}h ${m}min`
  if (h > 0) return `${h}h`
  return `${m}min`
}

function formatDias(dias) {
  return `${dias} dia${dias !== 1 ? 's' : ''}`
}

onMounted(() => {
  store.fetchStats(selectedOpt.value.mes, selectedOpt.value.ano)
  viaturas.fetchAtivas()
})

async function onRegistrar(payload) {
  try {
    await store.registrar(payload)
    store.fetchStats(selectedOpt.value.mes, selectedOpt.value.ano)
    modalAdicionar.value = false
    toast.show('Apreensão registrada com sucesso.')
  } catch {}
}

async function openRelatorio() {
  modalRelatorio.value = true
  await store.fetchRelatorio()
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
  gap: 1.5rem;
}

.page-card {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  overflow: hidden;
}

.ranks-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.section-title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
}

.section-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.mes-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: var(--fs-sm);
  color: var(--text);
  background: var(--surface);
  font-family: inherit;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;
}

.mes-select:focus { border-color: var(--primary); }

.btn-add {
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
}

.btn-add svg { width: 14px; height: 14px; }
.btn-add:hover { background: var(--primary-dark); }

.btn-relatorio {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  background: none;
  color: var(--text-soft);
  border: 1px solid var(--border);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, color 0.15s;
}

.btn-relatorio svg { width: 14px; height: 14px; }
.btn-relatorio:hover { background: var(--surface-subtle); color: var(--text-strong); }

.ranks-top {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.ranks-items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.rank-card .card-header {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--border-soft);
}

.rank-card .card-title {
  font-size: var(--fs-sm);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

@media (max-width: 768px) {
  .content { padding: 1.25rem 1rem; }

  .ranks-top,
  .ranks-items {
    grid-template-columns: 1fr;
  }

  .section-heading { flex-direction: column; align-items: flex-start; }
}
</style>
