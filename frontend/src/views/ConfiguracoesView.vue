<template>
  <div class="page-layout">
    <AppSidebar
      :currentPath="route.path"
      :isAdmin="auth.isAdmin"
      :isRh="auth.isRh"
      :isP3="auth.isP3"
      :canEmitir="auth.canEmitir"
      :initials="initials"
      :userName="auth.user?.name"
      :userRank="auth.graduacaoInfo?.label"
      @logout="handleLogout"
    />

    <div class="page-main">
      <AppTopbar
        title="Configurações"
        breadcrumb="Administração"
        :currentDate="currentDate"
        :currentTime="currentTime"
        :initials="initials"
        :userName="auth.user?.name"
        :roleLabel="roleLabel"
      />

      <main class="page-content">
        <div class="config-page">

          <!-- Imagem Hero -->
          <section class="config-card">
            <div class="card-header">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div>
                <h2 class="card-title">Imagem de Fundo</h2>
                <p class="card-desc">Foto exibida como plano de fundo na primeira tela da página institucional</p>
              </div>
            </div>

            <div class="upload-area">
              <div v-if="heroPreview" class="preview-block">
                <img :src="heroPreview" alt="Preview hero" class="preview-wide" />
                <button class="btn-remove" @click="removeHero">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Remover imagem
                </button>
              </div>
              <div v-else-if="store.loading" class="skeleton skeleton--wide" />
              <label v-else class="upload-zone" for="input-hero">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>Clique para selecionar a imagem</span>
                <small>JPG, PNG ou WebP — recomendado 1920×1080 — máx. 5MB</small>
              </label>
              <input id="input-hero" type="file" accept="image/*" class="sr-only" @change="onHeroChange" />
            </div>

            <div class="card-footer">
              <button class="btn-primary" :disabled="!heroDirty || store.saving" @click="saveHero">
                {{ store.saving ? 'Salvando...' : 'Salvar Imagem de Fundo' }}
              </button>
            </div>
          </section>

          <!-- Carrossel -->
          <section class="config-card">
            <div class="card-header">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 3l-4 4-4-4" />
                </svg>
              </div>
              <div>
                <h2 class="card-title">Fotos do Carrossel</h2>
                <p class="card-desc">Até 5 fotos exibidas em sequência abaixo do hero na página institucional</p>
              </div>
            </div>

            <div class="slot-grid">
              <div v-for="idx in 5" :key="idx" class="slot">
                <span class="slot-num">{{ idx }}</span>
                <div v-if="carrosselPreviews[idx - 1]" class="slot-preview">
                  <img :src="carrosselPreviews[idx - 1]" :alt="`Foto ${idx}`" class="slot-img" />
                  <button class="slot-remove" @click="removeCarrossel(idx - 1)" :aria-label="`Remover foto ${idx}`">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div v-else-if="store.loading" class="skeleton skeleton--slot" />
                <label v-else class="slot-empty" :for="`input-carr-${idx}`">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </label>
                <input
                  :id="`input-carr-${idx}`"
                  type="file"
                  accept="image/*"
                  class="sr-only"
                  @change="(e) => onCarrosselChange(e, idx - 1)"
                />
              </div>
            </div>

            <div class="card-footer">
              <button class="btn-primary" :disabled="!carrosselDirty || store.saving" @click="saveCarrossel">
                {{ store.saving ? 'Salvando...' : 'Salvar Fotos do Carrossel' }}
              </button>
            </div>
          </section>

          <!-- Militar Destaque -->
          <section class="config-card">
            <div class="card-header">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h2 class="card-title">Militar Destaque</h2>
                <p class="card-desc">Policial em destaque exibido na seção inferior da página institucional</p>
              </div>
            </div>

            <div class="destaque-form">
              <div class="destaque-col-foto">
                <span class="field-label">Foto do Militar</span>
                <div v-if="militarFotoPreview" class="preview-block">
                  <img :src="militarFotoPreview" alt="Foto militar" class="preview-portrait" />
                  <button class="btn-remove btn-remove--sm" @click="removeMilitarFoto">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Remover
                  </button>
                </div>
                <div v-else-if="store.loading" class="skeleton skeleton--portrait" />
                <label v-else class="upload-zone upload-zone--portrait" for="input-militar-foto">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <small>Selecionar foto</small>
                </label>
                <input id="input-militar-foto" type="file" accept="image/*" class="sr-only" @change="onMilitarFotoChange" />
              </div>

              <div class="destaque-col-fields">
                <div class="field-group">
                  <label class="field-label" for="militar-nome">Nome do Militar</label>
                  <input
                    id="militar-nome"
                    type="text"
                    class="field-input"
                    v-model="militarNome"
                    placeholder="Ex: Cap. João Silva"
                    @input="militarDirty = true"
                  />
                </div>
                <div class="field-group">
                  <label class="field-label" for="militar-desc">Descrição <span class="optional">(opcional)</span></label>
                  <textarea
                    id="militar-desc"
                    class="field-input field-textarea"
                    v-model="militarDesc"
                    placeholder="Ex: Responsável por operações de alto risco..."
                    rows="4"
                    @input="militarDirty = true"
                  />
                </div>
              </div>
            </div>

            <div class="card-footer">
              <button class="btn-primary" :disabled="!militarDirty || store.saving" @click="saveMilitar">
                {{ store.saving ? 'Salvando...' : 'Salvar Militar Destaque' }}
              </button>
            </div>
          </section>

          <Transition name="fade">
            <div v-if="successMsg" class="alert-success">{{ successMsg }}</div>
          </Transition>

          <Transition name="fade">
            <div v-if="store.saveError" class="alert-error">{{ store.saveError }}</div>
          </Transition>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useInstitucionalStore } from '@/stores/institucional'
