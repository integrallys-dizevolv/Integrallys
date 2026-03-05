export interface InventaryItem {
  id: string
  name: string
  category: string
  quantity: number
  minQuantity: number
  unit: string
  status: 'available' | 'low' | 'critical'
  costPrice?: number
  salePrice?: number
  ncm?: string
  taxRule?: string
}

export const ESTOQUE_STORAGE_ITEMS_KEY = 'recepcao_estoque_items_mock_db'
export const ESTOQUE_STORAGE_MOVS_KEY = 'recepcao_estoque_movs_mock_db'

export const MOCK_ESTOQUE: InventaryItem[] = [
  {
    id: '1',
    name: 'Dipirona 500mg',
    category: 'Medicamento',
    quantity: 150,
    minQuantity: 50,
    unit: 'unid',
    status: 'available',
    costPrice: 3.2,
    salePrice: 7.5,
    ncm: '3003.90.99',
    taxRule: 'ICMS-ST 18%',
  },
  {
    id: '2',
    name: 'Gaze Estéril',
    category: 'Consumível',
    quantity: 20,
    minQuantity: 50,
    unit: 'pacotes',
    status: 'low',
    costPrice: 18,
    salePrice: 35,
    ncm: '3005.90.90',
    taxRule: 'ICMS 12%',
  },
  {
    id: '3',
    name: 'Luvas de Procedimento',
    category: 'EPI',
    quantity: 5,
    minQuantity: 20,
    unit: 'caixas',
    status: 'critical',
    costPrice: 14.9,
    salePrice: 28,
    ncm: '4015.19.00',
    taxRule: 'ICMS 12%',
  },
  {
    id: '4',
    name: 'Seringa 5ml',
    category: 'Consumível',
    quantity: 300,
    minQuantity: 100,
    unit: 'unid',
    status: 'available',
    costPrice: 1.1,
    salePrice: 2.9,
    ncm: '9018.31.11',
    taxRule: 'ICMS 18%',
  },
  {
    id: '5',
    name: 'Álcool 70%',
    category: 'Saneante',
    quantity: 12,
    minQuantity: 10,
    unit: 'litros',
    status: 'available',
    costPrice: 7.8,
    salePrice: 15.5,
    ncm: '3808.94.19',
    taxRule: 'ICMS 18%',
  },
  {
    id: '6',
    name: 'Esparadrapo 10cm',
    category: 'Consumível',
    quantity: 8,
    minQuantity: 15,
    unit: 'unid',
    status: 'low',
    costPrice: 3.4,
    salePrice: 8.9,
    ncm: '3005.10.90',
    taxRule: 'ICMS 12%',
  },
]
