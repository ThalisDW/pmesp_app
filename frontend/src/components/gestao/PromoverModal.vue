<template>
  <div v-if="open" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">Promover Policial</h3>
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

        <div class="grad-change">
          <div class="grad-item current">
            <span class="grad-item-label">Graduação atual</span>
            <span class="grad-item-value">{{ currentLabel }}</span>
          </div>
          <svg class="grad-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
          <div class="grad-item new">
            <span class="grad-item-label">Nova graduação</span>
            <span class="grad-item-value" :class="{ placeholder: !novaGraduacao }">
              {{ novaLabel || 'Selecione...' }}
            </span>
          </div>
        </div>

        <div class="field">
          <label class="field-label">Selecionar nova graduação</label>
          <select v-model="novaGraduacao" class="field-input">
            <option value="" disabled>Escolha a graduação</option>
            <optgroup v-for="grupo in graduacaoGroups" :key="grupo.label" :label="grupo.label">
              <option
                v-for="g in grupo.items"
                :key="g.value"
                :value="g.value"
                :disabled="g.value === officer?.graduacao"
              >
                {{ g.nickPrefix }} {{ g.label }}
              </option>
            </optgroup>
          </select>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-ghost" @click="$emit('close')">Cancelar</button>
        <button class="btn-primary" :disabled="!novaGraduacao || novaGraduacao === officer?.graduacao || loading" @click="confirm">
          <span v-if="loading" class="btn-spinner" />
          {{ loading ? 'Promovendo...' : 'Confirmar Promoção' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { GRADUACOES } from '@/constants/graduacoes'

const props = defineProps({
  open: { type: Boolean, default: false },
  officer: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'confirm'])

const novaGraduacao = ref('')

watch(() => props.open, (val) => { if (val) novaGraduacao.value = '' })

const currentLabel = computed(() => {
  return GRADUACOES.find((g) => g.value === props.officer?.graduacao)?.label ?? '—'
})

const novaLabel = computed(() => {
  return GRADUACOES.find((g) => g.value === novaGraduacao.value)?.label ?? ''
})

const graduacaoGroups = computed(() => {
  const groups = {}
  for (const g of GRADUACOES) {
    if (!groups[g.grupo]) groups[g.grupo] = { label: g.grupo, items: [] }
    groups[g.grupo].items.push(g)
  }
  return Object.values(groups)
})

function confirm() {
  if (!novaGraduacao.value || novaGraduacao.value === props.officer?.graduacao) return
  emit('confirm', novaGraduacao.value)
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

.grad-change {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.grad-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.65rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border-soft);
}

.grad-item.current { background: var(--surface-subtle); }
.grad-item.new { background: var(--surface-brand-soft); border-color: var(--primary-light); }

.grad-item-label {
  font-size: var(--fs-xs);
  color: var(--text-faint);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.grad-item-value {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

.grad-item-value.placeholder { color: var(--text-faint); font-weight: var(--fw-normal); }

.grad-arrow { width: 18px; height: 18px; color: var(--text-muted); flex-shrink: 0; }

.field { display: flex; flex-direction: column; gap: 0.35rem; }

.field-label {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

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
