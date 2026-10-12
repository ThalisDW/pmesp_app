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
        title="Fardamentos"
        breadcrumb="Operacional / Fardamentos"
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
              <h3 class="card-title">Fardamentos</h3>
              <span v-if="!store.loading" class="card-subtitle">
                {{ store.fardamentos.length }} fardamento{{ store.fardamentos.length !== 1 ? 's' : '' }} cadastrado{{ store.fardamentos.length !== 1 ? 's' : '' }}
              </span>
            </div>
            <button v-if="auth.isP3" class="btn-open" @click="abrirCriar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Novo Fardamento
            </button>
          </div>

          <div v-if="store.loading" class="list-feedback">
            <div class="spinner" />
            <span>Carregando fardamentos...</span>
          </div>

          <div v-else-if="store.error" class="list-error">{{ store.error }}</div>

          <div v-else-if="store.fardamentos.length === 0" class="list-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>Nenhum fardamento cadastrado.</span>
          </div>

          <div v-else class="cards-grid">
            <FardamentoCard
              v-for="(f, i) in store.fardamentos"
              :key="f._id"
              :fardamento="f"
              :is-p3="auth.isP3"
              :is-first="i === 0"
              :is-last="i === store.fardamentos.length - 1"
              :action-loading="store.actionLoading"
              @editar="abrirEditar"
              @remover="onRemover"
              @mover-cima="onMover($event, 'cima')"
              @mover-baixo="onMover($event, 'baixo')"
            />
          </div>
        </div>
      </main>
    </div>
  </div>

  <CadastrarFardamentoModal
    :open="modalAbrir"
    :fardamento="fardamentoEditando"
    :loading="store.actionLoading"
    :error="store.actionError || ''"
    @close="fecharModal"
    @confirm="onConfirm"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFardamentosStore } from '@/stores/fardamentos'
import { useToastStore } from '@/stores/toast'
import { useClock } from '@/composables/useClock'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import FardamentoCard from '@/components/fardamentos/FardamentoCard.vue'
import CadastrarFardamentoModal from '@/components/fardamentos/CadastrarFardamentoModal.vue'

const auth = useAuthStore()
const store = useFardamentosStore()
const toast = useToastStore()
const route = useRoute()
const router = useRouter()
const { currentTime, currentDate } = useClock()

const modalAbrir = ref(false)
const fardamentoEditando = ref(null)

const initials = computed(() => {
  const parts = (auth.user?.name || 'U').split(' ')
  return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0]
})

const roleLabel = computed(() => {
  const map = { admin: 'Administrador', supervisor: 'Supervisor', officer: 'Policial Militar' }
  return map[auth.user?.role] || ''
})

onMounted(() => {
  store.fetchAll()
})

function abrirCriar() {
  fardamentoEditando.value = null
  modalAbrir.value = true
}

function abrirEditar(fardamento) {
  fardamentoEditando.value = fardamento
  modalAbrir.value = true
}

function fecharModal() {
  modalAbrir.value = false
  fardamentoEditando.value = null
  store.actionError = null
}

async function onConfirm(payload) {
  try {
    if (fardamentoEditando.value) {
      await store.atualizar(fardamentoEditando.value._id, payload)
      fecharModal()
      toast.show(`Fardamento "${payload.nome}" atualizado.`)
    } else {
      await store.criar(payload)
      fecharModal()
      toast.show(`Fardamento "${payload.nome}" criado.`)
    }
  } catch {}
}

async function onRemover(id) {
  const f = store.fardamentos.find(f => f._id === id)
  try {
    await store.remover(id)
    toast.show(`Fardamento "${f?.nome ?? ''}" removido.`)
  } catch {}
}

function onMover(id, direcao) {
  store.mover(id, direcao)
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
  white-space: nowrap;
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

.list-error {
  padding: 1.5rem;
  color: var(--error);
  font-size: var(--fs-sm);
}

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

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  padding: 1.25rem 1.5rem;
}

@media (max-width: 600px) {
  .content { padding: 1rem; }
  .cards-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem; padding: 0.75rem; }
}
</style>
