<template>
  <BaseModal
    :open="open"
    title="Solicitar Ausência"
    subtitle="Informe o período e o motivo da ausência"
    max-width="480px"
    @close="$emit('close')"
  >
    <template #header-icon>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    </template>

    <div class="form">
      <div v-if="error" class="form-error">{{ error }}</div>

      <div class="date-row">
        <div class="field">
          <label class="label">Data Início</label>
          <input v-model="form.dataInicio" type="date" class="input" :min="minDate" />
        </div>
        <div class="date-sep">até</div>
        <div class="field">
          <label class="label">Data Fim</label>
          <input v-model="form.dataFim" type="date" class="input" :min="form.dataInicio || minDate" />
        </div>
      </div>

      <p v-if="rangeError" class="range-error">{{ rangeError }}</p>

      <div class="field">
        <label class="label">Motivo</label>
        <textarea
          v-model="form.motivo"
          class="textarea"
          rows="4"
          placeholder="Descreva o motivo da ausência..."
        />
      </div>
    </div>

    <template #footer>
      <button class="btn-ghost" :disabled="loading" @click="$emit('close')">Cancelar</button>
      <button class="btn-primary" :disabled="loading || !isValid" @click="submit">
        {{ loading ? 'Salvando...' : 'Solicitar' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const props = defineProps({
  open: { type: Boolean, required: true },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['close', 'confirm'])

const form = ref({ dataInicio: '', dataFim: '', motivo: '' })

const minDate = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
})

const rangeError = computed(() => {
  if (form.value.dataInicio && form.value.dataFim && form.value.dataFim < form.value.dataInicio) {
    return 'Data fim deve ser igual ou posterior à data início'
  }
  return ''
})

const isValid = computed(() =>
  !!form.value.dataInicio &&
  !!form.value.dataFim &&
  !rangeError.value &&
  !!form.value.motivo.trim()
)

watch(
  () => props.open,
  (val) => { if (val) form.value = { dataInicio: '', dataFim: '', motivo: '' } }
)

function submit() {
  if (!isValid.value) return
  emit('confirm', {
    dataInicio: form.value.dataInicio,
    dataFim: form.value.dataFim,
    motivo: form.value.motivo.trim(),
  })
}
</script>

<style scoped>
.form { display: flex; flex-direction: column; gap: 1rem; }

.form-error {
  background: var(--error-bg);
  color: var(--error);
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 0.6rem 0.875rem;
  font-size: var(--fs-sm);
}

.date-row {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}

.date-row .field { flex: 1; min-width: 0; }

.date-sep {
  font-size: var(--fs-sm);
  color: var(--text-muted);
  padding-bottom: 0.65rem;
  white-space: nowrap;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .date-row { flex-direction: column; align-items: stretch; gap: 1rem; }
  .date-sep { padding-bottom: 0; text-align: center; }
}

.range-error {
  font-size: var(--fs-xs);
  color: var(--error);
  margin: -0.5rem 0 0;
}

.field { display: flex; flex-direction: column; gap: 0.35rem; }

.label {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text);
}

.input, .textarea {
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: var(--fs-sm);
  font-family: inherit;
  color: var(--text);
  background: var(--surface);
  transition: border-color 0.15s;
  width: 100%;
  box-sizing: border-box;
}

.input:focus, .textarea:focus {
  outline: none;
  border-color: var(--primary-light);
}

.textarea { resize: vertical; }
</style>
