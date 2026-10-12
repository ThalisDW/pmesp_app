<template>
  <div class="page">

    <div ref="scanLineEl" class="scan-line" aria-hidden="true" />

    <!-- Topbar -->
    <header class="topbar">
      <div class="brand">
        <div class="brand-icon">
          <img src="@/assets/images/logo-pmsp.png" alt="Logo PMESP" />
        </div>
        <div class="brand-text">
          <span class="brand-unit">PMESP • RP</span>
          <span class="brand-name">Centro de Comando</span>
        </div>
      </div>
      <RouterLink to="/institucional" class="back-link">← Voltar à institucional</RouterLink>
    </header>

    <!-- Layout principal -->
    <div class="layout">

      <!-- Coluna esquerda -->
      <div class="left-col">
        <div class="left-content">
          <div class="status-tag">
            <span class="status-dot" />
            SISTEMA EM PRONTIDÃO
          </div>

          <h1 class="heading">
            <span class="h-black">Acesso</span>
            <span class="h-blue">Operacional</span>
          </h1>

          <p class="heading-sub">
            Autenticação restrita ao efetivo autorizado da Polícia Militar Brasileira.
            Seu vínculo é validado diretamente no sistema institucional do batalhão.
          </p>

          <ul class="features">
            <li class="feature-item">
              <span class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              <span>Validação automática de pertencimento à corporação</span>
            </li>
            <li class="feature-item">
              <span class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <span>Canal seguro com autenticação via credenciais institucionais</span>
            </li>
            <li class="feature-item">
              <span class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </span>
              <span>Funcional e patente atribuídos na criação de login</span>
            </li>
          </ul>
        </div>

        <!-- Radar decorativo -->
        <div class="radar-wrap">
          <svg class="radar-svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <!-- Círculos concêntricos -->
            <circle cx="200" cy="200" r="188" fill="none" stroke="#d9dee6" stroke-width="1" />
            <circle cx="200" cy="200" r="148" fill="none" stroke="#d9dee6" stroke-width="1" />
            <circle cx="200" cy="200" r="108" fill="none" stroke="#d9dee6" stroke-width="1" />
            <circle cx="200" cy="200" r="68"  fill="none" stroke="#d9dee6" stroke-width="1" />
            <circle cx="200" cy="200" r="30"  fill="none" stroke="#d9dee6" stroke-width="1" />

            <!-- Linhas de eixo -->
            <line x1="200" y1="12"  x2="200" y2="388" stroke="#d9dee6" stroke-width="0.5" />
            <line x1="12"  y1="200" x2="388" y2="200" stroke="#d9dee6" stroke-width="0.5" />
            <line x1="67"  y1="67"  x2="333" y2="333" stroke="#d9dee6" stroke-width="0.5" />
            <line x1="333" y1="67"  x2="67"  y2="333" stroke="#d9dee6" stroke-width="0.5" />

            <!-- Pontos de alvo -->
            <circle ref="dotA" cx="290" cy="142" r="4.5" fill="#dc2626" :class="{ 'dot-detected': detected.a }" />
            <circle ref="dotB" cx="148" cy="258" r="3.5" fill="#dc2626" :class="{ 'dot-detected': detected.b }" />
            <circle ref="dotC" cx="318" cy="272" r="3"   fill="#dc2626" :class="{ 'dot-detected': detected.c }" />

            <!-- Cardinal: N S L O -->
            <text x="200" y="3"   text-anchor="middle" dominant-baseline="hanging" class="cardinal">N</text>
            <text x="200" y="397" text-anchor="middle" dominant-baseline="auto"    class="cardinal">S</text>
            <text x="397" y="200" text-anchor="end"    dominant-baseline="middle"  class="cardinal">L</text>
            <text x="3"   y="200" text-anchor="start"  dominant-baseline="middle"  class="cardinal">O</text>
          </svg>

          <div class="radar-badge">
            <img src="@/assets/images/logo_ft.png" alt="Logo PMESP" />
          </div>
        </div>
      </div>

      <!-- Coluna direita: card de autenticação -->
      <div class="right-col">
        <div class="auth-card">

          <!-- Topo do card -->
          <div class="card-top">
            <span class="card-label">AUTENTICAÇÃO</span>
            <span class="card-restricted">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              RESTRITO
            </span>
          </div>

          <h2 class="card-title">Identificação oficial</h2>
          <p class="card-desc">
            Entre com suas credenciais institucionais para prosseguir com a autenticação.
          </p>

          <!-- Formulário -->
          <form @submit.prevent="handleLogin" novalidate class="form">
            <div class="field">
              <input
                v-model="form.username"
                type="text"
                class="input"
                placeholder="Usuário institucional"
                autocomplete="username"
                required
                :disabled="loading || blocked > 0"
              />
            </div>

            <div class="field">
              <div class="input-wrap">
                <input
                  v-model="form.password"
                  :type="showPwd ? 'text' : 'password'"
                  class="input"
                  placeholder="Senha"
                  autocomplete="current-password"
                  required
                  :disabled="loading || blocked > 0"
                />
                <button type="button" class="toggle-pwd" @click="showPwd = !showPwd">
                  <svg v-if="!showPwd" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                </button>
              </div>
            </div>

            <Transition name="alert-fade">
              <div v-if="error" class="alert-error" role="alert">
                {{ error }}<strong v-if="blocked > 0"> ({{ blocked }}s)</strong>
              </div>
            </Transition>

            <button
              type="submit"
              class="btn-submit"
              :disabled="loading || blocked > 0 || !form.username || !form.password"
            >
              <span v-if="loading" class="spinner" />
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>{{ loading ? 'Verificando...' : blocked > 0 ? `Bloqueado (${blocked}s)` : 'Entrar no Sistema' }}</span>
            </button>
          </form>

          <!-- Verificação automática -->
          <div class="verification">
            <span class="ver-label">VERIFICAÇÃO AUTOMÁTICA</span>
            <ul class="ver-list">
              <li>Suas credenciais serão <strong>verificadas</strong> no banco de dados institucional.</li>
              <li>Só é permitido acesso a membros <strong>ativos</strong> da corporação.</li>
              <li>Novo acesso mediante avaliação de necessidade por parte do setor RH.</li>
            </ul>
          </div>

          <!-- Aviso legal -->
          <div class="card-warning" style="font-weight: 500;">
            Acesso monitorado e auditado. Uso indevido, compartilhamento de credenciais ou tentativas de invasão estão sujeitos às sanções previstas no regulamento disciplinar.
          </div>

          
        </div><!-- Footer do card -->
          <p class="card-footer-line">
            CANAL CRIPTOGRAFADO • SESSÃO TEMPORÁRIA • CONEXÃO SEGURA
          </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useApi } from '@/composables/useApi'

