<template>
  <BaseModal
    :open="open"
    :title="veiculo ? 'Editar Veículo' : 'Cadastrar Veículo'"
    max-width="540px"
    @close="$emit('close')"
  >
    <div class="foto-section">
      <div class="foto-preview">
        <img v-if="form.foto" :src="form.foto" class="foto-img" alt="Foto do veículo" />
        <div v-else class="foto-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="1" y="3" width="15" height="13" rx="2" />
            <path d="M16 8h4l3 3v5h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
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
          {{ form.foto ? 'Trocar foto' : 'Adicionar foto' }}
          <input type="file" accept="image/*" @change="handleFoto" />
        </label>
        <button v-if="form.foto" class="btn-remove-foto" @click="form.foto = ''">Remover foto</button>
      </div>
      <span v-if="fotoError" class="foto-error">{{ fotoError }}</span>
    </div>

    <div class="fields-row">
      <div class="field field--grow">
        <label class="field-label">Modelo <span class="req">*</span></label>
        <input
          v-model="form.modelo"
          class="field-input"
          placeholder="Ex: Ford F-150"
          maxlength="100"
        />
      </div>
      <div class="field field--ano">
        <label class="field-label">Ano <span class="req">*</span></label>
        <input
          v-model.number="form.ano"
          type="number"
          class="field-input"
          :min="1900"
          :max="maxAno"
        />
      </div>
    </div>

    <div class="section-label">Prefixos</div>

    <div class="prefixo-add-row">
      <input
        v-model="novoPrefixo"
        class="field-input"
        placeholder="Ex: M-001"
        maxlength="60"
        @keyup.enter="addPrefixo"
      />
      <button class="btn-add-prefixo" :disabled="!novoPrefixo.trim()" @click="addPrefixo">
        Adicionar
      </button>
    </div>

    <div v-if="form.prefixos.length > 0" class="prefixos-chips">
      <div v-for="(p, i) in form.prefixos" :key="i" class="prefixo-chip">
        <span>{{ p }}</span>
        <button class="chip-remove" @click="removePrefixo(i)" title="Remover">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="error" class="error-msg">{{ error }}</div>

    <template #footer>
      <button class="btn-ghost" @click="$emit('close')">Cancelar</button>
      <button class="btn-primary" :disabled="!isValid || loading" @click="handleConfirm">
        <span v-if="loading">Salvando...</span>
        <span v-else>{{ veiculo ? 'Salvar Alterações' : 'Cadastrar' }}</span>
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  veiculo: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['close', 'confirm'])

const maxAno = new Date().getFullYear() + 1

const form = reactive({
  foto: '',
  modelo: '',
  ano: new Date().getFullYear(),
  prefixos: [],
})

const novoPrefixo = ref('')
const fotoError = ref('')

watch(() => props.open, (val) => {
  if (!val) return
  fotoError.value = ''
  novoPrefixo.value = ''
  if (props.veiculo) {
    form.foto = props.veiculo.foto ?? ''
    form.modelo = props.veiculo.modelo ?? ''
    form.ano = props.veiculo.ano ?? new Date().getFullYear()
    form.prefixos = [...(props.veiculo.prefixos ?? [])]
  } else {
    form.foto = ''
    form.modelo = ''
    form.ano = new Date().getFullYear()
    form.prefixos = []
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

function addPrefixo() {
  const p = novoPrefixo.value.trim()
  if (!p || form.prefixos.includes(p)) return
  form.prefixos.push(p)
  novoPrefixo.value = ''
}

function removePrefixo(i) {
  form.prefixos.splice(i, 1)
}

const isValid = computed(() => !!form.modelo.trim() && form.ano >= 1900 && form.ano <= maxAno)

function handleConfirm() {
  if (!isValid.value) return
  emit('confirm', {
    modelo: form.modelo.trim(),
    ano: form.ano,
    foto: form.foto,
    prefixos: [...form.prefixos],
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
  height: 80px;
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
.foto-placeholder svg { width: 36px; height: 36px; }

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

.fields-row {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.field--grow { flex: 1; }
.field--ano { width: 90px; flex-shrink: 0; }

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

.section-label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary);
  border-bottom: 1px solid var(--border-soft);
  padding-bottom: 0.4rem;
}

.prefixo-add-row {
  display: flex;
  gap: 0.5rem;
}

.prefixo-add-row .field-input { flex: 1; }

.btn-add-prefixo {
  padding: 0.55rem 0.9rem;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  flex-shrink: 0;
}

.btn-add-prefixo:hover:not(:disabled) { background: var(--primary-dark); }
.btn-add-prefixo:disabled { opacity: 0.5; cursor: not-allowed; }

.prefixos-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.prefixo-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.4rem 0.2rem 0.65rem;
  background: var(--surface-brand-soft);
  color: var(--primary);
  border: 1px solid var(--primary-light);
  border-radius: 999px;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  font-family: var(--font-family-display);
}

.chip-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary);
  padding: 0;
  border-radius: 50%;
  transition: background 0.12s;
  flex-shrink: 0;
}

.chip-remove svg { width: 10px; height: 10px; }
.chip-remove:hover { background: var(--primary-light); color: #fff; }

.error-msg {
  font-size: var(--fs-sm);
  color: var(--error);
  background: var(--danger-soft);
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
}

@media (max-width: 480px) {
  .fields-row { flex-direction: column; align-items: stretch; }
  .field--ano { width: 100%; }
}
</style>
