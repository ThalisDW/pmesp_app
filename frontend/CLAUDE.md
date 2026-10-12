# Frontend — Vue 3 + Vite (SPA)

> **REGRA CRÍTICA:** Sempre que criar, alterar ou remover qualquer arquivo neste diretório,
> atualize este CLAUDE.md na mesma sessão. Ele é lido no lugar dos arquivos reais para economizar tokens.

---

## Regra principal: TUDO É COMPONENTE

Qualquer elemento que apareça em mais de um lugar, ou que tenha lógica/estilo próprio, **é um componente**.
Nenhuma view deve ter mais de ~150 linhas de template. Se passou disso, extraia componentes.
Nunca duplicar markup entre views — extrair para componente de layout ou UI.

---

## Estrutura de pastas

```
src/
├── assets/
│   └── main.css                    → CSS global, variáveis CSS, reset
├── constants/
│   └── graduacoes.js               → GRADUACOES[], CARGOS[], getGraduacao(), buildDisplayName()
├── components/
│   ├── ui/                         → Componentes genéricos reutilizáveis
│   │   ├── AppToast.vue            → toast global: fixed top-center, slide+fade transition, progress bar CSS-driven; consome useToastStore
│   │   ├── BaseButton.vue          → (a criar) variantes: primary, danger, ghost; prop loading
│   │   ├── BaseInput.vue           → (a criar) label, erro, slot ícone, prop type
│   │   ├── BaseModal.vue           → overlay, container, header (title+subtitle+slot header-icon+close), body, footer (centra botões mobile); props: open, title, subtitle, maxWidth, flush; slots: header-icon, default, footer; estilos comuns de btn-ghost/btn-primary/btn-danger via :deep() no footer
│   │   ├── BaseAlert.vue           → (a criar) variantes: error, success, warning, info
│   │   ├── BaseSpinner.vue         → (a criar) spinner de carregamento
│   │   ├── BaseBadge.vue           → (a criar) badge de status/role
│   │   ├── BaseCard.vue            → (a criar) card com sombra e padding padrão
│   │   └── BaseTable.vue           → tabela base reutilizável; props: loading, isEmpty, loadingText, emptyText, dimmed; slots: head (th), body (tr), empty-icon
│   ├── dashboard/
│   │   ├── AvisosTab.vue          → lista de avisos do quadro de publicações do dashboard
│   │   └── BoletinsTab.vue        → lista de boletins internos do quadro de publicações do dashboard
│   ├── gestao/
│   │   ├── CadastroUsuarioForm.vue → form com nome, RG, username, graduação, cargo; emite `submit` com dados validados; mostra preview do displayName
│   │   ├── SenhaTempCard.vue      → exibe usuário criado + senha temporária com botão copiar + aviso de exibição única
│   │   ├── EfetivoAtivoTab.vue    → tabela com efetivo ativo; emite `promover`, `advertencia`, `exonerar`, `editarCargo` por officer
│   │   ├── ExoneradosTab.vue      → tabela somente-leitura de policiais exonerados (active: false)
│   │   ├── PromoverModal.vue      → modal overlay; select de nova graduação com grupos; emite `confirm(novaGraduacao)`
│   │   ├── AdvertenciaModal.vue   → modal overlay; textarea motivo + contador PAD; emite `confirm(descricao)`
│   │   ├── ExonerarModal.vue      → modal overlay de confirmação destrutiva; emite `confirm`
│   │   ├── EditarCargoModal.vue   → modal overlay; select de novo cargo com descrição; emite `confirm(novoCargo)`
│   │   ├── CriarAvaliacaoModal.vue → modal overlay; select estagiário, slider nota 0-10 com feedback visual colorido, textarea avaliação (required) e pontoAtencao (optional); emite `confirm(payload)`
│   │   └── CriarAvaliacaoRocamModal.vue → modal overlay; select policial ROCAM (prop membros[]), slider nota 0-10 com feedback visual colorido, textarea avaliação (required) e pontoAtencao (optional); emite `confirm({ avaliadoId, avaliacao, pontoAtencao, nota })`
│   ├── viaturas/
│   │   ├── ViaturaDropdown.vue     → item colapsável; props: viatura, showEncerrar, showEdit, actionLoading; emits: encerrar(id), edit-crew(viatura)
│   │   ├── AbrirViaturaModal.vue   → modal form: prefixo (select com prefixos da frota; aviso se nenhum disponível), observação, 5 selects de cargo; prop prefixos (Array — prefixos disponíveis da frota); emite confirm(payload)
│   │   ├── EncerrarViaturaModal.vue → modal confirmação destrutiva; mostra crew; emite confirm
│   │   └── EditarTripulacaoModal.vue → modal pré-populado com crew atual; selects filtrados; marca "EM OUTRA BARCA"; emite confirm(crew)
│   ├── institucional/
│   │   ├── LandingHero.vue      → seção hero (100vh): imagem de fundo, overlay escuro, badge, título, 7 stat cards glassmorphism do mês; props: imagemHero, stats, mes, ano
│   │   ├── LandingCarousel.vue  → carrossel automático (5s) com prev/next/dots; props: fotos[]
│   │   └── LandingDestaque.vue  → seção militar destaque: foto circular com anel gradiente dourado, nome, descrição; props: militar { nome, foto, descricao }
│   ├── apreensoes/
│   │   ├── TotaisCard.vue              → card de totais por período; props: totais, loading, mesLabel; 7 itens em grid responsivo
│   │   ├── RankList.vue                → lista de rank reutilizável; props: items[], loading, formatter(Function); medalhas gold/silver/bronze nos top 3; formatter converte total (ex: minutos → "Xh Ymin")
│   │   ├── AdicionarApreensaoModal.vue → modal form: viatura (apenas a do user), origem, grid de 7 inputs numéricos; valida ≥1 item; emite confirm(payload)
│   │   ├── RelatorioViaturasModal.vue  → modal lista last 15 viaturas com dropdown de apreensoes; apenas P3/admin abre
│   │   └── RelatorioSemanalModal.vue   → modal relatório semanal (P3/admin only); select de semana (atual + 3 anteriores, seg→dom); mostra TotaisCard + todos os RankLists filtrados por semana; carrega via store.fetchSemanal(inicio, fim)
│   ├── frota/
│   │   ├── VeiculoCard.vue             → card horizontal por veículo; foto/placeholder, modelo, ano, prefixos badges; ações editar/remover (confirm inline 2 etapas) visíveis apenas se isP3
│   │   └── CadastrarVeiculoModal.vue   → modal create/edit: upload foto (base64, max 2MB), modelo, ano, lista dinâmica de prefixos com add/remove
│   ├── ausencias/
│   │   ├── SolicitarAusenciaModal.vue  → modal create: datepicker (input type=date, min=hoje, PT-BR) + textarea motivo; emite confirm({data, motivo})
│   │   └── AusenciaAvisoModal.vue      → modal informativo quando user.ausente=true; emite continuar / ir-ausencias
│   ├── fardamentos/
│   │   ├── FardamentoCard.vue          → card vertical; imagem (210px height) com overlay de ações (cima/baixo/editar/excluir com confirm) no topo direito; info (nome, descricao) e 2-col grid dos 11 campos de inventário (esq: maos/jaqueta/mochila/acessorios/sapatos/chapeu; dir: camisa/coletes/adesivos/calcas/mascara); ações visíveis apenas se isP3
│   │   └── CadastrarFardamentoModal.vue → modal create/edit: foto upload (portrait 80x100, max 2MB), nome (required), descricao textarea, 2-col grid de 11 campos de inventário (texto livre tipo "321/4")
│   ├── efetivo/
│   │   ├── EfetivoTable.vue        → tabela de policiais com avatar, cargo, graduação, PAD, cursos, patrulha
│   │   ├── PadIndicator.vue        → 3 quadradinhos coloridos (0=vazio, 1=dourado, 2=âmbar, 3=vermelho)
│   │   ├── CursosBadge.vue         → badge com contagem de cursos ou "—"
│   │   └── PatrulhaStatus.vue      → badge Em Patrulha/Fora de Serviço + data da última patrulha
│   └── layout/
│       ├── AppSidebar.vue          → sidebar institucional fixa do dashboard
│       └── AppTopbar.vue           → topbar do dashboard com página, relógio e usuário
├── composables/
│   ├── useApi.js                   → wrapper fetch com auth header e tratamento de erros
│   └── useClock.js                 → relógio reativo (currentTime, currentDate) com setInterval
├── router/
│   └── index.js                    → rotas + guard beforeEach
├── stores/
│   ├── institucional.js            → Pinia store de config institucional; State: config, stats, mes, ano, loading, saving, error, saveError; Actions: fetchConfig() (pública), fetchStats() (pública), saveConfig(updates) (admin — usa fetch com Bearer token)
│   ├── auth.js                     → Pinia store de autenticação
│   ├── publicacoes.js              → Pinia store de avisos e boletins internos
│   └── toast.js                    → Pinia store global de notificações; actions: show(msg, type, duration), hide()
└── views/
    ├── InstitucionalView.vue
    ├── ConfiguracoesView.vue
    ├── LoginView.vue
    ├── ChangePasswordView.vue
    ├── DashboardView.vue
    ├── EfetivoView.vue
    ├── GestaoUsuariosView.vue
    ├── EmitirBoletimView.vue
    ├── GestaoEfetivoView.vue
    ├── ViaturaView.vue
    ├── ApreensaoView.vue
    ├── FrotaView.vue
    ├── FardamentosView.vue
    ├── AusenciasView.vue
    ├── AvaliacaoEstagioView.vue
    └── AvaliacaoRocamView.vue
```