const router = useRouter()
const auth = useAuthStore()
const api = useApi()

const form = reactive({ username: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPwd = ref(false)
const blocked = ref(0)

let countdownTimer = null

// ── Scan line ──
const scanLineEl = ref(null)
const dotA = ref(null)
const dotB = ref(null)
const dotC = ref(null)
const detected = reactive({ a: false, b: false, c: false })

const SCAN_MS = 14000
const MISS_CHANCE = { a: 0.25, b: 0.45, c: 0.35 }
let rafId = null
let scanStart = null
const lastDetect = { a: -Infinity, b: -Infinity, c: -Infinity }

function animateScan(ts) {
  if (!scanStart) scanStart = ts
  const elapsed = (ts - scanStart) % SCAN_MS
  const progress = elapsed / SCAN_MS
  const scanY = progress * (window.innerHeight + 8) - 4

  if (scanLineEl.value) {
    const op = progress < 0.04 ? progress / 0.04 : progress > 0.96 ? (1 - progress) / 0.04 : 1
    scanLineEl.value.style.transform = `translateY(${scanY}px)`
    scanLineEl.value.style.opacity = op
  }

  const dots = [
    { key: 'a', el: dotA.value },
    { key: 'b', el: dotB.value },
    { key: 'c', el: dotC.value },
  ]
  for (const { key, el } of dots) {
    if (!el || detected[key] || ts - lastDetect[key] < SCAN_MS * 0.85) continue
    const rect = el.getBoundingClientRect()
    const dotY = rect.top + rect.height / 2
    if (Math.abs(scanY - dotY) < 10) {
      lastDetect[key] = ts
      if (Math.random() > MISS_CHANCE[key]) {
        detected[key] = true
        setTimeout(() => { detected[key] = false }, 1300)
      }
    }
  }

  rafId = requestAnimationFrame(animateScan)
}

function startCountdown(seconds) {
  blocked.value = seconds
  clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    blocked.value--
    if (blocked.value <= 0) {
      blocked.value = 0
      error.value = ''
      clearInterval(countdownTimer)
    }
  }, 1000)
}

onMounted(() => { rafId = requestAnimationFrame(animateScan) })
onBeforeUnmount(() => {
  clearInterval(countdownTimer)
  if (rafId) cancelAnimationFrame(rafId)
})

