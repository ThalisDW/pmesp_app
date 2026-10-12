<template>
  <BaseTable
    :loading="loading"
    :is-empty="officers.length === 0"
    loading-text="Carregando exonerados..."
    empty-text="Nenhum policial exonerado."
    dimmed
  >
    <template #empty-icon>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    </template>

    <template #head>
      <th>Policial</th>
      <th>Última Graduação</th>
      <th>Cargo</th>
      <th class="col-center">PAD</th>
      <th>Exonerado em</th>
    </template>

    <template #body>
      <tr v-for="officer in officers" :key="officer._id">
        <td class="td-policial">
          <div class="officer-info">
            <span class="officer-name">{{ officer.name }}</span>
            <span class="officer-rg">RG {{ officer.rg }} · @{{ officer.username }}</span>
          </div>
        </td>

        <td>
          <div class="grad-cell">
            <span class="grad-prefix">{{ getGraduacaoPrefix(officer.graduacao) }}</span>
            <span class="grad-label">{{ getGraduacaoLabel(officer.graduacao) }}</span>
          </div>
        </td>

        <td>
          <div class="cargo-badges">
            <span v-for="c in (Array.isArray(officer.cargo) ? officer.cargo : [officer.cargo])" :key="c" class="cargo-badge">
              {{ getCargoLabel(c) }}
            </span>
          </div>
        </td>

        <td class="col-center">
          <div class="pad-dots">
            <span
              v-for="i in 3"
              :key="i"
              class="pad-dot"
              :class="dotClass(i, officer.advertencias?.length ?? 0)"
            />
          </div>
        </td>

        <td class="td-date">
          <span class="date-value">{{ formatDate(officer.updatedAt) }}</span>
        </td>
      </tr>
    </template>
  </BaseTable>
</template>

<script setup>
import BaseTable from '@/components/ui/BaseTable.vue'
import { GRADUACOES, CARGOS } from '@/constants/graduacoes'

defineProps({
  officers: { type: Array, required: true },
  loading: { type: Boolean, default: false },
})

function getGraduacaoLabel(v) { return GRADUACOES.find((g) => g.value === v)?.label ?? v }
function getGraduacaoPrefix(v) { return GRADUACOES.find((g) => g.value === v)?.nickPrefix ?? '' }
function getCargoLabel(v) { return CARGOS.find((c) => c.value === v)?.label ?? v }

function dotClass(i, count) {
  if (i > count) return ''
  if (count === 1) return 'dot-gold'
  if (count === 2) return 'dot-amber'
  return 'dot-red'
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style scoped>
.td-policial { min-width: 180px; }

.officer-info { display: flex; flex-direction: column; gap: 1px; }

.officer-name {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-muted);
  text-decoration: line-through;
}

.officer-rg { font-size: var(--fs-xs); color: var(--text-faint); }

.grad-cell { display: flex; align-items: center; gap: 0.35rem; white-space: nowrap; }
.grad-prefix { font-size: var(--fs-md); line-height: 1; opacity: 0.5; }
.grad-label { font-size: var(--fs-sm); color: var(--text-faint); }

.cargo-badges { display: flex; gap: 0.3rem; flex-wrap: wrap; }

.cargo-badge {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--border-soft);
  background: var(--surface-subtle);
  color: var(--text-faint);
  white-space: nowrap;
}

.pad-dots { display: flex; gap: 4px; justify-content: center; }

.pad-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: var(--surface-subtle);
  border: 1px solid var(--border);
}

.dot-gold { background: var(--accent); border-color: var(--accent); opacity: 0.5; }
.dot-amber { background: var(--warning); border-color: var(--warning); opacity: 0.5; }
.dot-red { background: var(--error); border-color: var(--error); opacity: 0.5; }

.td-date { white-space: nowrap; }
.date-value { color: var(--text-faint); font-size: var(--fs-sm); }
</style>
