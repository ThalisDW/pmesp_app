# Backend — Nuxt 3 / Nitro (API only)

> **REGRA CRÍTICA:** Sempre que criar, alterar ou remover qualquer arquivo neste diretório,
> atualize este CLAUDE.md na mesma sessão. Ele é lido no lugar dos arquivos reais para economizar tokens.

---

## Arquitetura

Nuxt 3 usado apenas como servidor de API (sem frontend, sem SSR).
Toda lógica de negócio vive em **classes de serviço** (`server/services/`).
Event handlers em `server/api/` são finos: validam entrada → chamam serviço → retornam resposta.

```
server/
├── api/
│   ├── auth/
│   │   ├── login.post.ts
│   │   └── change-password.post.ts
│   ├── users/
│   │   ├── index.get.ts
│   │   └── index.post.ts
│   ├── efetivo/
│   │   └── index.get.ts
│   ├── publicacoes/
│   │   ├── index.get.ts
│   │   └── index.post.ts
│   ├── viaturas/
│   │   ├── index.get.ts
│   │   ├── index.post.ts
│   │   └── [id]/
│   │       ├── encerrar.patch.ts
│   │       └── tripulacao.patch.ts
│   ├── apreensoes/
│   │   ├── index.get.ts              → GET /api/apreensoes — stats do mês (totais + rankGeral + rankPorItem)
│   │   ├── index.post.ts             → POST /api/apreensoes — registrar apreensão (usuario deve estar na viatura)
│   │   ├── relatorio.get.ts          → GET /api/apreensoes/relatorio — last 15 viaturas com apreensoes (p3/admin)
│   │   └── relatorio-semanal.get.ts  → GET /api/apreensoes/relatorio-semanal — stats de semana por intervalo de datas (p3/admin)
│   ├── frota/
│   │   ├── index.get.ts          → GET /api/frota — lista veículos ativos (any auth)
│   │   ├── index.post.ts         → POST /api/frota — cadastrar veículo (p3/admin)
│   │   ├── [id].put.ts           → PUT /api/frota/:id — atualizar veículo (p3/admin)
│   │   ├── [id].delete.ts        → DELETE /api/frota/:id — soft delete (p3/admin)
│   │   └── prefixos-disponiveis.get.ts → GET /api/frota/prefixos-disponiveis — prefixos não em uso (any auth)
│   ├── fardamentos/
│   │   ├── index.get.ts          → GET /api/fardamentos — lista fardamentos ativos ordenados por `ordem` (any auth)
│   │   ├── index.post.ts         → POST /api/fardamentos — criar fardamento (p3/admin)
│   │   └── [id]/
│   │       ├── index.put.ts      → PUT /api/fardamentos/:id — atualizar fardamento (p3/admin)
│   │       ├── index.delete.ts   → DELETE /api/fardamentos/:id — soft delete (p3/admin)
│   │       └── mover.patch.ts    → PATCH /api/fardamentos/:id/mover — swap ordem com adjacente (p3/admin)
│   ├── institucional/
│   │   ├── config.get.ts   → GET /api/institucional/config — público; upsert singleton de config
│   │   ├── config.put.ts   → PUT /api/institucional/config — admin only; atualiza imagemHero, fotosCarrossel, militarDestaque
│   │   └── stats.get.ts    → GET /api/institucional/stats — público; retorna totais apreensões do mês atual
│   ├── gestao/
│   │   └── efetivo/
│   │       ├── index.get.ts
│   │       └── [id]/
│   │           ├── promover.patch.ts
│   │           ├── advertencia.patch.ts
│   │           ├── exonerar.patch.ts
│   │           └── cargo.patch.ts
│   ├── avaliacoes-estagio/
│   │   ├── index.get.ts     → GET /api/avaliacoes-estagio — paginado (20); estagio=próprias sem avaliador; officer=suas avaliações; p1/admin=todas+filtros (nota_min,nota_max,avaliadorId,estagiarioId,dataInicio,dataFim)
│   │   ├── index.post.ts    → POST /api/avaliacoes-estagio — cria avaliação; proibido para cargo estagio; campos: estagiarioId, avaliacao, nota (0-10), pontoAtencao?
│   │   └── membros.get.ts   → GET /api/avaliacoes-estagio/membros — estagiarios[] para todos; avaliadores[] só p1/admin
│   └── avaliacoes-rocam/
│       ├── index.get.ts     → GET /api/avaliacoes-rocam — paginado (20); rocam=próprias sem avaliador; officer=suas avaliações; p1/admin=todas+filtros (nota_min,nota_max,avaliadorId,avaliadoId,dataInicio,dataFim)
│       ├── index.post.ts    → POST /api/avaliacoes-rocam — cria avaliação; proibido para cargo rocam; campos: avaliadoId, avaliacao, nota (0-10), pontoAtencao?
│       └── membros.get.ts   → GET /api/avaliacoes-rocam/membros — membros[] (policiais ROCAM) para todos; avaliadores[] só p1/admin
├── constants/
│   └── graduacoes.ts
├── services/
│   └── ApreensaoService.ts  → getStats(), create(data), getRelatorio()
├── models/ (continuação)
│   └── ConfigInstitucional.ts → singleton de config da landing page institucional
├── models/
│   ├── User.ts
│   ├── Publicacao.ts
│   ├── Viatura.ts
│   ├── Apreensao.ts              → viaturaId, viaturaPrefixo, membros[], 7 campos numéricos de itens, origem, registradoPorId
│   ├── VeiculoFrota.ts           → modelo, ano, foto (base64), prefixos[], ativo
│   ├── AvaliacaoEstagio.ts       → avaliadorId/Nome/Rg, estagiarioId/Nome/Rg, avaliacao, pontoAtencao, nota (0-10), timestamps
│   └── AvaliacaoRocam.ts         → avaliadorId/Nome/Rg, avaliadoId/Nome/Rg, avaliacao, pontoAtencao, nota (0-10), timestamps
├── middleware/
│   ├── 01.cors.ts
│   └── 02.rateLimit.ts
├── plugins/
│   └── seed.ts
└── utils/
    ├── db.ts
    ├── jwt.ts
    ├── rateLimit.ts
    └── auth.ts              → requireAuth(event) → JwtPayload; usado nos novos handlers
```

