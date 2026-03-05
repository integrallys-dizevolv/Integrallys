import { useEffect, useState } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb';
import { PageHeader } from '../../ui'
import { AgendaView, AgendaPersonalItem } from '../../../admin/pages/agenda/AgendaView';
import { AtendimentoView } from './page/AtendimentoView';
import { type Appointment } from '@/mocks/especialista/agenda';
import { getEspecialistaAgendaData } from '@/services/agenda.service';

type AgendaSpecialistItem = {
    id: number;
};

interface AgendaPessoalViewProps {
    onPageChange: (page: string) => void;
}

export function AgendaPessoalView({ onPageChange }: AgendaPessoalViewProps) {
    const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [specialistConsultas, setSpecialistConsultas] = useState<Array<{
        id: number;
        hora: string;
        duracao?: string;
        paciente: string;
        tipo?: string;
        profissional: string;
        unidade: string;
        status: string;
        pagamento: string;
        data?: string;
    }>>([]);
    const [specialistPersonal, setSpecialistPersonal] = useState<AgendaPersonalItem[]>([]);

    useEffect(() => {
        let mounted = true;

        const loadAgenda = async () => {
            const data = await getEspecialistaAgendaData();
            if (!mounted) return;
            setAppointments(data.appointments);
            setSpecialistConsultas(data.agendaItems);
            setSpecialistPersonal(data.agendaPersonal as AgendaPersonalItem[]);
        };

        void loadAgenda();

        return () => {
            mounted = false;
        };
    }, []);

    const handleStartAttendance = (item: AgendaSpecialistItem) => {
        // Busca o appointment original para passar para a visualização de atendimento
        const apt = appointments.find(a => a.id === item.id);
        if (apt) {
            setActiveAppointment(apt);
        }
    };

    if (activeAppointment) {
        return (
            <AtendimentoView
                onPageChange={(page) => page === 'agenda' ? setActiveAppointment(null) : onPageChange(page)}
                patientName={activeAppointment.patientName || activeAppointment.title}
                appointmentTime={activeAppointment.time}
                appointmentType={activeAppointment.type === 'reconsulta' ? 'reconsulta' : 'consulta'}
            />
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => onPageChange?.('inicio')} className="cursor-pointer text-[#1A1A1AB2] dark:text-[#c3cec9] hover:text-[#0039A6] dark:hover:text-white">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-app-text-primary dark:text-white font-normal">Minha Agenda</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <PageHeader
                title="Agenda médica"
                subtitle="Consulte seus horários e gerencie seus atendimentos"
                onPageChange={onPageChange}
            />
            <AgendaView
                mockAgendaItems={specialistConsultas}
                mockAgendaPersonal={specialistPersonal}
                onStartAtendimento={handleStartAttendance}
                hideStatusFiltersInPersonal={true}
                isSpecialist={true}
                hideBreadcrumb={true}
            />
        </div>
    );
}
