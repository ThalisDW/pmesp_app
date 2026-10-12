<template>
  <div class="rank-mini-card">
    <div class="rmc-header">
      <span class="rmc-title">{{ title }}</span>
    </div>

    <div v-if="loading" class="rmc-feedback">
      <div class="mini-spinner" />
      <span>Carregando...</span>
    </div>

    <div v-else-if="!items.length" class="rmc-empty">
      Sem dados no período.
    </div>

    <div v-else class="rmc-list">
      <div v-for="(item, i) in items.slice(0, 3)" :key="item.userId" class="rmc-row">
        <span class="rmc-pos" :class="posClass(i)">{{ i + 1 }}</span>
        <span class="rmc-name">{{ shortName(item.name) }}</span>
        <span class="rmc-value">{{ formatter ? formatter(item.total) : item.total.toLocaleString('pt-BR') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  formatter: { type: Function, default: null },
})

function posClass(i) {
  return ['pos-gold', 'pos-silver', 'pos-bronze'][i] ?? ''
}

function shortName(name) {
  if (!name) return '—'
  const parts = name.trim().split(' ')
  if (parts.length <= 2) return name
  return `${parts[0]} ${parts[parts.length - 1]}`
}
</script>

<style scoped>
.rank-mini-card {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  overflow: hidden;
}

.rmc-header {
  padding: 0.85rem 1.1rem;
  border-bottom: 1px solid var(--border-soft);
}

.rmc-title {
  font-size: var(--fs-sm);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.rmc-feedback {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 1.1rem;
  color: var(--text-faint);
  font-size: var(--fs-sm);
}

.mini-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }

.rmc-empty {
  padding: 1.25rem 1.1rem;
  font-size: var(--fs-sm);
  color: var(--text-faint);
  font-style: italic;
}

.rmc-list {
  display: flex;
  flex-direction: column;
}

.rmc-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 1.1rem;
  border-bottom: 1px solid var(--border-soft);
}

.rmc-row:last-child { border-bottom: none; }

.rmc-pos {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-2xs);
  font-weight: var(--fw-bold);
  font-family: var(--font-family-display);
  flex-shrink: 0;
  background: var(--surface-subtle);
  color: var(--text-muted);
}

.pos-gold { background: #fef9c3; color: #a16207; }
.pos-silver { background: #f1f5f9; color: #475569; }
.pos-bronze { background: #fff7ed; color: #9a3412; }

.rmc-name {
  flex: 1;
  font-size: var(--fs-sm);
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.rmc-value {
  font-size: var(--fs-sm);
  font-weight: var(--fw-bold);
  color: var(--primary);
  font-family: var(--font-family-display);
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
