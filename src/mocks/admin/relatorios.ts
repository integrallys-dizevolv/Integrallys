export const MOCK_AGENDAMENTOS_REPORT = [
    {
        data: '21/11/2026',
        horario: '09:00',
        cliente: 'Maria Silva Santos',
        procedimento: 'Consulta Nutricional',
        profissional: 'Dra. Ana Paula',
        valor: 200.00,
        status: 'Realizado',
        pagamento: 'Pago',
        formaPagamento: 'PIX',
        convenio: 'Particular',
        unidade: 'Clínica Central'
    },
    {
        data: '21/11/2026',
        horario: '10:30',
        cliente: 'João Pedro Costa',
        procedimento: 'Hidroterapia Colônica',
        profissional: 'Dr. Carlos Mendes',
        valor: 280.00,
        status: 'Realizado',
        pagamento: 'Pago',
        formaPagamento: 'Crédito',
        convenio: 'Unimed',
        unidade: 'Clínica Central'
    },
    {
        data: '21/11/2026',
        horario: '14:00',
        cliente: 'Ana Carolina Lima',
        procedimento: 'Acupuntura',
        profissional: 'Dra. Beatriz Rocha',
        valor: 180.00,
        status: 'Agendado',
        pagamento: 'Em Aberto',
        formaPagamento: '-',
        convenio: 'Particular',
        unidade: 'Unidade Norte'
    },
    {
        data: '21/11/2026',
        horario: '15:30',
        cliente: 'Roberto Mendes',
        procedimento: 'Bioimpedância',
        profissional: 'Dra. Ana Paula',
        valor: 150.00,
        status: 'Cancelado',
        justificativa: 'Paciente solicitou cancelamento por motivo pessoal',
        pagamento: '-',
        formaPagamento: '-',
        convenio: 'Particular',
        unidade: 'Clínica Central'
    },
    {
        data: '21/11/2026',
        horario: '16:00',
        cliente: 'Fernanda Oliveira',
        procedimento: 'Massoterapia',
        profissional: 'Terapeuta Lucas',
        valor: 160.00,
        status: 'Não Compareceu',
        pagamento: '-',
        formaPagamento: '-',
        convenio: 'Particular',
        unidade: 'Unidade Norte'
    },
    {
        data: '21/11/2026',
        horario: '17:00',
        cliente: '-',
        procedimento: '-',
        profissional: 'Dra. Ana Paula',
        valor: 0,
        status: 'Disponível',
        pagamento: '-',
        formaPagamento: '-',
        convenio: '-',
        unidade: 'Clínica Central'
    },
];

export const MOCK_CLIENTES_REPORT = [
    {
        nome: 'Maria Silva Santos',
        dataNascimento: '15/03/1985',
        sexo: 'Feminino',
        cidade: 'São Paulo',
        midia: 'Instagram',
        procedimento: 'Consulta',
        unidade: 'Clínica Central',
        convenio: 'Particular',
        atendimentos: 24,
        ultimo: '21/11/2026',
        profissional: 'Dra. Ana Paula'
    },
    {
        nome: 'João Pedro Costa',
        dataNascimento: '22/07/1990',
        sexo: 'Masculino',
        cidade: 'São Paulo',
        midia: 'Indicação',
        convenio: 'Unimed',
        atendimentos: 21,
        ultimo: '21/11/2026',
        profissional: 'Dr. Carlos Mendes'
    },
    {
        nome: 'Ana Carolina Lima',
        dataNascimento: '10/12/1978',
        sexo: 'Feminino',
        cidade: 'Guarulhos',
        midia: 'Facebook',
        procedimento: 'Quiropraxia',
        unidade: 'Unidade Norte',
        convenio: 'Particular',
        atendimentos: 19,
        ultimo: '18/11/2026',
        profissional: 'Dra. Beatriz Rocha'
    }
];

export const MOCK_VENDAS_REPORT = [
    {
        data: '21/11/2026',
        cliente: 'Maria Silva Santos',
        produto: 'Ômega 3 Premium',
        quantidade: 2,
        valorUnitario: 85.00,
        total: 170.00,
        profissional: 'Dra. Ana Paula',
        pagamento: 'PIX',
        unidade: 'Clínica Central'
    },
    {
        data: '21/11/2026',
        cliente: 'João Pedro Costa',
        produto: 'Colágeno Hidrolisado',
        quantidade: 3,
        valorUnitario: 95.00,
        total: 285.00,
        profissional: 'Dr. Carlos Mendes',
        pagamento: 'Crédito',
        unidade: 'Clínica Central'
    },
    {
        data: '20/11/2026',
        cliente: 'Ana Carolina Lima',
        produto: 'Probiótico Advanced',
        quantidade: 1,
        valorUnitario: 120.00,
        total: 120.00,
        profissional: 'Dra. Ana Paula',
        pagamento: 'Débito',
        unidade: 'Unidade Norte'
    }
];

