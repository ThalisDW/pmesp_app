<template>
  <Teleport to="body">
    <button v-if="!isOpen" class="sidebar-hamburger" @click="isOpen = true" aria-label="Abrir menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
    <div v-if="isOpen" class="sidebar-backdrop" @click="isOpen = false" />
  </Teleport>

  <aside class="sidebar" :class="{ 'sidebar--open': isOpen }">
    <div class="sidebar-header">
      <div class="brand">
        <div class="brand-icon">
          <img src="@/assets/images/logo-pmsp.png" alt="Logo PMESP" />
        </div>
        <div class="brand-text">
          <span class="brand-unit">PMESP • RP</span>
          <span class="brand-name">Centro de Comando</span>
        </div>
      </div>
      <button class="sidebar-close" @click="isOpen = false" aria-label="Fechar menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <nav class="sidebar-nav">
      <RouterLink to="/" class="nav-item" :class="{ active: currentPath === '/' }" @click="isOpen = false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span>Dashboard</span>
      </RouterLink>

      <div class="nav-section">Operacional</div>

      <RouterLink to="/efetivo" class="nav-item" :class="{ active: currentPath === '/efetivo' }" @click="isOpen = false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span>Hierarquia</span>
      </RouterLink>

      <a class="nav-item disabled" title="Em desenvolvimento">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>Ocorrências</span>
        <span class="badge-soon">Em breve</span>
      </a>

      <RouterLink
        to="/viaturas"
        class="nav-item"
        :class="{ active: currentPath === '/viaturas' }"
        @click="isOpen = false"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <path d="M16 8h4l3 3v5h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        <span>Registro de Turno</span>
      </RouterLink>

      <RouterLink
        to="/apreensoes"
        class="nav-item"
        :class="{ active: currentPath === '/apreensoes' }"
        @click="isOpen = false"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span>Apreensões</span>
      </RouterLink>

      <RouterLink
        to="/ausencias"
        class="nav-item"
        :class="{ active: currentPath === '/ausencias' }"
        @click="isOpen = false"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>Ausências</span>
      </RouterLink>

      <a class="nav-item disabled" title="Em desenvolvimento">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        <span>Relatórios</span>
        <span class="badge-soon">Em breve</span>
      </a>

      <div class="nav-section">Gestão Operacional</div>

      <RouterLink
        to="/gestao/frota"
        class="nav-item"
        :class="{ active: currentPath === '/gestao/frota' }"
        @click="isOpen = false"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <path d="M16 8h4l3 3v5h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        <span>Frota de Viaturas</span>
      </RouterLink>

      <RouterLink
        to="/fardamentos"
        class="nav-item"
        :class="{ active: currentPath === '/fardamentos' }"
        @click="isOpen = false"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
        </svg>
        <span>Fardamentos</span>
      </RouterLink>

      <div class="nav-section">Gestão de Pessoal</div>

      <RouterLink
        to="/avaliacoes-estagio"
        class="nav-item"
        :class="{ active: currentPath === '/avaliacoes-estagio' }"
        @click="isOpen = false"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <span>Avaliações de Estágio</span>
      </RouterLink>

      <RouterLink
        v-if="canRocam"
        to="/avaliacoes-rocam"
        class="nav-item"
        :class="{ active: currentPath === '/avaliacoes-rocam' }"
        @click="isOpen = false"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <span>Avaliações ROCAM</span>
      </RouterLink>

      <template v-if="isRh || canEmitir">
        <RouterLink
          v-if="isRh"
          to="/gestao/usuarios"
          class="nav-item"
          :class="{ active: currentPath === '/gestao/usuarios' }"
          @click="isOpen = false"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          <span>Cadastrar Policial</span>
        </RouterLink>

        <RouterLink
          v-if="isRh"
          to="/gestao/efetivo"
          class="nav-item"
          :class="{ active: currentPath === '/gestao/efetivo' }"
          @click="isOpen = false"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>Gerenciar Efetivo</span>
        </RouterLink>

        <RouterLink
          v-if="isRh"
          to="/registro-atividade"
          class="nav-item"
          :class="{ active: currentPath === '/registro-atividade' }"
          @click="isOpen = false"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span>Registro de Atividade</span>
        </RouterLink>

        <RouterLink
          v-if="canEmitir"
          to="/emitir-boletim"
          class="nav-item"
          :class="{ active: currentPath === '/emitir-boletim' }"
          @click="isOpen = false"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="12" y1="17" x2="12" y2="17" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>Emitir Boletim</span>
        </RouterLink>
      </template>

      <template v-if="isAdmin">
        <div class="nav-section">Administração</div>
        <RouterLink
          to="/configuracoes"
          class="nav-item"
          :class="{ active: currentPath === '/configuracoes' }"
          @click="isOpen = false"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
          </svg>
          <span>Configurações</span>
        </RouterLink>
      </template>

    </nav>

    <div class="sidebar-footer">
      <div class="user-avatar">{{ initials }}</div>
      <div class="user-details">
        <span class="user-name">{{ userName }}</span>
        <span class="user-rank">{{ userRank }}</span>
      </div>
      <button class="logout-btn" title="Sair" @click="emit('logout')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const isOpen = ref(false)
