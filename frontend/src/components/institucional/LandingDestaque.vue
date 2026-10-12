<template>
  <section class="destaque-section">
    <div class="destaque-bg-glow" />

    <div class="destaque-container">
      <span class="destaque-tag">MILITAR DESTAQUE</span>

      <div class="destaque-photo-ring">
        <img
          v-if="militar.foto"
          :src="militar.foto"
          :alt="militar.nome"
          class="destaque-photo"
        />
        <div v-else class="destaque-photo-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </div>

      <div class="destaque-deco">
        <div class="deco-line" />
        <span class="deco-star">✦</span>
        <div class="deco-line" />
      </div>

      <h2 class="destaque-name">{{ militar.nome }}</h2>

      <p v-if="militar.descricao" class="destaque-desc">{{ militar.descricao }}</p>

      <div class="destaque-deco">
        <div class="deco-line" />
        <span class="deco-star">✦</span>
        <div class="deco-line" />
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  militar: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.destaque-section {
  background: #04070f;
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;
}

.destaque-bg-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 50%, rgba(200, 169, 81, 0.07) 0%, transparent 65%);
  pointer-events: none;
}

.destaque-container {
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
}

.destaque-tag {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--accent);
  display: inline-flex;
  align-items: center;
  gap: 0.875rem;
}

.destaque-tag::before,
.destaque-tag::after {
  content: '';
  display: inline-block;
  width: 32px;
  height: 1px;
  background: var(--accent);
}

.destaque-photo-ring {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  padding: 3px;
  background: conic-gradient(
    var(--accent) 0deg,
    rgba(200, 169, 81, 0.2) 180deg,
    var(--accent) 360deg
  );
  flex-shrink: 0;
}

.destaque-photo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #04070f;
}

.destaque-photo-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 4px solid #04070f;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.25);
}

.destaque-photo-placeholder svg {
  width: 64px;
  height: 64px;
}

.destaque-deco {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 360px;
}

.deco-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(200, 169, 81, 0.45), transparent);
}

.deco-star {
  color: var(--accent);
  font-size: 0.7rem;
}

.destaque-name {
  font-size: clamp(1.75rem, 4vw, 3rem);
  font-weight: 800;
  color: #fff;
  margin: 0;
  font-family: var(--font-family-display);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  line-height: 1.15;
}

.destaque-desc {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  max-width: 480px;
  line-height: 1.65;
}

@media (max-width: 600px) {
  .destaque-photo-ring {
    width: 160px;
    height: 160px;
  }
}
</style>
