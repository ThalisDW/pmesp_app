<template>
  <BaseModal :open="open" title="Registrar Apreensão" max-width="540px" @close="$emit('close')">
    <div v-if="!userViatura" class="no-viatura">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
      <span>Você não está em patrulha. Registre uma apreensão somente quando estiver em uma viatura ativa.</span>
    </div>

    <template v-else>
      <div class="field">
        <label class="field-label">Viatura</label>
        <div class="viatura-badge">{{ userViatura.prefixo }}</div>
      </div>

      <div class="field">
        <label class="field-label">Origem da Apreensão</label>
        <input
          v-model="form.origem"
          class="field-input"
          placeholder="Ex: Abordagem de rotina, Blitz, Informação de CI..."
          maxlength="300"
        />
      </div>

      <div class="section-label">Itens Apreendidos</div>

      <div class="items-grid">
        <div v-for="item in ITENS_APREENSAO" :key="item.key" class="item-box">
          <label class="item-label">{{ item.label }}</label>
          <input
            v-model.number="form[item.key]"
            type="number"
            min="0"
            class="item-input"
            placeholder="0"
          />
        </div>
      </div>

      <div v-if="error" class="error-msg">{{ error }}</div>
    </template>

    <template #footer>
      <button class="btn-ghost" @click="$emit('close')">Cancelar</button>
      <button
        v-if="userViatura"
        class="btn-primary"
        :disabled="!canSubmit || loading"
        @click="handleConfirm"
      >
        <span v-if="loading">Registrando...</span>
        <span v-else>Registrar</span>
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import { ITENS_APREENSAO } from '@/constants/apreensoes'
import BaseModal from '@/components/ui/BaseModal.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  userViatura: { type: Object, default: null },
  error: { type: String, default: '' },
})

const emit = defineEmits(['close', 'confirm'])

const defaultForm = () => ({
  origem: '',
  armasFogo: 0,
  drogas: 0,
  explosivos: 0,
  itensRoubados: 0,
  armasBrancas: 0,
  dinheiroSujo: 0,
  municao: 0,
})

const form = reactive(defaultForm())

watch(() => props.open, (val) => {
  if (val) Object.assign(form, defaultForm())
})

const totalItens = computed(() =>
  ITENS_APREENSAO.reduce((sum, item) => sum + (Number(form[item.key]) || 0), 0),
)

const canSubmit = computed(() => totalItens.value > 0)

function handleConfirm() {
  if (!canSubmit.value || !props.userViatura) return
  const payload = { viaturaId: props.userViatura._id, origem: form.origem }
  for (const item of ITENS_APREENSAO) {
    payload[item.key] = Number(form[item.key]) || 0
  }
  emit('confirm', payload)
}
</script>

<style scoped>
.no-viatura {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 0;
  color: var(--text-muted);
  text-align: center;
  font-size: var(--fs-sm);
}

.no-viatura svg { width: 40px; height: 40px; color: var(--border); }

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.viatura-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 0.9rem;
  background: var(--surface-brand-soft);
  color: var(--primary);
  border: 1px solid var(--primary-light);
  border-radius: 8px;
  font-size: var(--fs-sm);
  font-weight: var(--fw-bold);
  font-family: var(--font-family-display);
  width: fit-content;
}

.field-input {
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

.items-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
}

.item-box {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-label {
  font-size: var(--fs-2xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-input {
  padding: 0.45rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: var(--fs-md);
  font-weight: var(--fw-bold);
  color: var(--text-strong);
  background: var(--surface);
  font-family: var(--font-family-display);
  text-align: center;
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
}

.item-input:focus { border-color: var(--primary); }
.item-input::-webkit-inner-spin-button,
.item-input::-webkit-outer-spin-button { opacity: 1; }

.error-msg {
  font-size: var(--fs-sm);
  color: var(--error);
  background: var(--danger-soft);
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
}

@media (max-width: 480px) {
  .items-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
