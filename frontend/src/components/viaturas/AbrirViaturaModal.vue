<template>
  <BaseModal :open="open" title="Abrir Viatura" max-width="560px" @close="$emit('close')">
    <div v-if="prefixos.length === 0" class="no-prefixos">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
      <span>Nenhum prefixo disponível. Cadastre veículos na Frota de Viaturas.</span>
    </div>

    <div class="fields-row">
      <div class="field">
        <label class="field-label">Prefixo <span class="req">*</span></label>
        <select v-model="form.prefixo" class="field-select" :disabled="prefixos.length === 0">
          <option value="">— Selecionar —</option>
          <option v-for="p in prefixos" :key="p.prefixo" :value="p.prefixo">
            {{ p.prefixo }} — {{ p.modelo }} {{ p.ano }}
          </option>
        </select>
      </div>
      <div class="field field--grow">
        <label class="field-label">Observação</label>
        <input
          v-model="form.observacao"
          class="field-input"
          placeholder="Opcional..."
          maxlength="200"
        />
      </div>
    </div>

    <div class="section-label">Tripulação</div>

    <div class="roles-grid">
      <div v-for="role in ROLES" :key="role.key" class="field">
        <label class="field-label">
          {{ role.label }}
          <span v-if="role.required" class="req">*</span>
        </label>
        <select v-model="form[role.key]" class="field-select">
          <option value="">— Selecionar —</option>
          <option
            v-for="officer in availableFor(role.key)"
            :key="officer._id"
            :value="officer._id"
          >
            {{ officerLabel(officer) }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="error" class="error-msg">{{ error }}</div>

    <template #footer>
      <button class="btn-ghost" @click="$emit('close')">Cancelar</button>
      <button class="btn-primary" :disabled="!isValid || loading" @click="handleConfirm">
        <span v-if="loading">Abrindo...</span>
        <template v-else>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="3" width="15" height="13" rx="2" />
            <path d="M16 8h4l3 3v5h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          Abrir Viatura
        </template>
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import { GRADUACOES, buildDisplayName } from '@/constants/graduacoes'
import BaseModal from '@/components/ui/BaseModal.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  officers: { type: Array, default: () => [] },
  prefixos: { type: Array, default: () => [] },
  error: { type: String, default: '' },
})

const emit = defineEmits(['close', 'confirm'])

const ROLES = [
  { key: 'motorista', label: 'Motorista', required: true },
  { key: 'chefeDeBarca', label: 'Chefe de Barca', required: true },
  { key: 'auxiliar1', label: '1° Auxiliar', required: false },
  { key: 'auxiliar2', label: '2° Auxiliar', required: false },
  { key: 'auxiliar3', label: '3° Auxiliar', required: false },
]

const form = reactive({
  prefixo: '',
  observacao: '',
  motorista: '',
  chefeDeBarca: '',
  auxiliar1: '',
  auxiliar2: '',
  auxiliar3: '',
})

watch(() => props.open, (val) => {
  if (val) resetForm()
})

function resetForm() {
  Object.assign(form, {
    prefixo: '',
    observacao: '',
    motorista: '',
    chefeDeBarca: '',
    auxiliar1: '',
    auxiliar2: '',
    auxiliar3: '',
  })
}

function availableFor(roleKey) {
  const otherSelected = ROLES
    .filter((r) => r.key !== roleKey)
    .map((r) => form[r.key])
    .filter(Boolean)
  return props.officers.filter((o) => !otherSelected.includes(o._id))
}

function officerLabel(officer) {
  const base = buildDisplayName(officer.name, officer.rg, officer.graduacao)
  return officer.patrulhando ? `${base} · EM SERVIÇO` : base
}

const isValid = computed(() => !!form.prefixo.trim() && !!form.motorista && !!form.chefeDeBarca)

function handleConfirm() {
  if (!isValid.value) return
  emit('confirm', {
    prefixo: form.prefixo.trim(),
    observacao: form.observacao.trim(),
    motorista: form.motorista,
    chefeDeBarca: form.chefeDeBarca,
    auxiliar1: form.auxiliar1 || null,
    auxiliar2: form.auxiliar2 || null,
    auxiliar3: form.auxiliar3 || null,
  })
}
</script>

<style scoped>
.no-prefixos {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--surface-subtle);
  border: 1px solid var(--border-soft);
  border-radius: 8px;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.no-prefixos svg { width: 20px; height: 20px; flex-shrink: 0; color: var(--text-faint); }

.fields-row {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.field--grow { flex: 1; }

.field-label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.req { color: var(--error); }

.field-input,
.field-select {
  width: 100%;
  min-width: 0;
  padding: 0.55rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: var(--fs-sm);
  color: var(--text);
  background: var(--surface);
  font-family: inherit;
  transition: border-color 0.15s;
  outline: none;
}

.field-input:focus,
.field-select:focus {
  border-color: var(--primary);
}

.section-label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary);
  border-bottom: 1px solid var(--border-soft);
  padding-bottom: 0.4rem;
}

.roles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.error-msg {
  font-size: var(--fs-sm);
  color: var(--error);
  background: var(--danger-soft);
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
}

@media (max-width: 480px) {
  .fields-row {
    flex-direction: column;
    align-items: stretch;
  }

  .roles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
