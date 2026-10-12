import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/institucional',
    name: 'Institucional',
    component: () => import('@/views/InstitucionalView.vue'),
    meta: { public: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/primeiro-acesso',
    name: 'ChangePassword',
    component: () => import('@/views/ChangePasswordView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/efetivo',
    name: 'Efetivo',
    component: () => import('@/views/EfetivoView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/gestao/usuarios',
    name: 'GestaoUsuarios',
    component: () => import('@/views/GestaoUsuariosView.vue'),
    meta: { requiresAuth: true, requiresCargo: 'p1' },
  },
  {
    path: '/emitir-boletim',
    name: 'EmitirBoletim',
    component: () => import('@/views/EmitirBoletimView.vue'),
    meta: { requiresAuth: true, requiresEmitir: true },
  },
  {
    path: '/gestao/efetivo',
    name: 'GestaoEfetivo',
    component: () => import('@/views/GestaoEfetivoView.vue'),
    meta: { requiresAuth: true, requiresCargo: 'p1' },
  },
  {
    path: '/viaturas',
    name: 'RegistroTurno',
    component: () => import('@/views/ViaturaView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/apreensoes',
    name: 'Apreensoes',
    component: () => import('@/views/ApreensaoView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/gestao/frota',
    name: 'FrotaViaturas',
    component: () => import('@/views/FrotaView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/fardamentos',
    name: 'Fardamentos',
    component: () => import('@/views/FardamentosView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/ausencias',
    name: 'Ausencias',
    component: () => import('@/views/AusenciasView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/registro-atividade',
    name: 'RegistroAtividade',
    component: () => import('@/views/AtividadeView.vue'),
    meta: { requiresAuth: true, requiresCargo: 'p1' },
  },
  {
    path: '/avaliacoes-estagio',
    name: 'AvaliacoesEstagio',
    component: () => import('@/views/AvaliacaoEstagioView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/avaliacoes-rocam',
    name: 'AvaliacoesRocam',
    component: () => import('@/views/AvaliacaoRocamView.vue'),
    meta: { requiresAuth: true, requiresRocamAccess: true },
  },
  {
    path: '/configuracoes',
    name: 'Configuracoes',
    component: () => import('@/views/ConfiguracoesView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.public) return true

  if (!auth.isAuthenticated) return '/login'

  if (auth.needsPasswordChange && to.name !== 'ChangePassword') {
    return '/primeiro-acesso'
  }

  if (!auth.needsPasswordChange && to.name === 'ChangePassword') {
    return '/'
  }

  if (to.meta.requiresAdmin && auth.user?.role !== 'admin') {
    return '/'
  }

  if (to.meta.requiresCargo && !auth.user?.cargo?.includes(to.meta.requiresCargo) && auth.user?.role !== 'admin') {
    return '/'
  }

  if (to.meta.requiresRocamAccess) {
    const cargo = auth.user?.cargo ?? []
    const hasRocamAccess = cargo.includes('rocam') || cargo.includes('bracal_rocam') || cargo.includes('p1') || auth.user?.role === 'admin'
    if (!hasRocamAccess) return '/'
  }

  if (to.meta.requiresEmitir) {
    const grad = parseInt(auth.user?.graduacao)
    const canEmitir = auth.user?.role === 'admin' || auth.user?.cargo?.includes('p1') || (!isNaN(grad) && grad <= 7)
    if (!canEmitir) return '/'
  }

  return true
})

export default router
