<template>
  <div v-if="open" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header danger">
        <h3 class="modal-title">Exonerar Policial</h3>
        <button class="modal-close" @click="$emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="danger-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <p class="confirm-text">
          Tem certeza que deseja exonerar <strong>{{ officer?.name }}</strong>?
        </p>
        <p class="confirm-sub">
          O acesso ao sistema será revogado imediatamente. Esta ação pode ser revisada pelo administrador.
        </p>
      </div>

      <div class="modal-footer">
        <button class="btn-ghost" @click="$emit('close')">Cancelar</button>
        <button class="btn-danger" :disabled="loading" @click="$emit('confirm')">
          <span v-if="loading" class="btn-spinner" />
          {{ loading ? 'Exonerando...' : 'Confirmar Exoneração' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  officer: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

defineEmits(['close', 'confirm'])
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
  max-width: 400px;
  box-shadow: var(--shadow-lg, 0 20px 60px rgb(0 0 0 / 20%));
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);
}

.modal-header.danger { border-bottom-color: #fca5a5; }

.modal-title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-bold);
  color: var(--error);
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
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.danger-icon {
  width: 56px;
  height: 56px;
  background: var(--danger-soft);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--error);
}

.danger-icon svg { width: 28px; height: 28px; }

.confirm-text {
  font-size: var(--fs-md);
  color: var(--text-strong);
  font-weight: var(--fw-semibold);
}

.confirm-sub {
  font-size: var(--fs-sm);
  color: var(--text-muted);
  line-height: var(--lh-relaxed);
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

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.4rem;
  background: var(--error);
  color: #fff;
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
}

.btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-danger:hover:not(:disabled) { filter: brightness(1.1); }

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
