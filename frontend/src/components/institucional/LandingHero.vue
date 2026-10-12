<template>
  <section class="hero" :style="bgStyle">
    <div class="hero-overlay" />

    <div class="hero-content">
      <div class="hero-body">
        <div class="hero-badge">BATALHÃO OPERACIONAL</div>
        <h1 class="hero-title">
          Força, Disciplina<br />
          e <span class="title-accent">Resultados</span>
        </h1>
        <p class="hero-desc">
          Apreensões realizadas pelo efetivo em operação no período atual
        </p>
      </div>

      <div class="hero-stats">
        <div class="stats-header">
          <div class="stats-divider" />
          <span class="stats-period">APREENSÕES {{ periodLabel }}</span>
          <div class="stats-divider" />
        </div>

        <div class="stats-grid">
          <div v-for="item in ITEMS" :key="item.key" class="stat-card">
            <span class="stat-icon" v-html="item.svg" />
            <strong class="stat-number">{{ (stats && stats[item.key]) ?? 0 }}</strong>
            <span class="stat-lbl">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  imagemHero: { type: String, default: '' },
  stats: { type: Object, default: null },
  mes: { type: Number, default: null },
  ano: { type: Number, default: null },
})

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const periodLabel = computed(() => {
  const m = props.mes ?? new Date().getMonth() + 1
  const a = props.ano ?? new Date().getFullYear()
  return `${MESES[m - 1].toUpperCase()} / ${a}`
})

const bgStyle = computed(() =>
  props.imagemHero ? { backgroundImage: `url(${props.imagemHero})` } : {}
)

const ITEMS = [
  {
    key: 'armasFogo',
    label: 'Armas de Fogo',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="4"/>
      <line x1="2" y1="12" x2="8" y2="12"/>
      <line x1="16" y1="12" x2="22" y2="12"/>
      <line x1="12" y1="2" x2="12" y2="8"/>
      <line x1="12" y1="16" x2="12" y2="22"/>
    </svg>`,
  },
  {
    key: 'drogas',
    label: 'Drogas',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="8" width="18" height="13" rx="2"/>
      <path d="M8 8V5a4 4 0 0 1 8 0v3"/>
      <line x1="12" y1="12" x2="12" y2="17"/>
      <line x1="9.5" y1="14.5" x2="14.5" y2="14.5"/>
    </svg>`,
  },
  {
    key: 'explosivos',
    label: 'Explosivos',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>`,
  },
  {
    key: 'itensRoubados',
    label: 'Itens Roubados',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>`,
  },
  {
    key: 'armasBrancas',
    label: 'Armas Brancas',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14.5 17.5L3 6 3 3h3l11.5 11.5"/>
      <path d="M13 19l6-6"/>
      <path d="M16 16l4 4"/>
      <path d="M10 10L5 5"/>
    </svg>`,
  },
  {
    key: 'dinheiroSujo',
    label: 'Dinheiro Sujo',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>`,
  },
  {
    key: 'municao',
    label: 'Munição',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>`,
  },
]
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  background-color: #080d1a;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(5, 8, 16, 0.6) 0%,
    rgba(5, 8, 16, 0.25) 35%,
    rgba(5, 8, 16, 0.75) 75%,
    rgba(5, 8, 16, 0.97) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 120px 4rem 3rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.hero-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 0;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--accent);
  border: 1px solid rgba(200, 169, 81, 0.4);
  padding: 0.35rem 0.875rem;
  border-radius: 999px;
  margin-bottom: 1.5rem;
  width: fit-content;
}

.hero-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  margin: 0 0 1.25rem;
  font-family: var(--font-family-display);
}

.title-accent {
  color: var(--accent);
}

.hero-desc {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
  max-width: 480px;
  line-height: 1.6;
}

.hero-stats {
  padding-bottom: 1rem;
}

.stats-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.stats-divider {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(200, 169, 81, 0.4), transparent);
}

.stats-period {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--accent);
  white-space: nowrap;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.75rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 1.25rem 0.875rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.11);
  border-color: rgba(200, 169, 81, 0.3);
  transform: translateY(-2px);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--accent);
}

.stat-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  font-family: var(--font-family-display);
}

.stat-lbl {
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  line-height: 1.3;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-content {
    padding: 100px 1.5rem 2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
