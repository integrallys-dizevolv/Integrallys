import { appendCaixaTransaction } from '@/services/recepcaoCaixa.service'
import { applyVendaBaixaEstoque } from '@/services/recepcaoEstoque.service'

export interface PrescricaoProduto {
  id: string
  nome: string
  quantidade: number
  posologia: string
  valorUnitario: number
}

export interface PrescricaoAtiva {
  id: string
  paciente: string
  tipo: 'normal' | 'complementar'
  data: string
  observacao?: string
  produtos: PrescricaoProduto[]
}

const STORAGE_KEY = 'especialista_prescricoes_ativas_v1'
const AJUSTES_STORAGE_KEY = 'especialista_ajustes_posologia_v1'

export interface AjustePosologiaRegistro {
  id: string
  data: string
  especialista: string
  paciente: string
  produto: string
  posologiaAnterior: string
  novaPosologia: string
  observacao: string
}

const isBrowser = () => typeof window !== 'undefined'

export const loadPrescricoesAtivas = (): PrescricaoAtiva[] => {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as PrescricaoAtiva[]) : []
  } catch {
    return []
  }
}

export const savePrescricoesAtivas = (items: PrescricaoAtiva[]) => {
  if (!isBrowser()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('storage'))
}

export const getOrCreateUltimaPrescricao = (paciente: string): PrescricaoAtiva => {
  const current = loadPrescricoesAtivas()
  const existing = current.find((item) => item.paciente === paciente)
  if (existing) return existing

  const seeded: PrescricaoAtiva = {
    id: `pre-${Date.now()}`,
    paciente,
    tipo: 'normal',
    data: new Date().toISOString().split('T')[0],
    produtos: [
      {
        id: 'prod-vitd3',
        nome: 'Vitamina D3 1000UI',
        quantidade: 1,
        posologia: '1 cápsula ao dia após almoço',
        valorUnitario: 45,
      },
    ],
  }

  savePrescricoesAtivas([seeded, ...current])
  return seeded
}

export const salvarAjustePosologia = (
  prescricaoId: string,
  produtos: PrescricaoProduto[],
  observacao: string,
) => {
  const current = loadPrescricoesAtivas()
  const original = current.find((item) => item.id === prescricaoId)
  if (!original) return

  const adjustments = produtos
    .map((item) => {
      const previous = original.produtos.find((origin) => origin.id === item.id)
      if (!previous) return null
      if ((previous.posologia || '').trim() === (item.posologia || '').trim()) return null

      return {
        id: `ajuste-${Date.now()}-${item.id}`,
        data: new Date().toISOString().split('T')[0],
        especialista: 'Dr. Especialista',
        paciente: original.paciente,
        produto: item.nome,
        posologiaAnterior: previous.posologia,
        novaPosologia: item.posologia,
        observacao,
      } as AjustePosologiaRegistro
    })
    .filter(Boolean) as AjustePosologiaRegistro[]

  if (!isBrowser()) return
  try {
    const raw = window.localStorage.getItem(AJUSTES_STORAGE_KEY)
    const currentAjustes = raw ? (JSON.parse(raw) as AjustePosologiaRegistro[]) : []
    window.localStorage.setItem(
      AJUSTES_STORAGE_KEY,
      JSON.stringify([...adjustments, ...currentAjustes]),
    )
    window.dispatchEvent(new Event('storage'))
  } catch {
    // noop
  }
}

export const salvarPrescricaoComplementar = async (
  paciente: string,
  produtos: Array<{ nome: string; quantidade: number; valorUnitario: number; posologia: string }>,
  formaPagamento: 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito' | 'consumo',
) => {
  const nova: PrescricaoAtiva = {
    id: `comp-${Date.now()}`,
    paciente,
    tipo: 'complementar',
    data: new Date().toISOString().split('T')[0],
    produtos: produtos.map((item, index) => ({
      id: `comp-prod-${Date.now()}-${index}`,
      nome: item.nome,
      quantidade: item.quantidade,
      posologia: item.posologia,
      valorUnitario: item.valorUnitario,
    })),
  }

  const current = loadPrescricoesAtivas()
  savePrescricoesAtivas([nova, ...current])

  applyVendaBaixaEstoque(
    produtos.map((item) => ({ productName: item.nome, quantity: item.quantidade })),
    {
      paciente,
      vendedor: 'Especialista',
      formaPagamento: formaPagamento,
    },
  )

  if (formaPagamento !== 'consumo') {
    const total = produtos.reduce((acc, item) => acc + item.quantidade * item.valorUnitario, 0)
    const method =
      formaPagamento === 'dinheiro'
        ? 'cash'
        : formaPagamento === 'pix'
        ? 'pix'
        : formaPagamento === 'cartao_debito'
        ? 'debit'
        : 'credit'

    await appendCaixaTransaction({
      description: `Prescrição complementar - ${paciente}`,
      value: total,
      method,
      responsible: 'Especialista',
    })
  }
}
