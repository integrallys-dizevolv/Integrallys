export interface Prontuario {
    id: number
    paciente: string
    data: string
    tipo: string
    status: 'Em Andamento' | 'Finalizado'
}

export const MOCK_PRONTUARIOS: Prontuario[] = [
    { id: 1, paciente: 'Maria Silva', data: '15/11/2024', tipo: 'Consulta Biorressonância Quântica', status: 'Em Andamento' },
    { id: 2, paciente: 'Maria Silva', data: '10/09/2024', tipo: 'Avaliação Nutricional Funcional', status: 'Finalizado' },
    { id: 3, paciente: 'Maria Silva', data: '05/06/2024', tipo: 'Primeira Consulta Geral', status: 'Finalizado' },
    { id: 4, paciente: 'Maria Silva', data: '12/05/2024', tipo: 'Retorno de Avaliação', status: 'Finalizado' },
];
