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
        title="Gerenciar Efetivo"
        breadcrumb="Gestão de Pessoal / Efetivo"
        :current-date="currentDate"
        :current-time="currentTime"
        :initials="initials"
        :user-name="auth.user?.name || ''"
        :role-label="roleLabel"
      />

      <main class="content">

        <!-- Card -->
        <div class="page-card">
          <div class="card-header">
            <h3 class="card-title">Gerenciamento do Efetivo</h3>
          </div>

          <!-- Tabs -->
          <div class="page-tabs">
            <button
              class="page-tab"
              :class="{ active: activeTab === 'ativos' }"
              @click="switchTab('ativos')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Efetivo Ativo
              <span v-if="store.ativos.length" class="tab-count">{{ store.ativos.length }}</span>
            </button>
            <button
              class="page-tab"
              :class="{ active: activeTab === 'exonerados' }"
              @click="switchTab('exonerados')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Exonerados
              <span v-if="store.exonerados.length" class="tab-count muted">{{ store.exonerados.length }}</span>
            </button>
          </div>

          <EfetivoAtivoTab
            v-if="activeTab === 'ativos'"
            :officers="store.ativos"
            :loading="store.loadingAtivos"
            @promover="openPromover"
            @advertencia="openAdvertencia"
            @exonerar="openExonerar"
            @ver-advertencias="openVerAdvertencias"
            @editar-cargo="openEditarCargo"
          />

          <ExoneradosTab
            v-else
            :officers="store.exonerados"
            :loading="store.loadingExonerados"
          />
        </div>

      </main>
    </div>
  </div>

  <!-- Modais -->
  <PromoverModal
    :open="modal.promover"
    :officer="selectedOfficer"
    :loading="store.actionLoading"
    @close="closeModals"
    @confirm="onPromover"
  />

  <AdvertenciaModal
    :open="modal.advertencia"
    :officer="selectedOfficer"
    :loading="store.actionLoading"
    @close="closeModals"
    @confirm="onAdvertencia"
  />

  <ExonerarModal
    :open="modal.exonerar"
    :officer="selectedOfficer"
    :loading="store.actionLoading"
    @close="closeModals"
    @confirm="onExonerar"
  />

  <VerAdvertenciasModal
    :open="modal.verAdvertencias"
    :officer="selectedOfficer"
    @close="closeModals"
  />

  <EditarCargoModal
    :open="modal.editarCargo"
    :officer="selectedOfficer"
    :loading="store.actionLoading"
    @close="closeModals"
    @confirm="onEditarCargo"
  />
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useGestaoEfetivoStore } from '@/stores/gestaoEfetivo'
import { useToastStore } from '@/stores/toast'
import { useClock } from '@/composables/useClock'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import EfetivoAtivoTab from '@/components/gestao/EfetivoAtivoTab.vue'
import ExoneradosTab from '@/components/gestao/ExoneradosTab.vue'
import PromoverModal from '@/components/gestao/PromoverModal.vue'
import AdvertenciaModal from '@/components/gestao/AdvertenciaModal.vue'
import ExonerarModal from '@/components/gestao/ExonerarModal.vue'
import VerAdvertenciasModal from '@/components/gestao/VerAdvertenciasModal.vue'
import EditarCargoModal from '@/components/gestao/EditarCargoModal.vue'

const auth = useAuthStore()
const store = useGestaoEfetivoStore()
const toast = useToastStore()
const route = useRoute()
const router = useRouter()
const { currentTime, currentDate } = useClock()

const activeTab = ref('ativos')
const selectedOfficer = ref(null)
const modal = reactive({ promover: false, advertencia: false, exonerar: false, verAdvertencias: false, editarCargo: false })

watch(() => store.actionError, (err) => {
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

onMounted(() => store.fetchAtivos())

function switchTab(tab) {
  activeTab.value = tab
  if (tab === 'exonerados' && store.exonerados.length === 0) store.fetchExonerados()
}

function openPromover(officer) { selectedOfficer.value = officer; modal.promover = true; store.actionError = null }
function openAdvertencia(officer) { selectedOfficer.value = officer; modal.advertencia = true; store.actionError = null }
function openExonerar(officer) { selectedOfficer.value = officer; modal.exonerar = true; store.actionError = null }
function openVerAdvertencias(officer) { selectedOfficer.value = officer; modal.verAdvertencias = true }
function openEditarCargo(officer) { selectedOfficer.value = officer; modal.editarCargo = true; store.actionError = null }

function closeModals() {
  modal.promover = false
  modal.advertencia = false
  modal.exonerar = false
  modal.verAdvertencias = false
  modal.editarCargo = false
}

async function onPromover(novaGraduacao) {
  try {
    await store.promover(selectedOfficer.value._id, novaGraduacao)
    closeModals()
    toast.show(`${selectedOfficer.value.name} promovido com sucesso.`)
  } catch {}
}

async function onAdvertencia(descricao) {
  try {
    await store.darAdvertencia(selectedOfficer.value._id, descricao)
    closeModals()
    toast.show(`Advertência registrada para ${selectedOfficer.value.name}.`)
  } catch {}
}

async function onEditarCargo(cargo) {
  try {
    await store.editarCargo(selectedOfficer.value._id, cargo)
    closeModals()
    toast.show(`Cargo de ${selectedOfficer.value.name} atualizado com sucesso.`)
  } catch {}
}

async function onExonerar() {
  try {
    const nome = selectedOfficer.value.name
    await store.exonerar(selectedOfficer.value._id)
    closeModals()
    toast.show(`${nome} foi exonerado.`)
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
  padding: 1.25rem 1.5rem 0;
}

.card-title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
}

.page-tabs {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid var(--border-soft);
  padding: 0 1.5rem;
  margin-top: 1rem;
}

.page-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1rem;
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

.page-tab svg { width: 15px; height: 15px; }

.page-tab:hover { color: var(--text-strong); }

.page-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.tab-count {
  font-size: var(--fs-xs);
  background: var(--surface-brand-soft);
  color: var(--primary);
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  font-weight: var(--fw-bold);
}

.tab-count.muted {
  background: var(--surface-subtle);
  color: var(--text-muted);
}

</style>
