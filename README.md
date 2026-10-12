# PMESP — Sistema de Gerenciamento Policial (RP)

Sistema web para gerenciamento de efetivo, viaturas, apreensões e publicações de uma corporação policial em ambiente de roleplay.

## Stack

| Camada | Tecnologia | Porta |
|--------|-----------|-------|
| Frontend | Vue 3 + Vite (SPA) | 3000 |
| Backend | Nuxt 3 / Nitro (API only) | 4000 |
| Banco | MongoDB 7 | 27017 (interno) |
| Proxy | Nginx (apenas em produção) | 80 |

## Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose instalados

## Como rodar

### 1. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` se necessário (os valores padrão já funcionam para desenvolvimento local):

```env
MONGO_USER=admin
MONGO_PASSWORD=pmesp2024
MONGO_DB=pmesp
JWT_SECRET=troque_em_producao
VITE_API_URL=http://localhost:4000
```

### 2. Desenvolvimento (com hot-reload)

```bash
docker-compose -f docker-compose.dev.yml up
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Qualquer alteração em `frontend/src/` ou `backend/server/` recarrega automaticamente.
- Na primeira execução demora alguns minutos (instala dependências). Nas próximas é imediato.

### 3. Produção

```bash
# Primeira vez (ou após mudanças no código):
docker-compose up --build

# Execuções seguintes (sem rebuild):
docker-compose up
```

- Frontend: http://localhost (via Nginx)
- Backend: http://localhost:4000

## Primeiro acesso

Ao subir o sistema pela primeira vez, um usuário administrador é criado automaticamente:

| Campo | Valor |
|-------|-------|
| Login | `admin` |
| Senha | `Admin@123` |

Na primeira autenticação, o sistema exigirá a troca de senha.

## Funcionalidades

| Módulo | Acesso |
|--------|--------|
| Dashboard | Todos |
| Efetivo | Todos |
| Viaturas em patrulha | P1 / Admin |
| Apreensões | Todos (registrar requer estar na viatura) |
| Fardamentos | Todos (gerenciar: P3 / Admin) |
| Frota de viaturas | P3 / Admin |
| Gestão de efetivo | P1 / Admin |
| Gestão de usuários | P1 / Admin |
| Emitir boletim/aviso | Asp. Oficial+ / P1 / Admin |

## Roles e cargos

| Role | Descrição |
|------|-----------|
| `admin` | Acesso total |
| `supervisor` | Acesso operacional ampliado |
| `officer` | Acesso básico |

| Cargo | Descrição |
|-------|-----------|
| `padrao` | Sem permissões extras |
| `p1` | Recursos Humanos — gerencia efetivo e viaturas |
| `p3` | Operacional — gerencia frota, fardamentos, apreensões |
| `p5` | Comunicação |
| `estagio` | Estágio |

## Estrutura do projeto

```
pmesp_app/
├── docker-compose.yml          # produção
├── docker-compose.dev.yml      # desenvolvimento
├── .env.example
├── backend/                    # Nuxt 3 / Nitro (API only)
│   └── server/
│       ├── api/                # endpoints REST
│       ├── models/             # schemas Mongoose
│       ├── services/           # lógica de negócio
│       ├── middleware/         # CORS, rate limiting
│       ├── utils/              # db, jwt, auth
│       └── plugins/            # seed de dados iniciais
└── frontend/                   # Vue 3 + Vite
    └── src/
        ├── views/              # páginas
        ├── components/         # componentes reutilizáveis
        ├── stores/             # Pinia stores
        ├── composables/        # lógica compartilhada
        └── router/             # rotas e guards
```

## Rate limiting

| Rota | Limite | Janela |
|------|--------|--------|
| `/api/auth/*` | 5 requisições | 15 minutos |
| `/api/*` (demais) | 120 requisições | 1 minuto |
