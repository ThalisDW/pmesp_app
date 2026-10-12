<template>
  <div v-if="open" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">Nova Avaliação ROCAM</h3>
        <button class="modal-close" @click="$emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="field">
          <label class="field-label">Policial ROCAM <span class="req">*</span></label>
          <select v-model="form.avaliadoId" class="field-input">
            <option value="" disabled>Selecione o policial ROCAM</option>
            <option v-for="m in membros" :key="m._id" :value="m._id">
              {{ m.name }} — RG {{ m.rg }}
            </option>
          </select>
          <span v-if="!membros.length" class="field-hint-warn">Nenhum policial ROCAM ativo encontrado.</span>
        </div>

        <div class="field">
          <label class="field-label">Nota <span class="req">*</span></label>
          <div class="nota-wrap">
            <div class="nota-display" :class="notaColorClass">
              <span class="nota-number">{{ form.nota }}</span>
              <span class="nota-desc">{{ notaDesc }}</span>
            </div>
            <input type="range" min="0" max="10" step="1" v-model.number="form.nota" class="nota-slider" />
            <div class="nota-legend">
              <span>0 — Retirar</span>
              <span>5 — Adequar</span>
              <span>10 — Apto</span>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="field-label">Avaliação <span class="req">*</span></label>
          <textarea
            v-model="form.avaliacao"
            class="field-input field-textarea"
            placeholder="Descreva o desempenho do policial ROCAM..."
            rows="4"
          />
        </div>

        <div class="field">
          <label class="field-label">Ponto de Atenção <span class="opt">(opcional)</span></label>
          <textarea
            v-model="form.pontoAtencao"
            class="field-input field-textarea"
            placeholder="Indique pontos que necessitam atenção..."
            rows="3"
          />
        </div>

        <p v-if="error" class="form-error">{{ error }}</p>
      </div>

      <div class="modal-footer">
        <button class="btn-ghost" @click="$emit('close')">Cancelar</button>
        <button class="btn-primary" :disabled="!canSubmit || loading" @click="confirm">
          <span v-if="loading" class="btn-spinner" />
          {{ loading ? 'Salvando...' : 'Criar Avaliação' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  membros: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
})

const emit = defineEmits(['close', 'confirm'])

const form = reactive({ avaliadoId: '', avaliacao: '', pontoAtencao: '', nota: 5 })

watch(() => props.open, (val) => {
  if (val) Object.assign(form, { avaliadoId: '', avaliacao: '', pontoAtencao: '', nota: 5 })
})

const canSubmit = computed(() => !!form.avaliadoId && !!form.avaliacao.trim())

const notaDesc = computed(() => {
  if (form.nota <= 3) return 'Retirar do ROCAM'
  if (form.nota <= 6) return 'Necessita se adequar'
  return 'Apto para aprovação'
})

const notaColorClass = computed(() => {
  if (form.nota <= 3) return 'nota-danger'
  if (form.nota <= 6) return 'nota-warning'
  return 'nota-success'
})

function confirm() {
  if (!canSubmit.value) return
  emit('confirm', { ...form })
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
  max-width: 500px;
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

.field { display: flex; flex-direction: column; gap: 0.35rem; }

.field-label {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

.req { color: var(--error); }
.opt { color: var(--text-faint); font-weight: var(--fw-normal); font-size: var(--fs-xs); }

.field-input {
  border: 1px solid var(--border);
  background: var(--surface-soft);
  color: var(--text);
  font-size: var(--fs-md);
  padding: 0.55rem 0.8rem;
  border-radius: 8px;
  outline: none;
  font-family: inherit;
}

.field-input:focus {
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgb(42 82 152 / 10%);
}

.field-textarea { resize: vertical; line-height: 1.5; }

.field-hint-warn { font-size: var(--fs-xs); color: var(--warning); }

.nota-wrap { display: flex; flex-direction: column; gap: 0.75rem; }

.nota-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-soft);
  transition: background 0.2s, border-color 0.2s;
}

.nota-display.nota-danger { background: var(--danger-soft); border-color: #fca5a5; }
.nota-display.nota-warning { background: var(--warning-soft); border-color: var(--accent-light); }
.nota-display.nota-success { background: var(--success-bg); border-color: #86efac; }

.nota-number {
  font-size: 2rem;
  font-weight: var(--fw-bold);
  line-height: 1;
  min-width: 2ch;
  text-align: center;
}

.nota-display.nota-danger .nota-number { color: var(--error); }
.nota-display.nota-warning .nota-number { color: var(--warning); }
.nota-display.nota-success .nota-number { color: var(--success); }

.nota-desc { font-size: var(--fs-sm); font-weight: var(--fw-semibold); color: var(--text-soft); }

.nota-slider { width: 100%; cursor: pointer; accent-color: var(--primary); }

.nota-legend {
  display: flex;
  justify-content: space-between;
  font-size: var(--fs-xs);
  color: var(--text-faint);
}

.form-error {
  font-size: var(--fs-sm);
  color: var(--error);
  background: var(--danger-soft);
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #fca5a5;
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
