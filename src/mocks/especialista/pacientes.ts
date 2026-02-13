import { BASE_PACIENTES_LIST } from '@/mocks/shared/base'

export interface Paciente {
    id: number
    nome: string
    idade: number
    plano: string
    ultimaConsulta: string
    status: 'Ativo' | 'Inativo'
    telefone: string
}

const getAge = (birthDate: string) => {
    const [year, month, day] = birthDate.split('-').map(Number)
    const birth = new Date(year, month - 1, day)
    const today = new Date('2026-02-21')
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1
    return age
}

export const MOCK_PACIENTES: Paciente[] = BASE_PACIENTES_LIST.map((paciente, index) => ({
    id: index + 1,
    nome: paciente.nome,
    idade: getAge(paciente.birthDate),
    plano: index % 2 === 0 ? 'Particular' : 'Unimed',
    ultimaConsulta: '21/02/2026',
    status: index % 3 === 0 ? 'Inativo' : 'Ativo',
    telefone: paciente.phone
}))
