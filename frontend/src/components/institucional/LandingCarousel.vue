<template>
  <section class="carousel-section">
    <div class="carousel-header">
      <span class="label-tag">GALERIA</span>
      <h2 class="section-title">Momentos em Operação</h2>
    </div>

    <div class="carousel-wrapper">
      <div class="carousel-track" :style="trackStyle">
        <div v-for="(foto, idx) in fotos" :key="idx" class="carousel-slide">
          <img :src="foto" :alt="`Foto ${idx + 1}`" class="carousel-img" />
        </div>
      </div>

      <button
        v-if="fotos.length > 1"
        class="carousel-btn carousel-btn--prev"
        @click="prev"
        aria-label="Anterior"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        v-if="fotos.length > 1"
        class="carousel-btn carousel-btn--next"
        @click="next"
        aria-label="Próximo"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>

    <div v-if="fotos.length > 1" class="carousel-dots">
      <button
        v-for="(_, idx) in fotos"
        :key="idx"
        class="dot"
        :class="{ 'dot--active': idx === current }"
        @click="goTo(idx)"
        :aria-label="`Ir para foto ${idx + 1}`"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  fotos: { type: Array, required: true },
})

const current = ref(0)
let timer = null

const trackStyle = computed(() => ({
  transform: `translateX(-${current.value * 100}%)`,
  transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
}))

function next() {
  current.value = (current.value + 1) % props.fotos.length
}

function prev() {
  current.value = (current.value - 1 + props.fotos.length) % props.fotos.length
}

function goTo(idx) {
  current.value = idx
  resetTimer()
}

function resetTimer() {
  clearInterval(timer)
  if (props.fotos.length > 1) {
    timer = setInterval(next, 5000)
  }
}

onMounted(resetTimer)
onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.carousel-section {
  background: #060a14;
  padding: 5rem 0 2.5rem;
}

.carousel-header {
  text-align: center;
  padding: 0 2rem;
  margin-bottom: 2.5rem;
}

.label-tag {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: var(--accent);
  margin-bottom: 0.75rem;
}

.section-title {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.88);
  margin: 0;
  font-family: var(--font-family-display);
}

.carousel-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 16 / 7;
}

.carousel-track {
  display: flex;
  height: 100%;
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(5, 8, 16, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  z-index: 2;
}

.carousel-btn:hover {
  background: rgba(200, 169, 81, 0.5);
  border-color: var(--accent);
}

.carousel-btn svg {
  width: 18px;
  height: 18px;
}

.carousel-btn--prev {
  left: 1.5rem;
}

.carousel-btn--next {
  right: 1.5rem;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  padding: 1.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  padding: 0;
}

.dot--active {
  background: var(--accent);
  transform: scale(1.4);
}

@media (max-width: 768px) {
  .carousel-wrapper {
    aspect-ratio: 4 / 3;
  }
}
</style>
