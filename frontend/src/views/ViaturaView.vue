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
        title="Registro de Turno"
        breadcrumb="Operacional / Registro de Turno"
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
              <h3 class="card-title">Viaturas em Patrulha</h3>
              <span v-if="!store.loading" class="card-subtitle">
                {{ store.ativas.length }} viatura{{ store.ativas.length !== 1 ? 's' : '' }} ativa{{ store.ativas.length !== 1 ? 's' : '' }}
              </span>
            </div>
            <button class="btn-open" @click="modalAbrir = true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Abrir Viatura
            </button>
          </div>

          <div v-if="store.loading" class="list-feedback">
            <div class="spinner" />
            <span>Carregando viaturas...</span>
          </div>

          <div v-else-if="store.ativas.length === 0" class="list-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span>Nenhuma viatura em patrulha.</span>
          </div>

          <div v-else class="viaturas-list">
            <ViaturaDropdown
              v-for="v in store.ativas"
              :key="v._id"
              :viatura="v"
              show-encerrar
              show-edit
              :action-loading="store.actionLoading"
              @encerrar="openEncerrar"
              @edit-crew="openEditar"
            />
          </div>
        </div>
      </main>
    </div>
  </div>

  <AbrirViaturaModal
    :open="modalAbrir"
    :loading="store.actionLoading"
    :officers="efetivo.officers"
    :prefixos="frota.prefixosDisponiveis"
    :error="store.actionError || ''"
    @close="modalAbrir = false"
    @confirm="onAbrir"
  />

  <EncerrarViaturaModal
    :open="!!selectedViatura"
    :viatura="selectedViatura"
    :loading="store.actionLoading"
    @close="selectedViatura = null"
    @confirm="onEncerrar"
  />

  <EditarTripulacaoModal
    :open="!!selectedViaturaEditar"
    :viatura="selectedViaturaEditar"
    :loading="store.actionLoading"
    :officers="efetivo.officers"
    :error="store.actionError || ''"
    @close="selectedViaturaEditar = null"
    @confirm="onEditarTripulacao"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useViaturasStore } from '@/stores/viaturas'
import { useEfetivoStore } from '@/stores/efetivo'
import { useFrotaStore } from '@/stores/frota'
import { useToastStore } from '@/stores/toast'
import { useClock } from '@/composables/useClock'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import ViaturaDropdown from '@/components/viaturas/ViaturaDropdown.vue'
import AbrirViaturaModal from '@/components/viaturas/AbrirViaturaModal.vue'
import EncerrarViaturaModal from '@/components/viaturas/EncerrarViaturaModal.vue'
import EditarTripulacaoModal from '@/components/viaturas/EditarTripulacaoModal.vue'

const auth = useAuthStore()
const store = useViaturasStore()
const efetivo = useEfetivoStore()
const frota = useFrotaStore()
const toast = useToastStore()
const route = useRoute()
const router = useRouter()
const { currentTime, currentDate } = useClock()

const modalAbrir = ref(false)
const selectedViatura = ref(null)
const selectedViaturaEditar = ref(null)

watch(() => store.actionError, (err) => {
  if (err) toast.show(err, 'error')
})

watch(modalAbrir, (val) => {
  if (val) {
    efetivo.fetchAll()
    frota.fetchPrefixosDisponiveis()
  }
})

const initials = computed(() => {
  const parts = (auth.user?.name || 'U').split(' ')
  return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0]
})

const roleLabel = computed(() => {
  const map = { admin: 'Administrador', supervisor: 'Supervisor', officer: 'Policial Militar' }
  return map[auth.user?.role] || ''
})

onMounted(() => {
  store.fetchAtivas()
  if (efetivo.officers.length === 0) efetivo.fetchAll()
})

function openEncerrar(viaturaId) {
  selectedViatura.value = store.ativas.find((v) => v._id === viaturaId) ?? null
}

function openEditar(viatura) {
  selectedViaturaEditar.value = viatura
}

async function onAbrir(payload) {
  try {
    const v = await store.abrirViatura(payload)
    modalAbrir.value = false
    toast.show(`Viatura ${v.prefixo} aberta com sucesso.`)
  } catch {}
}

async function onEncerrar() {
  const prefixo = selectedViatura.value?.prefixo
  const id = selectedViatura.value?._id
  try {
    await store.encerrarViatura(id)
    selectedViatura.value = null
    toast.show(`Viatura ${prefixo} encerrada.`)
  } catch {}
}

async function onEditarTripulacao(crew) {
  const id = selectedViaturaEditar.value?._id
  const prefixo = selectedViaturaEditar.value?.prefixo
  try {
    await store.editarTripulacao(id, crew)
    selectedViaturaEditar.value = null
    toast.show(`Tripulação da ${prefixo} atualizada.`)
  } catch {}
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
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card-title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
}

.card-subtitle {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

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
}

.btn-open svg { width: 14px; height: 14px; }
.btn-open:hover { background: var(--primary-dark); }

.list-feedback {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 2.5rem;
  color: var(--text-faint);
  font-size: var(--fs-md);
}

.spinner {
  width: 22px;
  height: 22px;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }

.list-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 3.5rem 3rem;
  color: var(--text-faint);
  font-size: var(--fs-md);
}

.list-empty svg {
  width: 42px;
  height: 42px;
  color: var(--border);
}

.viaturas-list {
  display: flex;
  flex-direction: column;
}

</style>
