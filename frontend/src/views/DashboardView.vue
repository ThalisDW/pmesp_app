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
        title="Dashboard"
        breadcrumb="Início"
        :current-date="currentDate"
        :current-time="currentTime"
        :initials="initials"
        :user-name="auth.user?.name || ''"
        :role-label="roleLabel"
      />

      <main class="content">
        <div class="welcome-banner">
          <div class="welcome-text">
            <h2>Bem-vindo, {{ firstName }}!</h2>
            <p>{{ greeting }} Você está acessando o Sistema de Gerenciamento da PMESP.</p>
          </div>
          <div class="welcome-badge">
            <img src="@/assets/images/logo_ft.png" alt="Logo PMESP" />
          </div>
        </div>

        <!-- Stats cards -->
        <div class="stats-grid">
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
              <span class="stat-value">{{ efeivoEmServico === null ? '—' : efeivoEmServico }}</span>
              <span class="stat-label">Efetivo de Serviço</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ diasPatrulhadosUsuario === null ? '—' : diasPatrulhadosUsuario }}</span>
              <span class="stat-label">Meus Dias Patrulhados</span>
              <span v-if="minhaFlag" class="stat-flag" :class="minhaFlag">{{ flagLabel(minhaFlag) }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ viaturas.loading ? '—' : viaturas.count }}</span>
              <span class="stat-label">Viaturas em Patrulha</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ apStore.meusTurnos === null ? '—' : apStore.meusTurnos }}</span>
              <span class="stat-label">Meus Turnos no Mês</span>
            </div>
          </div>
        </div>

        <!-- Info box -->
        <div class="info-box">
          <div class="info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <p class="info-title">Sistema em implantação</p>
            <p class="info-desc">
              O sistema está em fase inicial. Os módulos de Ocorrências, Relatórios e Configurações
              serão disponibilizados em breve. Utilize o menu lateral para navegar quando os módulos forem liberados.
            </p>
          </div>
        </div>

        <!-- Rankings do Mês -->
        <div class="ranks-section">
          <div class="ranks-heading-row">
            <h3 class="ranks-heading">Rankings do Mês</h3>
            <RouterLink to="/apreensoes" class="btn-ver-todos">
              Ver rankings completos
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </RouterLink>
          </div>
          <div class="ranks-grid">
            <RankMiniCard
              title="Mais Apreensões"
              :items="apStore.rankGeral"
              :loading="apStore.loading"
            />
            <RankMiniCard
              title="Horas Patrulhadas"
              :items="apStore.rankPatrulha"
              :loading="apStore.loading"
              :formatter="formatMinutos"
            />
          </div>
        </div>

        <!-- Viaturas em Patrulha -->
        <div class="quadro-card">
          <div class="quadro-header">
            <h3 class="quadro-title">Viaturas em Patrulha</h3>
            <span class="viaturas-badge">
              {{ viaturas.loading ? '...' : `${viaturas.count} ativa${viaturas.count !== 1 ? 's' : ''}` }}
            </span>
          </div>

          <div v-if="viaturas.loading" class="viaturas-feedback">
            <div class="mini-spinner" />
            <span>Carregando...</span>
          </div>
          <div v-else-if="viaturas.ativas.length === 0" class="viaturas-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span>Nenhuma viatura em patrulha no momento.</span>
          </div>
          <div v-else class="viaturas-list">
            <ViaturaDropdown
              v-for="v in viaturas.ativas"
              :key="v._id"
              :viatura="v"
            />
          </div>
        </div>

        <!-- Quadro de Avisos / Boletins -->
        <div class="quadro-card">
          <div class="quadro-header">
            <h3 class="quadro-title">Quadro de Publicações</h3>
            <RouterLink v-if="auth.canEmitir" to="/emitir-boletim" class="quadro-action">
              + Emitir
            </RouterLink>
          </div>

          <div class="quadro-tabs">
            <button
              class="quadro-tab"
              :class="{ active: quadroTab === 'avisos' }"
              @click="switchTab('avisos')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              Avisos
              <span v-if="pub.hasUnseenAvisos && quadroTab !== 'avisos'" class="unseen-dot" />
            </button>
            <button
              class="quadro-tab"
              :class="{ active: quadroTab === 'boletins' }"
              @click="switchTab('boletins')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Boletins Internos
              <span v-if="pub.hasUnseenBoletins && quadroTab !== 'boletins'" class="unseen-dot" />
            </button>
          </div>

          <div class="tab-scroll">
            <AvisosTab v-if="quadroTab === 'avisos'" :avisos="pub.avisos" :loading="pub.loading" />
            <BoletinsTab v-else :boletins="pub.boletins" :loading="pub.loading" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useEfetivoStore } from '@/stores/efetivo'
