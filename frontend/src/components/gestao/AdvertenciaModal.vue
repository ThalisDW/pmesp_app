<template>
  <div v-if="open" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">Registrar Advertência</h3>
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

        <div class="pad-counter">
          <span class="pad-label">Advertências atuais (PAD)</span>
          <div class="pad-dots">
            <span
              v-for="i in 3"
              :key="i"
              class="pad-dot"
              :class="{ filled: i <= (officer?.advertencias?.length ?? 0) }"
            />
          </div>
          <span class="pad-count">{{ officer?.advertencias?.length ?? 0 }}/3</span>
        </div>

        <div v-if="(officer?.advertencias?.length ?? 0) >= 3" class="warn-bar">
          Policial já atingiu o limite máximo de 3 advertências (PAD).
        </div>

        <div v-else class="field">
          <label class="field-label">Motivo da advertência <span class="required">*</span></label>
          <textarea
            v-model="descricao"
            class="field-input"
            :class="{ error: showError }"
            placeholder="Descreva o motivo da advertência..."
            rows="4"
          />
          <span v-if="showError" class="field-error">Motivo obrigatório</span>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-ghost" @click="$emit('close')">Cancelar</button>
        <button
          class="btn-warning"
          :disabled="(officer?.advertencias?.length ?? 0) >= 3 || loading"
          @click="confirm"
        >
          <span v-if="loading" class="btn-spinner" />
          {{ loading ? 'Registrando...' : 'Registrar Advertência' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  officer: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'confirm'])

const descricao = ref('')
const showError = ref(false)

watch(() => props.open, (val) => {
  if (val) { descricao.value = ''; showError.value = false }
})

function confirm() {
  if (!descricao.value.trim()) { showError.value = true; return }
  emit('confirm', descricao.value.trim())
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
  max-width: 440px;
  box-shadow: var(--shadow-lg, 0 20px 60px rgb(0 0 0 / 20%));
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);
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
  gap: 1.1rem;
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

.officer-rg { font-size: var(--fs-xs); color: var(--text-faint); }

.pad-counter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1rem;
  background: var(--surface-subtle);
  border-radius: 8px;
}

.pad-label {
  font-size: var(--fs-xs);
  color: var(--text-muted);
  flex: 1;
}

.pad-dots {
  display: flex;
  gap: 5px;
}

.pad-dot {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1px solid var(--border);
  background: var(--surface);
}

.pad-dot.filled { background: var(--error); border-color: var(--error); }

.pad-count {
  font-size: var(--fs-sm);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
}

.warn-bar {
  padding: 0.75rem 1rem;
  background: var(--danger-soft);
  color: var(--error);
  font-size: var(--fs-sm);
  border-radius: 8px;
  border: 1px solid #fca5a5;
}

.field { display: flex; flex-direction: column; gap: 0.35rem; }

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
  resize: vertical;
  font-family: inherit;
  line-height: var(--lh-relaxed);
}

.field-input:focus {
  border-color: var(--warning);
  box-shadow: 0 0 0 3px rgb(202 138 4 / 10%);
}

.field-input.error { border-color: var(--error); }
.field-error { font-size: var(--fs-xs); color: var(--error); }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--border-soft);
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

.btn-warning {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.4rem;
  background: var(--warning);
  color: #fff;
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
}

.btn-warning:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-warning:hover:not(:disabled) { background: var(--accent-light); }

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
