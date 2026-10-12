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
      </svg>
    </template>

    <template #head>
      <th>Policial</th>
      <th>Graduação</th>
      <th>Cargo</th>
      <th class="col-center">PAD</th>
      <th class="col-actions">Ações</th>
    </template>

    <template #body>
      <tr v-for="officer in officers" :key="officer._id">
        <td class="td-policial">
          <div class="officer-info">
            <div class="officer-name-row">
              <span class="officer-name">{{ officer.name }}</span>
              <span v-if="officer.ausente" class="badge-ausente">Ausente</span>
            </div>
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
            <span
              v-for="c in officer.cargo"
              :key="c"
              class="cargo-badge"
              :class="`cargo-${c}`"
            >{{ getCargoLabel(c) }}</span>
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

        <td class="col-actions">
          <div class="action-btns">
            <button class="btn-action edit-cargo" title="Editar Cargo" @click="$emit('editarCargo', officer)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="7" cy="12" r="1" />
                <circle cx="17" cy="12" r="1" />
              </svg>
              Cargo
            </button>
            <button class="btn-action promote" title="Promover" @click="$emit('promover', officer)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="18 15 12 9 6 15" />
              </svg>
              Promover
            </button>
            <button class="btn-action warn" title="Advertência" @click="$emit('advertencia', officer)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Advertência
            </button>
            <button class="btn-action dismiss" title="Exonerar" @click="$emit('exonerar', officer)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Exonerar
            </button>
            <button
              v-if="officer.advertencias?.length"
              class="btn-action view-adv"
              :title="`Ver ${officer.advertencias.length} advertência(s)`"
              @click="$emit('verAdvertencias', officer)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              PAD ({{ officer.advertencias.length }})
            </button>
          </div>
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

defineEmits(['promover', 'advertencia', 'exonerar', 'verAdvertencias', 'editarCargo'])

function getGraduacaoLabel(v) { return GRADUACOES.find((g) => g.value === v)?.label ?? v }
function getGraduacaoPrefix(v) { return GRADUACOES.find((g) => g.value === v)?.nickPrefix ?? '' }
function getCargoLabel(v) { return CARGOS.find((c) => c.value === v)?.label ?? v }

function dotClass(i, count) {
  if (i > count) return ''
  if (count === 1) return 'dot-gold'
  if (count === 2) return 'dot-amber'
  return 'dot-red'
}
</script>

<style scoped>
.td-policial { min-width: 180px; }

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

.officer-name {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

.officer-rg { font-size: var(--fs-xs); color: var(--text-faint); }

.grad-cell { display: flex; align-items: center; gap: 0.35rem; white-space: nowrap; }
.grad-prefix { font-size: var(--fs-md); line-height: 1; }
.grad-label { font-size: var(--fs-sm); color: var(--text); }

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
.cargo-badge.cargo-p3 { background: var(--warning-soft); color: var(--warning); }
.cargo-badge.cargo-p5 { background: var(--success-bg); color: var(--success); }
.cargo-badge.cargo-estagio { background: var(--danger-soft); color: var(--error); }
.cargo-badge.cargo-rocam { background: var(--surface-subtle); color: var(--accent); border-color: var(--accent-light); }
.cargo-badge.cargo-bracal_rocam { background: var(--warning-soft); color: var(--warning); border-color: var(--accent-light); }

.pad-dots { display: flex; gap: 4px; justify-content: center; }

.pad-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: var(--surface-subtle);
  border: 1px solid var(--border);
}

.dot-gold { background: var(--accent); border-color: var(--accent); }
.dot-amber { background: var(--warning); border-color: var(--warning); }
.dot-red { background: var(--error); border-color: var(--error); }

.col-actions { min-width: 260px; }

.action-btns { display: flex; gap: 0.4rem; flex-wrap: nowrap; }

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.65rem;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
  transition: background 0.12s, color 0.12s;
}

.btn-action svg { width: 13px; height: 13px; flex-shrink: 0; }

.btn-action.edit-cargo {
  background: var(--surface-subtle);
  color: var(--text-soft);
  border-color: var(--border);
}

.btn-action.edit-cargo:hover { background: var(--accent-light, #e6c96e); color: #7a5c00; border-color: var(--accent); }

.btn-action.promote {
  background: var(--surface-brand-soft);
  color: var(--primary);
  border-color: var(--primary-light);
}

.btn-action.promote:hover { background: var(--primary); color: #fff; }

.btn-action.warn {
  background: var(--warning-soft);
  color: var(--warning);
  border-color: var(--accent-light);
}

.btn-action.warn:hover { background: var(--warning); color: #fff; }

.btn-action.view-adv {
  background: var(--surface-subtle);
  color: var(--text-soft);
  border-color: var(--border);
}

.btn-action.view-adv:hover { background: var(--surface); color: var(--text-strong); }

.btn-action.dismiss {
  background: var(--danger-soft);
  color: var(--error);
  border-color: #fca5a5;
}

.btn-action.dismiss:hover { background: var(--error); color: #fff; }

.btn-action svg {
  color: var(--text-muted);
}
</style>
