import { AgendaView } from '../../../admin/pages/agenda/AgendaView';
import { mockAgendaItems, mockAgendaPersonal } from '@/mocks/gestor/agenda';

interface AgendaGlobalViewProps {
    onPageChange?: (page: string) => void;
}

// Dados mockados específicos para o Gestor (se necessário diferente do admin, podemos customizar aqui)
// Por enquanto vamos reutilizar a estrutura e pode-se passar mocks via props se o componente aceitar,
// mas o componente AgendaView atual aceita mockAgendaItems e mockAgendaPersonal.


export function AgendaGlobalView({ onPageChange }: AgendaGlobalViewProps) {
    return (
        <AgendaView
            mockAgendaItems={mockAgendaItems}
            mockAgendaPersonal={mockAgendaPersonal}
            setCurrentPage={onPageChange}
            showShortcutButtons={true}
            hideGlobalTab={false}
            recepcaoLayout={true}
            allowPersonalTab={true}
            allowMixedView={true}
        />
    );
}