---

## Estado atual dos arquivos

### `nuxt.config.ts`
```ts
export default defineNuxtConfig({
  ssr: false,
  nitro: { preset: 'node-server', devProxy: {} },
  runtimeConfig: { mongoUri: '', jwtSecret: '' },
})
```
Variáveis injetadas em runtime via `NUXT_MONGO_URI` e `NUXT_JWT_SECRET`.

### `server/utils/db.ts`
Singleton de conexão Mongoose. Chama `useRuntimeConfig().mongoUri`.
Flag `connected` evita reconexão. Chamar `await connectDB()` no início de cada serviço/handler.

### `server/utils/jwt.ts`
Duas funções puras: `signToken(payload, secret)` → JWT 8h | `verifyToken(token, secret)` → JwtPayload.
Interface: `JwtPayload { id, username, role, cargo, graduacao }`.
Secret sempre vem de `useRuntimeConfig().jwtSecret` — nunca hardcodar.

### `server/utils/rateLimit.ts`
`checkRate(key, limit, windowMs)` — janela fixa em memória (`Map`).
Retorna `{ allowed, remaining, resetAt, retryAfter }`.
Limpeza automática de entradas expiradas a cada 10 min via `setInterval`.

### `server/middleware/01.cors.ts`
Seta headers CORS para `*`. Responde `204` para `OPTIONS` (preflight).

### `server/middleware/02.rateLimit.ts`
- `/api/auth/*` → 5 req / 15 min · chave: `ip:path`
- `/api/*` demais → 120 req / min · chave: `ip:api`
- Seta `X-RateLimit-*` e `Retry-After`. Lança `createError(429)`.

### `server/constants/graduacoes.ts`
Fonte de verdade para graduações e cargos. Exporta:
- `GRADUACOES[]` — `{ label, value, nickPrefix, roleName, grupo }`
- `CARGOS[]` — `{ label, value, description }`
- `getGraduacao(value)` — busca graduação pelo value
- `buildDisplayName(name, rg, graduacao)` → `"nickPrefix | nome - rg"`