export const MOCK_ORCAMENTOS_REPORT = [
    {
        data: '15/11/2026',
        cliente: 'Carlos Alberto',
        profissional: 'Dra. Ana Paula',
        produto: 'Kit Suplementos Completo',
        unidade: 'Clínica Central',
        valor: 450.00,
        validade: '30/11/2026',
        dias: 9,
        situacao: 'No Prazo'
    },
    {
        data: '10/11/2026',
        cliente: 'Patrícia Souza',
        profissional: 'Dr. Carlos Mendes',
        produto: 'Vitaminas Especiais',
        unidade: 'Clínica Central',
        valor: 320.00,
        validade: '25/11/2026',
        dias: -4,
        situacao: 'Vencido'
    },
    {
        data: '18/11/2026',
        cliente: 'Ricardo Alves',
        profissional: 'Dra. Beatriz Rocha',
        produto: 'Tratamento Dermocosméticos',
        valor: 680.00,
        validade: '03/12/2026',
        dias: 12,
        situacao: 'No Prazo'
    }
];

export const MOCK_ESTOQUE_REPORT = [
    {
        produto: 'Ômega 3 Premium',
        categoria: 'Suplementos',
        tipoEstoque: 'Prescrição/Vendas',
        quantidade: 45,
        minimo: 20,
        custoUnitario: 52.00,
        valor: 85.00,
        margemValor: 33.00,
        margemPercentual: 63.46,
        fornecedor: 'Nutriplus',
        validade: '15/06/2026',
        lote: 'L2026-034',
        situacao: 'Normal'
    },
    {
        produto: 'Colágeno Hidrolisado',
        categoria: 'Suplementos',
        tipoEstoque: 'Prescrição/Vendas',
        quantidade: 12,
        minimo: 15,
        custoUnitario: 60.00,
        valor: 95.00,
        margemValor: 35.00,
        margemPercentual: 58.33,
        fornecedor: 'VitaHealth',
        validade: '20/08/2026',
        lote: 'L2026-128',
        situacao: 'Baixo'
    },
    {
        produto: 'Probiótico Advanced',
        categoria: 'Suplementos',
        tipoEstoque: 'Suprimentos',
        quantidade: 8,
        minimo: 10,
        custoUnitario: 76.00,
        valor: 120.00,
        margemValor: 44.00,
        margemPercentual: 57.89,
        fornecedor: 'BioLab',
        validade: '10/04/2026',
        lote: 'L2026-089',
        situacao: 'Crítico'
    }
];

export const MOCK_REPASSE_REPORT = [
    {
        data: '21/11/2026',
        horario: '09:00',
        profissional: 'Dra. Ana Paula',
        procedimento: 'Consulta Nutricional',
        unidade: 'Clínica Central',
        situacao: 'Atendido',
        cliente: 'Maria Silva Santos',
        recebido: 200.00,
        percentual: 60,
        repasse: 120.00,
        lucro: 80.00
    },
    {
        data: '21/11/2026',
        horario: '10:30',
        profissional: 'Dr. Carlos Mendes',
        procedimento: 'Hidroterapia Colônica',
        cliente: 'João Pedro Costa',
        recebido: 280.00,
        percentual: 55,
        repasse: 154.00,
        lucro: 126.00
    },
    {
        data: '21/11/2026',
        horario: '14:00',
        profissional: 'Dra. Beatriz Rocha',
        procedimento: 'Acupuntura',
        unidade: 'Unidade Norte',
        situacao: 'Cancelado',
        cliente: 'Ana Carolina Lima',
        recebido: 180.00,
        percentual: 50,
        repasse: 90.00,
        lucro: 90.00
    }
];

