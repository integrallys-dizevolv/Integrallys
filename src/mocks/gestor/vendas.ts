import { BASE_PRODUTOS_LIST, BASE_UNIDADES } from '@/mocks/shared/base'

export interface Sale {
    id: number
    product: string
    unit: string
    quantity: number
    unitPrice: string
    unitCost: string
    margin: string
    total: string
    date: string
    status: 'Pago' | 'Pendente' | 'Cancelado'
}

const formatMoney = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`

export const MOCK_SALES: Sale[] = BASE_PRODUTOS_LIST.map((produto, index) => {
    const quantity = index % 2 === 0 ? 4 : 2
    const total = produto.valor * quantity
    return {
        id: index + 1,
        product: produto.nome,
        unit: index % 2 === 0 ? BASE_UNIDADES.central.nome : BASE_UNIDADES.norte.nome,
        quantity,
        unitPrice: formatMoney(produto.valor),
        unitCost: formatMoney(produto.valor * 0.6),
        margin: '40%',
        total: formatMoney(total),
        date: '21/02/2026',
        status: index === 1 ? 'Pendente' : 'Pago'
    }
})