import { useClock } from '@/composables/useClock'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'

const auth = useAuthStore()
const store = useInstitucionalStore()
const route = useRoute()
const router = useRouter()
const { currentDate, currentTime } = useClock()

const initials = computed(() => {
  return (auth.user?.name || '')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
})

const roleLabel = computed(() => auth.graduacaoInfo?.label || auth.user?.role || '')

const heroPreview = ref('')
const heroDirty = ref(false)

const carrosselPreviews = ref(['', '', '', '', ''])
const carrosselDirty = ref(false)

const militarFotoPreview = ref('')
const militarNome = ref('')
const militarDesc = ref('')
const militarDirty = ref(false)

const successMsg = ref('')

function compressImage(file, maxWidth, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        let w = img.width
        let h = img.height
        if (w > maxWidth) {
          h = Math.round((h * maxWidth) / w)
          w = maxWidth
        }
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

async function onHeroChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  heroPreview.value = await compressImage(file, 1920, 0.82)
  heroDirty.value = true
  e.target.value = ''
}

function removeHero() {
  heroPreview.value = ''
  heroDirty.value = true
}

async function onCarrosselChange(e, idx) {
  const file = e.target.files?.[0]
  if (!file) return
  const b64 = await compressImage(file, 1440, 0.78)
  carrosselPreviews.value = carrosselPreviews.value.map((v, i) => (i === idx ? b64 : v))
  carrosselDirty.value = true
  e.target.value = ''
}

function removeCarrossel(idx) {
  carrosselPreviews.value = carrosselPreviews.value.map((v, i) => (i === idx ? '' : v))
  carrosselDirty.value = true
}

async function onMilitarFotoChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  militarFotoPreview.value = await compressImage(file, 800, 0.82)
  militarDirty.value = true
  e.target.value = ''
}

function removeMilitarFoto() {
  militarFotoPreview.value = ''
  militarDirty.value = true
}

function flash(msg) {
  successMsg.value = msg
  setTimeout(() => { successMsg.value = '' }, 3500)
}

async function saveHero() {
  const ok = await store.saveConfig({ imagemHero: heroPreview.value })
  if (ok) { heroDirty.value = false; flash('Imagem de fundo salva com sucesso!') }
}

async function saveCarrossel() {
  const fotos = carrosselPreviews.value.filter(Boolean)
  const ok = await store.saveConfig({ fotosCarrossel: fotos })
  if (ok) { carrosselDirty.value = false; flash('Fotos do carrossel salvas com sucesso!') }
}

async function saveMilitar() {
  const ok = await store.saveConfig({
    militarDestaque: {
      nome: militarNome.value,
      foto: militarFotoPreview.value,
      descricao: militarDesc.value,
    },
  })
  if (ok) { militarDirty.value = false; flash('Militar destaque salvo com sucesso!') }
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}

