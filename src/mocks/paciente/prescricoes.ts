import { BASE_PRESCRICOES, getProfissionalById } from '@/mocks/shared/base'

export interface Prescricao {
    id: number
    profissional: string
    data: string
    tipo: string
    validade: string
    status: 'Ativo' | 'Pendente' | 'Expirado'
}

export const MOCK_PRESCRICOES: Prescricao[] = BASE_PRESCRICOES.map((presc, index) => {
    const profissional = getProfissionalById(presc.profissionalId)!
    return {
        id: 500 + index + 1,
        profissional: profissional.nome,
        data: '21/02/2026',
        tipo: 'Medicamento',
        validade: '21/03/2026',
        status: index === 1 ? 'Pendente' : 'Ativo'
    }
})
