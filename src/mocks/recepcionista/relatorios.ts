
export const MOCK_RELATORIOS_FINANCEIRO = {
    totalReceitas: 68450.00,
    totalDespesas: 15780.00,
    saldoLiquido: 52670.00,
    receitasCrescimento: 9.87,
    despesasCrescimento: -2.4,
    metaMensal: 85,
    porFormaPagamento: [
        { label: 'Cartão de Crédito', value: 25600.00, percent: 45 },
        { label: 'Cartão de Débito', value: 18900.00, percent: 30 },
        { label: 'Dinheiro', value: 12300.00, percent: 18 },
        { label: 'PIX', value: 11650.00, percent: 7 },
    ],
    despesasPorCategoria: [
        { label: 'Materiais', value: 5600.00, color: 'bg-blue-500' },
        { label: 'Salários', value: 8000.00, color: 'bg-purple-500' },
        { label: 'Infraestrutura', value: 1200.00, color: 'bg-orange-500' },
        { label: 'Outros', value: 980.00, color: 'bg-slate-400' },
    ],
    statusConsultas: {
        pagas: 156,
        pendentes: 23,
        canceladas: 8
    }
}

export const MOCK_RELATORIOS_PERFORMANCE = {
    kpis: [
        { label: 'Total de Consultas', value: '187', color: 'text-blue-600' },
        { label: 'Taxa de Comparecimento', value: '83.4%', color: 'text-emerald-600' },
        { label: 'Ocupação da Agenda', value: '78.5%', color: 'text-indigo-600' },
        { label: 'Média por Dia', value: '18.7', color: 'text-purple-600' }
    ],
    pacienteAnalysis: [
        { value: '142', label: 'Total de Pacientes', bg: 'bg-gray-50 dark:bg-white/5', text: 'text-[#101828] dark:text-white' },
        { value: '38', label: 'Novos Pacientes', bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-700' },
        { value: '104', label: 'Pacientes Recorrentes', bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700', sub: '(73.2% do total)' },
        { value: '87', label: 'Retornaram', bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-700', sub: 'Taxa: 61.3%' },
        { value: '61.3%', label: 'Taxa de Retorno', bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-700' }
    ]
}