onMounted(async () => {
  await store.fetchConfig()
  const cfg = store.config
  if (!cfg) return
  if (cfg.imagemHero) heroPreview.value = cfg.imagemHero
  if (cfg.fotosCarrossel?.length) {
    cfg.fotosCarrossel.forEach((f, i) => {
      if (i < 5) carrosselPreviews.value[i] = f
    })
  }
  if (cfg.militarDestaque) {
    militarNome.value = cfg.militarDestaque.nome || ''
    militarFotoPreview.value = cfg.militarDestaque.foto || ''
    militarDesc.value = cfg.militarDestaque.descricao || ''
  }
})
</script>

<style scoped>
.page-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-light);
}

.page-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.config-page {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.config-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.75rem;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-icon {
  width: 40px;
  height: 40px;
  background: var(--surface-brand-soft);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  flex-shrink: 0;
}

.card-icon svg {
  width: 20px;
  height: 20px;
}

.card-title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-semibold);
  color: var(--text-strong);
  margin: 0 0 0.2rem;
  font-family: var(--font-family-display);
}

.card-desc {
  font-size: var(--fs-sm);
  color: var(--text-muted);
  margin: 0;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border-soft);
}

.upload-area {
  margin-bottom: 0;
}

.upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2.5rem;
  border: 2px dashed var(--border);
  border-radius: 10px;
  cursor: pointer;
  color: var(--text-muted);
  transition: border-color 0.2s, background 0.2s, color 0.2s;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.upload-zone:hover {
  border-color: var(--primary-light);
  background: var(--surface-brand-soft);
  color: var(--primary);
}

.upload-zone svg {
  width: 28px;
  height: 28px;
}

.upload-zone span {
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
}

.upload-zone small {
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

.upload-zone--portrait {
  padding: 2rem 1.25rem;
  width: 160px;
  height: 180px;
  gap: 0.5rem;
}

.upload-zone--portrait svg {
  width: 24px;
  height: 24px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.preview-block {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preview-wide {
  width: 100%;
  max-height: 260px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.preview-portrait {
  width: 160px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.btn-remove {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.875rem;
  background: var(--error-bg);
  color: var(--error);
  border: 1px solid var(--error);
  border-radius: 6px;
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  width: fit-content;
}

.btn-remove:hover {
  background: var(--error);
  color: #fff;
}

.btn-remove svg {
  width: 14px;
  height: 14px;
}

.btn-remove--sm {
  padding: 0.35rem 0.75rem;
}

.slot-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.875rem;
}

.slot {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.slot-num {
  font-size: var(--fs-xs);
  font-weight: var(--fw-bold);
  color: var(--text-muted);
  text-align: center;
}

.slot-preview {
  position: relative;
}

.slot-img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--border);
  display: block;
}

.slot-remove {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(220, 38, 38, 0.9);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: background 0.15s;
}

.slot-remove:hover {
  background: var(--error);
}

.slot-remove svg {
  width: 10px;
  height: 10px;
}

.slot-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  aspect-ratio: 4/3;
  border: 2px dashed var(--border);
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-muted);
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}

.slot-empty:hover {
  border-color: var(--primary-light);
  background: var(--surface-brand-soft);
  color: var(--primary);
}

.slot-empty svg {
  width: 18px;
  height: 18px;
}

.destaque-form {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: start;
}

.destaque-col-foto {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.destaque-col-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text);
}

.optional {
  font-weight: var(--fw-normal);
  color: var(--text-muted);
}

.field-input {
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: var(--fs-sm);
  color: var(--text);
  background: var(--surface);
  outline: none;
  transition: border-color 0.15s;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
}

.field-input:focus {
  border-color: var(--primary-light);
}

.field-textarea {
  resize: vertical;
}

.btn-primary {
  padding: 0.65rem 1.5rem;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: background 0.15s;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-light);
}

.btn-primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.alert-success {
  padding: 0.875rem 1rem;
  background: var(--success-bg);
  color: var(--success);
  border: 1px solid var(--success);
  border-radius: 8px;
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
}

.alert-error {
  padding: 0.875rem 1rem;
  background: var(--error-bg);
  color: var(--error);
  border: 1px solid var(--error);
  border-radius: 8px;
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
}

.skeleton {
  background: var(--surface-subtle);
  border-radius: 10px;
  animation: sk-pulse 1.4s ease-in-out infinite;
}

.skeleton--wide {
  width: 100%;
  height: 200px;
}

.skeleton--slot {
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 8px;
}

.skeleton--portrait {
  width: 160px;
  height: 200px;
  border-radius: 8px;
}

@keyframes sk-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .page-content {
    padding: 1rem;
  }

  .slot-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .destaque-form {
    grid-template-columns: 1fr;
  }
}
</style>
