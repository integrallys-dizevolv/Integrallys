
export interface Transaction {
    id: string
    hour: string
    date: string
    description: string
    type: 'income' | 'expense'
    value: number
    method: 'cash' | 'credit' | 'debit' | 'pix' | 'card'
    responsible: string
    status: 'cleared' | 'pending'
}

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: '1', hour: '08:15', date: '16/01', description: 'Recebimento - Maria Silva', type: 'income', value: 150.00, method: 'cash', responsible: 'Ana Recepcionista', status: 'cleared' },
    { id: '2', hour: '09:30', date: '16/01', description: 'Recebimento - Pedro Costa', type: 'income', value: 120.00, method: 'credit', responsible: 'Ana Recepcionista', status: 'cleared' },
    { id: '3', hour: '10:45', date: '16/01', description: 'Recebimento - Laura Oliveira', type: 'income', value: 200.00, method: 'pix', responsible: 'Ana Recepcionista', status: 'cleared' },
    { id: '4', hour: '11:20', date: '16/01', description: 'Recebimento - Roberto Ferreira', type: 'income', value: 180.00, method: 'cash', responsible: 'Ana Recepcionista', status: 'cleared' },
    { id: '5', hour: '14:30', date: '16/01', description: 'Recebimento - Carlos Mendes', type: 'income', value: 150.00, method: 'debit', responsible: 'Ana Recepcionista', status: 'cleared' },
    { id: '6', hour: '15:10', date: '16/01', description: 'Recebimento - Julia Martins', type: 'income', value: 200.00, method: 'pix', responsible: 'Ana Recepcionista', status: 'cleared' },
]