Graduações (value numérico, 1=mais alto, 14=mais baixo):
`'14'` Sd 2° Cl, `'13'` Sd 1° Cl, `'12'` Cabo, `'11'` 3° Sgt, `'10'` 2° Sgt, `'9'` 1° Sgt,
`'8'` Subtenente, `'7'` Asp. Oficial (✯), `'6'` 2° Ten (✧), `'5'` 1° Ten (✧✧),
`'4'` Capitão (✧✧✧), `'3'` Major (✵✧✧), `'2'` Ten. Coronel (✵✵✧), `'1'` Coronel (✵✵✵)
Cargos: `padrao`, `p1` (RH), `p3` (Operacional), `p5` (Comunicação), `estagio`, `rocam` (Estágio ROCAM), `bracal_rocam` (Braçal ROCAM — avaliador ROCAM)

### `server/models/User.ts`

Schema Mongoose:
```
username       String   unique, lowercase, trim, required
password       String   required (bcrypt hash, salt 12)
name           String   required
rg             String   default: ''
role           'admin' | 'supervisor' | 'officer'  default: 'officer'
cargo          'padrao' | 'p1' | 'p3' | 'p5' | 'estagio' | 'rocam'  default: 'padrao'
graduacao      String   enum de GRADUACAO_VALUES  default: '14'
dataPromocao   Date     default: null
cursos         [ObjectId]  ref: 'Course'  default: []
advertencias   [{ descricao, data, aplicadoPor }]  max 3 (validator)  default: []
patrulhando    Boolean  default: false
ultimaPatrulha Date     default: null
badge          String   default: ''
firstAccess    Boolean  default: true
active         Boolean  default: true
ausente        Boolean  default: false
timestamps: true
```
Hook `pre('save')`: faz hash bcrypt(12) apenas se `password` foi modificado.
Método: `comparePassword(plain) → Promise<boolean>` via `bcrypt.compare`.
Export: `const User = mongoose.models.User || mongoose.model('User', UserSchema)`

### `server/plugins/seed.ts`
Nitro plugin que roda no boot. Cria usuário admin se não existir:
- username: `admin` | password: `Admin@123` | role: `admin` | cargo: `p1` | graduacao: `'4'` (Capitão) | rg: `00001` | firstAccess: `true`

### `server/api/auth/login.post.ts`
`POST /api/auth/login` — público (rate limit cobre)
Body: `{ username, password }`
Retorna: `{ token, user: { id, username, name, rg, role, cargo, graduacao, dataPromocao, patrulhando, badge, firstAccess, ausente } }`
Erro 400 se campos faltando · 401 se inválido · nunca revelar qual campo está errado.

### `server/api/auth/change-password.post.ts`
`POST /api/auth/change-password` — requer Bearer token
Body: `{ newPassword, confirmPassword }`
Valida: mínimo 8 chars · senhas iguais.
Faz `bcrypt.hash(12)` manualmente (não passa pelo hook `pre('save')`).
Seta `firstAccess: false` via `findByIdAndUpdate`.
Retorna: `{ success: true, message }`

### `server/api/users/index.get.ts`
`GET /api/users` — requer Bearer token · role: `admin`
Retorna: `{ users: [...] }` sem campo `password` (projeção `{ password: 0 }`).
Ordenado por `name`.

### `server/api/efetivo/index.get.ts`
`GET /api/efetivo` — requer Bearer token (qualquer role)
Retorna: `{ officers: [...] }` com todos os campos exceto `password` e `__v`.
Ordenado por `name`. Apenas usuários `active: true`.

### `server/models/Publicacao.ts`
Schema Mongoose:
```
tipo           'aviso' | 'boletim'  required
titulo         String   default: ''
conteudo       String   default: ''
parte1–parte4  String   default: 'Sem alterações.'
autorId        ObjectId ref: 'User'  required
autorNome      String   required
autorRg        String   default: ''
autorGraduacao String   default: ''
autorCargo     String   default: ''
ativo          Boolean  default: true
timestamps: true
```

### `server/api/publicacoes/index.get.ts`
`GET /api/publicacoes` — requer Bearer token (qualquer role)
Retorna: `{ avisos: [...], boletins: [...] }` — ambos ordenados por `createdAt` desc.
Avisos: limit 50. Boletins: limit 20.

