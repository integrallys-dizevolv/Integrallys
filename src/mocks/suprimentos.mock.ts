export interface SuprimentoItem {
  id: string
  nome: string
  unidadeMedida: string
  quantidadeAtual: number
  quantidadeMinima: number
  lote?: string
  validade?: string
}

export interface SuprimentoMovimentacao {
  id: string
  data: string
  usuario: string
  procedimento: string
  paciente: string
  suprimento: string
  quantidade: number
  tipo: 'entrada' | 'saida'
}

export const SUPRIMENTOS_ITEMS_KEY = 'integrallys_suprimentos_items_v1'
export const SUPRIMENTOS_MOVS_KEY = 'integrallys_suprimentos_movs_v1'

export const MOCK_SUPRIMENTOS_ITEMS: SuprimentoItem[] = [
  {
    id: 'sup-1',
    nome: 'Luva descartável',
    unidadeMedida: 'caixa',
    quantidadeAtual: 35,
    quantidadeMinima: 10,
    lote: 'LUV-2026-01',
    validade: '2027-01-31',
  },
  {
    id: 'sup-2',
    nome: 'Álcool 70%',
    unidadeMedida: 'litro',
    quantidadeAtual: 18,
    quantidadeMinima: 6,
    lote: 'ALC-2026-02',
    validade: '2026-12-30',
  },
]
