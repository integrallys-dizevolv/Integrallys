import { useEffect, useState } from 'react';
import { AgendaView as AdminAgendaView } from '../../../admin/pages/agenda/AgendaView';
import type { AgendaItem, AgendaPersonalItem } from '../../../admin/pages/agenda/AgendaView';
import { getRecepcaoAgendaData } from '@/services/agenda.service';

interface AgendaViewProps {
    onPageChange?: (page: string) => void;
}

export function AgendaView({ onPageChange }: AgendaViewProps) {
    const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
    const [agendaPersonal, setAgendaPersonal] = useState<AgendaPersonalItem[]>([]);
    const [allowedProfessionals, setAllowedProfessionals] = useState<string[] | undefined>(undefined);
    const [allowedPersonalAgenda, setAllowedPersonalAgenda] = useState<string[] | undefined>(undefined);

    useEffect(() => {
        let mounted = true;

        const loadAgenda = async () => {
            const data = await getRecepcaoAgendaData();
            if (!mounted) return;

            setAgendaItems(data.agendaItems as AgendaItem[]);
            setAgendaPersonal(data.agendaPersonal as AgendaPersonalItem[]);
            setAllowedProfessionals(data.allowedProfessionals);
            setAllowedPersonalAgenda(data.allowedPersonalAgenda);
        };

        void loadAgenda();

        return () => {
            mounted = false;
        };
    }, []);

    const personalAgenda = allowedPersonalAgenda === undefined
        ? agendaPersonal
        : allowedPersonalAgenda.length === 0
            ? []
            : agendaPersonal.filter((item) =>
                allowedPersonalAgenda.some((name) => (item.participantes || '').includes(name)),
            );

    return (
        <AdminAgendaView
            mockAgendaItems={agendaItems}
            mockAgendaPersonal={personalAgenda}
            setCurrentPage={onPageChange}
            showShortcutButtons={true}
            hideGlobalTab={false}
            // Propriedades adicionais para layout da recep��o
            recepcaoLayout={true}
            allowPersonalTab={personalAgenda.length > 0}
            allowMixedView={personalAgenda.length > 0}
            allowedProfessionals={allowedProfessionals}
        />
    );
}