---

## Estado atual dos arquivos

### `src/main.js`
```js
createApp(App) → use(createPinia()) → use(router) → mount('#app')
```
Ordem importa: Pinia antes do router (router guards usam stores).

### `src/App.vue`
`<RouterView />` + `<AppToast />` (montado globalmente via Teleport). Sem estado, sem lógica.

### `src/assets/main.css`
Reset global (`box-sizing`, `margin`, `padding`). Variáveis CSS:
```css
--primary: #1a3a6b       /* azul PMESP */
--primary-dark: #0f2347
--primary-light: #2a5298
--accent: #c8a951        /* dourado */
--accent-light: #e6c96e
--bg-dark: #0a0f1e
--bg-light: #f0f4f8
--surface: #ffffff
--error: #dc2626
--error-bg: #fef2f2
--success: #16a34a
--success-bg: #f0fdf4
--text: #1e293b
--text-muted: #64748b
--border: #e2e8f0
```
Inclui tokens semânticos adicionais de superfície, texto e feedback (`--surface-soft`, `--surface-subtle`, `--surface-brand-soft`, `--text-strong`, `--text-soft`, `--border-soft`, etc), tokens tipográficos (`--font-family-base`, `--font-family-display`, escala `--fs-*`, pesos `--fw-*`) e suporte a dark mode automático + manual (`@media (prefers-color-scheme: dark)` e `:root[data-theme='dark']`).
Tipografia padrão atual: `Manrope` + `Inter` como fallback.

