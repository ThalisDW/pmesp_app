<template>
  <BaseModal
    :open="open"
    title="Relatório de Apreensões"
    subtitle="Últimas 15 viaturas em patrulha"
    max-width="620px"
    flush
    @close="$emit('close')"
  >
    <div v-if="loading" class="feedback">
      <div class="spinner" />
      <span>Carregando relatório...</span>
    </div>

    <div v-else-if="viaturas.length === 0" class="empty">
      Nenhuma viatura registrada.
    </div>

    <div v-else class="viatura-list">
      <div
        v-for="v in viaturas"
        :key="v.viaturaId"
        class="viatura-row"
        :class="{ 'viatura-row--open': openIds.has(v.viaturaId) }"
      >
        <div class="viatura-header" @click="toggleViatura(v.viaturaId)">
          <div class="viatura-left">
            <span class="chevron">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
            <div class="viatura-info">
              <span class="viatura-prefixo">{{ v.prefixo }}</span>
              <span class="viatura-meta">
                {{ formatDate(v.abertaEm) }}
                <span class="status-badge" :class="v.status === 'ativa' ? 'badge--ativa' : 'badge--enc'">
                  {{ v.status === 'ativa' ? 'Ativa' : 'Encerrada' }}
                </span>
              </span>
            </div>
          </div>
          <span class="viatura-count">
            {{ v.apreensoes.length }} apreensão{{ v.apreensoes.length !== 1 ? 'ões' : '' }}
          </span>
        </div>

        <div v-if="openIds.has(v.viaturaId)" class="viatura-body">
          <div v-if="v.apreensoes.length === 0" class="no-apreensao">
            Nenhuma apreensão registrada nesta viatura.
          </div>

          <div v-for="a in v.apreensoes" :key="a._id" class="apreensao-entry">
            <div class="apreensao-meta">
              <span class="apreensao-data">{{ formatDateTime(a.createdAt) }}</span>
              <span v-if="a.origem" class="apreensao-origem">{{ a.origem }}</span>
            </div>
            <div class="apreensao-items">
              <span
                v-for="item in ITENS_APREENSAO"
                v-show="a[item.key] > 0"
                :key="item.key"
                class="apreensao-tag"
              >
                {{ item.label }}: <strong>{{ a[item.key] }}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <button class="btn-ghost" @click="$emit('close')">Fechar</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ITENS_APREENSAO } from '@/constants/apreensoes'
import BaseModal from '@/components/ui/BaseModal.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  viaturas: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

defineEmits(['close'])

const openIds = ref(new Set())

watch(() => props.open, (val) => {
  if (!val) openIds.value.clear()
})

function toggleViatura(id) {
  const s = new Set(openIds.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  openIds.value = s
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatDateTime(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.feedback {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
  color: var(--text-faint);
  font-size: var(--fs-sm);
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

.empty {
  padding: 2rem;
  text-align: center;
  color: var(--text-faint);
  font-size: var(--fs-sm);
}

.viatura-list {
  display: flex;
  flex-direction: column;
}

.viatura-row { border-bottom: 1px solid var(--border-soft); }
.viatura-row:last-child { border-bottom: none; }

.viatura-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  cursor: pointer;
  transition: background 0.12s;
  user-select: none;
}

.viatura-header:hover { background: var(--surface-soft); }

.viatura-left {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.chevron {
  color: var(--text-muted);
  display: flex;
  align-items: center;
  transition: transform 0.2s;
}

.chevron svg { width: 15px; height: 15px; }

.viatura-row--open .chevron { transform: rotate(180deg); }

.viatura-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.viatura-prefixo {
  font-size: var(--fs-sm);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
}

.viatura-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--fs-xs);
  color: var(--text-faint);
}

.status-badge {
  font-size: var(--fs-2xs);
  font-weight: var(--fw-semibold);
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge--ativa { background: var(--success-bg); color: var(--success); }
.badge--enc { background: var(--surface-subtle); color: var(--text-muted); }

.viatura-count {
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

.viatura-body {
  background: var(--surface-soft);
  border-top: 1px solid var(--border-soft);
  padding: 0.75rem 1.25rem 0.75rem 2.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.no-apreensao {
  font-size: var(--fs-sm);
  color: var(--text-faint);
  font-style: italic;
}

.apreensao-entry {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--border-soft);
}

.apreensao-entry:last-child { border-bottom: none; padding-bottom: 0; }

.apreensao-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.apreensao-data { font-size: var(--fs-xs); color: var(--text-muted); font-weight: var(--fw-semibold); }
.apreensao-origem { font-size: var(--fs-xs); color: var(--text-soft); font-style: italic; }

.apreensao-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.apreensao-tag {
  font-size: var(--fs-xs);
  background: var(--surface-subtle);
  color: var(--text-soft);
  border: 1px solid var(--border-soft);
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
}

.apreensao-tag strong { color: var(--primary); font-weight: var(--fw-bold); }
</style>