### `server/api/publicacoes/index.post.ts`
`POST /api/publicacoes` — requer Bearer token
Body aviso: `{ tipo: 'aviso', titulo, conteudo }`
Body boletim: `{ tipo: 'boletim', parte1?, parte2?, parte3?, parte4? }`
Autorização: aviso → `parseInt(graduacao) <= 7` ou admin. Boletim → `cargo === 'p1'` ou admin.
Snapshot do autor buscado no DB e salvo em `autorNome/Rg/Graduacao/Cargo`.
Retorna: `{ publicacao }`

### `server/api/gestao/efetivo/index.get.ts`
`GET /api/gestao/efetivo` — requer Bearer + cargo p1 ou admin
Query: `?exonerado=1` → retorna inativos. Sem query → retorna ativos.
Exclui admins. Ordenado por `{ graduacao: 1, name: 1 }`.
Retorna: `{ officers: [...] }`

### `server/api/gestao/efetivo/[id]/promover.patch.ts`
`PATCH /api/gestao/efetivo/:id/promover` — requer p1 ou admin
Body: `{ graduacao }` — deve ser valor válido de GRADUACAO_VALUES.
Atualiza `graduacao` + `dataPromocao = now`. Retorna `{ officer }`.

### `server/api/gestao/efetivo/[id]/advertencia.patch.ts`
`PATCH /api/gestao/efetivo/:id/advertencia` — requer p1 ou admin
Body: `{ descricao }`. Máximo 3 advertências — erro 400 se já tiver 3.
Push `{ descricao, data: now, aplicadoPor: payload.id }`. Retorna `{ officer }`.

### `server/api/gestao/efetivo/[id]/exonerar.patch.ts`
`PATCH /api/gestao/efetivo/:id/exonerar` — requer p1 ou admin
Não permite exonerar a si mesmo. Seta `active: false`. Retorna `{ officer }`.

### `server/models/Viatura.ts`
Schema Mongoose:
```
prefixo        String   required, trim
observacao     String   default: ''
status         'ativa' | 'encerrada'  default: 'ativa'
motorista      ObjectId ref: 'User'  required
chefeDeBarca   ObjectId ref: 'User'  required
auxiliar1–3    ObjectId ref: 'User'  default: null
abertaPor      ObjectId ref: 'User'  required
encerradaPor   ObjectId ref: 'User'  default: null
abertaEm       Date     default: Date.now
encerradaEm    Date     default: null
timestamps: true
```

### `server/api/viaturas/index.get.ts`
`GET /api/viaturas` — requer Bearer token (qualquer role)
Retorna: `{ viaturas: [...] }` — apenas `status: 'ativa'`, ordenadas por `abertaEm` desc.
Popula motorista, chefeDeBarca, auxiliar1–3 com `name rg graduacao cargo username`.

### `server/api/viaturas/index.post.ts`
`POST /api/viaturas` — requer Bearer token (qualquer role)
Body: `{ prefixo, observacao?, motorista, chefeDeBarca, auxiliar1?, auxiliar2?, auxiliar3? }`
Valida: prefixo obrigatório, motorista/chefeDeBarca obrigatórios, sem IDs duplicados na barca.
Ao criar: `User.updateMany({ _id: { $in: ids } }, { patrulhando: true, ultimaPatrulha: now })`.
Retorna `{ viatura }` populada.

### `server/api/viaturas/[id]/tripulacao.patch.ts`
`PATCH /api/viaturas/:id/tripulacao` — requer Bearer token (qualquer role)
Body: `{ motorista, chefeDeBarca, auxiliar1?, auxiliar2?, auxiliar3? }`
Calcula `addedIds` (novos na viatura) e `removedIds` (saíram). Verifica `addedIds` não estão patrulhando em outra viatura.
`updateMany` removedIds → `patrulhando: false`; addedIds → `patrulhando: true, ultimaPatrulha: now`.
Retorna `{ viatura }` populada.

### `server/utils/auth.ts`
`requireAuth(event)` — extrai e verifica Bearer token; retorna `JwtPayload`. Lança 401 se ausente/inválido.
Usado nos novos endpoints de apreensões. Handlers antigos ainda fazem inline auth.