---

### `src/constants/graduacoes.js`
Espelho do `backend/server/constants/graduacoes.ts` para uso no frontend.
- `GRADUACOES[]` — `{ label, value, nickPrefix, roleName, grupo }`
- `CARGOS[]` — `{ label, value, description }`
- `getGraduacao(value)` — busca graduação pelo value
- `buildDisplayName(name, rg, graduacao)` → `"nickPrefix | nome - rg"` (ex: `✧✧✧ | Hugo Amorim - 5436`)
- Values numéricos: `'1'`=Coronel … `'14'`=Sd 2° Cl (1=maior, 14=menor posto). Usar `parseInt(value)` para ordenar.

### `src/stores/auth.js`
Store Pinia `auth`. Persiste em `localStorage` (chaves: `pmesp_token`, `pmesp_user`).

**State:** `token: string|null`, `user: object|null`

**Getters:**
- `isAuthenticated` → `!!token`
- `isAdmin` → `user.role === 'admin'`
- `isRh` → `user.cargo === 'p1' || user.role === 'admin'`
- `isP3` → `user.cargo === 'p3' || user.role === 'admin'`
- `needsPasswordChange` → `!!user.firstAccess`
- `displayName` → `buildDisplayName(user.name, user.rg, user.graduacao)`
- `graduacaoInfo` → objeto completo da graduação atual (`{ label, nickPrefix, roleName, grupo }`)
- `canPostAviso` → `parseInt(user.graduacao) <= 7` ou admin (Asp. Oficial até Coronel)
- `canPostBoletim` → `user.cargo === 'p1'` ou admin
- `canEmitir` → canPostAviso OU canPostBoletim

**Actions:**
- `setAuth(token, user)` → persiste token e user
- `markFirstAccessDone()` → seta `user.firstAccess = false` e persiste
- `logout()` → limpa state e localStorage

**User object:**
```js
{ id, username, name, rg, role, cargo, graduacao, dataPromocao, patrulhando, badge, firstAccess }
```

---

### `src/composables/useClock.js`
Retorna `{ currentTime, currentDate }` atualizados a cada 1s via `setInterval`.
Gerencia o ciclo de vida internamente (`onMounted`/`onBeforeUnmount`). Usado em todas as views com topbar.

### `src/stores/efetivo.js`
Store Pinia `efetivo`. Busca dados via `GET /api/efetivo`.
**State:** `officers[]`, `loading`, `error`
**Getters:** `total`, `emPatrulha`, `foraDe`
**Action:** `fetchAll()` → popula `officers`

### `src/composables/useApi.js`
`useApi()` → retorna `{ get, post, put, delete }`.
Base URL: `import.meta.env.VITE_API_URL || 'http://localhost:4000'`.
Injeta `Authorization: Bearer <token>` automaticamente se `auth.token` existir.
Em erro 401: chama `auth.logout()` e redireciona `/login`.
Erros expõem `error.status` e `error.retryAfter` (do header `Retry-After`).

---

### `src/router/index.js`
Histórico: `createWebHistory()`.

| Rota | Nome | Componente | Meta |
|------|------|-----------|------|
| `/institucional` | `Institucional` | `InstitucionalView` | `public: true` |
| `/login` | `Login` | `LoginView` | `public: true` |
| `/primeiro-acesso` | `ChangePassword` | `ChangePasswordView` | `requiresAuth: true` |
| `/` | `Dashboard` | `DashboardView` | `requiresAuth: true` |
| `/efetivo` | `Efetivo` | `EfetivoView` | `requiresAuth: true` |
| `/gestao/usuarios` | `GestaoUsuarios` | `GestaoUsuariosView` | `requiresAuth: true, requiresCargo: 'p1'` |
| `/emitir-boletim` | `EmitirBoletim` | `EmitirBoletimView` | `requiresAuth: true, requiresEmitir: true` |
| `/gestao/efetivo` | `GestaoEfetivo` | `GestaoEfetivoView` | `requiresAuth: true, requiresCargo: 'p1'` |
| `/viaturas` | `Viaturas` | `ViaturaView` | `requiresAuth: true, requiresCargo: 'p1'` |
| `/apreensoes` | `Apreensoes` | `ApreensaoView` | `requiresAuth: true` |
| `/gestao/frota` | `FrotaViaturas` | `FrotaView` | `requiresAuth: true` |
| `/fardamentos` | `Fardamentos` | `FardamentosView` | `requiresAuth: true` |
| `/ausencias` | `Ausencias` | `AusenciasView` | `requiresAuth: true` |
| `/registro-atividade` | `RegistroAtividade` | `AtividadeView` | `requiresAuth: true, requiresCargo: 'p1'` |
| `/avaliacoes-estagio` | `AvaliacoesEstagio` | `AvaliacaoEstagioView` | `requiresAuth: true` |
| `/avaliacoes-rocam` | `AvaliacoesRocam` | `AvaliacaoRocamView` | `requiresAuth: true, requiresRocamAccess: true` |
| `/configuracoes` | `Configuracoes` | `ConfiguracoesView` | `requiresAuth: true, requiresAdmin: true` |

