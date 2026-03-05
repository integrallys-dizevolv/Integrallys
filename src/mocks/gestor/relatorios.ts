export const agendamentosData = [
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
        convenio: 'Particular'
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
        convenio: 'Unimed'
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
        convenio: 'Particular'
    },
    {
        data: '21/11/2026',
        horario: '15:30',
        cliente: 'Roberto Mendes',
        procedimento: 'Bioimpedância',
        profissional: 'Dra. Ana Paula',
        valor: 150.00,
        status: 'Cancelado',
        pagamento: '-',
        formaPagamento: '-',
        convenio: 'Particular'
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
        convenio: 'Particular'
    },
];

export const clientesData = [
    {
        nome: 'Maria Silva Santos',
        dataNascimento: '15/03/1985',
        sexo: 'Feminino',
        cidade: 'São Paulo',
        midia: 'Instagram',
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
        convenio: 'Particular',
        atendimentos: 19,
        ultimo: '18/11/2026',
        profissional: 'Dra. Beatriz Rocha'
    }
];

export const vendasData = [
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

export const orcamentosData = [
    {
        data: '15/11/2026',
        cliente: 'Carlos Alberto',
        profissional: 'Dra. Ana Paula',
        produto: 'Kit Suplementos Completo',
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

export const estoqueData = [
    {
        produto: 'Ômega 3 Premium',
        categoria: 'Suplementos',
        quantidade: 45,
        minimo: 20,
        valor: 85.00,
        fornecedor: 'Nutriplus',
        validade: '15/06/2026',
        lote: 'L2026-034',
        situacao: 'Normal'
    },
    {
        produto: 'Colágeno Hidrolisado',
        categoria: 'Suplementos',
        quantidade: 12,
        minimo: 15,
        valor: 95.00,
        fornecedor: 'VitaHealth',
        validade: '20/08/2026',
        lote: 'L2026-128',
        situacao: 'Baixo'
    },
    {
        produto: 'Probiótico Advanced',
        categoria: 'Suplementos',
        quantidade: 8,
        minimo: 10,
        valor: 120.00,
        fornecedor: 'BioLab',
        validade: '10/04/2026',
        lote: 'L2026-089',
        situacao: 'Crítico'
    }
];

export const repasseData = [
    {
        data: '21/11/2026',
        horario: '09:00',
        profissional: 'Dra. Ana Paula',
        procedimento: 'Consulta Nutricional',
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
        cliente: 'Ana Carolina Lima',
        recebido: 180.00,
        percentual: 50,
        repasse: 90.00,
        lucro: 90.00
    }
];

export const nfsData = [
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

export const nfeData = [
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

export const financeiroData = [
    {
        data: '21/11/2026',
        tipo: 'Receita',
        categoria: 'Consultas',
        descricao: 'Consulta Nutricional - Maria Silva Santos',
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
        valor: -850.00,
        formaPagamento: 'Boleto',
        status: 'Pago',
        unidade: 'Clínica Central',
        hora: '11:00'
    }
];

export const justificativasData = [
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

export const cartoesData = [
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
        prazoRecebimento: 1
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
        prazoRecebimento: 1
    },
    {
        data: '21/11/2026',
        horario: '14:30',
        cliente: 'Carlos Eduardo Lima',
        procedimento: 'Acupuntura',
        bandeira: 'Elo',
        operadora: 'Rede',
        valorBruto: 180.00,
        taxa: 3.0,
        valorLiquido: 174.60,
        parcelas: '2x',
        statusRecebimento: 'Pendente',
        dataRecebimento: '06/12/2026',
        prazoRecebimento: 15
    }
];

export const recebimentosData = [
    { data: '05/11/2026', hora: '14:30', cliente: 'João Silva', descricao: 'Consulta Nutricional', valor: 350.00, forma: 'PIX', status: 'Recebido' },
    { data: '05/11/2026', hora: '11:15', cliente: 'Maria Santos', descricao: 'Hidroterapia', valor: 280.00, forma: 'Cartão Crédito - Visa', status: 'Recebido' },
    { data: '05/11/2026', hora: '09:45', cliente: 'Pedro Costa', descricao: 'Acupuntura', valor: 180.00, forma: 'Dinheiro', status: 'Recebido' }
];

export const pagamentosData = [
    { data: '05/11/2026', hora: '09:00', fornecedor: 'Distribuidora MedSupply', descricao: 'Material Hospitalar', valor: 1850.00, forma: 'Boleto', status: 'Pago', vencimento: '05/11/2026' },
    { data: '04/11/2026', hora: '14:30', fornecedor: 'Governo Federal', descricao: 'INSS - Folha Outubro', valor: 3200.00, forma: 'Transferência', status: 'Pago', vencimento: '04/11/2026' }
];

