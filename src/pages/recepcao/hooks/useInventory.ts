import { useState, useCallback } from 'react'
import { InventoryItem } from '../context/types'

export const useInventory = () => {
    const [items, setItems] = useState<InventoryItem[]>([
        {
            id: '1',
            name: 'Suplemento A',
            category: 'Nutracêuticos',
            stock: 45,
            unit: 'frascos',
            minStock: 10,
            price: 120
        },
        {
            id: '2',
            name: 'Gaze Estéril',
            category: 'Consumíveis',
            stock: 156,
            unit: 'pacotes',
            minStock: 50,
            price: 15
        }
    ])

    const deductStock = useCallback((itemId: string, quantity: number) => {
        setItems(prev => prev.map(item => {
            if (item.id === itemId) {
                return { ...item, stock: Math.max(0, item.stock - quantity) }
            }
            return item
        }))
    }, [])

    const transferStock = useCallback((itemId: string, quantity: number, targetUnit: string) => {
        // RN-018: Tombamento (Transferência entre unidades)
        console.log(`LOG: Tombamento de ${quantity} unidades do item ${itemId} para ${targetUnit}`)
        setItems(prev => prev.map(item => {
            if (item.id === itemId) {
                return { ...item, stock: Math.max(0, item.stock - quantity) }
            }
            return item
        }))
    }, [])

    return { items, deductStock, transferStock }
}