**Guard `beforeEach`:**
1. Rota pública → passa (`/institucional`, `/login`)
   `requiresAdmin: true` → role !== 'admin' → `/`
2. Sem token → `/login`
3. `firstAccess=true` + não é `ChangePassword` → `/primeiro-acesso`
4. `firstAccess=false` + é `ChangePassword` → `/`
5. `requiresCargo: 'p1'` → cargo não inclui 'p1' e não admin → `/`
6. `requiresRocamAccess: true` → cargo não inclui 'rocam', 'bracal_rocam', 'p1' e não admin → `/`
7. `requiresEmitir: true` → `parseInt(graduacao) > 7` e cargo não inclui 'p1' e não admin → `/`

---

### `src/views/InstitucionalView.vue`
Rota `/institucional` — pública. Landing page institucional.
Nav fixa transparente (logo + botão "Entrar no Sistema" → /login). Renderiza em sequência: `LandingHero` (sempre), `LandingCarousel` (v-if fotosCarrossel.length), `LandingDestaque` (v-if militarDestaque.nome). Footer simples. Chama `store.fetchConfig()` + `store.fetchStats()` em paralelo no `onMounted`.

### `src/views/ConfiguracoesView.vue`
Rota `/configuracoes` — admin only (`requiresAdmin: true`). Layout: AppSidebar + AppTopbar.
3 seções: (1) Imagem Hero (upload base64, max 5MB, preview + remover + salvar); (2) Fotos Carrossel (5 slots com upload individual, preview + remover + salvar); (3) Militar Destaque (foto + campos nome + descrição + salvar). Cada seção tem botão "Salvar" independente que chama `store.saveConfig({ campo })`. Carrega config existente no `onMounted` e pré-popula os campos.

### `src/views/LoginView.vue`
**Design baseado no Figma PMESP-Site (node 4:5).** Layout institucional claro.
- **Topbar:** fundo branco, borda-bottom, logo PMESP + "Centro de Comando" à esquerda, "← Voltar à institucional" à direita.
- **Coluna esquerda:** fundo #eef0f4, badge "SISTEMA EM PRONTIDÃO" (vermelho + borda), heading gigante "Acesso" (preto #0f172a 4.5rem) + "Institucional" (azul #1a3a6b 4.5rem com underline vermelho), subtítulo cinza, 3 features com ícones circulares. Radar decorativo (SVG: círculos concêntricos + linhas + 3 pontos vermelhos) posicionado absolutamente no canto inferior direito da coluna. Badge/shield PMESP no centro do radar.
- **Coluna direita (card):** fundo branco, borda #e5e7eb, border-radius 12px, sombra leve. Topo: "AUTENTICAÇÃO" (cinza, uppercase) + badge "⚠ RESTRITO" (vermelho). Título "Identificação oficial". Subtítulo. Form: input usuário + input senha (com toggle visibilidade). Botão azul #2563eb "Entrar no Sistema" com ícone cadeado. Seção "VERIFICAÇÃO AUTOMÁTICA" com 3 bullets. Aviso legal em caixa #f9fafb. Footer "CANAL CRIPTOGRAFADO • SESSÃO TEMPORÁRIA • CONEXÃO SEGURA".
**State local:** `form {username, password}`, `loading`, `error`, `showPwd`, `blocked` (countdown 429).
**Lógica:** `handleLogin()` → `api.post('/api/auth/login')` → `auth.setAuth()` → redireciona.
Em erro 429: `startCountdown(retryAfter)` — botão desabilitado com timer regressivo visível.
Responsivo: abaixo de 900px empilha verticalmente.

### `src/views/ChangePasswordView.vue`
Tela de primeiro acesso alinhada ao visual da LoginView.
- **Topbar institucional:** logo PMESP + "Centro de Comando", com faixa superior branca e borda inferior.
- **Layout em duas colunas:** esquerda informativa (tag de status, heading grande "Segurança Inicial", orientações) e direita com card de alteração.
- **Card direito:** label "PRIMEIRO ACESSO", badge "RESTRITO", bloco de usuário, formulário de nova senha e confirma senha, regras e alerts.
**State local:** `form {newPassword, confirmPassword}`, `show {new, confirm}`, `loading`, `error`, `successMsg`.
**Computed:** `rules {length, upper, number, special}`, `strength` (0–4), `canSubmit`.
**Lógica:** `handleSubmit()` → `api.post('/api/auth/change-password')` → `auth.markFirstAccessDone()` → redireciona `/` após 1.5s.
Exibe: indicador de força da senha (4 segmentos coloridos), checklist de regras, hint de coincidir e rodapé de segurança no padrão da login.

