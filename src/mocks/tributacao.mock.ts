export interface RegraTributacao {
  id: string
  unidade: string
  nome: string
  regra: string
}

export const TRIBUTACAO_STORAGE_KEY = 'integrallys_tributacao_regras_v1'

export const MOCK_REGRAS_TRIBUTACAO: RegraTributacao[] = [
  { id: 'trb-1', unidade: 'Água Boa', nome: 'Produto padrão estadual', regra: 'ICMS 12%' },
  { id: 'trb-2', unidade: 'Querência', nome: 'Produto padrão municipal', regra: 'ISS 5%' },
  { id: 'trb-3', unidade: 'Água Boa', nome: 'Substituição tributária', regra: 'ICMS-ST 18%' },
]
