import { BASE_PACIENTES_LIST } from '@/mocks/shared/base'

export interface Prescricao {
    id: number
    numero: string
    paciente: string
    data: string
    tipo: 'Medicamento' | 'Exame' | 'Orientacao' | 'Suplementacao'
    validade: string
    status: 'Ativa' | 'Expirada' | 'Cancelada'
}

export const MOCK_PRESCRICOES: Prescricao[] = BASE_PACIENTES_LIST.slice(0, 4).map((paciente, index) => ({
    id: index + 1,
    numero: `#00${index + 1}`,
    paciente: paciente.nome,
    data: '21/02/2026',
    tipo: index % 2 === 0 ? 'Suplementacao' : 'Exame',
    validade: index % 2 === 0 ? '30 dias' : '60 dias',
    status: index === 2 ? 'Expirada' : 'Ativa'
}))
