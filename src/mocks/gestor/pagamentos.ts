export interface PagamentoRow {
    id: string;
    descricao: string;
    fornecedor: string;
    categoria: string;
    valor: string;
    documento: string;
    parcela: string;
    formaPagamento: 'PIX' | 'Débito' | 'Crédito' | 'Dinheiro' | 'Boleto';
    dataEmissao: string;
    vencimento: string;
    tipo: 'Fixa' | 'Variavel';
    status: 'À vencer' | 'Atrasado' | 'Pago';
}

export const MOCK_PAGAMENTOS: PagamentoRow[] = [
    { id: '1', descricao: 'Aluguel Clínica', fornecedor: 'Imobiliaria Silva', categoria: 'Despesa Fixa', valor: 'R$ 3.500,00', documento: 'DOC-1045', parcela: '1/1', formaPagamento: 'Boleto', dataEmissao: '01/12/2026', vencimento: '10/12/2026', tipo: 'Fixa', status: 'À vencer' },
    { id: '2', descricao: 'Energia Elétrica', fornecedor: 'Energisa', categoria: 'Despesa Fixa', valor: 'R$ 850,00', documento: 'DOC-1098', parcela: '1/1', formaPagamento: 'Débito', dataEmissao: '05/12/2026', vencimento: '15/12/2026', tipo: 'Fixa', status: 'À vencer' },
    { id: '3', descricao: 'Material Odontológico', fornecedor: 'Dental Supply', categoria: 'Material', valor: 'R$ 1.200,00', documento: 'DOC-1132', parcela: '2/3', formaPagamento: 'Crédito', dataEmissao: '03/12/2026', vencimento: '08/12/2026', tipo: 'Variavel', status: 'Pago' },
    { id: '4', descricao: 'Internet', fornecedor: 'Vivo Empresas', categoria: 'Despesa Fixa', valor: 'R$ 250,00', documento: 'DOC-1077', parcela: '1/1', formaPagamento: 'PIX', dataEmissao: '25/11/2026', vencimento: '05/12/2026', tipo: 'Fixa', status: 'Atrasado' }
];
