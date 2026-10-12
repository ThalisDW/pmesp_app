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
        title="Gestão de Pessoal"
        breadcrumb="RH / Cadastrar Policial"
        :current-date="currentDate"
        :current-time="currentTime"
        :initials="initials"
        :user-name="auth.user?.name || ''"
        :role-label="roleLabel"
      />

      <main class="content">

        <div class="page-header">
          <div class="page-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <div>
            <h2 class="page-title">Cadastrar Policial</h2>
            <p class="page-sub">Registre um novo membro no sistema. Uma senha temporária será gerada para o primeiro acesso.</p>
          </div>
        </div>

        <div class="form-card">
          <div class="card-header">
            <span class="card-label">NOVO CADASTRO</span>
            <span class="card-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Acesso restrito — RH
            </span>
          </div>

          <CadastroUsuarioForm
            v-if="!gestao.lastCreated"
            :loading="gestao.loading"
            :error="gestao.error"
            @submit="handleSubmit"
          />

          <SenhaTempCard
            v-else
            :user="gestao.lastCreated.user"
            :temp-password="gestao.lastCreated.tempPassword"
            @novo="gestao.resetLastCreated()"
          />
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useGestaoStore } from '@/stores/gestao'
import { useEfetivoStore } from '@/stores/efetivo'
import { useClock } from '@/composables/useClock'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import CadastroUsuarioForm from '@/components/gestao/CadastroUsuarioForm.vue'
import SenhaTempCard from '@/components/gestao/SenhaTempCard.vue'

const auth = useAuthStore()
const gestao = useGestaoStore()
const efetivo = useEfetivoStore()
const route = useRoute()
const router = useRouter()
const { currentTime, currentDate } = useClock()

const initials = computed(() => {
  const parts = (auth.user?.name || 'U').split(' ')
  return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0]
})

const roleLabel = computed(() => {
  const map = { admin: 'Administrador', supervisor: 'Supervisor', officer: 'Policial Militar' }
  return map[auth.user?.role] || ''
})

async function handleSubmit(data) {
  await gestao.criarUsuario(data)
  if (gestao.lastCreated) efetivo.fetchAll()
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

.content {
  padding: 2rem 1.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 760px;
}

/* Page header */
.page-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.page-header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--surface-brand-soft);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid var(--border-soft);
}

.page-header-icon svg {
  width: 22px;
  height: 22px;
}

.page-title {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
  line-height: 1.2;
}

.page-sub {
  font-size: var(--fs-md);
  color: var(--text-soft);
  margin-top: 0.3rem;
  line-height: var(--lh-relaxed);
}

/* Form card */
.form-card {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);
  background: var(--surface-soft);
}

.card-label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.card-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--primary);
  background: var(--surface-brand-soft);
  border: 1px solid var(--border-soft);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.card-badge svg {
  width: 11px;
  height: 11px;
}

:deep(.cadastro-form),
:deep(.senha-card) {
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .content { max-width: 100%; }
}
</style>