export const MOCK_NFS_REPORT = [
    {
        numero: '00001',
        data: '21/11/2026',
        cliente: 'Maria Silva Santos',
        servico: 'Consulta Nutricional',
        valor: 200.00,
        pagamento: 'PIX',
        aliquota: '5%',
        imposto: 10.00
    },
    {
        numero: '00002',
        data: '21/11/2026',
        cliente: 'João Pedro Costa',
        servico: 'Hidroterapia Colônica',
        valor: 280.00,
        pagamento: 'Crédito',
        aliquota: '5%',
        imposto: 14.00
    },
    {
        numero: '00003',
        data: '20/11/2026',
        cliente: 'Ana Carolina Lima',
        servico: 'Acupuntura',
        valor: 180.00,
        pagamento: 'Débito',
        aliquota: '5%',
        imposto: 9.00
    }
];

export const MOCK_NFE_REPORT = [
    {
        numero: 'NFe-00045',
        data: '21/11/2026',
        cliente: 'Maria Silva Santos',
        produto: 'Ômega 3 Premium',
        quantidade: 2,
        valor: 170.00,
        pagamento: 'PIX',
        chave: '3525 1121 0001 0004 5001 5500 0001 7045 8901 2345'
    },
    {
        numero: 'NFe-00046',
        data: '21/11/2026',
        cliente: 'João Pedro Costa',
        produto: 'Colágeno Hidrolisado',
        quantidade: 3,
        valor: 285.00,
        pagamento: 'Crédito',
        chave: '3525 1121 0001 0004 6001 5500 0002 8545 8901 2346'
    }
];

export const MOCK_FINANCEIRO_REPORT = [
    {
        data: '21/11/2026',
        tipo: 'Receita',
        categoria: 'Consultas',
        descricao: 'Consulta Nutricional - Maria Silva Santos',
        usuario: 'Recep??o',
        valor: 200.00,
        formaPagamento: 'PIX',
        status: 'Recebido',
        unidade: 'Clínica Central',
        hora: '09:15'
    },
    {
        data: '21/11/2026',
        tipo: 'Receita',
        categoria: 'Prescrição/Vendas',
        descricao: 'Prescrição/Venda Ômega 3 - João Pedro Costa',
        valor: 170.00,
        formaPagamento: 'Crédito',
        status: 'Recebido',
        unidade: 'Clínica Central',
        hora: '10:45'
    },
    {
        data: '21/11/2026',
        tipo: 'Despesa',
        categoria: 'Repasse',
        descricao: 'Repasse Dra. Ana Paula',
        usuario: 'Gestor',
        valor: -120.00,
        formaPagamento: 'Transferência',
        status: 'Pago',
        unidade: 'Clínica Central',
        hora: '14:30'
    },
    {
        data: '20/11/2026',
        tipo: 'Despesa',
        categoria: 'Fornecedores',
        descricao: 'Compra Suplementos - Suplementos Brasil Ltda',
        usuario: 'Administrador',
        valor: -850.00,
        formaPagamento: 'Boleto',
        status: 'Pago',
        unidade: 'Clínica Central',
        hora: '11:00'
    }
];

export const MOCK_JUSTIFICATIVAS_REPORT = [
    {
        data: '21/11/2026',
        horario: '15:30',
        cliente: 'Roberto Mendes',
        procedimento: 'Bioimpedância',
        profissional: 'Dra. Ana Paula',
        motivo: 'Imprevisto Pessoal',
        justificativa: 'Cliente teve compromisso urgente de trabalho',
        responsavel: 'Recepção',
        valor: 150.00
    },
    {
        data: '21/11/2026',
        horario: '16:00',
        cliente: 'Fernanda Oliveira',
        procedimento: 'Massoterapia',
        profissional: 'Terapeuta Lucas',
        motivo: 'Não Compareceu',
        justificativa: 'Cliente não compareceu e não avisou',
        responsavel: 'Sistema',
        valor: 160.00
    },
    {
        data: '20/11/2026',
        horario: '11:00',
        cliente: 'Paulo Santos',
        procedimento: 'Consulta Médica',
        profissional: 'Dr. Carlos Mendes',
        motivo: 'Problemas de Saúde',
        justificativa: 'Cliente com sintomas gripais, reagendado',
        responsavel: 'Recepção',
        valor: 250.00
    }
];

