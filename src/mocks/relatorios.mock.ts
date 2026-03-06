export interface EspecialistaAgendamentoRelatorio {
  id: string;
  data: string;
  pacienteId: string;
  pacienteNome: string;
  tipo: 'rotina' | 'retorno' | 'primeira_consulta' | 'urgencia';
}

export interface EspecialistaAvaliacaoRelatorio {
  id: string;
  data: string;
  nota: number;
}

export interface EspecialistaRepasseRelatorio {
  data: string;
  atendimento: string;
  cliente: string;
  valorBruto: number;
  percentual: number;
  valorRepasse: number;
}

export interface RelatoriosRecepcaoFiltrosMock {
  produtos: string[];
  usuarios: string[];
  midiasCaptacao: Array<'Facebook' | 'Instagram' | 'Radio' | 'Indicação' | 'Outro'>;
  procedimentos: string[];
}

export const MOCK_RELATORIOS_ESPECIALISTA_AGENDAMENTOS: EspecialistaAgendamentoRelatorio[] = [
  { id: 'ag-01', data: '2026-03-02', pacienteId: 'p1', pacienteNome: 'Maria Silva', tipo: 'rotina' },
  { id: 'ag-02', data: '2026-03-01', pacienteId: 'p2', pacienteNome: 'Pedro Costa', tipo: 'urgencia' },
  { id: 'ag-03', data: '2026-02-26', pacienteId: 'p3', pacienteNome: 'Ana Carolina', tipo: 'retorno' },
  { id: 'ag-04', data: '2026-02-20', pacienteId: 'p1', pacienteNome: 'Maria Silva', tipo: 'retorno' },
  { id: 'ag-05', data: '2026-02-16', pacienteId: 'p4', pacienteNome: 'Carlos Mendes', tipo: 'primeira_consulta' },
  { id: 'ag-06', data: '2026-02-10', pacienteId: 'p5', pacienteNome: 'Fernanda Souza', tipo: 'rotina' },
  { id: 'ag-07', data: '2026-01-29', pacienteId: 'p6', pacienteNome: 'Roberto Almeida', tipo: 'urgencia' },
  { id: 'ag-08', data: '2026-01-12', pacienteId: 'p7', pacienteNome: 'Julia Martins', tipo: 'rotina' },
  { id: 'ag-09', data: '2025-12-18', pacienteId: 'p8', pacienteNome: 'Ricardo Oliveira', tipo: 'retorno' },
  { id: 'ag-10', data: '2025-11-09', pacienteId: 'p9', pacienteNome: 'Camila Rodrigues', tipo: 'urgencia' },
  { id: 'ag-11', data: '2025-10-02', pacienteId: 'p10', pacienteNome: 'Marcos Vinicius', tipo: 'rotina' },
];

export const MOCK_RELATORIOS_ESPECIALISTA_AVALIACOES: EspecialistaAvaliacaoRelatorio[] = [
  { id: 'av-01', data: '2026-03-02', nota: 5 },
  { id: 'av-02', data: '2026-03-01', nota: 4 },
  { id: 'av-03', data: '2026-02-26', nota: 5 },
  { id: 'av-04', data: '2026-02-20', nota: 4 },
  { id: 'av-05', data: '2026-02-16', nota: 5 },
  { id: 'av-06', data: '2026-02-10', nota: 3 },
  { id: 'av-07', data: '2026-01-29', nota: 4 },
  { id: 'av-08', data: '2026-01-12', nota: 5 },
  { id: 'av-09', data: '2025-12-18', nota: 4 },
];

export const MOCK_RELATORIOS_ESPECIALISTA_REPASSES: EspecialistaRepasseRelatorio[] = [
  {
    data: '21/11/2025',
    atendimento: 'Consulta inicial',
    cliente: 'Maria Silva Santos',
    valorBruto: 250.0,
    percentual: 60,
    valorRepasse: 150.0,
  },
  {
    data: '20/11/2025',
    atendimento: 'Retorno',
    cliente: 'Joao Pedro Costa',
    valorBruto: 180.0,
    percentual: 50,
    valorRepasse: 90.0,
  },
  {
    data: '19/11/2025',
    atendimento: 'Consulta especial',
    cliente: 'Ana Carolina Lima',
    valorBruto: 300.0,
    percentual: 55,
    valorRepasse: 165.0,
  },
];

export const MOCK_RELATORIOS_RECEPCAO_FILTROS: RelatoriosRecepcaoFiltrosMock = {
  produtos: [
    'Toxina Botulinica',
    'Kit Pos-Cirurgico',
    'Consulta Dermatologica',
    'Limpeza de Pele',
    'Creme Hidratante Facial',
    'Sessão Laser',
    'Bioestimulador',
    'Preenchimento Labial',
    'Protetor Solar',
  ],
  usuarios: ['Ana Recepcionista', 'Beatriz Recepcionista', 'Carla Recepcionista'],
  midiasCaptacao: ['Facebook', 'Instagram', 'Radio', 'Indicação', 'Outro'],
  procedimentos: [
    'Consulta inicial',
    'Consulta de retorno',
    'Consulta dermatologica',
    'Limpeza de pele',
    'Aplicação de toxina',
    'Bioestimulador',
  ],
};
