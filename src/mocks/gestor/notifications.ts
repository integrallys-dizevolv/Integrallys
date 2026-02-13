import type { Notification } from '@/pages/admin/components/types'

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 1,
        title: 'Alerta de Stock',
        description: 'Item "Luvas Latex" atingiu o nível crítico na Unidade Centro.',
        date: 'Há 10 min',
        read: false
    },
    {
        id: 2,
        title: 'Relatório DRE pronto',
        description: 'O fecho do mês de Dezembro já está disponível para consulta.',
        date: 'Há 1 hora',
        read: true
    }
];
