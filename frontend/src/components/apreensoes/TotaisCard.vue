<template>
  <div class="totais-card page-card">
    <div class="card-header">
      <div class="header-text">
        <h3 class="card-title">Apreensões do Período</h3>
        <span class="card-subtitle">{{ mesLabel || mesAtual }}</span>
      </div>
    </div>

    <div v-if="loading" class="totais-skeleton">
      <div v-for="i in 7" :key="i" class="item-skeleton" />
    </div>

    <div v-else class="totais-grid">
      <div v-for="item in ITENS_APREENSAO" :key="item.key" class="totais-item">
        <div class="item-icon">
          <component :is="item.icon" />
        </div>
        <span class="item-value">{{ (totais?.[item.key] ?? 0).toLocaleString('pt-BR') }}</span>
        <span class="item-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { ITENS_APREENSAO as BASE_ITEMS } from '@/constants/apreensoes'

defineProps({
  totais: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  mesLabel: { type: String, default: '' },
})

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const mesAtual = computed(() => {
  const d = new Date()
  return `${MESES[d.getMonth()]} ${d.getFullYear()}`
})

function svgIcon(d) {
  return { render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', innerHTML: d }) }
}

const ITENS_APREENSAO = BASE_ITEMS.map((item) => {
  const icons = {
    armasFogo: '<path d="M2 12h6l2-3h4l2 3h2M4 12v4a1 1 0 001 1h1m10-5v4a1 1 0 01-1 1h-1m-4 0v-3m0 0H8m4 0h4"/><circle cx="9" cy="17" r="1"/><circle cx="15" cy="17" r="1"/>',
    drogas: '<path d="M12 2a5 5 0 015 5v10a5 5 0 01-10 0V7a5 5 0 015-5z"/><line x1="7.5" y1="12" x2="16.5" y2="12"/>',
    explosivos: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    itensRoubados: '<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>',
    armasBrancas: '<path d="M14.5 10l-9 9"/><path d="M21 3L9.5 14.5 7 17l-4 1 1-4 2.5-2.5L18 3z"/>',
    dinheiroSujo: '<circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2M9.5 9.5a2.5 2.5 0 015 0v1a2.5 2.5 0 01-5 0v1a2.5 2.5 0 005 0"/>',
    municao: '<circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>',
  }
  return { ...item, icon: svgIcon(icons[item.key] ?? '') }
})
</script>

<style scoped>
.totais-card {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  overflow: hidden;
  container-type: inline-size;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card-title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
}

.card-subtitle {
  font-size: var(--fs-sm);
  color: var(--text-muted);
  text-transform: capitalize;
}

.totais-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
}

.totais-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 1.25rem 0.75rem;
  border-right: 1px solid var(--border-soft);
  text-align: center;
}

.totais-item:last-child { border-right: none; }

.item-icon {
  color: var(--primary);
  display: flex;
  align-items: center;
}

.item-icon :deep(svg) {
  width: 22px;
  height: 22px;
}

.item-value {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
  line-height: 1;
}

.item-label {
  font-size: var(--fs-2xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
}

.totais-skeleton {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 1.25rem 0.75rem;
  gap: 1rem;
}

.item-skeleton {
  height: 72px;
  border-radius: 8px;
  background: var(--surface-subtle);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Container queries: responde à largura real do card, não da viewport */
@container (max-width: 700px) {
  .totais-grid { grid-template-columns: repeat(4, 1fr); }
  .totais-skeleton { grid-template-columns: repeat(4, 1fr); }
  .totais-item:nth-child(4) { border-right: none; }
  .totais-item:nth-child(5),
  .totais-item:nth-child(6),
  .totais-item:nth-child(7) { border-top: 1px solid var(--border-soft); }
}

@container (max-width: 420px) {
  .totais-grid { grid-template-columns: repeat(2, 1fr); }
  .totais-skeleton { grid-template-columns: repeat(2, 1fr); }
  .totais-item {
    border-right: 1px solid var(--border-soft);
    border-bottom: 1px solid var(--border-soft);
  }
  .totais-item:nth-child(even) { border-right: none; }
  /* Reset border-top herdado do bloco 4-col */
  .totais-item:nth-child(5),
  .totais-item:nth-child(6),
  .totais-item:nth-child(7) { border-top: none; }
  .totais-item:last-child { border-right: none; border-bottom: none; }
  .totais-item:last-child:nth-child(odd) { grid-column: span 2; }
}
</style>