async function handleLogin() {
  if (blocked.value > 0) return
  loading.value = true
  error.value = ''
  try {
    const { token, user } = await api.post('/api/auth/login', {
      username: form.username.trim(),
      password: form.password,
    })
    auth.setAuth(token, user)
    router.push(user.firstAccess ? '/primeiro-acesso' : '/')
  } catch (err) {
    if (err.status === 429) {
      startCountdown(parseInt(err.retryAfter || '60', 10))
      error.value = err.message
    } else {
      error.value = err.message || 'Erro ao realizar login'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ── Página ── */
.page {
  min-height: 100vh;
  background: #eef0f4;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* ── Topbar ── */
.topbar {
  height: 56px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.brand-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.brand-icon img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-unit {
  font-size: 0.6rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  line-height: 1;
}

.brand-name {
  font-size: 0.825rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
}

.back-link {
  font-size: 0.8rem;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.15s;
}

.back-link:hover {
  color: #111827;
}

/* ── Layout ── */
.layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ── Coluna esquerda ── */
.left-col {
  flex: 1;
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 4rem 3rem 3rem 5rem;
  overflow: hidden;
}

.left-content {
  position: relative;
  z-index: 2;
  max-width: 520px;
}

/* Status tag */
.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  padding: 0.3rem 0.875rem;
  font-size: 0.65rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1.75rem;
  background: white;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #dc2626;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
}

/* Heading */
.heading {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
  margin-bottom: 1.5rem;
}

.h-black {
  font-size: 4.5rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.h-blue {
  font-size: 4.5rem;
  font-weight: 800;
  color: #1a3a6b;
  letter-spacing: -0.02em;
  text-decoration: underline;
  text-decoration-color: #dc2626;
  text-underline-offset: 10px;
  text-decoration-thickness: 4px;
}

/* Subtítulo */
.heading-sub {
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 2rem;
  max-width: 420px;
}

/* Features */
.features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: #374151;
}

.feature-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #6b7280;
}

.feature-icon svg {
  width: 14px;
  height: 14px;
}

/* ── Radar ── */
.radar-wrap {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-20%);
  width: 360px;
  height: 360px;
  z-index: 1;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radar-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.radar-badge {
  position: relative;
  z-index: 2;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radar-badge img {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

/* Labels cardinais N S L O */
.cardinal {
  font-size: 10px;
  font-weight: 700;
  fill: #b0b8c4;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.08em;
}

/* Detecção dos pontos no radar */
.dot-detected {
  transform-box: fill-box;
  transform-origin: center;
  animation: dotDetect 1.3s ease-out forwards;
}

@keyframes dotDetect {
  0%   { filter: drop-shadow(0 0 0px rgba(220,38,38,0)); transform: scale(1); }
  18%  { filter: drop-shadow(0 0 10px rgba(220,38,38,1)) drop-shadow(0 0 4px rgba(255,180,180,0.9)); transform: scale(3.2); }
  55%  { filter: drop-shadow(0 0 5px rgba(220,38,38,0.5)); transform: scale(1.9); }
  100% { filter: drop-shadow(0 0 0px rgba(220,38,38,0)); transform: scale(1); }
}

/* ── Coluna direita ── */
.right-col {
  width: 460px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  align-items: center;
  justify-content: center;
  padding: 2rem 3rem 2rem 1rem;
  position: relative;
  z-index: 2;
}

/* ── Card ── */
.auth-card {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.card-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.card-restricted {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.65rem;
  font-weight: 700;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  letter-spacing: 0.08em;
}

.card-restricted svg {
  width: 11px;
  height: 11px;
}

.card-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.4rem;
  letter-spacing: -0.01em;
}

.card-desc {
  font-size: 0.825rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

/* ── Form ── */
.form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.field {
  width: 100%;
}

.input {
  width: 100%;
  padding: 0.7rem 0.875rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #111827;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.input::placeholder {
  color: #9ca3af;
}

.input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background: #ffffff;
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-wrap {
  position: relative;
}

.input-wrap .input {
  padding-right: 2.75rem;
}

.toggle-pwd {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.15s;
}

.toggle-pwd:hover {
  color: #374151;
}

.toggle-pwd svg {
  width: 17px;
  height: 17px;
}

/* Alert */
.alert-error {
  padding: 0.625rem 0.875rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #dc2626;
}

/* Submit button */
.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
}

.btn-submit svg {
  width: 16px;
  height: 16px;
}

.btn-submit:hover:not(:disabled) {
  background: #1d4ed8;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
  transform: translateY(-1px);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Verificação ── */
.verification {
  margin-bottom: 1rem;
}

.ver-label {
  display: block;
  font-size: 0.6rem;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
}

.ver-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.ver-list li {
  font-size: 0.775rem;
  color: #374151;
  padding-left: 1rem;
  position: relative;
  line-height: 1.5;
}

.ver-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #9ca3af;
}

.ver-list strong {
  color: #111827;
  font-weight: 600;
}

/* ── Aviso ── */
.card-warning {
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.72rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* ── Footer do card ── */
.card-footer-line {
  text-align: center;
  font-size: 0.6rem;
  color: #9ca3af;
  letter-spacing: 0.1em;
  font-weight: 500;
}

/* ── Scan line de fundo ── */
.scan-line {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(220, 38, 38, 0.4) 20%,
    rgba(220, 38, 38, 0.85) 50%,
    rgba(220, 38, 38, 0.4) 80%,
    transparent 100%
  );
  box-shadow:
    0 0 12px 4px rgba(220, 38, 38, 0.2),
    0 0 40px 10px rgba(220, 38, 38, 0.08);
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  will-change: transform, opacity;
}

/* ── Transitions ── */
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: all 0.2s ease;
}
.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .layout {
    flex-direction: column;
    overflow: auto;
  }

  .left-col {
    padding: 2.5rem 2rem 12rem;
    min-height: 420px;
  }

  .h-black, .h-blue {
    font-size: 3rem;
  }

  .right-col {
    width: 100%;
    padding: 0 1.5rem 2.5rem;
  }

  .auth-card {
    max-width: 100%;
  }

  .radar-wrap {
    width: 340px;
    height: 340px;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
