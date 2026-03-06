import {
  BASE_AGENDAMENTOS,
  BASE_PROCEDIMENTOS,
  getPacienteById,
  getProfissionalById,
  getUnidadeById,
  getProcedimentoById
} from '@/mocks/shared/base';

export interface AgendaItem {
  id: number;
  hora: string;
  duracao?: string;
  paciente: string;
  tipo?: string;
  profissional: string;
  unidade: string;
  status: string;
  pagamento: string;
  data?: string;
  valorProcedimento?: number;
  pagamentos?: { data: string; valor: number; metodo?: string }[];
  descricao?: string;
  local?: string;
  participantes?: string;
}

export interface AgendaPersonalItem {
  id: number;
  hora: string;
  duracao?: string;
  titulo: string;
  tipo: 'Reunião' | 'Tarefa' | 'Lembrete' | 'Evento' | 'Aprovação';
  prioridade: 'Alta' | 'Média' | 'Baixa';
  status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado';
  descricao?: string;
  data?: string;
  local?: string;
  participantes?: string;
}

const buildPagamentos = (status: string, valor: number) => {
  if (status === 'Pago Parcial') {
    return [{ data: '2026-02-10', valor: valor * 0.5, metodo: 'PIX' }];
  }
  if (status === 'Pago') {
    return [{ data: '2026-02-10', valor, metodo: 'Cartão' }];
  }
  return [];
};

export const mockAgendaItems: AgendaItem[] = BASE_AGENDAMENTOS.map((item) => {
  const paciente = getPacienteById(item.pacienteId)!;
  const profissional = getProfissionalById(item.profissionalId)!;
  const unidade = getUnidadeById(item.unidadeId)!;
  const procedimento = getProcedimentoById(item.procedimentoId)!;

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
    data: item.data,
    valorProcedimento: procedimento.valor,
    pagamentos: buildPagamentos(item.pagamento, procedimento.valor)
  };
});

export const mockAgendaPersonal: AgendaPersonalItem[] = [
  {
    id: 1,
    hora: '11:00',
    duracao: '1h',
    titulo: 'Reunião de Equipe',
    tipo: 'Reunião',
    prioridade: 'Alta',
    status: 'Pendente',
    descricao: 'Alinhamento semanal com a equipe médica.',
    data: '2026-03-05',
    local: 'Sala de Reuniões 1',
    participantes: 'Dr. Joao, Dra. Ana'
  }
];
