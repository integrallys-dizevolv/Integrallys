import {
  BASE_AGENDAMENTOS,
  BASE_PRESCRICOES,
  addDays,
  getPacienteById,
  getProcedimentoById,
  getProfissionalById,
  getProdutoById
} from '@/mocks/shared/base'

export type RecebimentoStatus = 'Liquidado' | 'Em Aberto' | 'A Vencer' | 'Atrasado'
export type RecebimentoForma = 'PIX' | 'Dinheiro' | 'Cartão Débito' | 'Cartão Crédito' | 'Boleto'

export interface GestorRecebimento {
  id: string
  numeroDocumento: string
  parcela: string
  devedor: string
  descricao: string
  profissional: string
  especialidade: string
  produto: string
  categoria: string
  dataEmissao: string
  dataVencimento: string
  formaRecebimento: RecebimentoForma
  valorTotal: number
  valorRecebido: number
  saldoAReceber: number
  status: RecebimentoStatus
}

const round2 = (value: number) => Math.round(value * 100) / 100

const statusByVencimento = (vencimentoISO: string): RecebimentoStatus => {
  const hoje = new Date('2026-02-21T00:00:00')
  const vencimento = new Date(`${vencimentoISO}T00:00:00`)
  return vencimento < hoje ? 'Atrasado' : 'A Vencer'
}

const recebimentosAtendimentos: GestorRecebimento[] = BASE_AGENDAMENTOS.map((item, index) => {
  const paciente = getPacienteById(item.pacienteId)!
  const procedimento = getProcedimentoById(item.procedimentoId)!
  const profissional = getProfissionalById(item.profissionalId)!
  const valorTotal = round2(procedimento.valor)
  const dataEmissao = addDays(item.data, -10)
  const documento = `REC-ATD-${String(item.id).padStart(4, '0')}`

  let valorRecebido = 0
  let formaRecebimento: RecebimentoForma = 'PIX'
  let status: RecebimentoStatus = statusByVencimento(item.data)
  let parcela = '1/1'

  if (item.pagamento === 'Pago') {
    valorRecebido = valorTotal
    formaRecebimento = index % 2 === 0 ? 'Cartão Crédito' : 'PIX'
    status = 'Liquidado'
  }

  if (item.pagamento === 'Pago Parcial') {
    valorRecebido = round2(valorTotal * 0.5)
    formaRecebimento = 'PIX'
    status = 'Em Aberto'
    parcela = '1/2'
  }

  return {
    id: `atd-${item.id}`,
    numeroDocumento: documento,
    parcela,
    devedor: paciente.nome,
    descricao: `${item.tipo} - ${procedimento.nome}`,
    profissional: profissional.nome,
    especialidade: profissional.especialidade,
    produto: '-',
    categoria: 'Atendimento',
    dataEmissao,
    dataVencimento: item.data,
    formaRecebimento,
    valorTotal,
    valorRecebido,
    saldoAReceber: round2(valorTotal - valorRecebido),
    status
  }
})

const recebimentosProdutos: GestorRecebimento[] = BASE_PRESCRICOES.flatMap((prescricao, idxPresc) => {
  const paciente = getPacienteById(prescricao.pacienteId)!
  const profissional = getProfissionalById(prescricao.profissionalId)!

  return prescricao.itens.map((item, idxItem) => {
    const produto = getProdutoById(item.produtoId)!
    const valorTotal = round2(produto.valor * item.quantidade)
    const documento = `REC-PRD-${String(idxPresc + 1).padStart(4, '0')}-${idxItem + 1}`
    const formaRecebimento: RecebimentoForma = idxItem % 2 === 0 ? 'Cartão Débito' : 'Dinheiro'
    const valorRecebido = idxItem % 2 === 0 ? round2(valorTotal * 0.7) : valorTotal
    const status: RecebimentoStatus = valorRecebido === valorTotal ? 'Liquidado' : 'Em Aberto'

    return {
      id: `prd-${prescricao.id}-${idxItem}`,
      numeroDocumento: documento,
      parcela: valorRecebido === valorTotal ? '1/1' : '1/2',
      devedor: paciente.nome,
      descricao: `Prescrição/Venda - ${produto.nome}`,
      profissional: profissional.nome,
      especialidade: profissional.especialidade,
      produto: produto.nome,
      categoria: 'Prescrição/Venda',
      dataEmissao: addDays(prescricao.data, -1),
      dataVencimento: addDays(prescricao.data, 15),
      formaRecebimento,
      valorTotal,
      valorRecebido,
      saldoAReceber: round2(valorTotal - valorRecebido),
      status
    }
  })
})

export const MOCK_RECEBIMENTOS: GestorRecebimento[] = [
  ...recebimentosAtendimentos,
  ...recebimentosProdutos
]

