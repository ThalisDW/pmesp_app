<template>
  <div class="pad-indicator" :title="tooltip">
    <div
      v-for="n in 3"
      :key="n"
      class="pad-square"
      :class="squareClass(n)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  count: {
    type: Number,
    required: true,
    validator: (v) => v >= 0 && v <= 3,
  },
  advertencias: {
    type: Array,
    default: () => [],
  },
})

function squareClass(n) {
  if (n > props.count) return 'empty'
  if (props.count === 1) return 'filled level-1'
  if (props.count === 2) return 'filled level-2'
  return 'filled level-3'
}

const tooltip = computed(() => {
  if (props.count === 0) return 'Sem advertências'
  const label = props.count === 1 ? '1 PAD' : `${props.count} PADs`
  return `${label} — máximo: 3`
})
</script>

<style scoped>
.pad-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.pad-square {
  width: 13px;
  height: 13px;
  border-radius: 3px;
  border: 1.5px solid var(--border);
  transition: background 0.15s, border-color 0.15s;
}

.pad-square.empty {
  background: transparent;
}

.pad-square.filled.level-1 {
  background: var(--accent);
  border-color: var(--accent);
}

.pad-square.filled.level-2 {
  background: var(--warning);
  border-color: var(--warning);
}

.pad-square.filled.level-3 {
  background: var(--error);
  border-color: var(--error);
}
</style>
