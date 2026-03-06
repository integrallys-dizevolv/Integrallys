import { BASE_AGENDAMENTOS, getPacienteById, getProcedimentoById } from '@/mocks/shared/base'

export interface ReceivableItem {
    id: string
    patientName: string
    date: string
    procedure: string
    description: string
    value: number
    method: string
    dueDate: string
    status: 'pago' | 'pendente' | 'atrasado'
    pagamentos?: { data: string; valor: number; metodo?: string }[]
}

const formatDate = (date: string) => {
    const [year, month, day] = date.split('-')
    return `${day}/${month}/${year}`
}

export const MOCK_RECEIVABLES: ReceivableItem[] = BASE_AGENDAMENTOS.map((item, index) => {
    const paciente = getPacienteById(item.pacienteId)!
    const procedimento = getProcedimentoById(item.procedimentoId)!
    const statusMap: Record<string, ReceivableItem['status']> = {
        Pago: 'pago',
        'Pago Parcial': 'pendente',
        Pendente: 'pendente'
    }
    return {
        id: `${item.id}`,
        patientName: paciente.nome,
        date: formatDate(item.data),
        procedure: item.tipo,
        description: item.pagamento === 'Pago Parcial' ? 'Saldo restante em aberto' : '',
        value: procedimento.valor,
        method: item.pagamento === 'Pago' ? 'Cartão de Crédito' : '',
        dueDate: formatDate(item.data),
        status: statusMap[item.pagamento] || (index % 3 === 0 ? 'atrasado' : 'pago'),
        pagamentos: item.pagamento === 'Pago Parcial'
            ? [{ data: item.data, valor: procedimento.valor * 0.5, metodo: 'PIX' }]
            : item.pagamento === 'Pago'
                ? [{ data: item.data, valor: procedimento.valor, metodo: 'Cartão de Crédito' }]
                : []
    }
})