### `src/views/DashboardView.vue`
Layout: sidebar fixa + área principal (topbar + conteúdo), com linguagem visual unificada com a LoginView.
**Composables:** usa `useClock()` para relógio reativo.
**Computed:** `firstName`, `initials` (2 letras do nome), `roleLabel`, `greeting` (bom dia/tarde/noite).
**Composição:** usa `AppSidebar` e `AppTopbar` para reduzir markup da view e centralizar layout institucional.
**Sidebar:** fixa, tema claro com bordas sutis, navegação com estado ativo em azul institucional, itens "Em breve", avatar do usuário e logout.
**Topbar:** metadados da página, relógio e usuário logado.
**Conteúdo:** banner de boas-vindas em card claro, 4 cards de stats e info box.
Stats: Efetivo de Serviço | Meus Dias Patrulhados (+ badge de flag apto/ativo/inativo) | Viaturas em Patrulha | Meus Turnos no Mês.
Flag de dias patrulhados vem de `atividadeStore.minhaAtividade` (fetched via `fetchMinha()` no `onMounted`), mesmo critério do Registro de Atividade (≥60% úteis=apto, 40-59%=ativo, <40%=inativo).
**Logout:** `auth.logout()` → `router.push('/login')`.
**Quadro de Publicações:** seção abaixo do info-box com dois tabs (`quadroTab: ref('avisos')`). Usa `AvisosTab` e `BoletinsTab`. Botão "+ Emitir" (link para `/emitir-boletim`) visível apenas para `auth.canEmitir`. Carrega dados via `pub.fetchAll()` no `onMounted`.

### `src/components/layout/AppSidebar.vue`
Sidebar institucional fixa do dashboard.
- Recebe `currentPath`, `isAdmin`, `isRh`, `isP3` (Boolean, default false), `initials`, `userName`, `userRank`.
- Seção "Gestão de Pessoal" visível apenas quando `isRh = true` (cargo p1 ou admin).
- Seção "Gestão Operacional" visível para TODOS autenticados. Contém links para Frota de Viaturas e Fardamentos.
- Emite `logout`.
- Exibe branding PMESP, grupos de navegação, itens desabilitados "Em breve" e rodapé do usuário.
- Cores e tipografia aplicadas por variáveis CSS globais (tokens), sem valores fixos de tema.

### `src/constants/apreensoes.js`
`ITENS_APREENSAO[]` — `{ key, label }` para os 7 tipos: armasFogo, drogas, explosivos, itensRoubados, armasBrancas, dinheiroSujo, municao.

### `src/stores/apreensoes.js`
Store Pinia `apreensoes`. Gerencia stats e registro de apreensões.
**State:** `totais`, `rankGeral[]`, `rankPorItem{}`, `rankPatrulha[]`, `rankDias[]`, `loading`, `error`, `actionLoading`, `actionError`, `relatorio[]`, `relatorioLoading`, `semanalStats`, `semanalLoading`, `semanalError`
**Actions:**
- `fetchStats(mes, ano)` → `GET /api/apreensoes?mes&ano` + `GET /api/apreensoes/rank-patrulha?mes&ano` + `GET /api/apreensoes/rank-dias?mes&ano` em paralelo → popula totais, ranks apreensoes, rankPatrulha e rankDias
- `registrar(payload)` → `POST /api/apreensoes` → registra
- `fetchRelatorio()` → `GET /api/apreensoes/relatorio` → last 15 viaturas com apreensões (p3/admin)
- `fetchSemanal(inicio, fim)` → `GET /api/apreensoes/relatorio-semanal?inicio&fim` (YYYY-MM-DD) → popula `semanalStats { totais, rankGeral, rankPorItem, rankPatrulha, rankDias }` (p3/admin)

### `src/stores/viaturas.js`
Store Pinia `viaturas`. Gerencia viaturas em patrulha.
**State:** `ativas[]`, `loading`, `error`, `actionLoading`, `actionError`
**Getters:** `count` → `ativas.length`
**Actions:**
- `fetchAtivas()` → `GET /api/viaturas` → popula `ativas`
- `abrirViatura(payload)` → `POST /api/viaturas` → insere no topo de `ativas`
- `encerrarViatura(id)` → `PATCH /api/viaturas/:id/encerrar` → remove de `ativas`

### `src/stores/avaliacaoEstagio.js`
Store Pinia `avaliacaoEstagio`. Gerencia avaliações de estágio com paginação (20 por página).
**State:** `avaliacoes[]`, `total`, `page`, `pages`, `loading`, `error`, `actionLoading`, `actionError`, `estagiarios[]`, `avaliadores[]`, `membrosLoading`
**Actions:**
- `fetchAvaliacoes(params)` → `GET /api/avaliacoes-estagio` (params: page, dataInicio, dataFim, nota_min, nota_max, avaliadorId, estagiarioId)
- `fetchMembros()` → `GET /api/avaliacoes-estagio/membros` → popula estagiarios + avaliadores (avaliadores só p1/admin)
- `criar(payload)` → `POST /api/avaliacoes-estagio`

