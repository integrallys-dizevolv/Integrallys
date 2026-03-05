export interface Evolucao {
    id: number
    paciente: string
    data: string
    tipo: 'Consulta' | 'Retorno' | 'Exame'
    resumo: string
    retornoRecepcao: 'Paciente avisado' | 'Retorno confirmado' | 'Não localizado'
    docsCount: number
}

export const MOCK_EVOLUCOES: Evolucao[] = [
    {
        id: 1,
        paciente: 'Maria Silva',
        data: '08/10/2026',
        tipo: 'Consulta',
        resumo: 'Paciente refere queixas persistentes de fadiga; ultrassonografia abdominal solicitada para avaliação.',
        retornoRecepcao: 'Paciente avisado',
        docsCount: 2
    },
    {
        id: 2,
        paciente: 'João Santos',
        data: '07/10/2026',
        tipo: 'Exame',
        resumo: 'Resultados de hemograma completo analisados. Valores dentro da normalidade, exceto colesterol levemente alterado.',
        retornoRecepcao: 'Retorno confirmado',
        docsCount: 1
    },
    {
        id: 3,
        paciente: 'Ana Costa',
        data: '06/10/2026',
        tipo: 'Consulta',
        resumo: 'Retorno pós-tratamento. Paciente apresenta melhora significativa dos sintomas iniciais.',
        retornoRecepcao: 'Não localizado',
        docsCount: 3
    },
    {
        id: 4,
        paciente: 'Carlos Pereira',
        data: '05/10/2026',
        tipo: 'Retorno',
        resumo: 'Acompanhamento de rotina. Pressão arterial estável. Renovação de receita contínua.',
        retornoRecepcao: 'Paciente avisado',
        docsCount: 0
    }
];

