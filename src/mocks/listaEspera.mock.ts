export interface WaitingPatient {
  id: string
  name: string
  priority: 'Alta' | 'Média' | 'Baixa'
  phone: string
  email: string
  specialist: string
  procedure: string
  unit: string
  waitTime: string
  specialty: string
  lastContact: string
  observation: string
  preferenciaHorario?: 'Manhã' | 'Tarde' | 'Final do dia' | null
}

export const LISTA_ESPERA_STORAGE_KEY = 'integrallys_lista_espera_items_v1'

export const MOCK_WAITING_LIST: WaitingPatient[] = [
  {
    id: '1',
    name: 'João Silva',
    priority: 'Alta',
    phone: '(11) 98765-4321',
    email: 'joao@email.com',
    specialist: 'Dr. Carlos Silva',
    procedure: 'Implante Dentário',
    unit: 'Água Boa',
    waitTime: '8 dias',
    specialty: 'Odontologia',
    lastContact: '13/10/2026',
    observation: 'Preferência por manhãs',
    preferenciaHorario: 'Manhã',
  },
  {
    id: '2',
    name: 'Marina Santos',
    priority: 'Média',
    phone: '(11) 97777-6666',
    email: 'marina@email.com',
    specialist: 'Dra. Ana Costa',
    procedure: 'Limpeza e Check-up',
    unit: 'Água Boa',
    waitTime: '15 dias',
    specialty: 'Dermatologia',
    lastContact: '12/10/2026',
    observation: 'Disponível apenas às quartas',
    preferenciaHorario: 'Tarde',
  },
  {
    id: '3',
    name: 'Carlos Roberto',
    priority: 'Baixa',
    phone: '(11) 96666-5555',
    email: 'carlos@email.com',
    specialist: 'Dr. Rafael Lima',
    procedure: 'Consulta Ortopedia',
    unit: 'Barra do Garças',
    waitTime: '22 dias',
    specialty: 'Ortopedia',
    lastContact: '10/10/2026',
    observation: 'Aguardando retorno de convênio',
    preferenciaHorario: 'Final do dia',
  },
  {
    id: '4',
    name: 'Ana Paula Lima',
    priority: 'Alta',
    phone: '(11) 95555-4444',
    email: 'ana.paula@email.com',
    specialist: 'Dra. Sofia Castro',
    procedure: 'Consulta Ginecologia',
    unit: 'Cuiabá',
    waitTime: '2 dias',
    specialty: 'Ginecologia',
    lastContact: '14/10/2026',
    observation: 'Urgência no atendimento',
    preferenciaHorario: 'Manhã',
  },
  {
    id: '5',
    name: 'Roberto Almeida',
    priority: 'Média',
    phone: '(11) 94444-3333',
    email: 'beto@email.com',
    specialist: 'Dr. Lucas Pereira',
    procedure: 'Exame de Vista',
    unit: 'Água Boa',
    waitTime: '5 dias',
    specialty: 'Oftalmologia',
    lastContact: '15/10/2026',
    observation: '',
    preferenciaHorario: null,
  },
  {
    id: '6',
    name: 'Fernanda Souza',
    priority: 'Baixa',
    phone: '(11) 93333-2222',
    email: 'nanda@email.com',
    specialist: 'Dra. Beatriz Santos',
    procedure: 'Nutrição',
    unit: 'Água Boa',
    waitTime: '12 dias',
    specialty: 'Nutrição',
    lastContact: '11/10/2026',
    observation: '',
    preferenciaHorario: 'Tarde',
  },
]
