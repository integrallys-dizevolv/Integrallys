import { useState } from 'react'
import { Sidebar, SidebarItem } from '@/components/global/Sidebar'
import { Header } from '@/components/global/Header'
import { NotificationsSheet } from '@/components/global/NotificationsSheet'
import type { Notification } from '@/pages/admin/components/types'
import {
    Home, Calendar, Users, Wallet, CreditCard, FileText, Package, Clock,
    BarChart2, Settings, Stethoscope, Activity, ClipboardList,
    Shield, Building2, FileCheck, ArrowLeftRight
} from 'lucide-react'

// ========== VIEWS - RECEPÇÃO ==========
import { DashboardView as RecepDashboardView } from '@/pages/recepcao/ui/DashboardView'
import { AgendaView as RecepAgendaView } from '@/pages/recepcao/pages/agenda/AgendaView'
import { PacientesView as RecepPacientesView } from '@/pages/recepcao/pages/pacientes/PacientesView'
import { CaixaView } from '@/pages/recepcao/pages/caixa/CaixaView'
import { RecebimentosView as RecepRecebimentosView } from '@/pages/recepcao/pages/recebimentos/RecebimentosView'
import { PrescricoesView as RecepPrescricoesView } from '@/pages/recepcao/pages/prescricoes/PrescricoesView'
import { EstoqueView as RecepEstoqueView } from '@/pages/recepcao/pages/estoque/EstoqueView'
import { ListaEsperaView } from '@/pages/recepcao/pages/lista/ListaEsperaView'
import { NovoPacienteView as RecepNovoPacienteView } from '@/pages/recepcao/pages/pacientes/pages/NovoPacienteView'

// ========== VIEWS - ESPECIALISTA ==========
import {
    AnamneseView,
    ProntuarioView,
    EvolucoesView,
    VisualizarEvolucaoView,
    CriarAnamneseView,
    VisualizarProntuarioView
} from '@/pages/especialista'

// ========== VIEWS - ADMIN ==========
import { UsuariosView } from '@/pages/admin/pages/usuarios/UsuariosView'
import { PermissoesView } from '@/pages/admin/pages/permissoes/PermissoesView'
import { UnidadesView } from '@/pages/admin/pages/unidades/UnidadesView'
import { ConfiguracoesView as AdminConfiguracoesView } from '@/pages/admin/pages/configuracoes/ConfiguracoesView'
import { RelatoriosView as AdminRelatoriosView } from '@/pages/admin/pages/relatorios/RelatoriosView'
import { AuditoriaView } from '@/pages/admin/pages/auditoria/AuditoriaView'
import { FinanceiroView } from '@/pages/admin/pages/financeiro/FinanceiroView'
import { RepasseView } from '@/pages/admin/pages/repasse/RepasseView'

// ========== SIDEBAR ITEMS - CATEGORIZADOS ==========
const masterSidebarItems: SidebarItem[] = [
    // ===== OPERACIONAL =====
    { id: 'cat-operacional', label: 'Operacional', icon: Home, type: 'category' },
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'pacientes', label: 'Pacientes', icon: Users },
    { id: 'caixa', label: 'Caixa', icon: Wallet },
    { id: 'recebimentos', label: 'Recebimentos', icon: CreditCard },
    { id: 'prescricoes', label: 'Prescrição/Vendas', icon: FileText },
    { id: 'estoque', label: 'Estoque', icon: Package },
    { id: 'espera', label: 'Lista de Espera', icon: Clock },

    // ===== CLÍNICO =====
    { id: 'cat-clinico', label: 'Clínico', icon: Stethoscope, type: 'category' },
    { id: 'anamnese', label: 'Anamnese', icon: ClipboardList },
    { id: 'prontuario', label: 'Prontuário', icon: FileText },
    { id: 'evolucoes', label: 'Evoluções Clínicas', icon: Activity },

    // ===== ADMINISTRATIVO =====
    { id: 'cat-admin', label: 'Administrativo', icon: Shield, type: 'category' },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'permissoes', label: 'Permissões', icon: Shield },
    { id: 'unidades', label: 'Unidades', icon: Building2 },
    { id: 'financeiro', label: 'Financeiro', icon: Wallet },
    { id: 'repasse', label: 'Repasse', icon: ArrowLeftRight },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart2 },
    { id: 'auditoria', label: 'Auditoria', icon: FileCheck },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
]


