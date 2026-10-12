import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useClock() {
  const currentTime = ref('')
  const currentDate = ref('')

  function update() {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    currentDate.value = now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  let timer
  onMounted(() => {
    update()
    timer = setInterval(update, 1000)
  })
  onBeforeUnmount(() => clearInterval(timer))

  return { currentTime, currentDate }
}
