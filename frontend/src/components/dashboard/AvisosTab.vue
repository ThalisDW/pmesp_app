<template>
  <div class="tab-content">
    <div v-if="loading" class="tab-feedback">
      <div class="spinner" />
      <span>Carregando avisos...</span>
    </div>

    <div v-else-if="avisos.length === 0" class="tab-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      <span>Nenhum aviso publicado.</span>
    </div>

    <div v-else class="aviso-list">
      <div v-for="aviso in avisos" :key="aviso._id" class="aviso-card">
        <div class="aviso-header">
          <div class="aviso-meta">
            <span class="aviso-autor">{{ getGraduacaoPrefix(aviso.autorGraduacao) }} {{ aviso.autorNome }}</span>
            <span class="aviso-rg">RG {{ aviso.autorRg }}</span>
          </div>
          <span class="aviso-date">{{ formatDate(aviso.createdAt) }}</span>
        </div>
        <h4 class="aviso-titulo">{{ aviso.titulo }}</h4>
        <p class="aviso-conteudo">{{ aviso.conteudo }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { GRADUACOES } from '@/constants/graduacoes'

defineProps({
  avisos: { type: Array, required: true },
  loading: { type: Boolean, default: false },
})

function getGraduacaoPrefix(value) {
  return GRADUACOES.find((g) => g.value === value)?.nickPrefix ?? ''
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.tab-content { padding: 1rem 0; }

.tab-feedback {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
  color: var(--text-faint);
  font-size: var(--fs-md);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }

.tab-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 3rem;
  color: var(--text-faint);
  font-size: var(--fs-md);
}

.tab-empty svg {
  width: 36px;
  height: 36px;
  color: var(--border);
}

.aviso-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.aviso-card {
  background: var(--surface-soft);
  border: 1px solid var(--border-soft);
  border-left: 3px solid var(--warning);
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.aviso-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.aviso-meta {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.aviso-autor {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

.aviso-rg {
  font-size: var(--fs-xs);
  color: var(--text-faint);
}

.aviso-date {
  font-size: var(--fs-xs);
  color: var(--text-muted);
  white-space: nowrap;
}

.aviso-titulo {
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  color: var(--text);
  margin-bottom: 0.4rem;
}

.aviso-conteudo {
  font-size: var(--fs-sm);
  color: var(--text-soft);
  line-height: var(--lh-relaxed);
  white-space: pre-line;
}
</style>
