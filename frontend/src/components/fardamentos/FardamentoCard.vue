<template>
  <div class="fardamento-card">
    <div class="card-img-wrap">
      <img v-if="fardamento.foto" :src="fardamento.foto" class="card-img" :alt="fardamento.nome" />
      <div v-else class="card-img-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span>Sem imagem</span>
      </div>

      <template v-if="isP3">
        <div v-if="confirmDelete" class="actions-overlay confirm-overlay">
          <span class="confirm-text">Excluir?</span>
          <button class="act-btn act-danger" title="Confirmar exclusão" @click="$emit('remover', fardamento._id)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
          <button class="act-btn" title="Cancelar" @click="confirmDelete = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div v-else class="actions-overlay">
          <button
            class="act-btn"
            title="Mover para cima"
            :disabled="isFirst || actionLoading"
            @click="$emit('mover-cima', fardamento._id)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
          <button
            class="act-btn"
            title="Mover para baixo"
            :disabled="isLast || actionLoading"
            @click="$emit('mover-baixo', fardamento._id)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <button class="act-btn" title="Editar" @click="$emit('editar', fardamento)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button class="act-btn act-danger-trigger" title="Excluir" @click="confirmDelete = true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </template>
    </div>

    <div class="card-body">
      <div class="card-info">
        <span class="card-nome">{{ fardamento.nome }}</span>
        <span v-if="fardamento.descricao" class="card-descricao">{{ fardamento.descricao }}</span>
      </div>

      <div class="campos-grid">
        <div class="campo-col">
          <div v-for="item in camposEsq" :key="item.key" class="campo-item">
            <span class="campo-label">{{ item.label }}</span>
            <span class="campo-val">{{ fardamento[item.key] || '—' }}</span>
          </div>
        </div>
        <div class="campo-col">
          <div v-for="item in camposDir" :key="item.key" class="campo-item">
            <span class="campo-label">{{ item.label }}</span>
            <span class="campo-val">{{ fardamento[item.key] || '—' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  fardamento: { type: Object, required: true },
  isP3: { type: Boolean, default: false },
  isFirst: { type: Boolean, default: false },
  isLast: { type: Boolean, default: false },
  actionLoading: { type: Boolean, default: false },
})

defineEmits(['editar', 'remover', 'mover-cima', 'mover-baixo'])

const confirmDelete = ref(false)

const camposEsq = [
  { key: 'maos', label: 'Mãos' },
  { key: 'jaqueta', label: 'Jaqueta' },
  { key: 'mochila', label: 'Mochila' },
  { key: 'acessorios', label: 'Acessórios' },
  { key: 'sapatos', label: 'Sapatos' },
  { key: 'chapeu', label: 'Chapéu' },
]

const camposDir = [
  { key: 'camisa', label: 'Camisa' },
  { key: 'coletes', label: 'Coletes' },
  { key: 'adesivos', label: 'Adesivos' },
  { key: 'calcas', label: 'Calças' },
  { key: 'mascara', label: 'Máscara' },
]
</script>

<style scoped>
.fardamento-card {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-img-wrap {
  position: relative;
  width: 100%;
  height: 210px;
  background: var(--surface-subtle);
  flex-shrink: 0;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--border);
}

.card-img-placeholder svg {
  width: 40px;
  height: 40px;
}

.card-img-placeholder span {
  font-size: var(--fs-xs);
  color: var(--text-faint);
}

.actions-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.confirm-overlay {
  align-items: flex-end;
}

.confirm-text {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: #fff;
  background: rgba(0,0,0,0.65);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  margin-bottom: 2px;
}

.act-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-soft);
  transition: background 0.12s, color 0.12s;
  padding: 0;
  flex-shrink: 0;
}

.act-btn svg { width: 13px; height: 13px; }

.act-btn:hover:not(:disabled) {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.act-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.act-btn.act-danger-trigger:hover:not(:disabled) {
  background: var(--error);
  color: #fff;
  border-color: var(--error);
}

.act-btn.act-danger {
  background: var(--error);
  color: #fff;
  border-color: var(--error);
}

.act-btn.act-danger:hover {
  background: #b91c1c;
  border-color: #b91c1c;
}

.card-body {
  padding: 0.9rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  flex: 1;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card-nome {
  font-size: var(--fs-md);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
  line-height: 1.3;
}

.card-descricao {
  font-size: var(--fs-sm);
  color: var(--text-muted);
  line-height: 1.4;
}

.campos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 0.5rem;
  border-top: 1px solid var(--border-soft);
  padding-top: 0.65rem;
}

.campo-col {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.campo-item {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
}

.campo-label {
  font-size: var(--fs-2xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  flex-shrink: 0;
}

.campo-val {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--text);
  font-family: var(--font-family-display);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
