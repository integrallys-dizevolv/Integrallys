import { useState } from 'react'
import { Sidebar } from '@/components/global/Sidebar'
import { Header } from '@/components/global/Header'
import { NotificationsSheet } from '@/components/global/NotificationsSheet'
import { MOCK_NOTIFICATIONS } from '@/mocks/gestor/notifications'
import { GESTOR_SIDEBAR_ITEMS } from '@/mocks/gestor/sidebar'

import { DashboardView } from './components/DashboardView'
import { AgendaGlobalView } from './pages/agenda/AgendaGlobalView'
import { FinanceiroView } from './pages/financeiro/FinanceiroView'
import { EstoqueView } from './pages/estoque/EstoqueView'
import { PermissoesView } from './pages/permissoes/PermissoesView'
import { UnidadesView } from './pages/unidades/UnidadesView'
import { ListaEsperaView } from '../recepcao/pages/lista/ListaEsperaView'
import { PacientesView } from './pages/paciente/PacientesView'

import { VendasView } from './pages/vendas/VendasView'
import { RepasseView } from '../admin/pages/repasse/RepasseView'
import { ConfiguracoesView } from './pages/configuracoes/ConfiguracoesView'
import { RelatoriosView } from './pages/relatorios/RelatoriosView'
import { RecebimentosView } from './pages/recebimento/RecebimentosView'
import { PagamentosView } from './pages/pagamentos/PagamentosView'
import { DocumentacaoClinicaView } from './pages/documentacao/DocumentacaoClinicaView'
import { UsuariosView } from './pages/usuarios/UsuariosView'

// Views (Placeholder for now)

export function PrincipalGestor({ onLogout }: { onLogout: () => void }) {
    const [currentPage, setCurrentPage] = useState('inicio')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)


    const renderContent = () => {
        switch (currentPage) {
            case 'inicio': return <DashboardView />
            case 'usuarios': return <UsuariosView />
            case 'unidades': return <UnidadesView onPageChange={setCurrentPage} />
            case 'permissoes': return <PermissoesView />
            case 'agenda': return <AgendaGlobalView onPageChange={setCurrentPage} />
            case 'pacientes': return <PacientesView onPageChange={setCurrentPage} />
            case 'espera': return <ListaEsperaView />
            case 'vendas': return <VendasView onPageChange={setCurrentPage} />
            case 'estoque': return <EstoqueView onPageChange={setCurrentPage} />
            case 'financeiro': return <FinanceiroView onPageChange={setCurrentPage} />
            case 'recebimento': return <RecebimentosView onPageChange={setCurrentPage} />
            case 'pagamento': return <PagamentosView onPageChange={setCurrentPage} />
            case 'repasse': return <RepasseView onPageChange={setCurrentPage} />
            case 'documentacao': return <DocumentacaoClinicaView onPageChange={setCurrentPage} />
            case 'relatorios': return <RelatoriosView onPageChange={setCurrentPage} />
            case 'configuracoes': return <ConfiguracoesView onPageChange={setCurrentPage} />
            default: return <DashboardView />
        }
    }

    return (
        <div className="flex h-screen bg-app-bg-secondary dark:bg-[#020817] overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                items={GESTOR_SIDEBAR_ITEMS}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    toggleSidebar={() => setIsSidebarOpen(true)}
                    currentPageTitle={GESTOR_SIDEBAR_ITEMS.find(i => i.id === currentPage)?.label || 'Início'}
                    onPageChange={setCurrentPage}
                    onLogout={onLogout}
                    notificationsOpen={notificationsOpen}
                    onNotificationsToggle={setNotificationsOpen}
                    userData={{
                        name: 'Gestor Integrallys',
                        role: 'Gestor de Unidade',
                        initials: 'GU',
                        initialsBg: 'bg-[#0039A6] text-white'
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
