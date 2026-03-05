import { MOCK_PROCEDIMENTOS } from '@/mocks/admin/cadastros'
import {
  MOCK_SUPRIMENTOS_ITEMS,
  SUPRIMENTOS_ITEMS_KEY,
  SUPRIMENTOS_MOVS_KEY,
  type SuprimentoItem,
  type SuprimentoMovimentacao,
} from '@/mocks/suprimentos.mock'

const isBrowser = () => typeof window !== 'undefined'

export const loadSuprimentos = (): SuprimentoItem[] => {
  if (!isBrowser()) return MOCK_SUPRIMENTOS_ITEMS
  try {
    const raw = window.localStorage.getItem(SUPRIMENTOS_ITEMS_KEY)
    if (!raw) {
      window.localStorage.setItem(SUPRIMENTOS_ITEMS_KEY, JSON.stringify(MOCK_SUPRIMENTOS_ITEMS))
      return MOCK_SUPRIMENTOS_ITEMS
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as SuprimentoItem[]) : MOCK_SUPRIMENTOS_ITEMS
  } catch {
    return MOCK_SUPRIMENTOS_ITEMS
  }
}

export const loadSuprimentoMovs = (): SuprimentoMovimentacao[] => {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(SUPRIMENTOS_MOVS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as SuprimentoMovimentacao[]) : []
  } catch {
    return []
  }
}

const saveSuprimentos = (items: SuprimentoItem[]) => {
  if (!isBrowser()) return
  window.localStorage.setItem(SUPRIMENTOS_ITEMS_KEY, JSON.stringify(items))
}

const saveMovs = (movs: SuprimentoMovimentacao[]) => {
  if (!isBrowser()) return
  window.localStorage.setItem(SUPRIMENTOS_MOVS_KEY, JSON.stringify(movs))
}

export const registrarBaixaAutomaticaSuprimentos = (payload: {
  procedimento: string
  paciente: string
  usuario: string
}) => {
  const procedimento = MOCK_PROCEDIMENTOS.find((item) => item.nome === payload.procedimento)
  if (!procedimento || !procedimento.baixaAutomaticaSuprimentos) return

  const vinculados = procedimento.suprimentosVinculados || []
  if (vinculados.length === 0) return

  const currentItems = loadSuprimentos()
  const currentMovs = loadSuprimentoMovs()
  const date = new Date().toISOString().split('T')[0]

  const nextItems = currentItems.map((item) => {
    const isLinked = vinculados.some((sup) => sup.toLowerCase() === item.nome.toLowerCase())
    if (!isLinked) return item
    return {
      ...item,
      quantidadeAtual: Math.max(0, item.quantidadeAtual - 1),
    }
  })

  const nextMovs = [
    ...vinculados.map((sup) => ({
      id: `sup-${Date.now()}-${sup}`,
      data: date,
      usuario: payload.usuario,
      procedimento: payload.procedimento,
      paciente: payload.paciente,
      suprimento: sup,
      quantidade: 1,
      tipo: 'saida' as const,
    })),
    ...currentMovs,
  ]

  saveSuprimentos(nextItems)
  saveMovs(nextMovs)
  if (isBrowser()) window.dispatchEvent(new Event('storage'))
}
