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
        title="Emitir Publicação"
        breadcrumb="Emitir Publicação"
        :current-date="currentDate"
        :current-time="currentTime"
        :initials="initials"
        :user-name="auth.user?.name || ''"
        :role-label="roleLabel"
      />

      <main class="content">

        <!-- Page Tabs -->
        <div class="page-tabs">
          <button
            v-if="auth.canPostBoletim"
            class="page-tab"
            :class="{ active: activeTab === 'boletim' }"
            @click="activeTab = 'boletim'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Boletim Interno
          </button>

          <button
            v-if="auth.canPostAviso"
            class="page-tab"
            :class="{ active: activeTab === 'aviso' }"
            @click="activeTab = 'aviso'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Emitir Aviso
          </button>
        </div>

        <!-- Boletim Interno Form -->
        <div v-if="activeTab === 'boletim' && auth.canPostBoletim" class="form-card">
          <div class="form-header">
            <div class="form-header-badge">BOLETIM INTERNO</div>
            <p class="form-header-desc">Preencha as partes do boletim. Deixe em branco para manter "Sem alterações."</p>
          </div>

          <div v-if="successMsg" class="success-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {{ successMsg }}
          </div>

          <div v-if="pub.submitError" class="error-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {{ pub.submitError }}
          </div>

          <form class="boletim-form" @submit.prevent="submitBoletim">
            <div class="part-field">
              <label class="part-label">
                <span class="part-num">1ª PARTE</span>
                <span class="part-name">Serviços Diários</span>
              </label>
              <textarea
                v-model="boletimForm.parte1"
                class="part-textarea"
                placeholder="Sem alterações."
                rows="3"
              />
            </div>

            <div class="part-field">
              <label class="part-label">
                <span class="part-num">2ª PARTE</span>
                <span class="part-name">Instrução e Operações Policiais</span>
              </label>
              <textarea
                v-model="boletimForm.parte2"
                class="part-textarea"
                placeholder="Sem alterações."
                rows="3"
              />
            </div>

            <div class="part-field">
              <label class="part-label">
                <span class="part-num">3ª PARTE</span>
                <span class="part-name">Assuntos Gerais e Administrativos</span>
              </label>
              <textarea
                v-model="boletimForm.parte3"
                class="part-textarea"
                placeholder="Sem alterações."
                rows="3"
              />
            </div>

            <div class="part-field">
              <label class="part-label">
                <span class="part-num">4ª PARTE</span>
                <span class="part-name">Justiça e Disciplina</span>
              </label>
              <textarea
                v-model="boletimForm.parte4"
                class="part-textarea"
                placeholder="Sem alterações."
                rows="3"
              />
            </div>

            <div class="form-preview">
              <span class="preview-label">ASSINA</span>
              <span class="preview-value">{{ auth.user?.name }}</span>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="pub.submitting">
                <span v-if="pub.submitting" class="btn-spinner" />
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                {{ pub.submitting ? 'Emitindo...' : 'Emitir Boletim' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Aviso Form -->
        <div v-if="activeTab === 'aviso' && auth.canPostAviso" class="form-card">
          <div class="form-header">
            <div class="form-header-badge warning">AVISO</div>
            <p class="form-header-desc">Emita um aviso para todo o efetivo.</p>
          </div>

          <div v-if="avisoSuccess" class="success-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {{ avisoSuccess }}
          </div>

          <div v-if="pub.submitError" class="error-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {{ pub.submitError }}
          </div>

          <form class="aviso-form" @submit.prevent="submitAviso">
            <div class="field">
              <label class="field-label">Título <span class="required">*</span></label>
              <input
                v-model="avisoForm.titulo"
                type="text"
                class="field-input"
                :class="{ error: avisoErrors.titulo }"
                placeholder="Ex: Operação Especial — 20/04"
                autocomplete="off"
              />
              <span v-if="avisoErrors.titulo" class="field-error">{{ avisoErrors.titulo }}</span>
            </div>

            <div class="field">
              <label class="field-label">Conteúdo <span class="required">*</span></label>
              <textarea
                v-model="avisoForm.conteudo"
                class="field-input"
                :class="{ error: avisoErrors.conteudo }"
                placeholder="Descreva o aviso..."
                rows="5"
              />
              <span v-if="avisoErrors.conteudo" class="field-error">{{ avisoErrors.conteudo }}</span>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary warning" :disabled="pub.submitting">
                <span v-if="pub.submitting" class="btn-spinner" />
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                </svg>
                {{ pub.submitting ? 'Emitindo...' : 'Emitir Aviso' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Sem permissão -->
        <div v-if="!auth.canEmitir" class="no-permission">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
          <p>Sem permissão para emitir publicações.</p>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePublicacoesStore } from '@/stores/publicacoes'
import { useClock } from '@/composables/useClock'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'

const auth = useAuthStore()
const pub = usePublicacoesStore()
const route = useRoute()
const router = useRouter()
const { currentTime, currentDate } = useClock()

const activeTab = ref(auth.canPostBoletim ? 'boletim' : 'aviso')
const successMsg = ref('')
const avisoSuccess = ref('')

const boletimForm = reactive({ parte1: '', parte2: '', parte3: '', parte4: '' })
const avisoForm = reactive({ titulo: '', conteudo: '' })
const avisoErrors = reactive({ titulo: '', conteudo: '' })

const initials = computed(() => {
  const parts = (auth.user?.name || 'U').split(' ')
  return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0]
})

const roleLabel = computed(() => {
  const map = { admin: 'Administrador', supervisor: 'Supervisor', officer: 'Policial Militar' }
  return map[auth.user?.role] || ''
})

async function submitBoletim() {
  successMsg.value = ''
  pub.submitError = null
  try {
    await pub.criarPublicacao({
      tipo: 'boletim',
      parte1: boletimForm.parte1 || 'Sem alterações.',
      parte2: boletimForm.parte2 || 'Sem alterações.',
      parte3: boletimForm.parte3 || 'Sem alterações.',
      parte4: boletimForm.parte4 || 'Sem alterações.',
    })
    boletimForm.parte1 = ''
    boletimForm.parte2 = ''
    boletimForm.parte3 = ''
    boletimForm.parte4 = ''
    successMsg.value = 'Boletim interno emitido com sucesso!'
  } catch {}
}

function validateAviso() {
  avisoErrors.titulo = avisoForm.titulo.trim() ? '' : 'Título obrigatório'
  avisoErrors.conteudo = avisoForm.conteudo.trim() ? '' : 'Conteúdo obrigatório'
  return !avisoErrors.titulo && !avisoErrors.conteudo
}

async function submitAviso() {
  avisoSuccess.value = ''
  pub.submitError = null
  if (!validateAviso()) return
  try {
    await pub.criarPublicacao({
      tipo: 'aviso',
      titulo: avisoForm.titulo.trim(),
      conteudo: avisoForm.conteudo.trim(),
    })
    avisoForm.titulo = ''
    avisoForm.conteudo = ''
    avisoSuccess.value = 'Aviso emitido com sucesso!'
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
  max-width: 860px;
}

/* Page Tabs */
.page-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-soft);
  padding-bottom: 0;
}

.page-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  font-size: var(--fs-md);
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

.page-tab svg {
  width: 16px;
  height: 16px;
}

.page-tab:hover {
  color: var(--text-strong);
}

.page-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

/* Form card */
.form-card {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 1.75rem;
}

.form-header {
  margin-bottom: 1.5rem;
}

.form-header-badge {
  display: inline-block;
  font-size: var(--fs-xs);
  font-weight: var(--fw-bold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary);
  background: var(--surface-brand-soft);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.form-header-badge.warning {
  color: var(--warning);
  background: var(--warning-soft);
}

.form-header-desc {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

/* Boletim parts */
.boletim-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.part-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.part-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.part-num {
  font-size: var(--fs-xs);
  font-weight: var(--fw-bold);
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.part-name {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

.part-textarea {
  border: 1px solid var(--border);
  background: var(--surface-soft);
  color: var(--text);
  font-size: var(--fs-sm);
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  outline: none;
  resize: vertical;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: inherit;
  line-height: var(--lh-relaxed);
}

.part-textarea:focus {
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgb(42 82 152 / 10%);
}

.form-preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--surface-soft);
  border: 1px solid var(--border-soft);
  border-radius: 8px;
}

.preview-label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-bold);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.preview-value {
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  font-style: italic;
  color: var(--text);
}

/* Aviso form */
.aviso-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

.required { color: var(--error); }

.field-input {
  border: 1px solid var(--border);
  background: var(--surface-soft);
  color: var(--text);
  font-size: var(--fs-md);
  padding: 0.55rem 0.8rem;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: inherit;
  resize: vertical;
}

.field-input:focus {
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgb(42 82 152 / 10%);
}

.field-input.error { border-color: var(--error); }
.field-error { font-size: var(--fs-xs); color: var(--error); }

/* Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.5rem;
  background: var(--primary);
  color: #fff;
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
  font-family: inherit;
}

.btn-primary svg { width: 16px; height: 16px; }

.btn-primary:hover:not(:disabled) { background: var(--primary-light); }

.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-primary.warning { background: var(--warning); }
.btn-primary.warning:hover:not(:disabled) { background: var(--accent-light); }

.btn-spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgb(255 255 255 / 40%);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Feedback bars */
.success-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--success-bg);
  color: var(--success);
  font-size: var(--fs-sm);
  border-radius: 8px;
  border: 1px solid #bbf7d0;
  margin-bottom: 1rem;
}

.error-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--danger-soft);
  color: var(--error);
  font-size: var(--fs-sm);
  border-radius: 8px;
  border: 1px solid #fca5a5;
  margin-bottom: 1rem;
}

.success-bar svg, .error-bar svg { width: 16px; height: 16px; flex-shrink: 0; }

/* No permission */
.no-permission {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 4rem;
  color: var(--text-faint);
  font-size: var(--fs-md);
}

.no-permission svg { width: 40px; height: 40px; color: var(--border); }

</style>
