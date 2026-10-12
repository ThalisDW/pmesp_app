export default defineNuxtConfig({
  ssr: false,

  typescript: {
    typeCheck: false,
  },

  nitro: {
    preset: 'node-server',
    devProxy: {},
  },

  vite: {
    server: {
      watch: {
        usePolling: true,   // obrigatório para HMR em volume Docker no Windows
        interval: 300,
      },
    },
  },

  runtimeConfig: {
    mongoUri: '',
    jwtSecret: '',
  },
})
