<template>
  <BaseModal
    :open="open"
    title="Editar Tripulação"
    :subtitle="viatura?.prefixo"
    max-width="520px"
    @close="$emit('close')"
  >
    <div class="roles-grid">
      <div v-for="role in ROLES" :key="role.key" class="field">
        <label class="field-label">
          {{ role.label }}
          <span v-if="role.required" class="req">*</span>
        </label>
        <select v-model="form[role.key]" class="field-select">
          <option value="">— Remover —</option>
          <option
            v-for="officer in availableFor(role.key)"
            :key="officer._id"
            :value="officer._id"
            :class="{ 'opt-busy': isBusyElsewhere(officer) }"
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
        <span v-if="loading">Salvando...</span>
        <span v-else>Salvar Tripulação</span>
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import { buildDisplayName } from '@/constants/graduacoes'
import BaseModal from '@/components/ui/BaseModal.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  viatura: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  officers: { type: Array, default: () => [] },
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
  motorista: '',
  chefeDeBarca: '',
  auxiliar1: '',
  auxiliar2: '',
  auxiliar3: '',
})

watch(() => props.open, (val) => {
  if (val && props.viatura) populateFromViatura()
})

watch(() => props.viatura, (v) => {
  if (props.open && v) populateFromViatura()
})

function populateFromViatura() {
  const v = props.viatura
  form.motorista = v.motorista?._id ?? v.motorista ?? ''
  form.chefeDeBarca = v.chefeDeBarca?._id ?? v.chefeDeBarca ?? ''
  form.auxiliar1 = v.auxiliar1?._id ?? v.auxiliar1 ?? ''
  form.auxiliar2 = v.auxiliar2?._id ?? v.auxiliar2 ?? ''
  form.auxiliar3 = v.auxiliar3?._id ?? v.auxiliar3 ?? ''
}

const currentCrewIds = computed(() => {
  const v = props.viatura
  if (!v) return []
  return ['motorista', 'chefeDeBarca', 'auxiliar1', 'auxiliar2', 'auxiliar3']
    .map((k) => v[k]?._id ?? v[k])
    .filter(Boolean)
})

function isBusyElsewhere(officer) {
  return officer.patrulhando && !currentCrewIds.value.includes(officer._id)
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
  return isBusyElsewhere(officer) ? `${base} · EM OUTRA BARCA` : base
}

const isValid = computed(() => !!form.motorista && !!form.chefeDeBarca)

function handleConfirm() {
  if (!isValid.value) return
  emit('confirm', {
    motorista: form.motorista,
    chefeDeBarca: form.chefeDeBarca,
    auxiliar1: form.auxiliar1 || null,
    auxiliar2: form.auxiliar2 || null,
    auxiliar3: form.auxiliar3 || null,
  })
}
</script>

<style scoped>
.roles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.field-label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.req { color: var(--error); }

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

.field-select:focus { border-color: var(--primary); }

.error-msg {
  font-size: var(--fs-sm);
  color: var(--error);
  background: var(--danger-soft);
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
}

@media (max-width: 480px) {
  .roles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