### `src/stores/avaliacaoRocam.js`
Store Pinia `avaliacaoRocam`. Gerencia avaliações ROCAM com paginação (20 por página).
**State:** `avaliacoes[]`, `total`, `page`, `pages`, `loading`, `error`, `actionLoading`, `actionError`, `membros[]`, `avaliadores[]`, `membrosLoading`
**Actions:**
- `fetchAvaliacoes(params)` → `GET /api/avaliacoes-rocam` (params: page, dataInicio, dataFim, nota_min, nota_max, avaliadorId, avaliadoId)
- `fetchMembros()` → `GET /api/avaliacoes-rocam/membros` → popula membros (policiais ROCAM) + avaliadores (só p1/admin)
- `criar(payload)` → `POST /api/avaliacoes-rocam` com `{ avaliadoId, avaliacao, pontoAtencao, nota }`

### `src/stores/gestao.js`
Store Pinia `gestao`. Gerencia criação de usuários via `POST /api/users`.
**State:** `loading`, `error`, `lastCreated: { user, tempPassword } | null`
**Action:** `criarUsuario(data)` → chama API e popula `lastCreated`; `resetLastCreated()` limpa para novo cadastro.

### `src/stores/frota.js`
Store Pinia `frota`. Gerencia frota de veículos e prefixos disponíveis.
**State:** `veiculos[]`, `prefixosDisponiveis[]`, `loading`, `error`, `actionLoading`, `actionError`
**Actions:**
- `fetchVeiculos()` → `GET /api/frota` → popula `veiculos`
- `fetchPrefixosDisponiveis()` → `GET /api/frota/prefixos-disponiveis` → popula `prefixosDisponiveis` (silencioso em erro)
- `criar(payload)` → `POST /api/frota` → insere em `veiculos` ordenado por modelo
- `atualizar(id, payload)` → `PUT /api/frota/:id` → atualiza `veiculos[idx]`
- `remover(id)` → `DELETE /api/frota/:id` → remove de `veiculos`

### `src/stores/fardamentos.js`
Store Pinia `fardamentos`. Gerencia lista de fardamentos ordenados.
**State:** `fardamentos[]`, `loading`, `error`, `actionLoading`, `actionError`
**Actions:**
- `fetchAll()` → `GET /api/fardamentos` → popula `fardamentos` (ordenados por `ordem`)
- `criar(payload)` → `POST /api/fardamentos` → push em `fardamentos`
- `atualizar(id, payload)` → `PUT /api/fardamentos/:id` → atualiza `fardamentos[idx]`
- `remover(id)` → `DELETE /api/fardamentos/:id` → filtra de `fardamentos`
- `mover(id, direcao)` → swap otimista de posição no array + `PATCH /api/fardamentos/:id/mover`; reverte com `fetchAll()` em caso de erro

### `src/stores/atividade.js`
Store Pinia `atividade`. Busca métricas por mês via `GET /api/atividade?mes&ano`.
**State:** `efetivo[]`, `totalWeekdays`, `mes`, `loading`, `error`, `minhaAtividade`, `minhaAtividadeLoading`
**Actions:**
- `fetchAll(mes?, ano?)` → `GET /api/atividade?mes&ano` (params opcionais, default = mês atual) → popula efetivo (P1 only)
- `fetchMinha()` → `GET /api/atividade/minha` → popula `minhaAtividade` (`{ diasPatrulhados, diasUteisPatrulhados, totalWeekdays, percentual, flag }`)

### `src/stores/ausencias.js`
Store Pinia `ausencias`. Gerencia ausências do usuário (ou todo efetivo para P1/admin).
**State:** `ausencias[]`, `loading`, `error`, `actionLoading`, `actionError`
**Getters:** `ativa` → primeira ausência com `status: 'ativa'`
**Actions:**
- `fetchAll(params)` → `GET /api/ausencias?usuarioId&data` → popula `ausencias`
- `solicitar(payload)` → `POST /api/ausencias` → unshift em `ausencias` + `auth.setAusente(true)`
- `encerrar(id)` → `PATCH /api/ausencias/:id/encerrar` → atualiza status otimisticamente + `auth.setAusente(false)`

### `src/stores/publicacoes.js`
Store Pinia `publicacoes`. Gerencia avisos e boletins internos.
**State:** `avisos[]`, `boletins[]`, `loading`, `error`, `submitting`, `submitError`
**Actions:**
- `fetchAll()` → `GET /api/publicacoes` → popula `avisos` e `boletins`
- `criarPublicacao(payload)` → `POST /api/publicacoes` → insere no topo da lista correspondente

### `src/components/dashboard/AvisosTab.vue`
Lista de avisos para o Quadro de Publicações do dashboard.
Props: `avisos[]`, `loading`. Exibe card com autor (prefixo + nome + RG), data e conteúdo. Borda esquerda dourada (`--warning`).

