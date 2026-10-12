<template>
  <div class="page">
    <header class="topbar">
      <div class="brand">
        <div class="brand-icon">
          <img src="@/assets/images/logo-pmsp.png" alt="Logo PMESP" />
        </div>
        <div class="brand-text">
          <span class="brand-unit">PMESP • RP</span>
          <span class="brand-name">Centro de Comando</span>
        </div>
      </div>
      <span class="back-link">Protocolo de primeiro acesso</span>
    </header>

    <div class="layout">
      <section class="left-col">
        <div class="status-tag">
          <span class="status-dot" />
          TROCA OBRIGATÓRIA DE CREDENCIAL
        </div>
        <h1 class="heading">
          <span class="h-black">Segurança</span>
          <span class="h-blue">Inicial</span>
        </h1>
        <p class="heading-sub">
          No primeiro acesso, a senha provisória deve ser substituída para habilitar o uso do sistema.
          A nova credencial ficará vinculada à sua identificação institucional.
        </p>
        <ul class="features">
          <li>Nova senha criptografada e vinculada ao seu cadastro.</li>
          <li>Validação imediata para liberar os módulos operacionais.</li>
          <li>Ação auditada para conformidade de acesso.</li>
        </ul>
      </section>

      <section class="right-col">
        <div class="card">
          <div class="card-header">
            <span class="card-label">PRIMEIRO ACESSO</span>
            <span class="card-restricted">RESTRITO</span>
          </div>

          <h2 class="card-title">Definir nova senha</h2>
          <p class="card-desc">Finalize a ativação da sua conta para continuar.</p>

          <div class="user-info">
            <span class="user-label">Usuário</span>
            <span class="user-name">{{ auth.user?.name }}</span>
            <span class="user-role">{{ roleLabel }}</span>
          </div>

          <form @submit.prevent="handleSubmit" novalidate>
            <div class="field">
              <label for="newPassword">Nova Senha</label>
              <div class="input-wrap">
                <input
                  id="newPassword"
                  v-model="form.newPassword"
                  :type="show.new ? 'text' : 'password'"
                  placeholder="Mínimo 8 caracteres"
                  :disabled="loading"
                  required
                />
                <button type="button" class="toggle-pwd" @click="show.new = !show.new">
                  <EyeIcon :open="show.new" />
                </button>
              </div>
              <div v-if="form.newPassword" class="strength-bar">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="strength-segment"
                  :class="{ active: strength >= i, [`level-${strength}`]: strength >= i }"
                />
              </div>
              <p v-if="form.newPassword" class="strength-label" :class="`level-${strength}`">
                {{ strengthLabel }}
              </p>
            </div>

            <div class="field">
              <label for="confirmPassword">Confirmar Nova Senha</label>
              <div class="input-wrap">
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  :type="show.confirm ? 'text' : 'password'"
                  placeholder="Repita a nova senha"
                  :disabled="loading"
                  required
                />
                <button type="button" class="toggle-pwd" @click="show.confirm = !show.confirm">
                  <EyeIcon :open="show.confirm" />
                </button>
              </div>
              <p v-if="form.confirmPassword && form.newPassword !== form.confirmPassword" class="hint-error">
                As senhas não coincidem
              </p>
              <p v-if="form.confirmPassword && form.newPassword === form.confirmPassword" class="hint-ok">
                Senhas coincidem
              </p>
            </div>

            <div class="rules">
              <p class="rules-title">A senha deve conter:</p>
              <ul>
                <li :class="{ ok: rules.length }">Mínimo 8 caracteres</li>
                <li :class="{ ok: rules.upper }">Letra maiúscula</li>
                <li :class="{ ok: rules.number }">Número</li>
                <li :class="{ ok: rules.special }">Caractere especial (!@#$%...)</li>
              </ul>
            </div>

            <Transition name="alert-fade">
              <div v-if="error" class="alert-error">{{ error }}</div>
            </Transition>

            <Transition name="alert-fade">
              <div v-if="successMsg" class="alert-success">{{ successMsg }}</div>
            </Transition>

            <button
              type="submit"
              class="btn-submit"
              :disabled="loading || !canSubmit"
            >
              <span v-if="loading" class="spinner" />
              {{ loading ? 'Salvando...' : 'Definir Nova Senha' }}
            </button>
          </form>

          <p class="card-footer-line">CANAL CRIPTOGRAFADO • SESSÃO TEMPORÁRIA • CONEXÃO SEGURA</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useApi } from '@/composables/useApi'