const auth = useAuthStore()
const canRocam = computed(() =>
  auth.user?.cargo?.includes('rocam') ||
  auth.user?.cargo?.includes('bracal_rocam') ||
  auth.isRh
)

defineProps({
  currentPath: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isRh: {
    type: Boolean,
    default: false,
  },
  canEmitir: {
    type: Boolean,
    default: false,
  },
  isP3: {
    type: Boolean,
    default: false,
  },
  initials: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    default: '',
  },
  userRank: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['logout'])
</script>

<style scoped>
.sidebar {
  width: 260px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid var(--border);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.brand-icon img {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-unit {
  font-size: var(--fs-2xs);
  font-weight: var(--fw-semibold);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.brand-name {
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-section {
  font-size: var(--fs-2xs);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  padding: 0.75rem 1.25rem 0.25rem;
  white-space: nowrap;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 1.25rem;
  color: var(--text-soft);
  transition: background 0.15s, color 0.15s;
  cursor: pointer;
  white-space: nowrap;
  border-left: 3px solid transparent;
  text-decoration: none;
  border: none;
  width: 100%;
  text-align: left;
  background: none;
}

.nav-item svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.nav-item:hover:not(.disabled) {
  background: var(--surface-subtle);
  color: var(--text-strong);
}

.nav-item.active {
  background: var(--surface-brand-soft);
  color: var(--primary);
  border-left-color: var(--primary-light);
}

.nav-item.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.badge-soon {
  margin-left: auto;
  font-size: var(--fs-2xs);
  background: var(--surface-subtle);
  color: var(--text-soft);
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  white-space: nowrap;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-top: 1px solid var(--border);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--surface-brand-soft);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-sm);
  font-weight: var(--fw-bold);
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-rank {
  font-size: var(--fs-xs);
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  transition: color 0.15s;
  flex-shrink: 0;
}

.logout-btn svg {
  width: 18px;
  height: 18px;
}

.logout-btn:hover {
  color: var(--error);
}

.sidebar-close {
  display: none;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 272px;
    z-index: 180;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    border-right: 1px solid var(--border);
  }

  .sidebar--open {
    transform: translateX(0);
  }

  .sidebar-close {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    padding: 0.25rem;
    transition: color 0.15s;
  }

  .sidebar-close:hover { color: var(--text-strong); }

  .sidebar-close svg {
    width: 18px;
    height: 18px;
  }
}

:global(.sidebar-hamburger) {
  display: none;
}

:global(.sidebar-backdrop) {
  display: none;
}

@media (max-width: 768px) {
  :global(.sidebar-hamburger) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0.875rem;
    left: 0.875rem;
    z-index: 200;
    width: 38px;
    height: 38px;
    border-radius: 8px;
    background: var(--surface);
    border: 1px solid var(--border);
    cursor: pointer;
    color: var(--text-soft);
    box-shadow: var(--shadow-sm);
    transition: background 0.15s, color 0.15s;
  }

  :global(.sidebar-hamburger:hover) {
    background: var(--surface-subtle);
    color: var(--text-strong);
  }

  :global(.sidebar-hamburger svg) {
    width: 18px;
    height: 18px;
  }

  :global(.sidebar-backdrop) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgb(0 0 0 / 45%);
    z-index: 170;
  }
}
</style>
