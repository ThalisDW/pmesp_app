<template>
  <BaseModal
    :open="open"
    title="Ausência Registrada"
    subtitle="Você possui uma ausência ativa neste período"
    max-width="440px"
    @close="$emit('continuar')"
  >
    <template #header-icon>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    </template>

    <p class="msg">
      Você está registrado como <strong>ausente</strong>. Acesse a tela de Ausências para visualizar ou retirar sua ausência ativa.
    </p>

    <template #footer>
      <button class="btn-ghost" @click="$emit('continuar')">Continuar</button>
      <button class="btn-primary" @click="$emit('ir-ausencias')">Ver Ausências</button>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/ui/BaseModal.vue'

defineProps({ open: { type: Boolean, required: true } })
defineEmits(['continuar', 'ir-ausencias'])
</script>

<style scoped>
.msg {
  font-size: var(--fs-sm);
  color: var(--text);
  line-height: 1.6;
}
</style>
