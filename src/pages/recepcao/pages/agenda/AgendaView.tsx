import { useEffect, useState } from 'react';
import { AgendaView as AdminAgendaView } from '../../../admin/pages/agenda/AgendaView';
import { mockAgendaItems, mockAgendaPersonal } from '@/mocks/recepcionista/agenda';

interface AgendaViewProps {
    onPageChange?: (page: string) => void;
}

export function AgendaView({ onPageChange }: AgendaViewProps) {
    const [allowedProfessionals, setAllowedProfessionals] = useState<string[] | undefined>(undefined);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('recepcao_profissionais_permitidos');
            if (stored) {
                setAllowedProfessionals(JSON.parse(stored));
            } else {
                setAllowedProfessionals(undefined);
            }
        } catch {
            setAllowedProfessionals(undefined);
        }
    }, []);

    return (
        <AdminAgendaView
            mockAgendaItems={mockAgendaItems}
            mockAgendaPersonal={mockAgendaPersonal}
            setCurrentPage={onPageChange}
            showShortcutButtons={true}
            hideGlobalTab={false}
            // Propriedades adicionais para layout da recepção
            recepcaoLayout={true}
            allowPersonalTab={true}
            allowMixedView={true}
            allowedProfessionals={allowedProfessionals}
        />
    );
}
