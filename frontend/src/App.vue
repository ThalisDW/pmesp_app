<template>
  <RouterView />
  <AppToast />
  <AusenciaAvisoModal
    :open="showAusenciaModal"
    @continuar="dismissModal"
    @ir-ausencias="goToAusencias"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppToast from '@/components/ui/AppToast.vue'
import AusenciaAvisoModal from '@/components/ausencias/AusenciaAvisoModal.vue'

const auth = useAuthStore()
const router = useRouter()
const showAusenciaModal = ref(false)
const modalDismissed = ref(false)

// Reseta dismissed a cada troca de usuário (login/logout)
watch(
  () => auth.user?.id,
  () => { modalDismissed.value = false }
)

watch(
  () => auth.user?.ausente,
  (val) => {
    if (val && !modalDismissed.value) {
      showAusenciaModal.value = true
    } else if (!val) {
      showAusenciaModal.value = false
    }
  },
  { immediate: true }
)

function dismissModal() {
  showAusenciaModal.value = false
  modalDismissed.value = true
}

function goToAusencias() {
  showAusenciaModal.value = false
  modalDismissed.value = true
  router.push('/ausencias')
}
</script>
