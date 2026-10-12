<template>
  <span v-if="count === 0" class="no-cursos">—</span>
  <span v-else class="cursos-count" :title="`${count} curso(s) concluído(s)`">
    {{ count }} {{ count === 1 ? 'curso' : 'cursos' }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  cursos: {
    type: Array,
    default: () => [],
  },
})

const count = computed(() => props.cursos.length)
</script>

<style scoped>
.no-cursos {
  color: var(--text-faint);
  font-size: var(--fs-sm);
}

.cursos-count {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: var(--surface-brand-soft);
  color: var(--primary);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--border-soft);
  white-space: nowrap;
}
</style>
