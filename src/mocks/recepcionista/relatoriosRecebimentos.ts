export interface RelatorioRecebimentoItem {
  id: number;
  dataVenda: string;
  dataCompensacao: string;
  cliente: string;
  descricao: string;
  formaPagamento:
    | "Cartão de Crédito"
    | "Cartão de Débito"
    | "Pix"
    | "Dinheiro"
    | "Boleto";
  parcelas: string;
  status: "Recebido" | "A Receber" | "Atrasado";
  valorBruto: number;
  taxaParcelamentoPercent?: number;
  taxaAntecipacaoPercent?: number;
}

export const MOCK_RELATORIO_RECEBIMENTOS: RelatorioRecebimentoItem[] = [
  {
    id: 1,
    dataVenda: "2026-02-20",
    dataCompensacao: "2026-02-21", // D+1 for Debit/Pix
    cliente: "Maria Silva",
    descricao: "Consulta Inicial",
    formaPagamento: "Pix",
    parcelas: "À vista",
    status: "Recebido",
    valorBruto: 250.0,
    taxaParcelamentoPercent: 0,
    taxaAntecipacaoPercent: 0,
  },
  {
    id: 2,
    dataVenda: "2026-02-20",
    dataCompensacao: "2026-03-20", // D+30 for Credit 1x
    cliente: "Pedro Costa",
    descricao: "Procedimento Estético",
    formaPagamento: "Cartão de Crédito",
    parcelas: "1/1",
    status: "A Receber",
    valorBruto: 500.0,
    taxaParcelamentoPercent: 3.2,
    taxaAntecipacaoPercent: 0.8,
  },
  {
    id: 3,
    dataVenda: "2026-02-19",
    dataCompensacao: "2026-02-20",
    cliente: "Ana Paula Santos",
    descricao: "Exame Laboratorial",
    formaPagamento: "Cartão de Débito",
    parcelas: "À vista",
    status: "Recebido",
    valorBruto: 120.0,
    taxaParcelamentoPercent: 1.6,
    taxaAntecipacaoPercent: 0,
  },
  {
    id: 4,
    dataVenda: "2026-01-15",
    dataCompensacao: "2026-02-15",
    cliente: "Julia Martins",
    descricao: "Pacote Tratamento (Parc 1/3)",
    formaPagamento: "Cartão de Crédito",
    parcelas: "1/3",
    status: "Recebido",
    valorBruto: 300.0,
    taxaParcelamentoPercent: 3.5,
    taxaAntecipacaoPercent: 0,
  },
  {
    id: 5,
    dataVenda: "2026-01-15",
    dataCompensacao: "2026-03-15",
    cliente: "Julia Martins",
    descricao: "Pacote Tratamento (Parc 2/3)",
    formaPagamento: "Cartão de Crédito",
    parcelas: "2/3",
    status: "A Receber",
    valorBruto: 300.0,
    taxaParcelamentoPercent: 3.5,
    taxaAntecipacaoPercent: 1.2,
  },
  {
    id: 6,
    dataVenda: "2026-01-15",
    dataCompensacao: "2026-01-15",
    cliente: "Julia Martins",
    descricao: "Pacote Tratamento (Parc 3/3)",
    formaPagamento: "Cartão de Crédito",
    parcelas: "3/3",
    status: "A Receber",
    valorBruto: 300.0,
    taxaParcelamentoPercent: 3.5,
    taxaAntecipacaoPercent: 1.2,
  },
  {
    id: 7,
    dataVenda: "2026-02-18",
    dataCompensacao: "2026-02-18",
    cliente: "Fernanda Oliveira",
    descricao: "Consulta Retorno",
    formaPagamento: "Dinheiro",
    parcelas: "À vista",
    status: "Recebido",
    valorBruto: 150.0,
    taxaParcelamentoPercent: 0,
    taxaAntecipacaoPercent: 0,
  },
  {
    id: 8,
    dataVenda: "2026-02-10",
    dataCompensacao: "2026-02-13", // Boleto compensations vary
    cliente: "Empresa Parceira LTDA",
    descricao: "Convênio Empresarial",
    formaPagamento: "Boleto",
    parcelas: "À vista",
    status: "Atrasado",
    valorBruto: 1500.0,
    taxaParcelamentoPercent: 0.3,
    taxaAntecipacaoPercent: 0,
  },
  {
    id: 9,
    dataVenda: "2026-02-05",
    dataCompensacao: "2026-03-05",
    cliente: "Ricardo Oliveira",
    descricao: "Cirurgia Pequeno Porte",
    formaPagamento: "Cartão de Crédito",
    parcelas: "1/2",
    status: "A Receber",
    valorBruto: 1200.0,
    taxaParcelamentoPercent: 3.8,
    taxaAntecipacaoPercent: 1.0,
  },
  {
    id: 10,
    dataVenda: "2026-02-05",
    dataCompensacao: "2026-01-05",
    cliente: "Ricardo Oliveira",
    descricao: "Cirurgia Pequeno Porte",
    formaPagamento: "Cartão de Crédito",
    parcelas: "2/2",
    status: "A Receber",
    valorBruto: 1200.0,
    taxaParcelamentoPercent: 3.8,
    taxaAntecipacaoPercent: 1.0,
  },
];


