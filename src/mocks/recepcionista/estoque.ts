
export interface InventaryItem {
    id: string
    name: string
    category: string
    quantity: number
    minQuantity: number
    unit: string
    status: 'available' | 'low' | 'critical'
}

export const MOCK_ESTOQUE: InventaryItem[] = [
    {
        id: '1',
        name: 'Dipirona 500mg',
        category: 'Medicamento',
        quantity: 150,
        minQuantity: 50,
        unit: 'unid',
        status: 'available'
    },
    {
        id: '2',
        name: 'Gaze Estéril',
        category: 'Consumível',
        quantity: 20,
        minQuantity: 50,
        unit: 'pacotes',
        status: 'low'
    },
    {
        id: '3',
        name: 'Luvas de Procedimento',
        category: 'EPI',
        quantity: 5,
        minQuantity: 20,
        unit: 'caixas',
        status: 'critical'
    },
    {
        id: '4',
        name: 'Seringa 5ml',
        category: 'Consumível',
        quantity: 300,
        minQuantity: 100,
        unit: 'unid',
        status: 'available'
    },
    {
        id: '5',
        name: 'Álcool 70%',
        category: 'Saneante',
        quantity: 12,
        minQuantity: 10,
        unit: 'litros',
        status: 'available'
    },
    {
        id: '6',
        name: 'Esparadrapo 10cm',
        category: 'Consumível',
        quantity: 8,
        minQuantity: 15,
        unit: 'unid',
        status: 'low'
    }
]
