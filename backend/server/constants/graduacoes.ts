export interface Graduacao {
  label: string
  value: string
  nickPrefix: string
  roleName: string
  grupo: string
}

export interface Cargo {
  label: string
  value: string
  description: string
}

export const GRADUACOES: Graduacao[] = [
  {
    label: 'Soldado 2° Classe',
    value: '14',
    nickPrefix: '',
    roleName: '[ ] SD 2° CL PM',
    grupo: 'PRAÇAS',
  },
  {
    label: 'Soldado 1° Classe',
    value: '13',
    nickPrefix: '❯',
    roleName: '[❯] SD 1° CL PM',
    grupo: 'PRAÇAS',
  },
  {
    label: 'Cabo',
    value: '12',
    nickPrefix: '❯❯',
    roleName: '[❯❯] CABO PM',
    grupo: 'PRAÇAS',
  },
  {
    label: '3º Sargento',
    value: '11',
    nickPrefix: '❯❯❯',
    roleName: '[❯❯❯] 3º SARGENTO PM',
    grupo: 'PRAÇAS GRADUADOS',
  },
  {
    label: '2º Sargento',
    value: '10',
    nickPrefix: '❯ ❯❯❯',
    roleName: '[❯ ❯❯❯] 2º SARGENTO PM',
    grupo: 'PRAÇAS GRADUADOS',
  },
  {
    label: '1º Sargento',
    value: '9',
    nickPrefix: '❯❯ ❯❯❯',
    roleName: '[❯❯ ❯❯❯] 1º SARGENTO PM',
    grupo: 'PRAÇAS GRADUADOS',
  },
  {
    label: 'Subtenente',
    value: '8',
    nickPrefix: '△',
    roleName: '[△] SUBTENENTE PM',
    grupo: 'PRAÇAS GRADUADOS',
  },
  {
    label: 'Aspirante a Oficial',
    value: '7',
    nickPrefix: '✯',
    roleName: '[✯] ASP. A OFICIAL PM',
    grupo: 'PRAÇAS ESPECIAIS',
  },
  {
    label: '2º Tenente',
    value: '6',
    nickPrefix: '✧',
    roleName: '[✧] 2° TENENTE PM',
    grupo: 'OFICIAIS SUBALTERNOS',
  },
  {
    label: '1º Tenente',
    value: '5',
    nickPrefix: '✧✧',
    roleName: '[✧✧] 1º TENENTE PM',
    grupo: 'OFICIAIS SUBALTERNOS',
  },
  {
    label: 'Capitão',
    value: '4',
    nickPrefix: '✧✧✧',
    roleName: '[✧✧✧] CAPITÃO PM',
    grupo: 'OFICIAIS INTERMEDIÁRIOS',
  },
  {
    label: 'Major',
    value: '3',
    nickPrefix: '✵✧✧',
    roleName: '[✵✧✧] MAJOR PM',
    grupo: 'OFICIAIS INTERMEDIÁRIOS',
  },
  {
    label: 'Ten. Coronel',
    value: '2',
    nickPrefix: '✵✵✧',
    roleName: '[✵✵✧] TEN. CORONEL PM',
    grupo: 'OFICIAIS INTERMEDIÁRIOS',
  },
  {
    label: 'Coronel',
    value: '1',
    nickPrefix: '✵✵✵',
    roleName: '[✵✵✵] CORONEL PM',
    grupo: 'OFICIAIS INTERMEDIÁRIOS',
  },
]

export const CARGOS: Cargo[] = [
  { label: 'Padrão', value: 'padrao', description: 'Policial padrão de patrulhamento' },
  { label: 'P1 - RH', value: 'p1', description: 'Recursos Humanos' },
  { label: 'P3 - Operacional', value: 'p3', description: 'Operacional' },
  { label: 'P5 - Comunicação', value: 'p5', description: 'Comunicação' },
  { label: 'Estágio Operacional', value: 'estagio', description: 'Estágio operacional' },
  { label: 'Estágio ROCAM', value: 'rocam', description: 'Estágio ROCAM' },
  { label: 'Braçal ROCAM', value: 'bracal_rocam', description: 'Braçal ROCAM — avalia policiais ROCAM' },
]

export const GRADUACAO_VALUES = GRADUACOES.map((g) => g.value)
export const CARGO_VALUES = CARGOS.map((c) => c.value)

export function getGraduacao(value: string): Graduacao | undefined {
  return GRADUACOES.find((g) => g.value === value)
}

export function buildDisplayName(name: string, rg: string, graduacao: string): string {
  const grad = getGraduacao(graduacao)
  const prefix = grad?.nickPrefix ?? ''
  return `${prefix} | ${name} - ${rg}`
}
