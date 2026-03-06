import { BASE_AGENDAMENTOS, getPacienteById, getProcedimentoById, getProfissionalById, getUnidadeById } from '@/mocks/shared/base'

export const mockAgendaItems = BASE_AGENDAMENTOS.map((item) => {
    const paciente = getPacienteById(item.pacienteId)!
    const profissional = getProfissionalById(item.profissionalId)!
    const procedimento = getProcedimentoById(item.procedimentoId)!
    const unidade = getUnidadeById(item.unidadeId)!

    return {
        id: item.id,
        hora: item.hora,
        duracao: procedimento.duracao,
        paciente: paciente.nome,
        profissional: profissional.nome,
        tipo: item.tipo,
        status: item.status,
        pagamento: item.pagamento,
        unidade: unidade.nome,
        data: item.data
    }
})

export const mockAgendaPersonal = [
    {
        id: 201,
        hora: '08:30',
        duracao: '1h',
        titulo: 'Reunião de Gestão Semanal',
        tipo: 'Reunião' as const,
        prioridade: 'Alta' as const,
        status: 'Pendente' as const,
        descricao: 'Alinhamento com diretores de unidade',
        local: 'Sala de Conferência',
        participantes: 'Diretoria (3 pessoas)',
        data: '2026-03-05'
    },
    {
        id: 202,
        hora: '11:00',
        duracao: '30min',
        titulo: 'Revisar Estoque Crítico',
        tipo: 'Tarefa' as const,
        prioridade: 'Alta' as const,
        status: 'Em Andamento' as const,
        descricao: 'Validar itens abaixo do mínimo',
        data: '2026-03-05'
    }
]
