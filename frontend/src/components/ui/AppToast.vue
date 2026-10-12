<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toast.visible" class="toast-wrap" :class="`toast--${toast.type}`" role="alert">
        <div class="toast-body">
          <div class="toast-icon">
            <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <svg v-else-if="toast.type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" @click="toast.hide()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div
          :key="toast._key"
          class="toast-progress"
          :style="{ animationDuration: `${toast.duration}ms` }"
          @animationend="toast.hide()"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'
const toast = useToastStore()
</script>

<style scoped>
.toast-wrap {
  position: fixed;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  min-width: 280px;
  max-width: 480px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 14%);
  overflow: hidden;
  font-family: var(--font-family-base);
}

.toast-body {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
}

.toast-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
}

.toast-icon svg {
  width: 18px;
  height: 18px;
}

.toast-message {
  flex: 1;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  line-height: var(--lh-base);
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.1rem;
  display: flex;
  align-items: center;
  opacity: 0.6;
  transition: opacity 0.15s;
}

.toast-close:hover { opacity: 1; }
.toast-close svg { width: 14px; height: 14px; }

.toast-progress {
  height: 3px;
  animation: toast-shrink linear forwards;
  transform-origin: left;
}

@keyframes toast-shrink {
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
}

/* --- type variants --- */
.toast--success {
  background: var(--success-bg);
  border: 1px solid #bbf7d0;
  color: var(--success);
}
.toast--success .toast-progress { background: var(--success); }
.toast--success .toast-close { color: var(--success); }

.toast--error {
  background: var(--danger-soft);
  border: 1px solid #fca5a5;
  color: var(--error);
}
.toast--error .toast-progress { background: var(--error); }
.toast--error .toast-close { color: var(--error); }

.toast--warning {
  background: var(--warning-soft);
  border: 1px solid #fcd34d;
  color: var(--warning);
}
.toast--warning .toast-progress { background: var(--warning); }
.toast--warning .toast-close { color: var(--warning); }

.toast--info {
  background: var(--surface-info-soft);
  border: 1px solid #bfdbfe;
  color: var(--primary-light);
}
.toast--info .toast-progress { background: var(--primary-light); }
.toast--info .toast-close { color: var(--primary-light); }

/* --- transition --- */
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-12px);
}

.toast-enter-to {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.toast-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-12px);
}
</style>
