<template>
  <BaseModal
    :open="open"
    :title="fardamento ? 'Editar Fardamento' : 'Novo Fardamento'"
    max-width="600px"
    @close="$emit('close')"
  >
    <div class="foto-section">
      <div class="foto-preview">
        <img v-if="form.foto" :src="form.foto" class="foto-img" alt="Imagem do fardamento" />
        <div v-else class="foto-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      </div>
      <div class="foto-controls">
        <label class="btn-upload">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          {{ form.foto ? 'Trocar imagem' : 'Adicionar imagem' }}
          <input type="file" accept="image/*" @change="handleFoto" />
        </label>
        <button v-if="form.foto" class="btn-remove-foto" @click="form.foto = ''">Remover imagem</button>
      </div>
      <span v-if="fotoError" class="foto-error">{{ fotoError }}</span>
    </div>

    <div class="field">
      <label class="field-label">Nome <span class="req">*</span></label>
      <input v-model="form.nome" class="field-input" placeholder="Nome do fardamento" maxlength="120" />
    </div>

    <div class="field">
      <label class="field-label">Descrição</label>
      <textarea v-model="form.descricao" class="field-input field-textarea" placeholder="Descrição opcional" maxlength="500" rows="2" />
    </div>

    <div class="section-label">Inventário</div>

    <div class="campos-form">
      <div class="campo-col">
        <div v-for="item in camposEsq" :key="item.key" class="field field--sm">
          <label class="field-label">{{ item.label }}</label>
          <input v-model="form[item.key]" class="field-input" :placeholder="item.placeholder" maxlength="30" />
        </div>
      </div>
      <div class="campo-col">
        <div v-for="item in camposDir" :key="item.key" class="field field--sm">
          <label class="field-label">{{ item.label }}</label>
          <input v-model="form[item.key]" class="field-input" :placeholder="item.placeholder" maxlength="30" />
        </div>
      </div>
    </div>

    <div v-if="error" class="error-msg">{{ error }}</div>

    <template #footer>
      <button class="btn-ghost" @click="$emit('close')">Cancelar</button>
      <button class="btn-primary" :disabled="!isValid || loading" @click="handleConfirm">
        <span v-if="loading">Salvando...</span>
        <span v-else>{{ fardamento ? 'Salvar Alterações' : 'Criar Fardamento' }}</span>
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  fardamento: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['close', 'confirm'])

const camposEsq = [
  { key: 'maos', label: 'Mãos', placeholder: 'Ex: 321/4' },
  { key: 'jaqueta', label: 'Jaqueta', placeholder: 'Ex: M' },
  { key: 'mochila', label: 'Mochila', placeholder: 'Ex: 2' },
  { key: 'acessorios', label: 'Acessórios', placeholder: 'Ex: Kit B' },
  { key: 'sapatos', label: 'Sapatos', placeholder: 'Ex: 42' },
  { key: 'chapeu', label: 'Chapéu', placeholder: 'Ex: L' },
]

const camposDir = [
  { key: 'camisa', label: 'Camisa', placeholder: 'Ex: M' },
  { key: 'coletes', label: 'Coletes', placeholder: 'Ex: 3' },
  { key: 'adesivos', label: 'Adesivos', placeholder: 'Ex: Set 2' },
  { key: 'calcas', label: 'Calças', placeholder: 'Ex: 40' },
  { key: 'mascara', label: 'Máscara', placeholder: 'Ex: P' },
]

const emptyForm = () => ({
  foto: '',
  nome: '',
  descricao: '',
  maos: '', jaqueta: '', mochila: '', acessorios: '', sapatos: '', chapeu: '',
  camisa: '', coletes: '', adesivos: '', calcas: '', mascara: '',
})

const form = reactive(emptyForm())
const fotoError = ref('')

watch(() => props.open, (val) => {
  if (!val) return
  fotoError.value = ''
  const f = props.fardamento
  if (f) {
    form.foto = f.foto ?? ''
    form.nome = f.nome ?? ''
    form.descricao = f.descricao ?? ''
    form.maos = f.maos ?? ''
    form.jaqueta = f.jaqueta ?? ''
    form.mochila = f.mochila ?? ''
    form.acessorios = f.acessorios ?? ''
    form.sapatos = f.sapatos ?? ''
    form.chapeu = f.chapeu ?? ''
    form.camisa = f.camisa ?? ''
    form.coletes = f.coletes ?? ''
    form.adesivos = f.adesivos ?? ''
    form.calcas = f.calcas ?? ''
    form.mascara = f.mascara ?? ''
  } else {
    Object.assign(form, emptyForm())
  }
})

function handleFoto(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (file.size > 10 * 1024 * 1024) {
    fotoError.value = 'Imagem muito grande. Máximo 10MB.'
    event.target.value = ''
    return
  }
  fotoError.value = ''
  const reader = new FileReader()
  reader.onload = (e) => { form.foto = e.target.result }
  reader.readAsDataURL(file)
}

const isValid = computed(() => !!form.nome.trim())

function handleConfirm() {
  if (!isValid.value) return
  emit('confirm', {
    nome: form.nome.trim(),
    descricao: form.descricao.trim(),
    foto: form.foto,
    maos: form.maos.trim(),
    jaqueta: form.jaqueta.trim(),
    mochila: form.mochila.trim(),
    acessorios: form.acessorios.trim(),
    sapatos: form.sapatos.trim(),
    chapeu: form.chapeu.trim(),
    camisa: form.camisa.trim(),
    coletes: form.coletes.trim(),
    adesivos: form.adesivos.trim(),
    calcas: form.calcas.trim(),
    mascara: form.mascara.trim(),
  })
}
</script>

<style scoped>
.foto-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.foto-preview {
  width: 80px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  background: var(--surface-subtle);
  border: 1px solid var(--border-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}

.foto-img { width: 100%; height: 100%; object-fit: cover; }

.foto-placeholder { color: var(--border); }
.foto-placeholder svg { width: 32px; height: 32px; }

.foto-controls {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.btn-upload {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--text-soft);
  cursor: pointer;
  font-family: inherit;
  transition: background 0.12s, color 0.12s;
  white-space: nowrap;
}

.btn-upload svg { width: 14px; height: 14px; }
.btn-upload:hover { background: var(--surface-subtle); color: var(--text-strong); }
.btn-upload input { display: none; }

.btn-remove-foto {
  font-size: var(--fs-xs);
  color: var(--error);
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  padding: 0.2rem 0;
  text-align: left;
  transition: opacity 0.12s;
}

.btn-remove-foto:hover { opacity: 0.7; }

.foto-error {
  width: 100%;
  font-size: var(--fs-xs);
  color: var(--error);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field--sm {}

.field-label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.req { color: var(--error); }

.field-input {
  width: 100%;
  min-width: 0;
  padding: 0.55rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: var(--fs-sm);
  color: var(--text);
  background: var(--surface);
  font-family: inherit;
  transition: border-color 0.15s;
  outline: none;
}

.field-input:focus { border-color: var(--primary); }

.field-textarea {
  resize: vertical;
  min-height: 56px;
}

.section-label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary);
  border-bottom: 1px solid var(--border-soft);
  padding-bottom: 0.4rem;
}

.campos-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem 1rem;
}

.campo-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.error-msg {
  font-size: var(--fs-sm);
  color: var(--error);
  background: var(--danger-soft);
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
}

@media (max-width: 500px) {
  .campos-form { grid-template-columns: 1fr; }
}
</style>
