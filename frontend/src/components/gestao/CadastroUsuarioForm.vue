<template>
  <form class="cadastro-form" @submit.prevent="submit">
    <div class="form-grid">

      <!-- Nome -->
      <div class="field">
        <label class="field-label" for="nome">Nome completo <span class="required">*</span></label>
        <input
          id="nome"
          v-model="form.name"
          type="text"
          class="field-input"
          :class="{ error: errors.name }"
          placeholder="Ex: Hugo Amorim"
          autocomplete="off"
        />
        <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
      </div>

      <!-- RG -->
      <div class="field">
        <label class="field-label" for="rg">RG <span class="required">*</span></label>
        <input
          id="rg"
          v-model="form.rg"
          type="text"
          class="field-input"
          :class="{ error: errors.rg }"
          placeholder="Ex: 5436"
          autocomplete="off"
        />
        <span v-if="errors.rg" class="field-error">{{ errors.rg }}</span>
      </div>

      <!-- Graduação -->
      <div class="field">
        <label class="field-label" for="graduacao">Graduação <span class="required">*</span></label>
        <select id="graduacao" v-model="form.graduacao" class="field-input" :class="{ error: errors.graduacao }">
          <option value="" disabled>Selecione a graduação</option>
          <optgroup v-for="grupo in graduacaoGroups" :key="grupo.label" :label="grupo.label">
            <option v-for="g in grupo.items" :key="g.value" :value="g.value">
              {{ g.nickPrefix }} {{ g.label }}
            </option>
          </optgroup>
        </select>
        <span v-if="errors.graduacao" class="field-error">{{ errors.graduacao }}</span>
      </div>

      <!-- Cargo -->
      <div class="field">
        <label class="field-label" for="cargo">Cargo</label>
        <select id="cargo" v-model="form.cargo" class="field-input">
          <option v-for="c in CARGOS" :key="c.value" :value="c.value">{{ c.label }}</option>
        </select>
      </div>

      <!-- Usuário -->
      <div class="field field-full">
        <label class="field-label" for="username">Usuário de acesso <span class="required">*</span></label>
        <div class="input-prefix-wrap">
          <span class="input-prefix">@</span>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="field-input has-prefix"
            :class="{ error: errors.username }"
            placeholder="usuario.acesso"
            autocomplete="off"
          />
        </div>
        <span v-if="errors.username" class="field-error">{{ errors.username }}</span>
        <span class="field-hint">Apenas letras minúsculas, números e pontos. Mínimo 3 caracteres.</span>
      </div>

    </div>

    <!-- Preview do nome de exibição -->
    <div v-if="form.name && form.rg && form.graduacao" class="preview-box">
      <span class="preview-label">Nome exibido no sistema</span>
      <span class="preview-display">{{ previewDisplayName }}</span>
    </div>

    <!-- Error -->
    <div v-if="error" class="form-error-bar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {{ error }}
    </div>

    <div class="form-actions">
      <button type="submit" class="btn-primary" :disabled="loading">
        <span v-if="loading" class="btn-spinner" />
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
        {{ loading ? 'Cadastrando...' : 'Cadastrar Policial' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { CARGOS, GRADUACOES, buildDisplayName } from '@/constants/graduacoes'

const props = defineProps({
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
})

const emit = defineEmits(['submit'])

const form = reactive({
  name: '',
  rg: '',
  username: '',
  graduacao: '',
  cargo: 'padrao',
})

const errors = reactive({
  name: '',
  rg: '',
  username: '',
  graduacao: '',
})

const graduacaoGroups = computed(() => {
  const groups = {}
  for (const g of GRADUACOES) {
    if (!groups[g.grupo]) groups[g.grupo] = { label: g.grupo, items: [] }
    groups[g.grupo].items.push(g)
  }
  return Object.values(groups)
})

const previewDisplayName = computed(() =>
  buildDisplayName(form.name, form.rg, form.graduacao)
)

function validate() {
  errors.name = form.name.trim() ? '' : 'Nome é obrigatório'
  errors.rg = form.rg.trim() ? '' : 'RG é obrigatório'
  errors.graduacao = form.graduacao ? '' : 'Selecione uma graduação'

  const u = form.username.trim()
  if (!u) {
    errors.username = 'Usuário é obrigatório'
  } else if (u.length < 3) {
    errors.username = 'Mínimo 3 caracteres'
  } else if (!/^[a-z0-9.]+$/.test(u)) {
    errors.username = 'Apenas letras minúsculas, números e pontos'
  } else {
    errors.username = ''
  }

  return !errors.name && !errors.rg && !errors.graduacao && !errors.username
}

function submit() {
  if (!validate()) return
  emit('submit', {
    name: form.name.trim(),
    rg: form.rg.trim(),
    username: form.username.trim(),
    graduacao: form.graduacao,
    cargo: form.cargo,
  })
}
</script>

<style scoped>
.cadastro-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-full {
  grid-column: 1 / -1;
}

.field-label {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

.required {
  color: var(--error);
}

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
}

.field-input:focus {
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgb(42 82 152 / 10%);
}

.field-input.error {
  border-color: var(--error);
}

.field-input.has-prefix {
  border-radius: 0 8px 8px 0;
  border-left: none;
}

.input-prefix-wrap {
  display: flex;
  align-items: stretch;
}

.input-prefix {
  display: flex;
  align-items: center;
  padding: 0 0.7rem;
  background: var(--surface-subtle);
  border: 1px solid var(--border);
  border-right: none;
  border-radius: 8px 0 0 8px;
  font-size: var(--fs-md);
  color: var(--text-muted);
  font-weight: var(--fw-semibold);
}

.field-error {
  font-size: var(--fs-xs);
  color: var(--error);
}

.field-hint {
  font-size: var(--fs-xs);
  color: var(--text-faint);
}

/* Preview */
.preview-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--surface-brand-soft);
  border: 1px solid var(--border-soft);
  border-radius: 8px;
}

.preview-label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.preview-display {
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  color: var(--primary);
}

/* Error bar */
.form-error-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--danger-soft);
  color: var(--error);
  font-size: var(--fs-sm);
  border-radius: 8px;
  border: 1px solid #fca5a5;
}

.form-error-bar svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

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

.btn-primary:hover:not(:disabled) {
  background: var(--primary-light);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary svg {
  width: 16px;
  height: 16px;
}

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

@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
  .field-full { grid-column: 1; }
}
</style>
