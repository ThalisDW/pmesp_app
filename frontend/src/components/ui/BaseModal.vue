<template>
  <div v-if="open" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal" :class="{ 'modal--flush': flush }" :style="{ maxWidth }">
      <div class="modal-header">
        <slot name="header-icon" />
        <div class="header-text">
          <h3 class="modal-title">{{ title }}</h3>
          <p v-if="subtitle" class="modal-subtitle">{{ subtitle }}</p>
        </div>
        <button class="modal-close" @click="$emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <slot />
      </div>

      <div v-if="$slots.footer" class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  maxWidth: { type: String, default: '560px' },
  flush: { type: Boolean, default: false },
})

defineEmits(['close'])
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
  box-shadow: 0 20px 60px rgb(0 0 0 / 20%);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);
  flex-shrink: 0;
}

.header-text {
  flex: 1;
  min-width: 0;
}

.modal-title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
  line-height: 1.2;
}

.modal-subtitle {
  font-size: var(--fs-sm);
  color: var(--text-muted);
  margin-top: 2px;
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  flex-shrink: 0;
  margin-left: auto;
}

.modal-close svg { width: 18px; height: 18px; }
.modal-close:hover { color: var(--text); }

.modal-body {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  flex: 1;
}

.modal--flush .modal-body {
  padding: 0;
  gap: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-soft);
  flex-shrink: 0;
}

/* Common button styles for footer slot content */
.modal-footer :deep(.btn-ghost) {
  padding: 0.6rem 1.2rem;
  background: none;
  border: 1px solid var(--border);
  color: var(--text-soft);
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}

.modal-footer :deep(.btn-ghost:hover) {
  background: var(--surface-subtle);
}

.modal-footer :deep(.btn-primary) {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  background: var(--primary);
  color: #fff;
  border: none;
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}

.modal-footer :deep(.btn-primary:hover:not(:disabled)) {
  background: var(--primary-dark);
}

.modal-footer :deep(.btn-primary:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-footer :deep(.btn-primary svg) {
  width: 15px;
  height: 15px;
}

.modal-footer :deep(.btn-danger) {
  padding: 0.6rem 1.2rem;
  background: var(--error);
  color: #fff;
  border: none;
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s;
}

.modal-footer :deep(.btn-danger:hover:not(:disabled)) {
  opacity: 0.88;
}

.modal-footer :deep(.btn-danger:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .modal-footer {
    justify-content: center;
  }
}
</style>