### `server/models/Apreensao.ts`
Schema Mongoose:
```
viaturaId      ObjectId   ref: 'Viatura'  required
viaturaPrefixo String     required
membros        [{ userId, name, rg, graduacao }]  snapshot da tripulação no momento
armasFogo      Number     default: 0
drogas         Number     default: 0
explosivos     Number     default: 0
itensRoubados  Number     default: 0
armasBrancas   Number     default: 0
dinheiroSujo   Number     default: 0
municao        Number     default: 0
origem         String     default: ''
registradoPorId ObjectId  ref: 'User'  required
timestamps: true
```
Indexes: `{ createdAt: -1 }`, `{ viaturaId: 1 }`.

### `server/services/ApreensaoService.ts`
- `getStatsByRange(start, end)` → agrega intervalo de datas: totais por item + rankGeral (top 10) + rankPorItem (top 5)
- `getStats(mes, ano)` → delega para `getStatsByRange` usando `monthRange(mes, ano)`
- `getPatrulhaRankByRange(start, end)` → top 10 officers por minutos patrulhados no intervalo
- `getPatrulhaRank(mes, ano)` → delega para `getPatrulhaRankByRange`
- `getDiasPatrulhadosRankByRange(start, end)` → top 10 officers por dias distintos patrulhados; acumula Set<string> de datas
- `getDiasPatrulhadosRank(mes, ano)` → delega para `getDiasPatrulhadosRankByRange`
- `create({ viaturaId, userId, items, origem })` → verifica usuário na viatura via `$or` query, snapshot crew, cria Apreensao
- `getRelatorio()` → last 15 viaturas (qualquer status) + apreensoes de cada uma

### `server/api/apreensoes/index.get.ts`
`GET /api/apreensoes?mes=4&ano=2026` — qualquer role autenticado; query params opcionais (default: mês atual)
Retorna: `{ totais, rankGeral, rankPorItem }`

### `server/api/apreensoes/rank-patrulha.get.ts`
`GET /api/apreensoes/rank-patrulha?mes=4&ano=2026` — qualquer role autenticado
Retorna: `{ rank: [{ userId, name, rg, graduacao, total: minutos }] }` top 10 por minutos patrulhados no período

### `server/api/apreensoes/rank-dias.get.ts`
`GET /api/apreensoes/rank-dias?mes=4&ano=2026` — qualquer role autenticado
Retorna: `{ rank: [{ userId, name, rg, graduacao, total: dias }] }` top 10 por dias distintos patrulhados no período (contando FDS também)

### `server/api/apreensoes/index.post.ts`
`POST /api/apreensoes` — qualquer role autenticado; backend verifica que user está na viatura ativa
Body: `{ viaturaId, origem?, armasFogo?, drogas?, explosivos?, itensRoubados?, armasBrancas?, dinheiroSujo?, municao? }`
Valida: ao menos um item > 0. Retorna `{ apreensao }`.

### `server/api/apreensoes/relatorio.get.ts`
`GET /api/apreensoes/relatorio` — requer cargo p3 ou admin
Retorna: `{ viaturas: [{ viaturaId, prefixo, status, abertaEm, encerradaEm, apreensoes[] }] }`

### `server/api/apreensoes/relatorio-semanal.get.ts`
`GET /api/apreensoes/relatorio-semanal?inicio=YYYY-MM-DD&fim=YYYY-MM-DD` — requer cargo p3 ou admin
Ambos os params obrigatórios. Datas parseadas via `new Date(ano, mes-1, dia)` (hora local) para evitar offset UTC.
Retorna: `{ totais, rankGeral, rankPorItem, rankPatrulha, rankDias }` — mesmo formato da rota mensal mas para intervalo livre.

### `server/api/viaturas/[id]/encerrar.patch.ts`
`PATCH /api/viaturas/:id/encerrar` — requer Bearer token (qualquer role)
Checa se viatura é ativa (400 se já encerrada).
Ao encerrar: `User.updateMany(...)` seta `patrulhando: false` em todos da barca.
Seta `status: 'encerrada'`, `encerradaPor`, `encerradaEm: now`.
Retorna `{ viatura }` populada.

### `server/api/users/index.post.ts`
`POST /api/users` — requer Bearer token · role: `admin` OU cargo: `p1`
Body: `{ username, name, rg?, role?, cargo?, graduacao?, dataPromocao?, badge? }`
Gera senha temporária aleatória: `Pmesp@XXXXXX`.
Retorna: `{ user: {...}, tempPassword }` — único momento em que a senha temporária é exposta.
Erro 409 se username já existe.

