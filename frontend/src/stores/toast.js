import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    visible: false,
    message: '',
    type: 'success',
    duration: 3500,
    _key: 0,
  }),

  actions: {
    show(message, type = 'success', duration = 3500) {
      this.message = message
      this.type = type
      this.duration = duration
      this._key++
      this.visible = true
    },

    hide() {
      this.visible = false
    },
  },
})
