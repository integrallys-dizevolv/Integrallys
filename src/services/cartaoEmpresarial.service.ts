export interface CartaoEmpresarial {
  id: string
  banco: string
  limite: number
  fechamentoDia: number
  vencimentoDia: number
  status: 'Ativo' | 'Inativo'
}

export interface FaturaCartao {
  id: string
  cartaoId: string
  competencia: string
  valorTotal: number
  status: 'Aberta' | 'Fechada' | 'Paga'
}

const CARTOES_KEY = 'gestor_cartoes_empresariais_v1'
const FATURAS_KEY = 'gestor_cartoes_empresariais_faturas_v1'

const isBrowser = () => typeof window !== 'undefined'

const seedCartoes: CartaoEmpresarial[] = [
  {
    id: 'card-1',
    banco: 'Sicredi Empresarial',
    limite: 15000,
    fechamentoDia: 25,
    vencimentoDia: 5,
    status: 'Ativo',
  },
]

const seedFaturas: FaturaCartao[] = [
  { id: 'fat-1', cartaoId: 'card-1', competencia: '2026-03', valorTotal: 4250, status: 'Aberta' },
  { id: 'fat-2', cartaoId: 'card-1', competencia: '2026-02', valorTotal: 3800, status: 'Paga' },
]

export const loadCartoes = () => {
  if (!isBrowser()) return seedCartoes
  try {
    const raw = window.localStorage.getItem(CARTOES_KEY)
    if (!raw) {
      window.localStorage.setItem(CARTOES_KEY, JSON.stringify(seedCartoes))
      return seedCartoes
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CartaoEmpresarial[]) : seedCartoes
  } catch {
    return seedCartoes
  }
}

export const loadFaturas = () => {
  if (!isBrowser()) return seedFaturas
  try {
    const raw = window.localStorage.getItem(FATURAS_KEY)
    if (!raw) {
      window.localStorage.setItem(FATURAS_KEY, JSON.stringify(seedFaturas))
      return seedFaturas
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as FaturaCartao[]) : seedFaturas
  } catch {
    return seedFaturas
  }
}
