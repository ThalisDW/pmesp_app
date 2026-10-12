<template>
  <div class="vdrop" :class="{ 'vdrop--open': isOpen }">
    <div class="vdrop-header" @click="isOpen = !isOpen">
      <div class="vdrop-left">
        <span class="vdrop-chevron">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
        <div class="vdrop-info">
          <span class="vdrop-prefixo">{{ viatura.prefixo }}</span>
          <span class="vdrop-meta">
            {{ crewCount }} tripulante{{ crewCount !== 1 ? 's' : '' }} · Aberta há {{ timeOpen }}
          </span>
        </div>
      </div>

      <div class="vdrop-right" @click.stop>
        <span v-if="viatura.observacao" class="vdrop-obs-icon" title="Tem observação">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </span>
        <button
          v-if="showEdit"
          class="btn-edit"
          :disabled="actionLoading"
          @click="$emit('edit-crew', viatura)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Editar
        </button>
        <button
          v-if="showEncerrar"
          class="btn-encerrar"
          :disabled="actionLoading"
          @click="$emit('encerrar', viatura._id)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          Encerrar
        </button>
      </div>
    </div>

    <div v-if="isOpen" class="vdrop-body">
      <div v-if="viatura.observacao" class="vdrop-obs">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {{ viatura.observacao }}
      </div>

      <div class="crew-list">
        <div v-for="{ key, label } in filledRoles" :key="key" class="crew-row">
          <span class="crew-role">{{ label }}</span>
          <div class="crew-officer">
            <span class="crew-prefix">{{ getPrefix(viatura[key].graduacao) }}</span>
            <span class="crew-name">{{ viatura[key].name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { GRADUACOES } from '@/constants/graduacoes'

const props = defineProps({
  viatura: { type: Object, required: true },
  showEncerrar: { type: Boolean, default: false },
  showEdit: { type: Boolean, default: false },
  actionLoading: { type: Boolean, default: false },
})

defineEmits(['encerrar', 'edit-crew'])

const isOpen = ref(false)

const ROLES = [
  { key: 'motorista', label: 'Motorista' },
  { key: 'chefeDeBarca', label: 'Chefe de Barca' },
  { key: 'auxiliar1', label: '1° Auxiliar' },
  { key: 'auxiliar2', label: '2° Auxiliar' },
  { key: 'auxiliar3', label: '3° Auxiliar' },
]

const filledRoles = computed(() => ROLES.filter((r) => !!props.viatura[r.key]))
const crewCount = computed(() => filledRoles.value.length)

const timeOpen = computed(() => {
  const diff = Date.now() - new Date(props.viatura.abertaEm).getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (h > 0) return `${h}h${m > 0 ? m + 'min' : ''}`
  return `${m}min`
})

function getPrefix(v) {
  return GRADUACOES.find((g) => g.value === v)?.nickPrefix ?? ''
}
</script>

<style scoped>
.vdrop {
  border-bottom: 1px solid var(--border-soft);
}

.vdrop:last-child {
  border-bottom: none;
}

.vdrop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  cursor: pointer;
  transition: background 0.12s;
  user-select: none;
}

.vdrop-header:hover {
  background: var(--surface-soft);
}

.vdrop-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.vdrop-chevron {
  color: var(--text-muted);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.vdrop-chevron svg {
  width: 16px;
  height: 16px;
}

.vdrop--open .vdrop-chevron {
  transform: rotate(180deg);
}

.vdrop-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.vdrop-prefixo {
  font-size: var(--fs-sm);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
}

.vdrop-meta {
  font-size: var(--fs-xs);
  color: var(--text-faint);
}

.vdrop-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.vdrop-obs-icon {
  color: var(--text-muted);
  display: flex;
  align-items: center;
}

.vdrop-obs-icon svg {
  width: 14px;
  height: 14px;
}

.btn-edit {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.7rem;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--surface-subtle);
  color: var(--text-soft);
  cursor: pointer;
  font-family: inherit;
  transition: background 0.12s, color 0.12s;
}

.btn-edit svg { width: 13px; height: 13px; }
.btn-edit:hover:not(:disabled) { background: var(--surface); color: var(--text-strong); }
.btn-edit:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-encerrar {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.7rem;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  border-radius: 6px;
  border: 1px solid #fca5a5;
  background: var(--danger-soft);
  color: var(--error);
  cursor: pointer;
  font-family: inherit;
  transition: background 0.12s, color 0.12s;
}

.btn-encerrar svg {
  width: 13px;
  height: 13px;
}

.btn-encerrar:hover:not(:disabled) {
  background: var(--error);
  color: #fff;
}

.btn-encerrar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Body */
.vdrop-body {
  background: var(--surface-soft);
  border-top: 1px solid var(--border-soft);
  padding: 0.75rem 1.25rem 0.75rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.vdrop-obs {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  font-size: var(--fs-sm);
  color: var(--text-soft);
  font-style: italic;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-soft);
}

.vdrop-obs svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--text-muted);
}

.crew-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.crew-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.crew-role {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  min-width: 120px;
  flex-shrink: 0;
}

.crew-officer {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: var(--fs-sm);
}

.crew-prefix {
  font-size: var(--fs-md);
  line-height: 1;
}

.crew-name {
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
}

.crew-rg {
  color: var(--text-faint);
  font-size: var(--fs-xs);
}
</style>