### `src/components/dashboard/BoletinsTab.vue`
Lista de boletins internos para o Quadro de Publicações do dashboard.
Props: `boletins[]`, `loading`. Exibe card com badge "BOLETIM INTERNO", 4 partes formatadas e linha "Assina: nome". Borda esquerda azul (`--primary`).

### `src/views/EmitirBoletimView.vue`
Rota `/emitir-boletim` — acesso restrito a `canEmitir`.
Page tabs: "Boletim Interno" (visível se `canPostBoletim`) e "Aviso" (visível se `canPostAviso`).
Boletim: 4 textareas (parte1–4) + preview "Assina: nome" + submit.
Aviso: título + textarea conteúdo + submit.
Tab inicial: `boletim` se `canPostBoletim`, senão `aviso`.

### `src/views/ApreensaoView.vue`
Rota `/apreensoes` — acesso para todos autenticados.
Layout: AppSidebar + AppTopbar. Conteúdo:
- `TotaisCard` com totais do mês
- Seção de rankings: botão "Registrar Apreensão" (todos) + botão "Relatório" (isP3 only) + botão "Relatório Semanal" (isP3 only)
- Filtro de mês: `<select>` com últimos 13 meses; ao trocar re-chama `fetchStats(mes, ano)`
- `ranks-top`: 3 cards lado a lado (grid 3 colunas) — RankGeral + RankPatrulha (horas, `formatMinutos`) + RankDias (dias patrulhados, `formatDias`)
- `ranks-items`: grid 2-col com 7 RankList por item de apreensão
- `userViatura` computed: viatura ativa onde o user está na tripulação (via viaturas.ativas)
- `modalSemanal` ref: controla `RelatorioSemanalModal`
- Usa `useApreensaoStore` + `useViaturasStore`

### `src/views/FrotaView.vue`
Rota `/gestao/frota` — acesso para todos autenticados. Botão "Cadastrar Veículo" visível apenas para `isP3`.
Layout: AppSidebar + AppTopbar. Page card.
Lista `VeiculoCard` com `:is-p3="auth.isP3"` e callbacks `@editar → CadastrarVeiculoModal` e `@remover → frota.remover`.
Usa `useFrotaStore`.
`onMounted`: chama `frota.fetchVeiculos()`.

### `src/views/FardamentosView.vue`
Rota `/fardamentos` — acesso para todos autenticados.
Layout: AppSidebar + AppTopbar. Page card com botão "Novo Fardamento" (visível apenas `isP3`).
Grid `repeat(auto-fill, minmax(220px, 1fr))` de `FardamentoCard`.
Passa `isFirst/isLast` com base no índice para controle dos botões de mover.
Emits: `@editar → CadastrarFardamentoModal`, `@remover → store.remover`, `@mover-cima/@mover-baixo → store.mover(id, direcao)`.
`onMounted`: chama `store.fetchAll()`.

### `src/views/ViaturaView.vue`
Rota `/viaturas` — acesso para todos autenticados. Gerencia viaturas abertas.
Layout: AppSidebar + AppTopbar. Page card com botão "Abrir Viatura" no header.
Lista `ViaturaDropdown` com `showEncerrar=true` e `@encerrar → EncerrarViaturaModal`.
Usa `useViaturasStore` + `useEfetivoStore` (para officers do AbrirViaturaModal — usa GET /api/efetivo acessível a todos) + `useFrotaStore`.
`onMounted`: chama `store.fetchAtivas()` e `efetivo.fetchAll()` se vazio.
Watch no `modalAbrir` também chama `efetivo.fetchAll()` e `frota.fetchPrefixosDisponiveis()` ao abrir o modal.
Passa `:prefixos="frota.prefixosDisponiveis"` ao `AbrirViaturaModal`.

### `src/views/GestaoUsuariosView.vue`
Acessível apenas para `cargo: 'p1'` (RH) e `admin`. Rota `/gestao/usuarios` com `requiresCargo: 'p1'` no router guard.
Dois estados: formulário (`CadastroUsuarioForm`) → após criação (`SenhaTempCard`).
Formulário valida: nome, RG, username (letras/números/pontos, mínimo 3), graduação obrigatória.
Mostra preview do displayName em tempo real enquanto preenche.

### `src/views/EfetivoView.vue`
Layout idêntico ao Dashboard (sidebar + topbar + content). Usa `useClock()` e `useEfetivoStore`.
- Toolbar com busca por nome/RG, filtro de cargo e filtro de status de patrulha (client-side).
- 3 stat cards: Total do Efetivo, Em Patrulha, Fora de Serviço.
- Renderiza `EfetivoTable` com `filteredOfficers` e estado `loading`.
- Exibe `error-bar` quando `efetivo.error` está preenchido.
- Carrega dados via `efetivo.fetchAll()` no `onMounted`.

