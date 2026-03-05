import {
  MOCK_ESPECIALISTA_APPOINTMENTS,
  MOCK_RECEPCAO_AGENDA_ITEMS,
  MOCK_RECEPCAO_AGENDA_PERSONAL,
  type EspecialistaAppointment,
} from '@/mocks/agenda.mock';

interface AgendaConsultaItem {
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
}

interface AgendaPessoalItem {
  id: number;
  hora: string;
  duracao?: string;
  titulo: string;
  tipo: 'Reunião' | 'Tarefa' | 'Lembrete' | 'Evento' | 'Aprovação';
  prioridade: 'Alta' | 'Média' | 'Baixa';
  status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado';
  descricao?: string;
  data?: string;
}

interface RecepcaoAgendaData {
  agendaItems: AgendaConsultaItem[];
  agendaPersonal: AgendaPessoalItem[];
  allowedProfessionals?: string[];
  allowedPersonalAgenda?: string[];
}

interface EspecialistaAgendaData {
  appointments: EspecialistaAppointment[];
  agendaItems: AgendaConsultaItem[];
  agendaPersonal: AgendaPessoalItem[];
}

interface AgendaCancelamentoRegistro {
  agendamentoId: number;
  motivo: string;
  data: string;
}

interface AgendaGeracaoRegistro {
  profissional: string;
  dataInicio: string;
  dataFim: string;
  diasSemana: number[];
  diasMes?: number[];
  horarios: { inicio: string; fim: string }[];
  duracaoPrimeira: number;
  duracaoRetorno: number;
  considerarFeriados: boolean;
  criadoEm: string;
}

const isBrowser = () => typeof window !== 'undefined';
const AGENDA_CANCELAMENTOS_KEY = 'agenda_cancelamentos_mock_db';
const AGENDA_GERACOES_KEY = 'agenda_geracoes_mock_db';

const parseStoredArray = (key: string): string[] | undefined => {
  if (!isBrowser()) return undefined;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return undefined;

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

export async function getRecepcaoAgendaData(): Promise<RecepcaoAgendaData> {
  return {
    agendaItems: MOCK_RECEPCAO_AGENDA_ITEMS,
    agendaPersonal: MOCK_RECEPCAO_AGENDA_PERSONAL,
    allowedProfessionals: parseStoredArray('recepcao_profissionais_permitidos'),
    allowedPersonalAgenda: parseStoredArray('recepcao_agenda_pessoal_permitidos'),
  };
}

export async function registrarCancelamento(
  agendamentoId: number,
  motivo: string,
): Promise<void> {
  const registro: AgendaCancelamentoRegistro = {
    agendamentoId,
    motivo: motivo.trim(),
    data: new Date().toISOString(),
  };

  if (!isBrowser()) {
    return Promise.resolve();
  }

  try {
    const raw = window.localStorage.getItem(AGENDA_CANCELAMENTOS_KEY);
    const atual = raw ? (JSON.parse(raw) as AgendaCancelamentoRegistro[]) : [];
    window.localStorage.setItem(
      AGENDA_CANCELAMENTOS_KEY,
      JSON.stringify([registro, ...atual].slice(0, 500)),
    );
  } catch {
    // fallback mock-only
  }

  return Promise.resolve();
}

export async function registrarGeracaoAgenda(
  payload: Omit<AgendaGeracaoRegistro, 'criadoEm'>,
): Promise<void> {
  const registro: AgendaGeracaoRegistro = {
    ...payload,
    criadoEm: new Date().toISOString(),
  };

  if (!isBrowser()) {
    return Promise.resolve();
  }

  try {
    const raw = window.localStorage.getItem(AGENDA_GERACOES_KEY);
    const atual = raw ? (JSON.parse(raw) as AgendaGeracaoRegistro[]) : [];
    window.localStorage.setItem(
      AGENDA_GERACOES_KEY,
      JSON.stringify([registro, ...atual].slice(0, 300)),
    );
  } catch {
    // fallback mock-only
  }

  return Promise.resolve();
}

export async function getEspecialistaAgendaData(): Promise<EspecialistaAgendaData> {
  const agendaItems: AgendaConsultaItem[] = MOCK_ESPECIALISTA_APPOINTMENTS
    .filter((appointment) => appointment.type === 'consulta' || appointment.type === 'reconsulta')
    .map((appointment) => ({
      id: appointment.id,
      hora: appointment.time,
      duracao: appointment.duration,
      paciente: appointment.patientName || appointment.title,
      tipo: appointment.type === 'consulta' ? 'Consulta' : 'Retorno',
      profissional: 'Dr. Especialista',
      unidade: 'Clínica Integrall',
      status:
        appointment.status === 'agendado'
          ? 'Aguardando'
          : appointment.status === 'concluido'
            ? 'Concluído'
            : 'Check-in',
      pagamento: 'Pendente',
    }));

  const agendaPersonal: AgendaPessoalItem[] = MOCK_ESPECIALISTA_APPOINTMENTS
    .filter((appointment) => appointment.type !== 'consulta' && appointment.type !== 'reconsulta')
    .map((appointment) => ({
      id: appointment.id,
      hora: appointment.time,
      duracao: appointment.duration,
      titulo: appointment.title,
      tipo: 'Reunião',
      prioridade: 'Média',
      status: appointment.status === 'agendado' ? 'Pendente' : 'Concluído',
      descricao: appointment.description,
      data: '2025-11-21',
    }));

  return {
    appointments: MOCK_ESPECIALISTA_APPOINTMENTS,
    agendaItems,
    agendaPersonal,
  };
}
