import { BASE_AGENDAMENTOS, getPacienteById, getProfissionalById, getProcedimentoById, getUnidadeById } from '@/mocks/shared/base'

export interface RelatorioConsultaItem {
  id: number;
  paciente: string;
  data: string;
  hora: string;
  procedimento: string;
  profissional: string;
  unidade: string;
  plano: string;
  valorProcedimento: number;
  statusPagamento: 'Pago' | 'Em Aberto' | 'Parcial' | 'Estornado';
  metodoPagamento?: string[];
  statusConsulta:
    | 'Agendado'
    | 'Realizado'
    | 'Cancelado'
    | 'Nao Compareceu'
    | 'Disponivel';
  justificativaCancelamento?: string;
  recorrencia: number;
}

export const MOCK_RELATORIO_CONSULTAS: RelatorioConsultaItem[] = BASE_AGENDAMENTOS.map((item, index) => {
  const paciente = getPacienteById(item.pacienteId)!
  const profissional = getProfissionalById(item.profissionalId)!
  const procedimento = getProcedimentoById(item.procedimentoId)!
  const unidade = getUnidadeById(item.unidadeId)!
  const statusPagamento = item.pagamento === 'Pago Parcial' ? 'Parcial' : item.pagamento === 'Pendente' ? 'Em Aberto' : 'Pago'
  return {
    id: item.id,
    paciente: paciente.nome,
    data: item.data,
    hora: item.hora,
    procedimento: item.tipo,
    profissional: profissional.nome,
    unidade: unidade.nome,
    plano: index % 2 === 0 ? 'Particular' : 'Unimed',
    valorProcedimento: procedimento.valor,
    statusPagamento,
    metodoPagamento: item.pagamento === 'Pago' ? ['Pix'] : item.pagamento === 'Pago Parcial' ? ['Pix', 'Credito'] : [],
    statusConsulta: item.status === 'Confirmado' ? 'Agendado' : item.status === 'Check-in' ? 'Realizado' : 'Agendado',
    recorrencia: 80 - index * 5
  }
})
