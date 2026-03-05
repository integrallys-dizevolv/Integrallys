export interface AgendaPayment {
  data: string;
  valor: number;
  metodo?: string;
}

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
  pagamentos?: AgendaPayment[];
}

export interface AgendaPersonalItem {
  id: number;
  hora: string;
  duracao?: string;
  titulo: string;
  tipo: "Reunião" | "Tarefa" | "Lembrete" | "Evento" | "Aprovação";
  prioridade: "Alta" | "Média" | "Baixa";
  status: "Pendente" | "Em Andamento" | "Concluído" | "Cancelado";
  descricao?: string;
  data?: string;
  local?: string;
  participantes?: string;
}

export interface AgendaAdminData {
  agendaItems: AgendaItem[];
  agendaPersonal: AgendaPersonalItem[];
}
