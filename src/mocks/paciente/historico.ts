export interface HistoricoItem {
    id: number
    tipo: string
    data: string
    especialidade: string
    medico: string
    status: string
}

export const MOCK_HISTORICO: HistoricoItem[] = [
    { id: 101, tipo: 'Consulta', data: '2026-01-08', especialidade: 'Clínica Geral', medico: 'Dra. Maria Santos', status: 'Concluído' },
    { id: 102, tipo: 'Exame', data: '2024-12-20', especialidade: 'Hemograma', medico: 'Laboratório Central', status: 'Concluído' },
    { id: 103, tipo: 'Retorno', data: '2024-12-15', especialidade: 'Cardiologia', medico: 'Dr. João Silva', status: 'Concluído' },
];

