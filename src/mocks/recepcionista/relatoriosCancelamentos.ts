export interface RelatorioCancelamentoItem {
  id: number;
  paciente: string;
  profissional: string;
  unidade: string;
  dataAgendada: string;
  horaAgendada: string;
  status: "Cancelado" | "Não Compareceu";
  motivo: string;
  observacoes?: string;
  canceladoPor?: string;
  dataCancelamento?: string;
}

export const MOCK_RELATORIO_CANCELAMENTOS: RelatorioCancelamentoItem[] = [
  {
    id: 1,
    paciente: "Fernanda Oliveira",
    profissional: "Dra. Ana Lima",
    unidade: "Central",
    dataAgendada: "2026-02-20",
    horaAgendada: "11:00",
    status: "Cancelado",
    motivo: "Imprevisto pessoal",
    observacoes: "Ligou informando que não poderá comparecer.",
    canceladoPor: "Recepcionista 1",
    dataCancelamento: "2026-02-19 14:30",
  },
  {
    id: 2,
    paciente: "Roberto Almeida",
    profissional: "Dr. João Santos",
    unidade: "Sul",
    dataAgendada: "2026-02-20",
    horaAgendada: "14:00",
    status: "Não Compareceu",
    motivo: "Sem justificativa prévia",
    observacoes: "Paciente não atendeu as ligações de confirmação.",
    canceladoPor: "Sistema (Automático)",
    dataCancelamento: "2026-02-20 14:15",
  },
  {
    id: 3,
    paciente: "Ricardo Oliveira",
    profissional: "Dra. Flávia Alves",
    unidade: "Sul",
    dataAgendada: "2026-02-18",
    horaAgendada: "10:30",
    status: "Cancelado",
    motivo: "Trabalho / Profissional",
    observacoes: "Reunião de última hora agendada.",
    canceladoPor: "Recepcionista 2",
    dataCancelamento: "2026-02-17 09:00",
  },
  {
    id: 4,
    paciente: "Juliana Costa",
    profissional: "Dr. João Santos",
    unidade: "Central",
    dataAgendada: "2026-02-15",
    horaAgendada: "16:00",
    status: "Cancelado",
    motivo: "Doença / Saúde",
    observacoes: "Gripe forte.",
    canceladoPor: "Próprio Paciente (App)",
    dataCancelamento: "2026-02-15 08:00",
  },
  {
    id: 5,
    paciente: "Marcos Vinícius",
    profissional: "Dra. Sofia Castro",
    unidade: "Norte",
    dataAgendada: "2026-02-14",
    horaAgendada: "09:00",
    status: "Não Compareceu",
    motivo: "Esquecimento",
    observacoes: "Confimou presença via WhatsApp mas não veio.",
    canceladoPor: "Recepcionista 1",
    dataCancelamento: "2026-02-14 09:15",
  },
  {
    id: 6,
    paciente: "Patrícia Lima",
    profissional: "Dra. Ana Lima",
    unidade: "Central",
    dataAgendada: "2026-02-10",
    horaAgendada: "15:30",
    status: "Cancelado",
    motivo: "Financeiro",
    observacoes: "Preferiu adiar o tratamento para o próximo mês.",
    canceladoPor: "Recepcionista 1",
    dataCancelamento: "2026-02-08 11:20",
  },
  {
    id: 7,
    paciente: "Lucas Santos",
    profissional: "Dr. João Santos",
    unidade: "Central",
    dataAgendada: "2026-02-05",
    horaAgendada: "11:00",
    status: "Cancelado",
    motivo: "Viagem",
    observacoes: "Estará fora da cidade na data.",
    canceladoPor: "Recepcionista 2",
    dataCancelamento: "2026-02-01 10:00",
  },
  {
    id: 8,
    paciente: "Camila Rodrigues",
    profissional: "Dra. Flávia Alves",
    unidade: "Sul",
    dataAgendada: "2026-02-02",
    horaAgendada: "14:00",
    status: "Não Compareceu",
    motivo: "Sem justificativa prévia",
    observacoes: "Telefone desligado.",
    canceladoPor: "Sistema (Automático)",
    dataCancelamento: "2026-02-02 14:15",
  },
];


