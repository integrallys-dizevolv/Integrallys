import { useState } from 'react'
import { Sidebar, SidebarItem } from '@/components/global/Sidebar'
import { Header } from '@/components/global/Header'
import {
    Home, Calendar, Users, FileText, Pill, ClipboardList, Box, BarChart2, Settings,
    Stethoscope
} from 'lucide-react'
import { NotificationsSheet } from '@/components/global/NotificationsSheet'
import type { Notification } from '@/pages/admin/components/types'

// Views
import {
    DashboardView,
    AgendaPessoalView,
    PacientesView,
    ProntuarioView,
    PrescricoesView,
    EvolucoesView,
    EstoqueView,
    RelatoriosView,
    ConfiguracoesView,
    NovoPacienteView,
    VisualizarProntuarioView,
    AnamneseView,
    CriarAnamneseView,
    VisualizarEvolucaoView
} from '.'
// Mock Data for User
const specialistUser = {
    name: 'Dr. Roberto Santos',
    role: 'Especialista',
    initials: 'RS',
    initialsBg: 'bg-[#0039A6] text-white'
}

// Sidebar Items - Categorizado
const specialistSidebarItems: SidebarItem[] = [
    // ===== OPERACIONAL =====
    { id: 'cat-operacional', label: 'Operacional', icon: Home, type: 'category' },
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'pacientes', label: 'Pacientes', icon: Users },

    // ===== CLÍNICO =====
    { id: 'cat-clinico', label: 'Clínico', icon: Stethoscope, type: 'category' },
    { id: 'anamnese', label: 'Anamnese', icon: Stethoscope },
    { id: 'prontuario', label: 'Prontuário', icon: FileText },
    { id: 'prescricoes', label: 'Prescrição/Vendas', icon: Pill },
    { id: 'evolucoes', label: 'Evoluções Clínicas', icon: ClipboardList },
    { id: 'estoque', label: 'Estoque', icon: Box },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart2 },

    // ===== SISTEMA =====
    { id: 'cat-sistema', label: 'Sistema', icon: Settings, type: 'category' },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
]

export function PrincipalEspecialista({ onLogout }: { onLogout: () => void }) {
    const [currentPage, setCurrentPage] = useState('inicio')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)

    // Mock Notifications
    const mockNotifications: Notification[] = [
        {
            id: 1,
            title: 'Nova Consulta Agendada',
            description: 'Paciente Maria Silva agendou para amanhã às 14h.',
            date: 'Há 30 min',
            read: false
        },
        {
            id: 2,
            title: 'Lembrete de Reunião',
            description: 'Reunião clínica às 16h.',
            date: 'Há 2 horas',
            read: true
        }
    ]

    const renderContent = () => {
        switch (currentPage) {
            case 'inicio': return <DashboardView onPageChange={setCurrentPage} />
            case 'agenda': return <AgendaPessoalView onPageChange={setCurrentPage} />
            case 'pacientes': return <PacientesView onPageChange={setCurrentPage} />
            case 'prontuario': return <ProntuarioView onPageChange={setCurrentPage} />
            case 'anamnese': return <AnamneseView onPageChange={setCurrentPage} />
            case 'prescricoes': return <PrescricoesView onPageChange={setCurrentPage} />
            case 'evolucoes': return <EvolucoesView onPageChange={setCurrentPage} />
            case 'visualizar-evolucao': return <VisualizarEvolucaoView onPageChange={setCurrentPage} />
            case 'estoque': return <EstoqueView onPageChange={setCurrentPage} />
            case 'relatorios': return <RelatoriosView onPageChange={setCurrentPage} />
            case 'novo-paciente': return <NovoPacienteView onPageChange={setCurrentPage} />
            case 'visualizar-prontuario': return <VisualizarProntuarioView onPageChange={setCurrentPage} />
            case 'criar-anamnese': return <CriarAnamneseView onPageChange={setCurrentPage} />
            case 'configuracoes': return <ConfiguracoesView onPageChange={setCurrentPage} />
            default: return <DashboardView onPageChange={setCurrentPage} />
        }
    }

    return (
        <div className="flex h-screen bg-app-bg-secondary dark:bg-app-bg-dark overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                items={specialistSidebarItems}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    toggleSidebar={() => setIsSidebarOpen(true)}
                    currentPageTitle={specialistSidebarItems.find(i => i.id === currentPage)?.label || 'Início'}
                    onPageChange={setCurrentPage}
                    onLogout={onLogout}
                    notificationsOpen={notificationsOpen}
                    onNotificationsToggle={setNotificationsOpen}
                    userData={specialistUser}
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
                notifications={mockNotifications}
            />
        </div>
    )
}
