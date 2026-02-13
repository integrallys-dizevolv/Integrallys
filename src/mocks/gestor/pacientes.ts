import { BASE_PACIENTES_LIST } from '@/mocks/shared/base'

export interface Patient {
    id: number
    name: string
    email: string
    phone: string
    cpf: string
    lastConsultation: string
    status: 'Cadastro Completo' | 'Cadastro Incompleto'
    activeStatus?: 'Ativo' | 'Inativo'
}

export const MOCK_PATIENTS: Patient[] = BASE_PACIENTES_LIST.map((paciente, index) => ({
    id: index + 1,
    name: paciente.nome,
    email: paciente.email,
    phone: paciente.phone,
    cpf: paciente.cpf,
    lastConsultation: '21/02/2026',
    status: index % 3 === 0 ? 'Cadastro Incompleto' : 'Cadastro Completo',
    activeStatus: index % 4 === 0 ? 'Inativo' : 'Ativo'
}))
