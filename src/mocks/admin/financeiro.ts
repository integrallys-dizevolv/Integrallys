export const MOCK_TRANSACTIONS = [
    { id: 1, data: '05/11/2026 14:30', tipo: 'Entrada', unidade: 'Clínica Central', descricao: 'Consulta Particular - João Silva', categoria: 'Consulta', valorTotal: 350.00, valorPago: 350.00, saldo: 0, forma: 'Pix', status: 'Pago' },
    { id: 2, data: '05/11/2026 11:15', tipo: 'Saída', unidade: 'Unidade Norte', descricao: 'Fornecedor - Material Hospitalar XYZ', categoria: 'Fornecedor', valorTotal: 1850.00, valorPago: 1000.00, saldo: 850.00, forma: 'Boleto', status: 'Parcial' },
    { id: 3, data: '04/11/2026 16:45', tipo: 'Entrada', unidade: 'Clínica Central', descricao: 'Procedimento Estético - Maria Santos', categoria: 'Procedimento', valorTotal: 1200.00, valorPago: 600.00, saldo: 600.00, forma: 'Cartão', status: 'Parcial' },
    { id: 4, data: '04/11/2026 09:00', tipo: 'Saída', unidade: 'Clínica Central', descricao: 'Aluguel Unidade Central', categoria: 'Infraestrutura', valorTotal: 5000.00, valorPago: 5000.00, saldo: 0, forma: 'Transferência', status: 'Pago' },
    { id: 5, data: '03/11/2026 10:20', tipo: 'Entrada', unidade: 'Unidade Norte', descricao: 'Exame Laboratorial - Pedro Costa', categoria: 'Exames', valorTotal: 450.00, valorPago: 450.00, saldo: 0, forma: 'Dinheiro', status: 'Pago' },
];

export const MOCK_ACCOUNTS = [
    { id: 1, name: 'Banco Sicredi', balance: 10000.00, type: 'Banco' },
    { id: 2, name: 'Banco Bradesco', balance: 15000.00, type: 'Banco' },
    { id: 3, name: 'Banco Itaú', balance: 8500.00, type: 'Banco' },
    { id: 4, name: 'Nubank', balance: 3200.00, type: 'Banco' },
    { id: 5, name: 'Dinheiro em Caixa', balance: 5000.00, type: 'Caixa' },
    { id: 6, name: 'Troco', balance: 200.00, type: 'Caixa' },
    { id: 7, name: 'PicPay', balance: 1850.00, type: 'Carteira Digital' },
];

export const MOCK_DAILY_MOVEMENTS = [
    { id: 1, hora: '14:30', tipo: 'Entrada', descricao: 'Pagamento consulta', forma: 'PIX', valor: 350.00, operador: 'Ana Costa' },
    { id: 2, hora: '11:15', tipo: 'Saída', descricao: 'Sangria para cofre', forma: 'Dinheiro', valor: 500.00, operador: 'Carlos Lima' },
    { id: 3, hora: '09:45', tipo: 'Entrada', descricao: 'Prescrição/Venda de produto', forma: 'Cartão', valor: 120.00, operador: 'Ana Costa' },
    { id: 4, hora: '08:00', tipo: 'Entrada', descricao: 'Suprimento inicial', forma: 'Dinheiro', valor: 1000.00, operador: 'Sistema' },
];

export const MOCK_DRE_ITEMS = [
    { id: 1, label: '1. Receita Bruta', sub: 'Receitas de vendas e serviços', value: 45320.00, type: 'positive', expandable: false },
    { id: 2, label: '2. (-) Deduções', sub: 'Devoluções e impostos sobre vendas', value: -4532.00, type: 'negative', expandable: false },
    { id: 3, label: '3. Receita Líquida', sub: '= Receita Bruta - Deduções', value: 40788.00, type: 'total', expandable: false },
    {
        id: 4,
        label: '4. (-) Custo dos Serviços/Produtos (CPV/CMV)',
        sub: 'Custos diretos de produção',
        value: -8450.00,
        type: 'negative',
        expandable: true,
        details: [
            { label: 'Material de Consumo', value: 3200.00 },
            { label: 'Produtos Vendidos', value: 2850.00 },
            { label: 'Serviços Terceirizados', value: 2400.00 }
        ]
    },
    { id: 5, label: '5. Lucro Bruto', sub: 'Margem: 71,4%', value: 32338.00, type: 'summary', expandable: false },
    {
        id: 6,
        label: '6. (-) Despesas Operacionais',
        sub: 'Despesas administrativas e comerciais',
        value: -18650.00,
        type: 'negative',
        expandable: true,
        details: [
            { label: 'Pessoal (Salários)', value: 8000.00 },
            { label: 'Repasse de Profissionais', value: 3200.00 },
            { label: 'Comissões de Vendedores', value: 800.00 },
            { label: 'Marketing', value: 3500.00 },
            { label: 'Ocupação', value: 3150.00 }
        ]
    },
    { id: 7, label: '7. Resultado Operacional', sub: 'Margem: 30,2%', value: 13688.00, type: 'summary', expandable: false },
    { id: 8, label: '8. Despesas/Receitas Não Operacionais', sub: 'Resultado financeiro e outros', value: 0.00, type: 'neutral', expandable: false },
    { id: 9, label: '9. EBITDA', sub: 'Indicador de geração de caixa', value: 13688.00, type: 'summary', expandable: false },
    { id: 10, label: '10. Lucro Antes dos Impostos (LAIR)', sub: 'Resultado antes da tributação', value: 13688.00, type: 'summary', expandable: false },
    {
        id: 11,
        label: '11. (-) Impostos sobre Resultado',
        sub: 'IR e CSLL',
        value: -2050.00,
        type: 'negative',
        expandable: true,
        details: [
            { label: 'Imposto de Renda (IR)', value: 1230.00 },
            { label: 'Contribuição Social (CSLL)', value: 820.00 }
        ]
    },
    { id: 12, label: '12. Lucro Líquido do Período', sub: 'Margem Líquida: 25,7%', value: 11638.00, type: 'result', sub2: 'Lucro final após todos os impostos', expandable: false },
];

export const MOCK_CASH_ACCOUNTS = [
    { id: 1, nome: 'Banco Sicredi', tipo: 'banco', saldo: 10000.00, cor: 'blue' },
    { id: 2, nome: 'Banco Bradesco', tipo: 'banco', saldo: 15000.00, cor: 'blue' },
    { id: 5, nome: 'Dinheiro em Caixa', tipo: 'caixa', saldo: 5000.00, cor: 'green' }
];

export const MOCK_REPORT_HISTORY = [
    { id: 1, data: '01/11/2026 10:30', tipo: 'Fluxo de Caixa', periodo: 'Out/2026', unidades: 'Todas', geradoPor: 'Admin' }
];

