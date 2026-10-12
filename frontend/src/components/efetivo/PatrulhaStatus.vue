<template>
  <div class="patrulha-status">
    <span class="status-badge" :class="patrulhando ? 'active' : 'inactive'">
      <span class="status-dot" />
      {{ patrulhando ? 'Em Patrulha' : 'Fora de Serviço' }}
    </span>
    <span class="ultima" :title="ultimaFormatada">{{ ultimaLabel }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  patrulhando: {
    type: Boolean,
    required: true,
  },
  ultimaPatrulha: {
    type: String,
    default: null,
  },
})

const ultimaFormatada = computed(() => {
  if (!props.ultimaPatrulha) return null
  return new Date(props.ultimaPatrulha).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const ultimaLabel = computed(() => {
  if (props.patrulhando) return ''
  if (!props.ultimaPatrulha) return 'Nunca patrulhou'
  return `Última: ${ultimaFormatada.value}`
})
</script>

<style scoped>
.patrulha-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  border: 1px solid transparent;
  width: fit-content;
}

.status-badge.active {
  background: var(--success-bg);
  color: var(--success);
  border-color: #bbf7d0;
}

.status-badge.inactive {
  background: var(--surface-subtle);
  color: var(--text-muted);
  border-color: var(--border-soft);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-badge.active .status-dot {
  background: var(--success);
  box-shadow: 0 0 0 2px #bbf7d0;
}

.status-badge.inactive .status-dot {
  background: var(--text-faint);
}

.ultima {
  font-size: var(--fs-xs);
  color: var(--text-faint);
  padding-left: 0.1rem;
}
</style>