### `server/models/Ausencia.ts`
Schema Mongoose:
```
usuarioId      ObjectId   ref: 'User'  required
usuarioNome    String     required (snapshot)
usuarioRg      String     default: ''
usuarioGraduacao String   default: ''
data           Date       required
motivo         String     required, trim
status         'ativa' | 'encerrada'  default: 'ativa'
encerradaEm    Date       default: null
timestamps: true
```
Indexes: `{ usuarioId: 1, status: 1 }`, `{ status: 1, data: -1 }`.

### `server/api/atividade/minha.get.ts`
`GET /api/atividade/minha` — qualquer role autenticado
Retorna métricas do mês corrente para o usuário logado:
`{ diasPatrulhados, diasUteisPatrulhados, totalWeekdays, percentual, flag }`
Usa `$and` com dois `$or` para filtrar viaturas do período E que contêm o usuário.

### `server/api/atividade/index.get.ts`
`GET /api/atividade?mes=6&ano=2026` — requer cargo p1 ou admin. Query params `mes` e `ano` opcionais (default: mês atual).
Retorna TODOS os usuários ativos não-admin (incluindo ausentes) com métricas do período:
- `diasPatrulhados`: dias totais únicos em viatura ativa
- `diasUteisPatrulhados`: dias úteis (seg-sex) únicos
- `totalWeekdays`: total de dias úteis do período
- `percentual`: % arredondado
- `flag`: `'apto'` (≥60%), `'ativo'` (40–59%), `'inativo'` (<40%)
- `diasAusencia`: dias de ausência dentro do período (sobreposição de todas as ausências com o mês)
- `ausente`: true se tem ausência ativa agora (apenas mês atual)
Ausências buscadas via `dataInicio <= today && dataFim >= monthStart`. Função `countDays(from, to)` conta dias corridos.
Mês passado: `ausentesAtivosIds = []` (nenhuma exclusão). Ordenado por flag→nome (graduação: frontend).
Retorna: `{ efetivo: [...], totalWeekdays, mes }`.

### `server/api/ausencias/index.get.ts`
`GET /api/ausencias` — qualquer role autenticado
Query params: `?usuarioId=xxx&data=yyyy-mm-dd` (apenas para P1/admin)
- Usuário comum: retorna só as próprias ausências
- P1/admin: retorna todas, com filtros opcionais por usuário e data
Retorna: `{ ausencias: [...] }` ordenadas por `createdAt desc`.

### `server/api/ausencias/index.post.ts`
`POST /api/ausencias` — qualquer role autenticado
Body: `{ dataInicio, dataFim, motivo }`
Valida: dataInicio, dataFim e motivo obrigatórios; fim >= inicio; só 1 ausência ativa por vez (409 se já tiver).
Datas parseadas via `Date.UTC(ano, mes-1, dia, 12, 0, 0)` (meio-dia UTC) para evitar deslocamento de fuso horário.
Snapshot de `usuarioNome/Rg/Graduacao`. Seta `user.ausente = true`.
Retorna: `{ ausencia }`.

### `server/api/ausencias/[id]/encerrar.patch.ts`
`PATCH /api/ausencias/:id/encerrar` — dono da ausência ou P1/admin
Seta `status = 'encerrada'`, `encerradaEm = now`. Seta `user.ausente = false`.
Retorna: `{ success: true }`.

### `server/models/Fardamento.ts`
Schema Mongoose:
```
nome       String   required, trim
descricao  String   default: ''
foto       String   default: '' (base64 data URL — max 2MB recommended)
ordem      Number   required (auto-incrementado na criação: max_ordem + 1)
maos       String   default: ''
jaqueta    String   default: ''
mochila    String   default: ''
acessorios String   default: ''
sapatos    String   default: ''
chapeu     String   default: ''
camisa     String   default: ''
coletes    String   default: ''
adesivos   String   default: ''
calcas     String   default: ''
mascara    String   default: ''
ativo      Boolean  default: true
timestamps: true
```
Index: `{ ativo: 1, ordem: 1 }`.

### `server/api/fardamentos/index.get.ts`
`GET /api/fardamentos` — qualquer role autenticado
Retorna: `{ fardamentos: [...] }` — apenas `ativo: true`, ordenados por `ordem`.

