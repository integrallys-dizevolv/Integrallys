import { useState } from 'react'
import { Sidebar } from '@/components/global/Sidebar'
import { Header } from '@/components/global/Header'
import { HomeView } from './views/HomeView'
import { AgendaView } from './views/AgendaView'
import { HistoricoView } from './views/HistoricoView'
import { PrescricoesView } from './views/PrescricoesView'
import { PagamentosView } from './views/PagamentosView'
import { ConfiguracoesView } from './views/ConfiguracoesView'
import { ReagendarView } from './views/ReagendarView'
import { NovoAgendamentoView } from './views/NovoAgendamentoView'
import { CartoesView } from './views/CartoesView'
import { NotificationsSheet } from '@/components/global/NotificationsSheet'
import { MOCK_PATIENT_APPOINTMENTS } from '@/mocks/paciente/agenda'
import { MOCK_HISTORICO } from '@/mocks/paciente/historico'
import { MOCK_PRESCRICOES } from '@/mocks/paciente/prescricoes'
import { MOCK_FATURAS } from '@/mocks/paciente/pagamentos'
import { MOCK_NOTIFICATIONS } from '@/mocks/paciente/notifications'
import { PATIENT_SIDEBAR_ITEMS } from '@/mocks/paciente/sidebar'
import { MOCK_PATIENT_PROFILE } from '@/mocks/paciente/perfil'
import type { PatientAppointment } from '@/types'




export function PrincipalPaciente({ onLogout }: { onLogout: () => void }) {
    const [currentPage, setCurrentPage] = useState('inicio')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const [selectedForReagendar, setSelectedForReagendar] = useState<PatientAppointment | null>(null)

    const handleReagendar = (appointment: PatientAppointment) => {
        setSelectedForReagendar(appointment)
        setCurrentPage('reagendar')
    }

    const renderContent = () => {
        switch (currentPage) {
            case 'inicio': return <HomeView onPageChange={setCurrentPage} mockHistorico={MOCK_HISTORICO} mockAgendamentos={MOCK_PATIENT_APPOINTMENTS} />
            case 'agenda': return <AgendaView onPageChange={setCurrentPage} mockAgendamentos={MOCK_PATIENT_APPOINTMENTS} onReagendar={handleReagendar} />
            case 'novo-agendamento': return <NovoAgendamentoView onPageChange={setCurrentPage} />
            case 'reagendar': return <ReagendarView onPageChange={setCurrentPage} appointment={selectedForReagendar} />
            case 'historico': return <HistoricoView onPageChange={setCurrentPage} mockHistorico={MOCK_HISTORICO} />
            case 'prescricoes': return <PrescricoesView onPageChange={setCurrentPage} mockPrescricoes={MOCK_PRESCRICOES} />
            case 'pagamentos': return <PagamentosView onPageChange={setCurrentPage} mockFaturas={MOCK_FATURAS} />
            case 'configuracoes': return <ConfiguracoesView onPageChange={setCurrentPage} />
            case 'gerenciar-cartoes': return <CartoesView onPageChange={setCurrentPage} />
            default: return <HomeView onPageChange={setCurrentPage} mockHistorico={MOCK_HISTORICO} mockAgendamentos={MOCK_PATIENT_APPOINTMENTS} />
        }
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-[#020817] overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                items={PATIENT_SIDEBAR_ITEMS}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    toggleSidebar={() => setIsSidebarOpen(true)}
                    currentPageTitle={PATIENT_SIDEBAR_ITEMS.find(i => i.id === currentPage)?.label || 'Início'}
                    onPageChange={setCurrentPage}
                    onLogout={onLogout}
                    notificationsOpen={notificationsOpen}
                    onNotificationsToggle={setNotificationsOpen}
                    userData={{
                        name: MOCK_PATIENT_PROFILE.name,
                        role: 'Paciente',
                        initials: MOCK_PATIENT_PROFILE.initials,
                        initialsBg: 'bg-gray-200 text-gray-700'
                    }}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto w-full">
                        {renderContent()}
                    </div>
                </main>
            </div>

            <NotificationsSheet
                open={notificationsOpen}
                onOpenChange={setNotificationsOpen}
                notifications={MOCK_NOTIFICATIONS}
            />
        </div>
    )
}