// Mock user data
const masterUser = {
    name: 'Master Integrallys',
    role: 'Master',
    initials: 'MI',
    initialsBg: 'bg-gradient-to-br from-[#0039A6] to-[#1a5c3e] text-white'
}

export function PrincipalMasterUnified({ onLogout }: { onLogout: () => void }) {
    const [currentPage, setCurrentPage] = useState('inicio')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)

    const mockNotifications: Notification[] = [
        {
            id: 1,
            title: 'Novo Agendamento',
            description: 'Paciente Maria Silva agendou consulta.',
            date: 'Há 10 min',
            read: false
        },
        {
            id: 2,
            title: 'Alerta de Estoque',
            description: 'Estoque baixo: Vitamina D3',
            date: 'Há 1 hora',
            read: false
        }
    ]

    const getCurrentPageTitle = () => {
        const navigableItems = masterSidebarItems.filter(item => item.type !== 'category')
        const item = navigableItems.find(i => i.id === currentPage)
        return item?.label || 'Início'
    }

    const renderContent = () => {
        switch (currentPage) {
            // ===== OPERACIONAL =====
            case 'inicio':
                return <RecepDashboardView onPageChange={setCurrentPage} />
            case 'agenda':
                return <RecepAgendaView />
            case 'pacientes':
                return <RecepPacientesView onPageChange={setCurrentPage} />
            case 'caixa':
                return <CaixaView />
            case 'recebimentos':
                return <RecepRecebimentosView />
            case 'prescricoes':
                return <RecepPrescricoesView />
            case 'estoque':
                return <RecepEstoqueView />
            case 'espera':
                return <ListaEsperaView />
            case 'novo-paciente':
                return <RecepNovoPacienteView onPageChange={setCurrentPage} />

            // ===== CLÍNICO =====
            case 'anamnese':
                return <AnamneseView onPageChange={setCurrentPage} />
            case 'prontuario':
                return <ProntuarioView onPageChange={setCurrentPage} />
            case 'evolucoes':
                return <EvolucoesView onPageChange={setCurrentPage} />
            case 'visualizar-evolucao':
                return <VisualizarEvolucaoView onPageChange={setCurrentPage} />
            case 'criar-anamnese':
                return <CriarAnamneseView onPageChange={setCurrentPage} />
            case 'visualizar-prontuario':
                return <VisualizarProntuarioView onPageChange={setCurrentPage} />

            // ===== ADMINISTRATIVO =====
            case 'usuarios':
                return <UsuariosView onPageChange={setCurrentPage} />
            case 'permissoes':
                return <PermissoesView onPageChange={setCurrentPage} view="lista" />
            case 'gerenciar-perfis':
                return <PermissoesView onPageChange={setCurrentPage} view="gerenciar" />
            case 'unidades':
                return <UnidadesView onPageChange={setCurrentPage} />
            case 'financeiro':
                return <FinanceiroView setCurrentPage={setCurrentPage} />
            case 'repasse':
                return <RepasseView onPageChange={setCurrentPage} />
            case 'relatorios':
                return <AdminRelatoriosView setCurrentPage={setCurrentPage}/>
            case 'auditoria':
                return <AuditoriaView setCurrentPage={setCurrentPage} />
            case 'configuracoes':
                return <AdminConfiguracoesView onPageChange={setCurrentPage} />

            default:
                return <RecepDashboardView onPageChange={setCurrentPage} />
        }
    }


    return (
        <div className="flex h-screen bg-gray-50 dark:bg-[#020817] overflow-hidden">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                items={masterSidebarItems}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    toggleSidebar={() => setIsSidebarOpen(true)}
                    currentPageTitle={getCurrentPageTitle()}
                    onPageChange={setCurrentPage}
                    onLogout={onLogout}
                    notificationsOpen={notificationsOpen}
                    onNotificationsToggle={setNotificationsOpen}
                    userData={masterUser}
                />

                <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="max-w-[1400px] mx-auto">
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