const EyeIcon = {
  props: ['open'],
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px">
      <template v-if="!open">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </template>
      <template v-else>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </template>
    </svg>
  `,
}

const router = useRouter()
const auth = useAuthStore()
const api = useApi()

const form = reactive({ newPassword: '', confirmPassword: '' })
const show = reactive({ new: false, confirm: false })
const loading = ref(false)
const error = ref('')
const successMsg = ref('')

const rules = computed(() => ({
  length: form.newPassword.length >= 8,
  upper: /[A-Z]/.test(form.newPassword),
  number: /[0-9]/.test(form.newPassword),
  special: /[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword),
}))

const strength = computed(() => Object.values(rules.value).filter(Boolean).length)

const strengthLabel = computed(() => {
  const labels = { 1: 'Muito fraca', 2: 'Fraca', 3: 'Boa', 4: 'Forte' }
  return labels[strength.value] || ''
})

const canSubmit = computed(
  () =>
    form.newPassword.length >= 8 &&
    form.newPassword === form.confirmPassword
)

const roleLabel = computed(() => {
  const map = { admin: 'Administrador', supervisor: 'Supervisor', officer: 'Policial' }
  return map[auth.user?.role] || ''
})

async function handleSubmit() {
  loading.value = true
  error.value = ''
  successMsg.value = ''
  try {
    await api.post('/api/auth/change-password', {
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword,
    })
    auth.markFirstAccessDone()
    successMsg.value = 'Senha definida com sucesso! Redirecionando...'
    setTimeout(() => router.push('/'), 1500)
  } catch (err) {
    error.value = err.message || 'Erro ao alterar senha'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg-light);
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 56px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.brand-icon img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-unit {
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.brand-name {
  font-size: 0.825rem;
  font-weight: 600;
  color: var(--text);
}

.back-link {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.layout {
  flex: 1;
  display: flex;
}

.left-col {
  flex: 1;
  padding: 3rem 2.75rem 2rem 5rem;
  background: #eef0f4;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.3rem 0.875rem;
  font-size: 0.65rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1.6rem;
  background: var(--surface);
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--error);
}

.heading {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
  margin-bottom: 1.25rem;
}

.h-black,
.h-blue {
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.h-black {
  color: #0f172a;
}

.h-blue {
  color: var(--primary);
  text-decoration: underline;
  text-decoration-color: var(--error);
  text-underline-offset: 8px;
}

.heading-sub {
  max-width: 520px;
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 1.3rem;
}

.features {
  list-style: disc;
  color: #374151;
  margin-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.right-col {
  width: 500px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  background: var(--surface);
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 4px 24px rgb(0 0 0 / 6%);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.card-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.card-restricted {
  font-size: 0.65rem;
  color: var(--error);
  background: var(--error-bg);
  border: 1px solid #fecaca;
  border-radius: 999px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.6rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.3rem;
}

.card-desc {
  font-size: 0.825rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8fafc;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 1rem;
}

.user-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.user-name {
  font-weight: 600;
  color: var(--primary);
  flex: 1;
}

.user-role {
  font-size: 0.75rem;
  background: var(--primary);
  color: var(--surface);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

/* Fields */
.field {
  margin-bottom: 1.25rem;
}

.field label {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.5rem;
}

.input-wrap {
  position: relative;
}

.input-wrap input {
  width: 100%;
  padding: 0.7rem 2.6rem 0.7rem 0.9rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--text);
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.input-wrap input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgb(37 99 235 / 10%);
  background: var(--surface);
}

.input-wrap input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-pwd {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}

.toggle-pwd:hover {
  color: #374151;
}

/* Strength */
.strength-bar {
  display: flex;
  gap: 4px;
  margin-top: 6px;
}

.strength-segment {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  transition: background 0.3s;
}

.strength-segment.active.level-1 { background: #ef4444; }
.strength-segment.active.level-2 { background: #f97316; }
.strength-segment.active.level-3 { background: #eab308; }
.strength-segment.active.level-4 { background: #22c55e; }

.strength-label {
  font-size: 0.75rem;
  margin-top: 4px;
}

.strength-label.level-1 { color: #ef4444; }
.strength-label.level-2 { color: #f97316; }
.strength-label.level-3 { color: #eab308; }
.strength-label.level-4 { color: #22c55e; }

.hint-error {
  font-size: 0.75rem;
  color: var(--error);
  margin-top: 4px;
}

.hint-ok {
  font-size: 0.75rem;
  color: var(--success);
  margin-top: 4px;
}

/* Rules */
.rules {
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  padding: 0.875rem 1rem;
  margin-bottom: 1.25rem;
}

.rules-title {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.rules ul {
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.3rem;
}

.rules li {
  font-size: 0.78rem;
  color: var(--text-muted);
  padding-left: 1.2rem;
  position: relative;
  transition: color 0.2s;
}

.rules li::before {
  content: '○';
  position: absolute;
  left: 0;
  font-size: 0.6rem;
}

.rules li.ok {
  color: var(--success);
}

.rules li.ok::before {
  content: '●';
  color: var(--success);
}

/* Alerts */
.alert-error,
.alert-success {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.alert-error {
  background: var(--error-bg);
  border: 1px solid #fecaca;
  color: var(--error);
}

.alert-success {
  background: var(--success-bg);
  border: 1px solid #bbf7d0;
  color: var(--success);
}

/* Submit */
.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background: #2563eb;
  color: var(--surface);
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgb(37 99 235 / 35%);
}

.btn-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgb(255 255 255 / 30%);
  border-top-color: var(--surface);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: all 0.25s ease;
}
.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.card-footer-line {
  margin-top: 0.9rem;
  text-align: center;
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
}

@media (max-width: 900px) {
  .layout {
    flex-direction: column;
  }

  .left-col {
    padding: 2rem 1.5rem 1rem;
  }

  .h-black,
  .h-blue {
    font-size: 2.8rem;
  }

  .right-col {
    width: 100%;
    padding: 1rem 1.5rem 2rem;
  }
}
</style>
