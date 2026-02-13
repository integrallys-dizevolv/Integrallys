import type { Notification } from '@/pages/admin/components/types'

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 1,
        title: 'Consulta Agendada',
        description: 'Sua consulta com Dr. João foi confirmada para 15/01.',
        date: 'Há 2 horas',
        read: false
    },
    {
        id: 2,
        title: 'Resultado de Exame',
        description: 'Seu hemograma completo já está disponível.',
        date: 'Há 1 dia',
        read: true
    },
    {
        id: 3,
        title: 'Fatura Disponível',
        description: 'A fatura referente à consulta de Cardiologia está disponível.',
        date: 'Há 2 dias',
        read: true
    }
];
