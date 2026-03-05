export interface StockItem {
    id: number
    product: string
    lot: string
    expirationDate: string
    quantity: number
    minQuantity: number
    unitCost: string
    unitPrice: string
    status: 'Adequado' | 'Baixo' | 'Crítico' | 'Vencendo'
}

export const MOCK_STOCK_ITEMS: StockItem[] = [
    {
        id: 1,
        product: 'Ômega 3 - 1000mg',
        lot: 'LT2026-001',
        expirationDate: '15/12/2026',
        quantity: 45,
        minQuantity: 20,
        unitCost: '52,00',
        unitPrice: '150,00',
        status: 'Adequado'
    },
    {
        id: 2,
        product: 'Vitamina D - 2000UI',
        lot: 'LT2026-002',
        expirationDate: '20/11/2026',
        quantity: 8,
        minQuantity: 15,
        unitCost: '36,00',
        unitPrice: '89,00',
        status: 'Vencendo'
    },
    {
        id: 3,
        product: 'Probiótico Premium',
        lot: 'LT2024-089',
        expirationDate: '28/02/2026',
        quantity: 32,
        minQuantity: 25,
        unitCost: '70,00',
        unitPrice: '180,00',
        status: 'Adequado'
    },
    {
        id: 4,
        product: 'Colágeno Hidrolisado',
        lot: 'LT2026-015',
        expirationDate: '10/01/2026',
        quantity: 12,
        minQuantity: 30,
        unitCost: '55,00',
        unitPrice: '140,00',
        status: 'Baixo'
    }
];

