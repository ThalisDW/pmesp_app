<template>
  <BaseModal
    :open="open"
    title="Encerrar Viatura"
    subtitle="Esta ação remove todos da patrulha."
    max-width="420px"
    @close="$emit('close')"
  >
    <template #header-icon>
      <div class="header-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
    </template>

    <div class="viatura-info">
      <span class="viatura-prefixo">{{ viatura?.prefixo }}</span>
      <span class="viatura-crew">{{ crewCount }} tripulante{{ crewCount !== 1 ? 's' : '' }}</span>
    </div>

    <div class="crew-preview">
      <div v-for="{ key, label } in filledRoles" :key="key" class="crew-item">
        <span class="crew-role">{{ label }}</span>
        <span class="crew-name">{{ viatura?.[key]?.name }}</span>
      </div>
    </div>

    <p class="confirm-text">
      O status de patrulha de todos os policiais da barca será encerrado.
    </p>

    <template #footer>
      <button class="btn-ghost" @click="$emit('close')">Cancelar</button>
      <button class="btn-danger" :disabled="loading" @click="$emit('confirm')">
        <span v-if="loading">Encerrando...</span>
        <span v-else>Confirmar Encerramento</span>
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  viatura: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

defineEmits(['close', 'confirm'])

const ROLES = [
  { key: 'motorista', label: 'Motorista' },
  { key: 'chefeDeBarca', label: 'Chefe de Barca' },
  { key: 'auxiliar1', label: '1° Auxiliar' },
  { key: 'auxiliar2', label: '2° Auxiliar' },
  { key: 'auxiliar3', label: '3° Auxiliar' },
]

const filledRoles = computed(() => ROLES.filter((r) => !!props.viatura?.[r.key]))
const crewCount = computed(() => filledRoles.value.length)
</script>

<style scoped>
.header-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--danger-soft);
  color: var(--error);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-icon svg { width: 20px; height: 20px; }

.viatura-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--surface-soft);
  border-radius: 8px;
  border: 1px solid var(--border-soft);
}

.viatura-prefixo {
  font-size: var(--fs-md);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
}

.viatura-crew {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.crew-preview {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.crew-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: var(--fs-sm);
}

.crew-role {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  min-width: 110px;
}

.crew-name { color: var(--text); }

.confirm-text {
  font-size: var(--fs-sm);
  color: var(--text-soft);
  line-height: var(--lh-relaxed);
  padding-top: 0.25rem;
  border-top: 1px solid var(--border-soft);
}
</style>
