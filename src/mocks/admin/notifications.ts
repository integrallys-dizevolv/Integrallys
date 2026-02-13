import type { Notification } from '@/pages/admin/components/types'

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 1, title: 'Nova unidade cadastrada', description: 'Unidade Centro Sul foi adicionada ao sistema', date: '2h atrás', read: false },
    { id: 2, title: 'Atualização de sistema', description: 'Nova versão 2.1.0 disponível', date: '1 dia atrás', read: false },
    { id: 3, title: 'Backup concluído', description: 'Backup automático realizado com sucesso', date: '2 dias atrás', read: true },
];
