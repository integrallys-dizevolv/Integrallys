import { useState } from 'react';
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
import { MOCK_APPOINTMENTS, Appointment } from '@/mocks/especialista/agenda';

interface AgendaPessoalViewProps {
    onPageChange: (page: string) => void;
}

export function AgendaPessoalView({ onPageChange }: AgendaPessoalViewProps) {
    const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);

    // Mapeia os compromissos do especialista para o padrão do componente AgendaView
    const specialistConsultas = MOCK_APPOINTMENTS.filter(apt => apt.type === 'consulta' || apt.type === 'reconsulta').map(apt => ({
        id: apt.id,
        hora: apt.time,
        duracao: apt.duration,
        paciente: apt.patientName || apt.title,
        tipo: apt.type === 'consulta' ? 'Consulta' : 'Retorno',
        profissional: "Dr. Especialista",
        unidade: "Clínica Integrall",
        status: apt.status === 'agendado' ? 'Aguardando' : (apt.status === 'concluido' ? 'Concluído' : 'Check-in'),
        pagamento: "Pendente"
    }));

    const specialistPersonal: AgendaPersonalItem[] = MOCK_APPOINTMENTS.filter(apt => apt.type !== 'consulta' && apt.type !== 'reconsulta').map(apt => ({
        id: apt.id,
        hora: apt.time,
        duracao: apt.duration,
        titulo: apt.title,
        tipo: 'Reunião',
        prioridade: 'Média',
        status: apt.status === 'agendado' ? 'Pendente' : 'Concluído',
        descricao: apt.description,
        data: '2025-11-21'
    }));

    const handleStartAttendance = (item: any) => {
        // Busca o appointment original para passar para a visualização de atendimento
        const apt = MOCK_APPOINTMENTS.find(a => a.id === item.id);
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
