<template>
  <div v-if="open" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title-row">
          <h3 class="modal-title">Advertências (PAD)</h3>
          <div class="pad-dots">
            <span
              v-for="i in 3"
              :key="i"
              class="pad-dot"
              :class="dotClass(i, officer?.advertencias?.length ?? 0)"
            />
          </div>
        </div>
        <button class="modal-close" @click="$emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div class="officer-bar">
        <span class="officer-name">{{ officer?.name }}</span>
        <span class="officer-rg">RG {{ officer?.rg }}</span>
      </div>

      <div class="modal-body">
        <div
          v-for="(adv, idx) in officer?.advertencias"
          :key="adv._id"
          class="adv-item"
        >
          <div class="adv-num">{{ idx + 1 }}ª</div>
          <div class="adv-content">
            <p class="adv-descricao">{{ adv.descricao }}</p>
            <span class="adv-date">{{ formatDate(adv.data) }}</span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-ghost" @click="$emit('close')">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  officer: { type: Object, default: null },
})

defineEmits(['close'])

function dotClass(i, count) {
  if (i > count) return ''
  if (count === 1) return 'dot-gold'
  if (count === 2) return 'dot-amber'
  return 'dot-red'
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
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
  box-shadow: var(--shadow-lg, 0 20px 60px rgb(0 0 0 / 20%));
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);
}

.modal-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
}

.pad-dots { display: flex; gap: 5px; }

.pad-dot {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  background: var(--surface-subtle);
  border: 1px solid var(--border);
}

.dot-gold { background: var(--accent); border-color: var(--accent); }
.dot-amber { background: var(--warning); border-color: var(--warning); }
.dot-red { background: var(--error); border-color: var(--error); }

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

.officer-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: var(--surface-soft);
  border-bottom: 1px solid var(--border-soft);
}

.officer-name {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

.officer-rg {
  font-size: var(--fs-xs);
  color: var(--text-faint);
}

.modal-body {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.adv-item {
  display: flex;
  gap: 1rem;
  padding: 0.9rem 1rem;
  background: var(--danger-soft);
  border: 1px solid #fca5a5;
  border-radius: 8px;
  border-left: 3px solid var(--error);
}

.adv-num {
  font-size: var(--fs-sm);
  font-weight: var(--fw-bold);
  color: var(--error);
  flex-shrink: 0;
  min-width: 20px;
}

.adv-content {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}

.adv-descricao {
  font-size: var(--fs-sm);
  color: var(--text-strong);
  line-height: var(--lh-relaxed);
}

.adv-date {
  font-size: var(--fs-xs);
  color: var(--text-faint);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
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
</style>
