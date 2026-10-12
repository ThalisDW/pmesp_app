<template>
  <div v-if="open" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">Editar Cargos</h3>
        <button class="modal-close" @click="$emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="officer-preview">
          <span class="officer-name">{{ officer?.name }}</span>
          <span class="officer-rg">RG {{ officer?.rg }}</span>
        </div>

        <div class="field">
          <label class="field-label">Cargos ativos <span class="req">*</span></label>
          <p class="field-hint">Selecione um ou mais cargos. Ao menos um obrigatório.</p>
          <div class="cargo-list">
            <label
              v-for="c in CARGOS"
              :key="c.value"
              class="cargo-option"
              :class="{ selected: selected.includes(c.value) }"
            >
              <input
                type="checkbox"
                :value="c.value"
                v-model="selected"
                class="cargo-checkbox"
              />
              <div class="cargo-option-body">
                <span class="cargo-option-label">{{ c.label }}</span>
                <span class="cargo-option-desc">{{ c.description }}</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-ghost" @click="$emit('close')">Cancelar</button>
        <button
          class="btn-primary"
          :disabled="selected.length === 0 || loading"
          @click="confirm"
        >
          <span v-if="loading" class="btn-spinner" />
          {{ loading ? 'Salvando...' : 'Confirmar Alteração' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { CARGOS } from '@/constants/graduacoes'

const props = defineProps({
  open: { type: Boolean, default: false },
  officer: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'confirm'])

const selected = ref([])

watch(() => props.open, (val) => {
  if (val) {
    const current = props.officer?.cargo
    selected.value = Array.isArray(current) ? [...current] : (current ? [current] : ['padrao'])
  }
})

function confirm() {
  if (selected.value.length === 0) return
  emit('confirm', [...selected.value])
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 40%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 14px;
  width: 100%;
  max-width: 460px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg, 0 20px 60px rgb(0 0 0 / 20%));
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);
  position: sticky;
  top: 0;
  background: var(--surface);
  z-index: 1;
}

.modal-title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
}

.modal-close svg { width: 18px; height: 18px; }
.modal-close:hover { color: var(--text); }

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.officer-preview {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0.75rem 1rem;
  background: var(--surface-soft);
  border-radius: 8px;
}

.officer-name {
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

.officer-rg {
  font-size: var(--fs-xs);
  color: var(--text-faint);
}

.field { display: flex; flex-direction: column; gap: 0.5rem; }

.field-label {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

.req { color: var(--error); }

.field-hint {
  font-size: var(--fs-xs);
  color: var(--text-faint);
  margin-top: -0.25rem;
}

.cargo-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cargo-option {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-soft);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.cargo-option:hover { background: var(--surface-subtle); }
.cargo-option.selected { background: var(--surface-brand-soft); border-color: var(--primary-light); }

.cargo-checkbox {
  margin-top: 2px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--primary);
  flex-shrink: 0;
}

.cargo-option-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cargo-option-label {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

.cargo-option-desc {
  font-size: var(--fs-xs);
  color: var(--text-faint);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--border-soft);
  position: sticky;
  bottom: 0;
  background: var(--surface);
}

.btn-ghost {
  padding: 0.6rem 1.2rem;
  background: none;
  border: 1px solid var(--border);
  color: var(--text-soft);
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
}

.btn-ghost:hover { background: var(--surface-subtle); }

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.4rem;
  background: var(--primary);
  color: #fff;
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
}

.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-primary:hover:not(:disabled) { background: var(--primary-light); }

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgb(255 255 255 / 40%);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
