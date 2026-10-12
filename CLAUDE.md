# PMESP — Sistema de Gerenciamento Policial (RP)

> **REGRA CRÍTICA:** Este arquivo e os `CLAUDE.md` de `frontend/` e `backend/` são a fonte de verdade do projeto.
> **Toda vez que qualquer arquivo do projeto for criado, alterado ou removido, o CLAUDE.md correspondente DEVE ser atualizado na mesma sessão, antes de encerrar.**
> Nunca deixe o CLAUDE.md desatualizado em relação ao código real.

---

## Stack

| Camada | Tecnologia | Porta |
|--------|-----------|-------|
| Frontend | Vue 3 + Vite (SPA) | 3000 |
| Backend | Nuxt 3 / Nitro (API only) | 4000 |
| Banco | MongoDB 7 | 27017 (interno) |
| Proxy/Serve | Nginx (frontend em prod) | — |

---

## Subir o projeto

### Desenvolvimento (hot-reload automático)
```bash
cp .env.example .env                        # apenas na primeira vez
docker-compose -f docker-compose.dev.yml up # sobe com HMR — salvar arquivo já reflete
```
- Frontend e backend ficam assistindo os arquivos via volume montado.
- `node_modules` ficam em volumes isolados no container (não conflita com o host).
- Alterar qualquer arquivo em `frontend/src/` ou `backend/server/` já recarrega automaticamente.
- Na **primeira vez** demora um pouco (instala dependências). Nas próximas é imediato.

### Produção
```bash
docker-compose up --build     # build completo + Nginx + imagem otimizada
docker-compose up             # sem rebuild (depois do primeiro build)
```

## Variáveis de ambiente (`.env`)

```env
MONGO_USER=admin
MONGO_PASSWORD=pmesp2024
MONGO_DB=pmesp
JWT_SECRET=troque_em_producao
VITE_API_URL=http://localhost:4000   # URL pública do backend — baked no build do frontend
```

**Regra crítica do Nuxt 3:** runtime config só é injetada via variáveis com prefixo `NUXT_`.
O `docker-compose.yml` converte automaticamente:
- `MONGO_USER/PASSWORD/DB` → monta a string e passa como `NUXT_MONGO_URI`
- `JWT_SECRET` → passa como `NUXT_JWT_SECRET`

`nuxt.config.ts` declara as chaves em camelCase:
```ts
runtimeConfig: { mongoUri: '', jwtSecret: '' }
// NUXT_MONGO_URI  → mongoUri
// NUXT_JWT_SECRET → jwtSecret
```

---

## Autenticação — fluxo completo

```
[POST /api/auth/login]
  → valida username + password no MongoDB
  → retorna { token (JWT 8h), user: { id, username, name, role, rank, badge, firstAccess } }

Frontend armazena token + user em localStorage (chaves: pmesp_token, pmesp_user)

Router guard (beforeEach):
  - rota pública (/login) → passa sempre
  - sem token → redireciona /login
  - firstAccess=true → redireciona /primeiro-acesso (bloqueado até trocar senha)
  - firstAccess=false + rota /primeiro-acesso → redireciona /

[POST /api/auth/change-password]  (Bearer token obrigatório)
  → { newPassword, confirmPassword }
  → faz hash bcrypt(12) e salva; seta firstAccess=false
  → frontend chama auth.markFirstAccessDone() e redireciona /
```

---

## Usuário inicial (seed automático no boot)

- **login:** `admin` | **senha:** `Admin@123`
- `firstAccess: true` → obrigado a trocar senha no primeiro login
- Seed só executa se não existir nenhum usuário com username `admin`

---

## Roles

| Role | Descrição |
|------|-----------|
| `admin` | Acesso total, cria usuários |
| `supervisor` | Acesso operacional ampliado |
| `officer` | Acesso básico |

---

## Rate limiting

| Rota | Limite | Janela | Chave |
|------|--------|--------|-------|
| `/api/auth/*` | 5 req | 15 min | `ip:path` |
| `/api/*` (demais) | 120 req | 1 min | `ip:api` |

Resposta 429 inclui headers `Retry-After`, `X-RateLimit-*`.
Frontend: botão de login fica bloqueado com countdown regressivo visível.

---

## Docker Compose — arquivos

| Arquivo | Uso | Característica |
|---------|-----|----------------|
| `docker-compose.yml` | Produção | Build com Dockerfile, Nginx, imagem otimizada |
| `docker-compose.dev.yml` | Desenvolvimento | Volume mount, HMR, `npm run dev` direto |

**dev:** `node:20-alpine` com volumes `./backend:/app` e `./frontend:/app`. node_modules em volumes nomeados separados (`backend_node_modules`, `frontend_node_modules`) para não conflitar com host.
**polling:** `usePolling: true` + `interval: 300ms` no Vite e Nuxt — necessário para file-watching funcionar em volumes Docker no Windows.
**NUXT_HOST=0.0.0.0** e **NUXT_PORT=4000** injetados via env no dev compose para o servidor escutar em todas as interfaces.

---

## Onde cada coisa vive

```
pmesp_app/
├── CLAUDE.md                  ← este arquivo
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── CLAUDE.md              ← regras técnicas do backend
│   └── ...
└── frontend/
    ├── CLAUDE.md              ← regras técnicas do frontend
    └── ...
```

Leia o `CLAUDE.md` da camada que for editar antes de começar.
