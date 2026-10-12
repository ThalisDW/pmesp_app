<template>
  <header class="topbar">
    <div class="topbar-left">
      <div class="page-meta">
        <h1 class="page-title">{{ title }}</h1>
        <span class="page-breadcrumb">{{ breadcrumb }}</span>
      </div>
    </div>
    <div class="topbar-right">
      <button class="theme-toggle" type="button" @click="toggleTheme">
        <svg v-if="isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3c0 .3-.01.6-.01.9A7.2 7.2 0 0 0 20.1 12c.3 0 .6-.01.9-.01z" />
        </svg>
        <span>{{ themeLabel }}</span>
      </button>
      <div class="datetime">
        <span class="date">{{ currentDate }}</span>
        <span class="time">{{ currentTime }}</span>
      </div>
      <div class="topbar-user" @mouseenter="showUserMenu = true" @mouseleave="showUserMenu = false">
        <button
          class="topbar-avatar avatar-button"
          type="button"
          :aria-expanded="showUserMenu"
          aria-haspopup="true"
        >
          {{ initials }}
        </button>

        <div v-if="showUserMenu" class="user-popover" role="menu">
          <span class="topbar-name">{{ userName }}</span>
          <span class="topbar-role">{{ roleLabel }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: 'Dashboard',
  },
  breadcrumb: {
    type: String,
    default: 'Início',
  },
  currentDate: {
    type: String,
    required: true,
  },
  currentTime: {
    type: String,
    required: true,
  },
  initials: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    default: '',
  },
  roleLabel: {
    type: String,
    default: '',
  },
})

const isDark = ref(false)
const themeLabel = computed(() => (isDark.value ? 'Tema claro' : 'Tema escuro'))
const showUserMenu = ref(false)

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  localStorage.setItem('pmesp_theme', theme)
  isDark.value = theme === 'dark'
}

function resolveInitialTheme() {
  const saved = localStorage.getItem('pmesp_theme')
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function toggleTheme() {
  applyTheme(isDark.value ? 'light' : 'dark')
}

onMounted(() => {
  applyTheme(resolveInitialTheme())
})
</script>

<style scoped>
.topbar {
  background: var(--surface);
  border-bottom: 1px solid var(--border-soft);
  padding: 0 1.75rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.page-meta {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

.page-title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  font-family: var(--font-family-display);
}

.page-breadcrumb {
  font-size: var(--fs-sm);
  color: var(--text-faint);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.theme-toggle {
  height: 2rem;
  border: 1px solid var(--border);
  background: var(--surface-soft);
  color: var(--text-soft);
  border-radius: 999px;
  padding: 0 0.7rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.theme-toggle svg {
  width: 0.85rem;
  height: 0.85rem;
}

.theme-toggle:hover {
  border-color: var(--primary-light);
  color: var(--primary);
  background: var(--surface-brand-soft);
}

.datetime {
  text-align: right;
  display: flex;
  flex-direction: column;
}

.date {
  font-size: var(--fs-xs);
  color: var(--text-muted);
  text-transform: capitalize;
}

.time {
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  color: var(--primary);
  font-variant-numeric: tabular-nums;
}

.topbar-user {
  position: relative;
}

.topbar-avatar {
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
}

.avatar-button {
  border: 1px solid var(--border);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.avatar-button:hover {
  border-color: var(--primary-light);
  background: var(--surface-info-soft);
}

.user-popover {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 12rem;
  padding: 0.65rem 0.8rem;
  border-radius: 0.6rem;
  border: 1px solid var(--border);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  z-index: 20;
}

.topbar-name {
  font-size: var(--fs-md);
  font-weight: var(--fw-semibold);
  color: var(--text);
}

.topbar-role {
  font-size: var(--fs-xs);
  color: var(--text-faint);
}

@media (max-width: 768px) {
  .topbar {
    padding-left: 3.75rem;
  }

  .topbar-right {
    gap: 0.75rem;
  }

  .theme-toggle span {
    display: none;
  }

  .theme-toggle {
    width: 2rem;
    padding: 0;
    justify-content: center;
  }

  .datetime {
    display: none;
  }
}
</style>
