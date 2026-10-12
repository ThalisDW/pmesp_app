<template>
  <div class="tbl-shell">
    <div v-if="loading" class="tbl-feedback">
      <div class="tbl-spinner" />
      <span>{{ loadingText }}</span>
    </div>

    <div v-else-if="isEmpty" class="tbl-empty">
      <slot name="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      </slot>
      <span>{{ emptyText }}</span>
    </div>

    <div v-else class="tbl-wrapper" :class="{ 'tbl--dimmed': dimmed }">
      <table class="tbl">
        <thead>
          <tr>
            <slot name="head" />
          </tr>
        </thead>
        <tbody>
          <slot name="body" />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading:     { type: Boolean, default: false },
  isEmpty:     { type: Boolean, required: true },
  loadingText: { type: String,  default: 'Carregando...' },
  emptyText:   { type: String,  default: 'Nenhum resultado encontrado.' },
  dimmed:      { type: Boolean, default: false },
})
</script>

<style scoped>
/* ── Feedback states ───────────────────────────────────────────── */
.tbl-feedback {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 2.5rem;
  color: var(--text-faint);
  font-size: var(--fs-md);
}

.tbl-spinner {
  width: 22px;
  height: 22px;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: tbl-spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes tbl-spin { to { transform: rotate(360deg); } }

.tbl-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 3rem;
  color: var(--text-faint);
  font-size: var(--fs-md);
}

:slotted(svg),
.tbl-empty :deep(svg) {
  width: 38px;
  height: 38px;
  color: var(--border);
}

/* ── Table chrome ──────────────────────────────────────────────── */
.tbl-wrapper { overflow-x: auto; }

.tbl {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--fs-sm);
}

/* Head */
.tbl :deep(thead th) {
  text-align: left;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  padding: 0.6rem 1rem;
  border-bottom: 1px solid var(--border-soft);
  background: var(--surface-soft);
  white-space: nowrap;
}

/* Body rows */
.tbl :deep(tbody tr) {
  border-bottom: 1px solid var(--border-soft);
  transition: background 0.12s;
}

.tbl :deep(tbody tr:last-child) { border-bottom: none; }

.tbl :deep(tbody tr:hover) { background: var(--surface-soft); }

/* Body cells */
.tbl :deep(tbody td) {
  padding: 0.75rem 1rem;
  vertical-align: middle;
  color: var(--text);
}

/* Alignment helpers */
.tbl :deep(.col-center) { text-align: center; }
.tbl :deep(.col-right)  { text-align: right; }

/* Dimmed variant (exonerados) */
.tbl--dimmed :deep(tbody tr) {
  opacity: 0.7;
}

.tbl--dimmed :deep(tbody tr:hover) { background: none; }
</style>
