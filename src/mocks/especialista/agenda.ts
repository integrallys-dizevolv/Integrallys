import { BASE_AGENDAMENTOS, getPacienteById, getProcedimentoById } from '@/mocks/shared/base'

export interface Appointment {
    id: number
    time: string
    duration: string
    title: string
    type: string
    description: string
    status: string
    patientName?: string
}

const specialistAppointments = BASE_AGENDAMENTOS.filter((item) => item.profissionalId === 'joao')

export const MOCK_APPOINTMENTS: Appointment[] = [
    {
        id: 1,
        time: '08:30',
        duration: '1h',
        title: 'Reuniao com equipe de TI',
        type: 'administrativo',
        description: 'Discussao sobre atualizacao do sistema',
        status: 'agendado'
    },
    ...specialistAppointments.map((item) => {
        const paciente = getPacienteById(item.pacienteId)!
        const procedimento = getProcedimentoById(item.procedimentoId)!
        return {
            id: item.id + 100,
            time: item.hora,
            duration: procedimento.duracao,
            title: `Consulta - ${paciente.nome}`,
            type: item.tipo.toLowerCase().includes('retorno') ? 'reconsulta' : 'consulta',
            patientName: paciente.nome,
            description: `Atendimento ${item.tipo.toLowerCase()}.`,
            status: item.status === 'Confirmado' ? 'agendado' : 'agendado'
        }
    })
]