export const MOCK_CARTOES_REPORT = [
    {
        data: '21/11/2026',
        horario: '10:30',
        cliente: 'João Pedro Costa',
        procedimento: 'Hidroterapia Colônica',
        bandeira: 'Visa',
        operadora: 'Cielo',
        valorBruto: 280.00,
        taxa: 2.5,
        valorLiquido: 273.00,
        parcelas: '1x',
        statusRecebimento: 'Recebido',
        dataRecebimento: '22/11/2026',
        prazoRecebimento: 1,
        tipo: 'Crédito'
    },
    {
        data: '21/11/2026',
        horario: '09:00',
        cliente: 'Maria Silva Santos',
        procedimento: 'Consulta Nutricional',
        bandeira: 'Master',
        operadora: 'Stone',
        valorBruto: 200.00,
        taxa: 2.8,
        valorLiquido: 194.40,
        parcelas: '1x',
        statusRecebimento: 'Recebido',
        dataRecebimento: '22/11/2026',
        prazoRecebimento: 1,
        tipo: 'Débito'
    }
];

export const MOCK_RECEBIMENTOS_REPORT = [
    { data: '05/11/2026', hora: '14:30', cliente: 'João Silva', descricao: 'Consulta Nutricional', valor: 350.00, forma: 'PIX', status: 'Recebido' },
    { data: '05/11/2026', hora: '11:15', cliente: 'Maria Santos', descricao: 'Hidroterapia', valor: 280.00, forma: 'Cartão Crédito - Visa', status: 'Recebido' },
    { data: '05/11/2026', hora: '09:45', cliente: 'Pedro Costa', descricao: 'Acupuntura', valor: 180.00, forma: 'Dinheiro', status: 'Recebido' },
];

export const MOCK_PAGAMENTOS_REPORT = [
    { data: '05/11/2026', hora: '09:00', fornecedor: 'Distribuidora MedSupply', descricao: 'Material Hospitalar', valor: 1850.00, forma: 'Boleto', status: 'Pago', vencimento: '05/11/2026' },
    { data: '04/11/2026', hora: '14:30', fornecedor: 'Governo Federal', descricao: 'INSS - Folha Outubro', valor: 3200.00, forma: 'Transferência', status: 'Pago', vencimento: '04/11/2026' },
];

export const MOCK_COMISSOES_REPORT = [
    {
        data: '21/11/2026',
        vendedor: 'Mariana Costa',
        produto: 'Ômega 3 Premium',
        quantidade: 2,
        cliente: 'Maria Silva Santos',
        valorVenda: 170.00,
        percentual: 10,
        valorComissao: 17.00
    },
    {
        data: '21/11/2026',
        vendedor: 'Mariana Costa',
        produto: 'Colágeno Hidrolisado',
        quantidade: 1,
        cliente: 'João Pedro Costa',
        valorVenda: 95.00,
        percentual: 10,
        valorComissao: 9.50
    },
    {
        data: '20/11/2026',
        vendedor: 'Carlos Mendes',
        produto: 'Probiótico Advanced',
        quantidade: 1,
        cliente: 'Ana Carolina Lima',
        valorVenda: 120.00,
        percentual: 5,
        valorComissao: 6.00
    }
];



export const MOCK_ESTOQUE_ENTRADAS_DIARIAS = [
    {
        unidade: 'Clínica Central',
        usuario: 'Administrador',
        data: '21/11/2026',
        notaFiscal: 'NF-89341',
        fornecedor: 'Nutriplus',
        tipoEstoque: 'Prescrição/Vendas',
        produto: '?mega 3 Premium',
        quantidade: 20,
        custoUnitario: 52.00,
        precoVenda: 85.00
    },
    {
        unidade: 'Unidade Norte',
        usuario: 'Gestor',
        data: '21/11/2026',
        notaFiscal: 'NF-89342',
        fornecedor: 'BioLab',
        tipoEstoque: 'Suprimentos',
        produto: 'Probiotico Advanced',
        quantidade: 10,
        custoUnitario: 76.00,
        precoVenda: 120.00
    }
];

export const MOCK_ESTOQUE_SAIDAS_DIARIAS = [
    {
        unidade: 'Clínica Central',
        usuario: 'Recep??o',
        data: '21/11/2026',
        cliente: 'Maria Silva Santos',
        tipoEstoque: 'Prescrição/Vendas',
        produto: '?mega 3 Premium',
        quantidade: 2,
        custoUnitario: 52.00,
        precoVenda: 85.00
    },
    {
        unidade: 'Unidade Norte',
        usuario: 'Recep??o',
        data: '21/11/2026',
        cliente: 'Ana Carolina Lima',
        tipoEstoque: 'Suprimentos',
        produto: 'Probiotico Advanced',
        quantidade: 1,
        custoUnitario: 76.00,
        precoVenda: 120.00
    }
];
