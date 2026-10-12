<template>
  <div class="rank-list">
    <div v-if="loading" class="rank-feedback">
      <div class="spinner" />
    </div>

    <div v-else-if="!items || items.length === 0" class="rank-empty">
      <span>Sem registros no período</span>
    </div>

    <div v-else class="rank-rows">
      <div v-for="(item, idx) in items" :key="item.userId" class="rank-row">
        <span class="rank-pos" :class="posClass(idx)">{{ idx + 1 }}</span>
        <div class="rank-info">
          <span class="rank-prefix">{{ getPrefix(item.graduacao) }}</span>
          <span class="rank-name">{{ item.name }}</span>
          <span class="rank-rg">· {{ item.rg }}</span>
        </div>
        <span class="rank-total">{{ displayTotal(item.total) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { GRADUACOES } from '@/constants/graduacoes'

const props = defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  formatter: { type: Function, default: null },
})

function displayTotal(val) {
  if (props.formatter) return props.formatter(val)
  return Number(val).toLocaleString('pt-BR')
}

function getPrefix(v) {
  return GRADUACOES.find((g) => g.value === v)?.nickPrefix ?? ''
}

function posClass(idx) {
  if (idx === 0) return 'pos--gold'
  if (idx === 1) return 'pos--silver'
  if (idx === 2) return 'pos--bronze'
  return ''
}
</script>

<style scoped>
.rank-list {
  display: flex;
  flex-direction: column;
}

.rank-feedback {
  display: flex;
  justify-content: center;
  padding: 1.5rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.rank-empty {
  padding: 1.25rem 1.5rem;
  font-size: var(--fs-sm);
  color: var(--text-faint);
  text-align: center;
}

.rank-rows {
  display: flex;
  flex-direction: column;
}

.rank-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1.25rem;
  border-bottom: 1px solid var(--border-soft);
}

.rank-row:last-child {
  border-bottom: none;
}

.rank-pos {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-xs);
  font-weight: var(--fw-bold);
  flex-shrink: 0;
  background: var(--surface-subtle);
  color: var(--text-muted);
}

.pos--gold   { background: #fef3c7; color: #b45309; }
.pos--silver { background: #f1f5f9; color: #475569; }
.pos--bronze { background: #fef0e6; color: #c2410c; }

.rank-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
  overflow: hidden;
}

.rank-prefix {
  font-size: var(--fs-md);
  flex-shrink: 0;
  line-height: 1;
}

.rank-name {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank-rg {
  font-size: var(--fs-xs);
  color: var(--text-faint);
  flex-shrink: 0;
}

.rank-total {
  font-size: var(--fs-md);
  font-weight: var(--fw-bold);
  color: var(--primary);
  font-family: var(--font-family-display);
  flex-shrink: 0;
}
</style>
