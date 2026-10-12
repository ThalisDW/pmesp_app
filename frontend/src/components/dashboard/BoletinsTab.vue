<template>
  <div class="tab-content">
    <div v-if="loading" class="tab-feedback">
      <div class="spinner" />
      <span>Carregando boletins...</span>
    </div>

    <div v-else-if="boletins.length === 0" class="tab-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <span>Nenhum boletim emitido.</span>
    </div>

    <div v-else class="boletim-list">
      <div v-for="boletim in boletins" :key="boletim._id" class="boletim-card">
        <div class="boletim-header">
          <div class="boletim-title-row">
            <span class="boletim-badge">BOLETIM INTERNO</span>
            <span class="boletim-date">{{ formatDate(boletim.createdAt) }}</span>
          </div>
          <span class="boletim-autor">Emitido por: {{ boletim.autorNome }} — RG {{ boletim.autorRg }}</span>
        </div>

        <div class="boletim-parts">
          <div class="part-item">
            <span class="part-label">1ª PARTE — SERVIÇOS DIÁRIOS</span>
            <p class="part-text">{{ boletim.parte1 }}</p>
          </div>
          <div class="part-item">
            <span class="part-label">2ª PARTE — INSTRUÇÃO E OPERAÇÕES POLICIAIS</span>
            <p class="part-text">{{ boletim.parte2 }}</p>
          </div>
          <div class="part-item">
            <span class="part-label">3ª PARTE — ASSUNTOS GERAIS E ADMINISTRATIVOS</span>
            <p class="part-text">{{ boletim.parte3 }}</p>
          </div>
          <div class="part-item">
            <span class="part-label">4ª PARTE — JUSTIÇA E DISCIPLINA</span>
            <p class="part-text">{{ boletim.parte4 }}</p>
          </div>
        </div>

        <div class="boletim-footer">
          <span class="boletim-assina">Assina: {{ boletim.autorNome }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  boletins: { type: Array, required: true },
  loading: { type: Boolean, default: false },
})

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

.boletim-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.boletim-card {
  background: var(--surface-soft);
  border: 1px solid var(--border-soft);
  border-left: 3px solid var(--primary);
  border-radius: 8px;
  padding: 1.25rem;
}

.boletim-header {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.boletim-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.boletim-badge {
  font-size: var(--fs-xs);
  font-weight: var(--fw-bold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary);
  background: var(--surface-brand-soft);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}

.boletim-date {
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

.boletim-autor {
  font-size: var(--fs-xs);
  color: var(--text-faint);
}

.boletim-parts {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.part-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.part-label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.part-text {
  font-size: var(--fs-sm);
  color: var(--text-soft);
  line-height: var(--lh-relaxed);
  white-space: pre-line;
  padding-left: 0.5rem;
  border-left: 2px solid var(--border-soft);
}

.boletim-footer {
  border-top: 1px solid var(--border-soft);
  padding-top: 0.75rem;
}

.boletim-assina {
  font-size: var(--fs-sm);
  font-style: italic;
  color: var(--text-soft);
}
</style>
