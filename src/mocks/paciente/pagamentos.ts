export interface Fatura {
    id: number
    descricao: string
    vencimento: string
    valor: string
    status: 'Pendente' | 'Pago' | 'Atrasado'
}

export const MOCK_FATURAS: Fatura[] = [
    { id: 901, descricao: 'Consulta Cardiologia', vencimento: '20/01/2026', valor: 'R$ 350,00', status: 'Pendente' },
    { id: 902, descricao: 'Exames Laboratoriais', vencimento: '10/01/2026', valor: 'R$ 150,00', status: 'Pago' },
];