### `server/api/fardamentos/index.post.ts`
`POST /api/fardamentos` — requer cargo p3 ou admin
Body: `{ nome, descricao?, foto?, maos?, jaqueta?, mochila?, acessorios?, sapatos?, chapeu?, camisa?, coletes?, adesivos?, calcas?, mascara? }`
Auto-calcula `ordem = max_existing_ordem + 1` (ou 1 se vazio).
Retorna `{ fardamento }`.

### `server/api/fardamentos/[id]/index.put.ts`
`PUT /api/fardamentos/:id` — requer cargo p3 ou admin
Body: mesmos campos do POST (exceto foto que é opcional).
Retorna `{ fardamento }` atualizado.

### `server/api/fardamentos/[id]/index.delete.ts`
`DELETE /api/fardamentos/:id` — requer cargo p3 ou admin
Soft delete: seta `ativo: false`. Retorna `{ success: true }`.

### `server/api/fardamentos/[id]/mover.patch.ts`
`PATCH /api/fardamentos/:id/mover` — requer cargo p3 ou admin
Body: `{ direcao: 'cima' | 'baixo' }`
Encontra fardamento adjacente por `ordem` e faz swap dos valores de `ordem`.
Se não há adjacente nessa direção, retorna `{ success: true }` sem erro.

### `server/models/VeiculoFrota.ts`
Schema Mongoose:
```
modelo   String   required, trim
ano      Number   required
foto     String   default: '' (base64 data URL — max 2MB recommended)
prefixos [String] default: []
ativo    Boolean  default: true
timestamps: true
```
Index: `{ ativo: 1 }`.

### `server/api/frota/index.get.ts`
`GET /api/frota` — qualquer role autenticado
Retorna: `{ veiculos: [...] }` — apenas `ativo: true`, ordenados por `modelo`.

### `server/api/frota/index.post.ts`
`POST /api/frota` — requer cargo p3 ou admin
Body: `{ modelo, ano, foto?, prefixos? }`
Valida: modelo obrigatório, ano >= 1900. Retorna `{ veiculo }`.

### `server/api/frota/[id].put.ts`
`PUT /api/frota/:id` — requer cargo p3 ou admin
Body: `{ modelo, ano, foto?, prefixos? }`. Retorna `{ veiculo }` atualizado.

### `server/api/frota/[id].delete.ts`
`DELETE /api/frota/:id` — requer cargo p3 ou admin
Soft delete: seta `ativo: false`. Retorna `{ success: true }`.

### `server/api/frota/prefixos-disponiveis.get.ts`
`GET /api/frota/prefixos-disponiveis` — qualquer role autenticado
Retorna: `{ prefixos: [{ prefixo, modelo, ano, veiculoId }] }` — prefixos de veículos ativos que não estão em uso em nenhuma viatura ativa. Ordenados alfabeticamente por prefixo.

### `server/models/AvaliacaoRocam.ts`
Schema Mongoose:
```
avaliadorId    ObjectId   ref: 'User'  required
avaliadorNome  String     required (snapshot)
avaliadorRg    String     default: ''
avaliadoId     ObjectId   ref: 'User'  required
avaliadoNome   String     required (snapshot)
avaliadoRg     String     default: ''
avaliacao      String     required, trim
pontoAtencao   String     default: ''
nota           Number     required, min: 0, max: 10
timestamps: true
```
Export com proteção de registro duplicado: `mongoose.models.AvaliacaoRocam || mongoose.model(...)`.

### `server/api/avaliacoes-rocam/index.get.ts`
`GET /api/avaliacoes-rocam` — requer Bearer token (qualquer role)
- `isRocam` (cargo tem 'rocam' MAS não 'bracal_rocam' e não p1/admin): filtra por `avaliadoId = payload.id`; resposta omite campos avaliador
- `bracal_rocam` (não p1/admin): filtra por `avaliadorId = payload.id`
- `isP1/admin`: sem filtro de pessoa + filtros extras via query: `nota_min`, `nota_max`, `avaliadorId`, `avaliadoId`, `dataInicio`, `dataFim`
Paginação: 20 por página. Retorna: `{ avaliacoes, total, page, pages }`.

