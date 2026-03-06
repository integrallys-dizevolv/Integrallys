import {
  BASE_AGENDAMENTOS,
  getPacienteById,
  getProfissionalById,
  getProcedimentoById,
  getUnidadeById
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
  cpf?: string;
  telefone?: string;
  observacoes?: string;
  valorProcedimento?: number;
  pagamentos?: { data: string; valor: number; metodo?: string }[];
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
  profissional?: string;
}

const buildAgendaItem = (item: (typeof BASE_AGENDAMENTOS)[number]): AgendaItem => {
  const paciente = getPacienteById(item.pacienteId)!;
  const profissional = getProfissionalById(item.profissionalId)!;
  const procedimento = getProcedimentoById(item.procedimentoId)!;
  const unidade = getUnidadeById(item.unidadeId)!;

  const buildPagamentos = () => {
    if (item.pagamento === 'Pago Parcial') {
      return [{ data: '2026-02-10', valor: procedimento.valor * 0.5, metodo: 'PIX' }];
    }
    if (item.pagamento === 'Pago') {
      return [{ data: '2026-02-10', valor: procedimento.valor, metodo: 'Cartão' }];
    }
    return [];
  };

  return {
    id: item.id,
    hora: item.hora,
    duracao: procedimento.duracao,
    paciente: paciente.nome,
    tipo: item.tipo,
    profissional: profissional.nome,
    unidade: unidade.nome,
    status: item.status,
    pagamento: item.pagamento,
    data: item.data,
    cpf: paciente.cpf,
    telefone: paciente.phone,
    observacoes: 'Atendimento planejado.',
    valorProcedimento: procedimento.valor,
    pagamentos: buildPagamentos()
  };
};

export const MOCK_AGENDA_ITEMS: AgendaItem[] = BASE_AGENDAMENTOS.map(buildAgendaItem);

export const MOCK_AGENDA_PERSONAL: AgendaPersonalItem[] = [
  {
    id: 201,
    hora: '08:30',
    duracao: '1h',
    titulo: 'Reunião com equipe de TI',
    tipo: 'Reunião',
    prioridade: 'Alta',
    status: 'Pendente',
    descricao: 'Discussao sobre atualizacao do sistema',
    local: 'Sala de Reuniões 1',
    participantes: 'Equipe TI (5 pessoas)',
    data: '2026-03-05',
    profissional: 'Dr. Joao Santos'
  }
];

export const MOCK_DIAS_SEMANA = [
  { nome: 'Domingo', numero: 15, data: '2026-02-15' },
  { nome: 'Segunda', numero: 16, data: '2026-02-16' },
  { nome: 'Terca', numero: 17, data: '2026-02-17' },
  { nome: 'Quarta', numero: 18, data: '2026-02-18' },
  { nome: 'Quinta', numero: 19, data: '2026-02-19' },
  { nome: 'Sexta', numero: 20, data: '2026-02-20' },
  { nome: 'Sabado', numero: 21, data: '2026-02-21' }
];

export const MOCK_WEEKLY_CONSULTAS: { [key: string]: AgendaItem[] } = BASE_AGENDAMENTOS.reduce(
  (acc, item) => {
    if (!item.data) return acc;
    const list = acc[item.data] || [];
    list.push(buildAgendaItem(item));
    acc[item.data] = list;
    return acc;
  },
  {} as { [key: string]: AgendaItem[] }
);