import { usePublicacoesStore } from '@/stores/publicacoes'
import { useViaturasStore } from '@/stores/viaturas'
import { useApreensaoStore } from '@/stores/apreensoes'
import { useAtividadeStore } from '@/stores/atividade'
import { useClock } from '@/composables/useClock'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import AvisosTab from '@/components/dashboard/AvisosTab.vue'
import BoletinsTab from '@/components/dashboard/BoletinsTab.vue'
import ViaturaDropdown from '@/components/viaturas/ViaturaDropdown.vue'
import RankMiniCard from '@/components/dashboard/RankMiniCard.vue'

const auth = useAuthStore()
const efetivo = useEfetivoStore()
const pub = usePublicacoesStore()
const viaturas = useViaturasStore()
const apStore = useApreensaoStore()
const atividadeStore = useAtividadeStore()
const route = useRoute()
const router = useRouter()
const { currentTime, currentDate } = useClock()
const quadroTab = ref('avisos')

const firstName = computed(() => auth.user?.name?.split(' ')[0] || 'Policial')

const initials = computed(() => {
  const parts = (auth.user?.name || 'U').split(' ')
  return parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : parts[0][0]
})

const roleLabel = computed(() => {
  const map = { admin: 'Administrador', supervisor: 'Supervisor', officer: 'Policial Militar' }
  return map[auth.user?.role] || ''
})

const diasPatrulhadosUsuario = computed(() => {
  if (atividadeStore.minhaAtividadeLoading) return null
  return atividadeStore.minhaAtividade?.diasPatrulhados ?? 0
})

const minhaFlag = computed(() => atividadeStore.minhaAtividade?.flag ?? null)

const efeivoEmServico = computed(() => {
  if (viaturas.loading) return null
  const ids = new Set()
  for (const v of viaturas.ativas) {
    for (const field of ['motorista', 'chefeDeBarca', 'auxiliar1', 'auxiliar2', 'auxiliar3']) {
      if (v[field]) ids.add((v[field]._id ?? v[field]).toString())
    }
  }
  return ids.size
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia!'
  if (h < 18) return 'Boa tarde!'
  return 'Boa noite!'
})

function formatMinutos(mins) {
  const total = Math.round(mins)
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h > 0 && m > 0) return `${h}h ${m}min`
  if (h > 0) return `${h}h`
  return `${m}min`
}

function flagLabel(flag) {
  if (flag === 'apto') return 'Apto para Promoção'
  if (flag === 'ativo') return 'Ativo'
  return 'Inativo'
}

onMounted(async () => {
  await pub.fetchAll()
  viaturas.fetchAtivas()
  const now = new Date()
  const mes = now.getMonth() + 1
  const ano = now.getFullYear()
  apStore.fetchStats(mes, ano)
  apStore.fetchMeusTurnos(mes, ano)
  atividadeStore.fetchMinha()
  if (quadroTab.value === 'avisos') pub.markAvisosRead()
  else pub.markBoletinsRead()
})

function switchTab(tab) {
  quadroTab.value = tab
  if (tab === 'avisos') pub.markAvisosRead()
  else pub.markBoletinsRead()
}

function logout() {
  efetivo.clear()
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

/* Content */
.content {
  padding: 2rem 1.75rem;
  flex: 1;
}

/* Welcome banner */
.welcome-banner {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 1.75rem 2rem;
  margin-bottom: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text);
  position: relative;
  overflow: hidden;
}