### `server/api/avaliacoes-rocam/index.post.ts`
`POST /api/avaliacoes-rocam` — requer Bearer token
Permitido apenas para `cargo.includes('bracal_rocam')` ou `cargo.includes('p1')` ou `role === 'admin'`; demais recebem 403.
Body: `{ avaliadoId, avaliacao, pontoAtencao?, nota }`
Valida: avaliadoId e avaliacao obrigatórios; nota 0-10 (Math.round).
Busca avaliador por `payload.id` no DB (JWT não tem nome). Valida avaliado: `User.findOne({ _id: avaliadoId, active: true, cargo: 'rocam' })`.
Retorna: `{ avaliacao }`.

### `server/api/avaliacoes-rocam/membros.get.ts`
`GET /api/avaliacoes-rocam/membros` — requer Bearer token (qualquer role)
Retorna:
- `membros`: `User.find({ active: true, cargo: 'rocam' })` — policiais ROCAM que podem ser avaliados; para todos autenticados
- `avaliadores`: `User.find({ active: true, cargo: { $in: ['bracal_rocam', 'p1'] }, role: { $ne: 'admin' } })` — só para p1/admin (usado em filtros)

---

## Padrão de classe de serviço (usar ao criar novos domínios)

```typescript
// server/services/ExemploService.ts
import { connectDB } from '../utils/db'
import { Exemplo } from '../models/Exemplo'

export class ExemploService {
  static async findAll() {
    await connectDB()
    return Exemplo.find({ active: true }).select('-__v').sort({ name: 1 }).lean()
  }

  static async findById(id: string) {
    await connectDB()
    const doc = await Exemplo.findById(id).lean()
    if (!doc) throw createError({ statusCode: 404, message: 'Não encontrado' })
    return doc
  }

  static async create(data: unknown) {
    await connectDB()
    return Exemplo.create(data)
  }

  static async update(id: string, data: unknown) {
    await connectDB()
    const doc = await Exemplo.findByIdAndUpdate(id, data, { new: true }).lean()
    if (!doc) throw createError({ statusCode: 404, message: 'Não encontrado' })
    return doc
  }

  static async remove(id: string) {
    await connectDB()
    await Exemplo.findByIdAndUpdate(id, { active: false })
  }
}
```

Handler correspondente (fino):
```typescript
// server/api/exemplos/index.get.ts
import { ExemploService } from '../../services/ExemploService'
import { requireAuth } from '../../utils/auth'  // a criar

export default defineEventHandler(async (event) => {
  requireAuth(event, ['admin', 'supervisor'])
  return ExemploService.findAll()
})
```

---

## Utilitário `requireAuth` (criar quando necessário)

```typescript
// server/utils/auth.ts
import { verifyToken } from './jwt'

export function requireAuth(event: H3Event, roles?: string[]) {
  const header = getHeader(event, 'authorization')
  if (!header?.startsWith('Bearer ')) throw createError({ statusCode: 401, message: 'Não autorizado' })
  const config = useRuntimeConfig()
  const payload = verifyToken(header.slice(7), config.jwtSecret)
  if (roles?.length && !roles.includes(payload.role)) throw createError({ statusCode: 403, message: 'Acesso negado' })
  return payload
}
```
Ao criar este utilitário, refatorar os handlers existentes para usá-lo e atualizar este CLAUDE.md.

---

## Regras de otimização (obrigatórias)

| Situação | O que fazer |
|----------|------------|
| Leitura | Sempre `.lean()` — retorna POJO, sem overhead de documento Mongoose |
| Projeção | Sempre omitir `password` e `__v` — usar `.select('-password -__v')` ou projeção `{password:0}` |
| Listagem | Sempre paginar — `.limit(n).skip(offset)` |
| Campo buscado | `index: true` no Schema |
| Verificar existência | `.exists({})` em vez de `findOne` |
| Múltiplos writes | `bulkWrite()` — nunca loop com `.save()` |
| Nunca retornar senha | Regra absoluta, sem exceção, em nenhum endpoint |

## Convenção de middlewares

Nomear com prefixo numérico para garantir ordem de execução:
- `01.cors.ts` — CORS
- `02.rateLimit.ts` — Rate limiting
- `03+` — futuros (ex: logging, auth global)

## Dependências atuais

```json
{
  "nuxt": "^3.11.2",
  "mongoose": "^8.3.4",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2"
}
```
