import {
    BASE_AGENDAMENTOS,
    BASE_PROCEDIMENTOS_LIST,
    BASE_PROFISSIONAIS_LIST,
    BASE_PACIENTES,
    getProfissionalById,
    getUnidadeById
} from '@/mocks/shared/base'

export interface PatientAppointment {
    id: number
    medico: string
    especialidade: string
    data: string
    local: string
    status: 'Confirmada' | 'Agendado' | 'Concluido' | 'Cancelado'
}

const formatDate = (date: string) => {
    const [year, month, day] = date.split('-')
    return `${day}/${month}/${year}`
}

export const MOCK_PATIENT_APPOINTMENTS: PatientAppointment[] = BASE_AGENDAMENTOS
    .filter((item) => item.pacienteId === BASE_PACIENTES.maria.id)
    .map((item) => {
        const profissional = getProfissionalById(item.profissionalId)!
        const unidade = getUnidadeById(item.unidadeId)!
        const statusMap: Record<string, PatientAppointment['status']> = {
            Confirmado: 'Confirmada',
            'Check-in': 'Agendado',
            'Check-out': 'Concluido',
            Cancelado: 'Cancelado'
        }
        return {
            id: item.id,
            especialidade: profissional.especialidade,
            status: statusMap[item.status] || 'Agendado',
            data: `${formatDate(item.data)} ${item.hora}`,
            medico: profissional.nome,
            local: unidade.nome
        }
    })

export const MOCK_TIME_SLOTS = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
]

export const MOCK_SPECIALISTS = BASE_PROFISSIONAIS_LIST.map((prof) => ({
    id: prof.id,
    name: prof.nome,
    specialty: prof.especialidade
}))

export const MOCK_PROCEDURES = BASE_PROCEDIMENTOS_LIST.map((proc) => ({
    id: proc.id,
    name: proc.nome,
    price: proc.valor
}))