### `src/views/AtividadeView.vue`
Rota `/registro-atividade` — acesso P1 + admin.
Layout: AppSidebar + AppTopbar. Usa `useAtividadeStore`.
Filtro de mês: `<select>` com últimos 13 meses; ao trocar re-chama `store.fetchAll(mes, ano)`.
Tabela ordenada por graduação (maior→menor, value 1=Coronel; computed `sortedEfetivo`). Inclui ausentes.
Colunas: Policial (+ badge "Ausente" amber se `o.ausente`) | Graduação | Cargo (badges por item do array; `normalizeCargo`) | Dias Patrulhados (x/total + badge FDS) | Ausência (dias no mês ou "—") | Cumprimento (barra de progresso + %) | Status (badge)
Badge de status: `apto` (verde, ≥60%), `ativo` (azul, 40-59%), `inativo` (vermelho, <40%).
Legenda acima da tabela. Botão "Atualizar" refaz `store.fetchAll(mes, ano)`.
Exibe mês de referência e total de dias úteis no subtítulo.

### `src/views/AusenciasView.vue`
Rota `/ausencias` — acesso para todos autenticados.
Layout: AppSidebar + AppTopbar. Usa `useAusenciasStore`.
- Alert banner amber se usuário logado tiver ausência ativa: mostra data + motivo + botão "Retirar Ausência" → chama `store.encerrar(id)`
- Botão "Solicitar Ausência" (desabilitado se já tem ausência ativa) → abre `SolicitarAusenciaModal`
- P1/admin: mostra ausências de todos + filtros client-side por usuário (select de únicos) e data (input date)
- Usuário comum: mostra somente as próprias
- Tabela: (P1: Policial) + Data | Motivo | Status (badge amber/verde) | Ação (botão "Retirar" se ativa)
`onMounted`: chama `store.fetchAll()`.

### `src/components/ausencias/SolicitarAusenciaModal.vue`
Modal create: datepicker `input type=date` com `min=hoje` (formato nativo PT-BR), textarea motivo.
Props: `open`, `loading`, `error`. Emits: `close`, `confirm({ data, motivo })`.

### `src/components/ausencias/AusenciaAvisoModal.vue`
Modal informativo mostrado em `App.vue` quando `auth.user.ausente=true` (uma vez por sessão via sessionStorage).
Props: `open`. Emits: `continuar` (fecha + sessionStorage), `ir-ausencias` (fecha + sessionStorage + router.push('/ausencias')).

### `src/App.vue`
`<RouterView />` + `<AppToast />` + `<AusenciaAvisoModal />`.
Watch em `auth.user?.ausente` (immediate): se true e `sessionStorage.pmesp_ausencia_modal_shown` não setado → abre modal.
Quando ausente volta a false → fecha modal. Dismiss/ir-ausencias: fecha + seta sessionStorage.

### `src/components/efetivo/EfetivoTable.vue`
Badge `"Ausente"` (amber pill) exibido ao lado do `officer-display` quando `officer.ausente === true`.

### `src/components/gestao/EfetivoAtivoTab.vue`
Badge `"Ausente"` (amber pill) exibido ao lado do `officer-name` quando `officer.ausente === true`.

### `src/components/layout/AppSidebar.vue`
Link "Ausências" (ícone calendário) visível para todos autenticados, após "Fardamentos" na seção Operacional.

### `src/components/layout/AppTopbar.vue`
Topbar de dashboard.
- Recebe `title`, `breadcrumb`, `currentDate`, `currentTime`, `initials`, `userName`, `roleLabel`.
- Exibe cabeçalho de página, botão de alternância de tema ("Tema escuro"/"Tema claro"), relógio e avatar do usuário.
- Ao passar o mouse sobre o avatar (hover), abre mini modal/dropdown com nome e informação de perfil; fecha ao tirar o mouse.
- Botão de tema persiste preferência em `localStorage` (`pmesp_theme`) e aplica via `data-theme` no `documentElement`.
- Cores e tipografia aplicadas por variáveis CSS globais (tokens), com suporte a dark mode.

---

## Regras de componentes (obrigatórias)

- **Props tipadas** com `defineProps` e tipos explícitos.
- **Emits declarados** com `defineEmits([...])`.
- **Sem lógica de negócio** em componentes UI — apenas apresentação e eventos.
- **Sem chamadas de API** em componentes — API fica em composables ou stores.
- **Estilos `scoped`** — nunca estilos globais dentro de componentes.
- **Nomes PascalCase** nos arquivos e no template (`<BaseButton />`).
- **Uma responsabilidade** por componente — se faz duas coisas, separe.
- **Sem hex hardcoded** no CSS — sempre usar variáveis CSS de `main.css`.

## Regras de stores

- Uma store por domínio: `auth`, `usuarios`, `ocorrencias`, `viaturas`, etc.
- Views e componentes consomem store — não fazem fetch direto.
- Estado de `loading` e `error` de operações assíncronas ficam na store, não em `ref` local da view.

## Regras de composables

- Prefixo `use` obrigatório.
- Encapsulam lógica repetida entre múltiplos componentes/views.
- Nunca duplicar chamada de API — criar composable ou mover para store.

## Breakpoint responsivo

Principal: `768px`. Mobile-first. Sidebar colapsa automaticamente abaixo de 768px.
No dashboard atual a sidebar não possui mais modo recolhido/expandido; em telas menores o layout empilha verticalmente.

## Dependências atuais

```json
{
  "vue": "^3.4.21",
  "vue-router": "^4.3.2",
  "pinia": "^2.1.7"
}
```
Sem biblioteca de UI externa (Tailwind, Element Plus, etc.) — CSS próprio com variáveis.
