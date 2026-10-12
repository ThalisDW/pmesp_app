<template>
  <BaseModal
    :open="open"
    title="Relatório Semanal de Apreensões"
    :subtitle="selectedOpt?.label"
    max-width="680px"
    @close="$emit('close')"
  >
    <template #header-icon>
      <div class="modal-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>
    </template>

    <div class="week-controls">
      <label class="week-label">Semana:</label>
      <select v-model="selectedWeek" class="week-select" @change="onWeekChange">
        <option v-for="opt in weekOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <div v-if="store.semanalError" class="error-bar">
      {{ store.semanalError }}
    </div>

    <TotaisCard
      :totais="store.semanalStats?.totais ?? null"
      :loading="store.semanalLoading"
      :mes-label="selectedOpt?.label"
    />

    <template #footer>
      <button class="btn-ghost" @click="$emit('close')">Fechar</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useApreensaoStore } from '@/stores/apreensoes'
import BaseModal from '@/components/ui/BaseModal.vue'
import TotaisCard from '@/components/apreensoes/TotaisCard.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
})

defineEmits(['close'])

const store = useApreensaoStore()

function localISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function brDate(date) {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}/${m}/${y}`
}

const weekOptions = computed(() => {
  const now = new Date()
  const day = now.getDay() // 0=Dom..6=Sab
  const diffToMon = day === 0 ? 6 : day - 1

  const baseMonday = new Date(now)
  baseMonday.setDate(now.getDate() - diffToMon)
  baseMonday.setHours(0, 0, 0, 0)

  return Array.from({ length: 4 }, (_, i) => {
    const mon = new Date(baseMonday)
    mon.setDate(baseMonday.getDate() - i * 7)
    const sun = new Date(mon)
    sun.setDate(mon.getDate() + 6)
    return {
      value: localISODate(mon),
      inicio: localISODate(mon),
      fim: localISODate(sun),
      label: `${brDate(mon)} a ${brDate(sun)}`,
    }
  })
})

const selectedWeek = ref(null)

const selectedOpt = computed(
  () => weekOptions.value.find((o) => o.value === selectedWeek.value) ?? weekOptions.value[0],
)

watch(
  () => props.open,
  (val) => {
    if (!val) return
    selectedWeek.value = weekOptions.value[0].value
    store.fetchSemanal(selectedOpt.value.inicio, selectedOpt.value.fim)
  },
)

function onWeekChange() {
  store.fetchSemanal(selectedOpt.value.inicio, selectedOpt.value.fim)
}

</script>

<style scoped>
.modal-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--surface-brand-soft, #e8eef8);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--primary);
}

.modal-icon svg {
  width: 18px;
  height: 18px;
}

.week-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.week-label {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-soft);
}

.week-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: var(--fs-sm);
  color: var(--text);
  background: var(--surface);
  font-family: inherit;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;
  min-width: 240px;
}

.week-select:focus {
  border-color: var(--primary);
}

.error-bar {
  padding: 0.75rem 1rem;
  background: var(--error-bg);
  color: var(--error);
  border-radius: 8px;
  font-size: var(--fs-sm);
}

@media (max-width: 768px) {
  .week-select {
    min-width: 0;
    width: 100%;
  }
}
</style>