.welcome-text h2 {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  margin-bottom: 0.4rem;
  color: var(--text-strong);
  font-family: var(--font-family-display);
  line-height: 1.2;
}

.welcome-text p {
  font-size: var(--fs-md);
  color: var(--text-soft);
  line-height: var(--lh-relaxed);
}

.welcome-badge img {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.welcome-badge {
  flex-shrink: 0;
  z-index: 2;
  width: 120px;
  height: 120px;
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.stat-card {
  background: var(--surface);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-soft);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 22px;
  height: 22px;
}

.stat-icon.blue {
  background: var(--surface-info-soft);
  color: var(--primary);
}

.stat-icon.red {
  background: var(--danger-soft);
  color: var(--error);
}

.stat-icon.green {
  background: var(--success-bg);
  color: var(--success);
}

.stat-icon.gold {
  background: var(--warning-soft);
  color: var(--warning);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  color: var(--text);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: var(--fs-sm);
  color: var(--text-faint);
}

.stat-flag {
  display: inline-flex;
  align-self: flex-start;
  margin-top: 0.35rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: var(--fs-2xs);
  font-weight: var(--fw-semibold);
  white-space: nowrap;
}
.stat-flag.apto { background: var(--success-bg); color: var(--success); border: 1px solid #bbf7d0; }
.stat-flag.ativo { background: var(--surface-brand-soft); color: var(--primary); border: 1px solid var(--primary-light); }
.stat-flag.inativo { background: var(--error-bg); color: var(--error); border: 1px solid #fca5a5; }

/* Info box */
.info-box {
  background: var(--surface-soft);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.info-icon {
  color: var(--primary);
  flex-shrink: 0;
  margin-top: 1px;
}

.info-icon svg {
  width: 20px;
  height: 20px;
}

.info-title {
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
  margin-bottom: 0.3rem;
}

.info-desc {
  font-size: var(--fs-md);
  color: var(--text-soft);
  line-height: var(--lh-relaxed);
}

/* Rankings */
.ranks-section { margin-top: 1.75rem; }

.ranks-heading-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ranks-heading {
  font-size: var(--fs-lg);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
}

.btn-ver-todos {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--primary);
  text-decoration: none;
  padding: 0.3rem 0.8rem;
  border: 1px solid var(--primary-light);
  border-radius: 6px;
  transition: background 0.15s;
}

.btn-ver-todos svg { width: 13px; height: 13px; }
.btn-ver-todos:hover { background: var(--surface-brand-soft); }

.ranks-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 600px) {
  .ranks-grid { grid-template-columns: 1fr; }
}

/* Viaturas */
.viaturas-badge {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  background: var(--success-bg);
  color: var(--success);
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  border: 1px solid #bbf7d0;
}

.viaturas-feedback {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1.5rem;
  color: var(--text-faint);
  font-size: var(--fs-sm);
}

.mini-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }

.viaturas-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2.5rem;
  color: var(--text-faint);
  font-size: var(--fs-sm);
}

.viaturas-empty svg { width: 36px; height: 36px; color: var(--border); }

.viaturas-list { display: flex; flex-direction: column; }

/* Quadro de publicações */
.quadro-card {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.75rem;
}

.quadro-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.quadro-title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
}

.quadro-action {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--primary);
  text-decoration: none;
  padding: 0.3rem 0.8rem;
  border: 1px solid var(--primary-light);
  border-radius: 6px;
  transition: background 0.15s;
}

.quadro-action:hover {
  background: var(--surface-brand-soft);
}

.quadro-tabs {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid var(--border-soft);
  margin-bottom: 0;
}

.quadro-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  margin-bottom: -1px;
  font-family: inherit;
}

.quadro-tab svg {
  width: 14px;
  height: 14px;
}

.quadro-tab:hover {
  color: var(--text-strong);
}

.quadro-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.tab-scroll {
  max-height: 680px;
  overflow-y: auto;
}

.unseen-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: var(--error);
  border-radius: 50%;
  margin-left: 4px;
  flex-shrink: 0;
  vertical-align: middle;
}

</style>
