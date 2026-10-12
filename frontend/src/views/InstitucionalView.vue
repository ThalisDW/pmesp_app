<template>
  <div class="inst-page">
    <nav class="inst-nav">
      <div class="nav-brand">
        <img src="@/assets/images/logo-pmsp.png" alt="PMESP" class="nav-logo" />
        <div class="nav-text">
          <span class="nav-unit">PMESP • RP</span>
          <span class="nav-name">Centro de Comando</span>
        </div>
      </div>
      <RouterLink to="/login" class="nav-login">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Entrar no Sistema
      </RouterLink>
    </nav>

    <LandingHero
      :imagemHero="store.config?.imagemHero || ''"
      :stats="store.stats"
      :mes="store.mes"
      :ano="store.ano"
    />

    <LandingCarousel
      v-if="store.config?.fotosCarrossel?.length"
      :fotos="store.config.fotosCarrossel"
    />

    <LandingDestaque
      v-if="store.config?.militarDestaque?.nome"
      :militar="store.config.militarDestaque"
    />

    <footer class="inst-footer">
      <img src="@/assets/images/logo-pmsp.png" alt="PMESP" class="footer-logo" />
      <span class="footer-name">PMESP — Centro de Comando Institucional</span>
      <span class="footer-copy">Sistema de Gerenciamento Policial</span>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useInstitucionalStore } from '@/stores/institucional'
import LandingHero from '@/components/institucional/LandingHero.vue'
import LandingCarousel from '@/components/institucional/LandingCarousel.vue'
import LandingDestaque from '@/components/institucional/LandingDestaque.vue'

const store = useInstitucionalStore()

onMounted(() => {
  Promise.all([store.fetchConfig(), store.fetchStats()])
})
</script>

<style scoped>
.inst-page {
  min-height: 100vh;
  background: #060a14;
  color: #fff;
}

.inst-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 3rem;
  background: linear-gradient(to bottom, rgba(4, 7, 15, 0.92) 0%, transparent 100%);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.nav-text {
  display: flex;
  flex-direction: column;
}

.nav-unit {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.55);
  text-transform: uppercase;
}

.nav-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.nav-login {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background: rgba(200, 169, 81, 0.12);
  border: 1px solid rgba(200, 169, 81, 0.35);
  border-radius: 8px;
  color: var(--accent);
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
}

.nav-login svg {
  width: 15px;
  height: 15px;
}

.nav-login:hover {
  background: rgba(200, 169, 81, 0.22);
  border-color: var(--accent);
}

.inst-footer {
  background: #020408;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 3rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.3;
}

.footer-name {
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.04em;
}

.footer-copy {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .inst-nav {
    padding: 1rem 1.25rem;
  }

  .nav-unit {
    display: none;
  }
}
</style>
