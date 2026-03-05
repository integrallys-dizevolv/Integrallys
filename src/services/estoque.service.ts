import {
  ESTOQUE_STORAGE_ITEMS_KEY,
  ESTOQUE_STORAGE_MOVS_KEY,
  MOCK_ESTOQUE,
  type InventaryItem,
} from '@/mocks/estoque.mock'

export interface EstoqueMovimentacao {
  id: string
  tipo: 'entrada' | 'saida'
  data: string
  produto: string
  quantidade: number
  detalhe: string
}

export interface RegistrarEntradaPayload {
  nf: string
  fornecedor: string
  data: string
  produto: string
  quantidade: number
  precoCusto: number
  lote: string
  validade: string
}

export interface RegistrarSaidaPayload {
  produtoId: string
  quantidade: number
  justificativa: string
}

interface RegistrarEntradaOptions {
  atualizarCustoExistente?: boolean
}

const isBrowser = () => typeof window !== 'undefined'

const statusByQuantity = (quantity: number, minQuantity: number): InventaryItem['status'] => {
  if (quantity <= minQuantity / 2) return 'critical'
  if (quantity <= minQuantity) return 'low'
  return 'available'
}

export const loadEstoqueItems = (): InventaryItem[] => {
  if (!isBrowser()) return MOCK_ESTOQUE
  try {
    const raw = window.localStorage.getItem(ESTOQUE_STORAGE_ITEMS_KEY)
    if (!raw) {
      window.localStorage.setItem(ESTOQUE_STORAGE_ITEMS_KEY, JSON.stringify(MOCK_ESTOQUE))
      return MOCK_ESTOQUE
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as InventaryItem[]) : MOCK_ESTOQUE
  } catch {
    return MOCK_ESTOQUE
  }
}

export const loadEstoqueMovs = (): EstoqueMovimentacao[] => {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(ESTOQUE_STORAGE_MOVS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as EstoqueMovimentacao[]) : []
  } catch {
    return []
  }
}

const persistItems = (items: InventaryItem[]) => {
  if (!isBrowser()) return
  window.localStorage.setItem(ESTOQUE_STORAGE_ITEMS_KEY, JSON.stringify(items))
}

const persistMovs = (movs: EstoqueMovimentacao[]) => {
  if (!isBrowser()) return
  window.localStorage.setItem(ESTOQUE_STORAGE_MOVS_KEY, JSON.stringify(movs))
}

const dispatchSync = () => {
  if (!isBrowser()) return
  window.dispatchEvent(new Event('storage'))
}

export const saveEditedItem = (updated: InventaryItem) => {
  const nextItems = loadEstoqueItems().map((item) => (item.id === updated.id ? updated : item))
  persistItems(nextItems)
  dispatchSync()
  return nextItems
}

export const removeItem = (itemId: string) => {
  const nextItems = loadEstoqueItems().filter((item) => item.id !== itemId)
  persistItems(nextItems)
  dispatchSync()
  return nextItems
}

export const registrarEntradaEstoque = (payload: RegistrarEntradaPayload, options?: RegistrarEntradaOptions) => {
  const normalizedProduto = payload.produto.trim().toLowerCase()
  const currentItems = loadEstoqueItems()
  const currentMovs = loadEstoqueMovs()

  let nextItems = currentItems
  const existing = currentItems.find((item) => item.name.trim().toLowerCase() === normalizedProduto)

  if (existing) {
    const quantity = existing.quantity + payload.quantidade
    const updated: InventaryItem = {
      ...existing,
      quantity,
      status: statusByQuantity(quantity, existing.minQuantity),
      costPrice: options?.atualizarCustoExistente ? payload.precoCusto : (existing.costPrice ?? payload.precoCusto),
    }
    nextItems = currentItems.map((item) => (item.id === existing.id ? updated : item))
  } else {
    const minQuantity = Math.max(1, Math.floor(payload.quantidade * 0.3))
    const newItem: InventaryItem = {
      id: String(Date.now()),
      name: payload.produto,
      category: 'Consumível',
      quantity: payload.quantidade,
      minQuantity,
      unit: 'unid',
      status: statusByQuantity(payload.quantidade, minQuantity),
      costPrice: payload.precoCusto,
      salePrice: undefined,
      ncm: '',
      taxRule: '',
    }
    nextItems = [newItem, ...currentItems]
  }

  const detalhe = [
    `NF ${payload.nf || '-'}`,
    `Fornecedor ${payload.fornecedor || '-'}`,
    `Lote ${payload.lote || '-'}`,
    `Validade ${payload.validade || '-'}`,
    `Custo R$ ${payload.precoCusto.toFixed(2)}`,
  ].join(' • ')

  const nextMovs: EstoqueMovimentacao[] = [
    {
      id: `ent-${Date.now()}`,
      tipo: 'entrada',
      data: payload.data,
      produto: payload.produto,
      quantidade: payload.quantidade,
      detalhe,
    },
    ...currentMovs,
  ]

  persistItems(nextItems)
  persistMovs(nextMovs)
  dispatchSync()
  return {
    items: nextItems,
    movimentacoes: nextMovs,
    novoProdutoIncompleto: !existing,
  }
}

export const registrarSaidaEstoque = (payload: RegistrarSaidaPayload) => {
  const currentItems = loadEstoqueItems()
  const currentMovs = loadEstoqueMovs()
  const selected = currentItems.find((item) => item.id === payload.produtoId)

  if (!selected) return { ok: false as const, error: 'Produto não encontrado para saída.' }

  const nextQuantity = selected.quantity - payload.quantidade
  if (nextQuantity < 0) return { ok: false as const, error: 'Quantidade de saída maior que o disponível.' }

  const nextItems = currentItems.map((item) => {
    if (item.id !== payload.produtoId) return item
    return {
      ...item,
      quantity: nextQuantity,
      status: statusByQuantity(nextQuantity, item.minQuantity),
    }
  })

  const nextMovs: EstoqueMovimentacao[] = [
    {
      id: `sai-${Date.now()}`,
      tipo: 'saida',
      data: new Date().toISOString().split('T')[0],
      produto: selected.name,
      quantidade: payload.quantidade,
      detalhe: payload.justificativa,
    },
    ...currentMovs,
  ]

  persistItems(nextItems)
  persistMovs(nextMovs)
  dispatchSync()

  return { ok: true as const, items: nextItems, movimentacoes: nextMovs }
}
