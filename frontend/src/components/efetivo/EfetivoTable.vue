<template>
  <BaseTable
    :loading="loading"
    :is-empty="officers.length === 0"
    loading-text="Carregando efetivo..."
    empty-text="Nenhum policial encontrado."
  >
    <template #empty-icon>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </template>

    <template #head>
      <th>Policial</th>
      <th>Atribuição</th>
      <th>Graduação</th>
      <th>Última Promoção</th>
      <th class="col-center">PAD</th>
      <th>Cursos</th>
      <th>Status de Patrulha</th>
    </template>

    <template #body>
      <tr v-for="officer in officers" :key="officer._id">
        <td class="td-policial">
          <div class="officer-info">
            <div class="officer-name-row">
              <span class="officer-display">{{ buildDisplayName(officer.name, officer.rg, officer.graduacao) }}</span>
              <span v-if="officer.ausente" class="badge-ausente">Ausente</span>
            </div>
            <span class="officer-username">@{{ officer.username }}</span>
          </div>
        </td>

        <td>
          <div class="cargo-badges">
            <span
              v-for="c in (Array.isArray(officer.cargo) ? officer.cargo : [officer.cargo])"
              :key="c"
              class="cargo-badge"
              :class="`cargo-${c}`"
            >{{ getCargoLabel(c) }}</span>
          </div>
        </td>

        <td>
          <div class="grad-cell">
            <span class="grad-prefix">{{ getGraduacaoPrefix(officer.graduacao) }}</span>
            <span class="grad-label">{{ getGraduacaoLabel(officer.graduacao) }}</span>
          </div>
        </td>

        <td class="td-date">
          <span v-if="officer.dataPromocao" class="date-value">{{ formatDate(officer.dataPromocao) }}</span>
          <span v-else class="no-value">—</span>
        </td>

        <td class="col-center">
          <PadIndicator :count="officer.advertencias?.length ?? 0" :advertencias="officer.advertencias ?? []" />
        </td>

        <td>
          <CursosBadge :cursos="officer.cursos ?? []" />
        </td>

        <td>
          <PatrulhaStatus :patrulhando="officer.patrulhando" :ultima-patrulha="officer.ultimaPatrulha" />
        </td>
      </tr>
    </template>
  </BaseTable>
</template>

<script setup>
import BaseTable from '@/components/ui/BaseTable.vue'
import PadIndicator from './PadIndicator.vue'
import CursosBadge from './CursosBadge.vue'
import PatrulhaStatus from './PatrulhaStatus.vue'
import { CARGOS, GRADUACOES, buildDisplayName } from '@/constants/graduacoes'

defineProps({
  officers: { type: Array, required: true },
  loading: { type: Boolean, default: false },
})

function getCargoLabel(value) { return CARGOS.find((c) => c.value === value)?.label ?? value }
function getGraduacaoLabel(value) { return GRADUACOES.find((g) => g.value === value)?.label ?? value }
function getGraduacaoPrefix(value) { return GRADUACOES.find((g) => g.value === value)?.nickPrefix ?? '' }

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style scoped>
.td-policial { min-width: 200px; }

.officer-info { display: flex; flex-direction: column; gap: 1px; }

.officer-name-row { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }

.badge-ausente {
  font-size: var(--fs-2xs);
  font-weight: var(--fw-semibold);
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fcd34d;
  white-space: nowrap;
  flex-shrink: 0;
}

.officer-display {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.officer-username { font-size: var(--fs-xs); color: var(--text-faint); }

.cargo-badges { display: flex; gap: 0.3rem; flex-wrap: wrap; }

.cargo-badge {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--border-soft);
  background: var(--surface-subtle);
  color: var(--text-soft);
  white-space: nowrap;
}

.cargo-badge.cargo-p1 { background: var(--surface-brand-soft); color: var(--primary); border-color: var(--primary-light); }
.cargo-badge.cargo-p3 { background: var(--warning-soft); color: var(--warning); border-color: var(--accent-light); }
.cargo-badge.cargo-p5 { background: var(--success-bg); color: var(--success); border-color: #bbf7d0; }
.cargo-badge.cargo-estagio { background: var(--danger-soft); color: var(--error); border-color: var(--error); }
.cargo-badge.cargo-rocam { background: var(--surface-subtle); color: var(--accent); border-color: var(--accent-light); }
.cargo-badge.cargo-bracal_rocam { background: var(--warning-soft); color: var(--warning); border-color: var(--accent-light); }

.grad-cell { display: flex; align-items: center; gap: 0.4rem; }
.grad-prefix { font-size: var(--fs-md); line-height: 1; }
.grad-label { font-size: var(--fs-sm); color: var(--text); white-space: nowrap; }

.td-date { white-space: nowrap; }
.date-value { color: var(--text-soft); font-size: var(--fs-sm); }
.no-value { color: var(--text-faint); }
</style>
