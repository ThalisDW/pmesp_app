<template>
  <div class="veiculo-card">
    <div class="veiculo-foto">
      <img v-if="veiculo.foto" :src="veiculo.foto" class="foto-img" alt="" />
      <div v-else class="foto-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <path d="M16 8h4l3 3v5h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      </div>
    </div>

    <div class="veiculo-info">
      <div class="veiculo-modelo">{{ veiculo.modelo }}</div>
      <div class="veiculo-ano">{{ veiculo.ano }}</div>
      <div class="prefixos-row">
        <span v-if="veiculo.prefixos.length === 0" class="sem-prefixos">Sem prefixos cadastrados</span>
        <span v-for="p in veiculo.prefixos" :key="p" class="prefixo-badge">{{ p }}</span>
      </div>
    </div>

    <div v-if="isP3" class="veiculo-actions">
      <button class="btn-action btn-edit" :disabled="actionLoading" @click="$emit('editar', veiculo)">
        Editar
      </button>
      <template v-if="!confirmando">
        <button class="btn-action btn-remove" :disabled="actionLoading" @click="confirmando = true">
          Remover
        </button>
      </template>
      <template v-else>
        <span class="confirm-text">Confirmar?</span>
        <button class="btn-action btn-confirm-yes" :disabled="actionLoading" @click="confirmarRemover">
          Sim
        </button>
        <button class="btn-action btn-confirm-no" :disabled="actionLoading" @click="confirmando = false">
          Não
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  veiculo: { type: Object, required: true },
  actionLoading: { type: Boolean, default: false },
  isP3: { type: Boolean, default: false },
})

const emit = defineEmits(['editar', 'remover'])

const confirmando = ref(false)

function confirmarRemover() {
  emit('remover', props.veiculo._id)
}
</script>

<style scoped>
.veiculo-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-soft);
  transition: background 0.12s;
}

.veiculo-card:last-child { border-bottom: none; }
.veiculo-card:hover { background: var(--surface-soft); }

.veiculo-foto {
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: var(--surface-subtle);
  border: 1px solid var(--border-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}

.foto-img { width: 100%; height: 100%; object-fit: cover; }

.foto-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--border);
}

.foto-placeholder svg { width: 28px; height: 28px; }

.veiculo-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.veiculo-modelo {
  font-size: var(--fs-md);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.veiculo-ano {
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

.prefixos-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 3px;
}

.prefixo-badge {
  font-size: var(--fs-2xs);
  font-weight: var(--fw-semibold);
  padding: 0.1rem 0.45rem;
  background: var(--surface-brand-soft);
  color: var(--primary);
  border: 1px solid var(--primary-light);
  border-radius: 999px;
  font-family: var(--font-family-display);
}

.sem-prefixos {
  font-size: var(--fs-xs);
  color: var(--text-faint);
  font-style: italic;
}

.veiculo-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
}

.btn-action {
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  font-family: inherit;
  cursor: pointer;
  border: 1px solid var(--border);
  background: none;
  transition: background 0.12s, color 0.12s;
  white-space: nowrap;
}

.btn-action:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-edit { color: var(--text-soft); }
.btn-edit:hover:not(:disabled) { background: var(--surface-subtle); color: var(--text-strong); }

.btn-remove { color: var(--error); border-color: var(--error); }
.btn-remove:hover:not(:disabled) { background: var(--danger-soft); }

.confirm-text {
  font-size: var(--fs-xs);
  color: var(--text-muted);
  white-space: nowrap;
}

.btn-confirm-yes { color: var(--error); border-color: var(--error); }
.btn-confirm-yes:hover:not(:disabled) { background: var(--danger-soft); }

.btn-confirm-no { color: var(--text-soft); }
.btn-confirm-no:hover:not(:disabled) { background: var(--surface-subtle); }

@media (max-width: 600px) {
  .veiculo-card { flex-wrap: wrap; }
  .veiculo-actions { width: 100%; }
}
</style>
