<template>
  <div class="senha-card">
    <div class="success-header">
      <div class="success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <div>
        <h3 class="success-title">Policial cadastrado com sucesso</h3>
        <p class="success-sub">O perfil já está disponível no Efetivo.</p>
      </div>
    </div>

    <div class="officer-summary">
      <div class="summary-avatar">{{ initials }}</div>
      <div class="summary-info">
        <span class="summary-display">{{ displayName }}</span>
        <span class="summary-username">@{{ user.username }}</span>
      </div>
    </div>

    <div class="password-section">
      <p class="password-label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Senha temporária
      </p>
      <div class="password-display">
        <code class="password-value">{{ tempPassword }}</code>
        <button class="copy-btn" type="button" :class="{ copied }" @click="copyPassword">
          <svg v-if="!copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {{ copied ? 'Copiado!' : 'Copiar' }}
        </button>
      </div>
      <p class="password-warning">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        Esta senha não será exibida novamente. Repasse ao policial antes de fechar.
      </p>
    </div>

    <div class="card-actions">
      <button type="button" class="btn-secondary" @click="emit('novo')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Cadastrar outro policial
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { buildDisplayName, getGraduacao } from '@/constants/graduacoes'

const props = defineProps({
  user: { type: Object, required: true },
  tempPassword: { type: String, required: true },
})

const emit = defineEmits(['novo'])
const copied = ref(false)

const initials = computed(() => {
  const parts = (props.user.name || 'U').split(' ')
  return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0]
})

const displayName = computed(() =>
  buildDisplayName(props.user.name, props.user.rg, props.user.graduacao)
)

async function copyPassword() {
  try {
    await navigator.clipboard.writeText(props.tempPassword)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // fallback: select the text visually
  }
}
</script>

<style scoped>
.senha-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.success-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.success-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--success-bg);
  color: var(--success);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #bbf7d0;
}

.success-icon svg {
  width: 22px;
  height: 22px;
}

.success-title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
}

.success-sub {
  font-size: var(--fs-sm);
  color: var(--text-soft);
  margin-top: 0.15rem;
}

/* Officer summary */
.officer-summary {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  background: var(--surface-soft);
  border: 1px solid var(--border-soft);
  border-radius: 10px;
}

.summary-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--surface-brand-soft);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-sm);
  font-weight: var(--fw-bold);
  flex-shrink: 0;
  border: 1px solid var(--border-soft);
}

.summary-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.summary-display {
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

.summary-username {
  font-size: var(--fs-sm);
  color: var(--text-faint);
}

/* Password section */
.password-section {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.password-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-soft);
}

.password-label svg {
  width: 14px;
  height: 14px;
}

.password-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--surface-subtle);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.password-value {
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: var(--fs-lg);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  letter-spacing: 0.05em;
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-soft);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  font-family: inherit;
  flex-shrink: 0;
}

.copy-btn svg {
  width: 13px;
  height: 13px;
}

.copy-btn:hover {
  border-color: var(--primary-light);
  color: var(--primary);
}

.copy-btn.copied {
  border-color: var(--success);
  color: var(--success);
  background: var(--success-bg);
}

/* Warning */
.password-warning {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: var(--fs-sm);
  color: var(--warning);
  background: var(--warning-soft);
  border: 1px solid var(--accent-light);
  border-radius: 8px;
  padding: 0.65rem 0.85rem;
  line-height: var(--lh-relaxed);
}

.password-warning svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Actions */
.card-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-soft);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1.25rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  font-family: inherit;
}

.btn-secondary svg {
  width: 15px;
  height: 15px;
}

.btn-secondary:hover {
  border-color: var(--primary-light);
  background: var(--surface-brand-soft);
  color: var(--primary);
}
</style>
