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
        title="Frota de Viaturas"
        breadcrumb="Gestão Operacional / Frota"
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
              <h3 class="card-title">Frota de Viaturas</h3>
              <span v-if="!frota.loading" class="card-subtitle">
                {{ frota.veiculos.length }} veículo{{ frota.veiculos.length !== 1 ? 's' : '' }} cadastrado{{ frota.veiculos.length !== 1 ? 's' : '' }}
              </span>
            </div>
            <button v-if="auth.isP3" class="btn-open" @click="abrirCadastrar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Cadastrar Veículo
            </button>
          </div>

          <div v-if="frota.loading" class="list-feedback">
            <div class="spinner" />
            <span>Carregando frota...</span>
          </div>

          <div v-else-if="frota.veiculos.length === 0" class="list-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span>Nenhum veículo cadastrado.</span>
          </div>

          <div v-else class="veiculos-list">
            <VeiculoCard
              v-for="v in frota.veiculos"
              :key="v._id"
              :veiculo="v"
              :action-loading="frota.actionLoading"
              :is-p3="auth.isP3"
              @editar="abrirEditar"
              @remover="onRemover"
            />
          </div>
        </div>
      </main>
    </div>
  </div>

  <CadastrarVeiculoModal
    :open="modalAbrir"
    :veiculo="veiculoEditando"
    :loading="frota.actionLoading"
    :error="frota.actionError || ''"
    @close="fecharModal"
    @confirm="onConfirm"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFrotaStore } from '@/stores/frota'
import { useToastStore } from '@/stores/toast'
import { useClock } from '@/composables/useClock'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import VeiculoCard from '@/components/frota/VeiculoCard.vue'
import CadastrarVeiculoModal from '@/components/frota/CadastrarVeiculoModal.vue'

const auth = useAuthStore()
const frota = useFrotaStore()
const toast = useToastStore()
const route = useRoute()
const router = useRouter()
const { currentTime, currentDate } = useClock()

const modalAbrir = ref(false)
const veiculoEditando = ref(null)

watch(() => frota.actionError, (err) => {
  if (err) toast.show(err, 'error')
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
  frota.fetchVeiculos()
})

function abrirCadastrar() {
  veiculoEditando.value = null
  modalAbrir.value = true
}

function abrirEditar(veiculo) {
  veiculoEditando.value = veiculo
  modalAbrir.value = true
}

function fecharModal() {
  modalAbrir.value = false
  veiculoEditando.value = null
}

async function onConfirm(payload) {
  try {
    if (veiculoEditando.value) {
      await frota.atualizar(veiculoEditando.value._id, payload)
      fecharModal()
      toast.show(`Veículo ${payload.modelo} atualizado.`)
    } else {
      await frota.criar(payload)
      fecharModal()
      toast.show(`Veículo ${payload.modelo} cadastrado.`)
    }
  } catch {}
}

async function onRemover(id) {
  const v = frota.veiculos.find((v) => v._id === id)
  try {
    await frota.remover(id)
    toast.show(`Veículo ${v?.modelo ?? ''} removido.`)
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

.veiculos-list {
  display: flex;
  flex-direction: column;
}
</style>
