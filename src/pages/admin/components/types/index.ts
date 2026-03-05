// Tipos compartilhados para a página PrincipalAdmin

export interface User {
  id: number
  nome: string
  perfil: string
  status: 'Ativo' | 'Inativo'
  email: string
  unidade: string
  crth?: string
  tipoVinculo?: 'Colaborador' | 'Parceiro'
  isVendedor?: boolean
  comissao?: number
  profissionaisPermitidos?: string[]
  agendaPessoalPermitidos?: string[]
}

export interface Unit {
  id: number
  nome: string
  endereco: string
  gestor: string
  status: 'Ativa' | 'Em Manutenção' | 'Inativa'
  cnpj?: string
  especialistas?: number
  pacientes?: number
}

export interface Permission {
  id: number
  perfil: string
  descricao: string
  usuarios: number
}

export interface PermissionModule {
  id: string
  nome: string
  permissoes: PermissionItem[]
}

export interface PermissionItem {
  id: string
  label: string
  enabled: boolean
}

export interface AgendaItem {
  id: number
  hora: string
  duracao?: string
  paciente: string
  tipo?: string
  profissional: string
  unidade: string
  status: string
  pagamento: string
  data?: string
}

export interface AgendaPersonalItem {
  id: number
  hora: string
  duracao?: string
  titulo: string
  tipo: 'Reunião' | 'Tarefa' | 'Lembrete' | 'Evento' | 'Aprovação'
  prioridade: 'Alta' | 'Média' | 'Baixa'
  status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado'
  descricao?: string
  data?: string
  local?: string
  participantes?: string
}

export interface Notification {
  id: number
  title: string
  description: string
  date: string
  read: boolean
}
