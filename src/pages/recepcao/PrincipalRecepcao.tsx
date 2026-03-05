import React, { useMemo, useState } from 'react'
import {
    LayoutDashboard, Calendar, Users, Wallet, CreditCard,
    FileText, Package, Boxes, Clock, BarChart3, Settings
} from 'lucide-react'
import { DashboardView } from './ui/DashboardView'
import { AgendaView } from './pages/agenda/AgendaView'
import { PacientesView } from './pages/pacientes/PacientesView'
import { CaixaView } from './pages/caixa/CaixaView'
import { RecebimentosView } from './pages/recebimentos/RecebimentosView'
import { PrescricoesView } from './pages/prescricoes/PrescricoesView'
import { EstoqueView } from './pages/estoque/EstoqueView'
import { SuprimentosView } from './pages/suprimentos/SuprimentosView'
import { ListaEsperaView } from './pages/lista/ListaEsperaView'
import { RelatoriosView } from './pages/relatorios/RelatoriosView'

// Removed RepasseView import
// Removed ArrowLeftRight import

import { ConfiguracoesView } from './pages/configuracoes/ConfiguracoesView'

// Global Components
import { Sidebar, SidebarItem } from '../../components/global/Sidebar'
import { Header } from '../../components/global/Header'
import { NotificationsSheet } from '../../components/global/NotificationsSheet'
import { Notification } from '../admin/components/types'
import { loadRetornosAlerts } from '@/utils/retornosFollowup'

export const PrincipalRecepcao = ({ onLogout }: { onLogout: () => void }) => {
    const [activePage, setActivePage] = useState('inicio')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)

    const menuItems: SidebarItem[] = [
        // ===== OPERACIONAL =====
        { id: 'cat-operacional', label: 'Operacional', icon: LayoutDashboard, type: 'category' },
        { id: 'inicio', label: 'Início', icon: LayoutDashboard },
        { id: 'agenda', label: 'Agenda', icon: Calendar },
        { id: 'pacientes', label: 'Pacientes', icon: Users },
        { id: 'prescricoes', label: 'Prescrição/Vendas', icon: FileText },
        { id: 'estoque', label: 'Estoque', icon: Package },
        { id: 'suprimentos', label: 'Suprimentos', icon: Boxes },
        { id: 'espera', label: 'Lista de espera', icon: Clock },

        // ===== FINANCEIRO =====
        { id: 'cat-financeiro', label: 'Financeiro', icon: Wallet, type: 'category' },
        { id: 'caixa', label: 'Caixa', icon: Wallet },
        { id: 'recebimentos', label: 'Recebimentos', icon: CreditCard },

        // ===== SISTEMA =====
        { id: 'cat-sistema', label: 'Sistema', icon: Settings, type: 'category' },
        { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
        { id: 'settings', label: 'Configurações', icon: Settings },
    ]

    const baseNotifications: Notification[] = [
        { id: 1, title: 'Confirmação pendente', description: 'Paciente João Silva aguardando confirmação', date: '5min atrás', read: false },
        { id: 2, title: 'Novo agendamento', description: 'Dra. Ana agendou retorno para Maria', date: '20min atrás', read: false },
        { id: 3, title: 'Lembrete de estoque', description: 'Baixo estoque de luvas descartáveis', date: '1h atrás', read: true },
    ]

    const mergedNotifications = useMemo(() => {
        const runtimeAlerts = loadRetornosAlerts()
            .filter((item) => item.profile === 'recepcao')
            .map((item, index) => ({
                id: 1000 + index,
                title: item.title,
                description: item.description,
                date: item.date,
                read: item.read,
            }))

        return [...runtimeAlerts, ...baseNotifications]
    }, [notificationsOpen])

    const renderPage = () => {
        switch (activePage) {
            case 'inicio': return <DashboardView onPageChange={setActivePage} />
            case 'agenda': return <AgendaView />
            case 'pacientes': return <PacientesView onPageChange={setActivePage} />
            case 'caixa': return <CaixaView onPageChange={setActivePage} />
            case 'recebimentos': return <RecebimentosView onPageChange={setActivePage} />
            case 'prescricoes': return <PrescricoesView onPageChange={setActivePage} />
            case 'estoque': return <EstoqueView onPageChange={setActivePage} />
            case 'suprimentos': return <SuprimentosView onPageChange={setActivePage} />
            case 'espera': return <ListaEsperaView onPageChange={setActivePage} />
            case 'relatorios': return <RelatoriosView onPageChange={setActivePage} />

            case 'settings': return <ConfiguracoesView onPageChange={setActivePage} />
            default: return <DashboardView onPageChange={setActivePage} />
        }
    }

    const getCurrentPageTitle = () => {
        return menuItems.find(item => item.id === activePage)?.label || 'Integrallys'
    }




    return (
        <div className="flex h-screen bg-app-bg-secondary dark:bg-app-bg-dark overflow-hidden">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                currentPage={activePage}
                onPageChange={setActivePage}
                items={menuItems}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    toggleSidebar={() => setIsSidebarOpen(true)}
                    currentPageTitle={getCurrentPageTitle()}
                    onPageChange={setActivePage}
                    onLogout={onLogout}
                    notificationsOpen={notificationsOpen}
                    onNotificationsToggle={setNotificationsOpen}
                    userData={{
                        name: 'Luciana Soares',
                        role: 'Recepção',
                        initials: 'LS',
                        imageUrl: 'https://ui-avatars.com/api/?name=Luciana+Soares&background=0039A6&color=fff'
                    }}
                />

                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <div className="max-w-[1400px] mx-auto">
                        {renderPage()}
                    </div>
                </main>
            </div>

            <NotificationsSheet
                open={notificationsOpen}
                onOpenChange={setNotificationsOpen}
                notifications={mergedNotifications}
            />
        </div>
    )
}
