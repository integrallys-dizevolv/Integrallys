import { useState } from 'react'
import { Sidebar } from '../../components/global/Sidebar'
import { Header } from '../../components/global/Header'
import { DashboardCards } from './components/DashboardCards'
import { DashboardActivity } from './components/DashboardActivity'
import { NotificationsSheet } from '../../components/global/NotificationsSheet'
import { ConfiguracoesView } from './pages/configuracoes/ConfiguracoesView'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/Breadcrumb'
import { RelatoriosView } from './pages/relatorios/RelatoriosView'
import { AuditoriaView } from './pages/auditoria/AuditoriaView'
import { RepasseView } from './pages/repasse/RepasseView'
import { MOCK_NOTIFICATIONS } from '@/mocks/admin/notifications'
import { AgendaAdmin } from '@/components/features/admin/AgendaAdmin'
import { UsuariosAdmin } from '@/components/features/admin/UsuariosAdmin'
import { PermissoesAdmin } from '@/components/features/admin/PermissoesAdmin'
import { UnidadesAdmin } from '@/components/features/admin/UnidadesAdmin'
import { FinanceiroAdmin } from '@/components/features/admin/FinanceiroAdmin'
import { RelatorioTarefasView } from '@/pages/gestor/pages/tarefas/RelatorioTarefasView'


export function PrincipalAdmin({ onLogout }: { onLogout: () => void }) {
  const [currentPage, setCurrentPage] = useState('inicio')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)



  const getCurrentPageTitle = () => {
    const titles: Record<string, string> = {
      inicio: 'Início',
      usuarios: 'Usuários',
      permissoes: 'Permissões',
      'gerenciar-perfis': 'Gerenciar Perfis',
      unidades: 'Unidades',
      agenda: 'Agenda',
      relatorios: 'Relatórios',
      financeiro: 'Financeiro',
      repasse: 'Repasse',
      'tarefas-relatorio': 'Relatório de Tarefas',
      auditoria: 'Log de Auditoria',
      configuracoes: 'Configurações',
    }
    return titles[currentPage] || 'Início'
  }

  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Início</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <DashboardCards />
        <DashboardActivity />
      </div>
    )
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'inicio':
        return renderDashboard()
      case 'usuarios':
        return <UsuariosAdmin onPageChange={setCurrentPage} />
      case 'permissoes':
        return <PermissoesAdmin onPageChange={setCurrentPage} view="lista" />
      case 'gerenciar-perfis':
        return <PermissoesAdmin onPageChange={setCurrentPage} view="gerenciar" />
      case 'unidades':
        return <UnidadesAdmin onPageChange={setCurrentPage} />
      case 'agenda':
        return <AgendaAdmin setCurrentPage={setCurrentPage} />
      case 'relatorios':
        return <RelatoriosView />
      case 'financeiro':
        return <FinanceiroAdmin setCurrentPage={setCurrentPage} />
      case 'tarefas-relatorio':
        return <RelatorioTarefasView onPageChange={setCurrentPage} perfil="admin" />
      case 'repasse':
        return <RepasseView onPageChange={setCurrentPage} />
      case 'auditoria':
        return <AuditoriaView setCurrentPage={setCurrentPage} />
      case 'configuracoes':
        return <ConfiguracoesView onPageChange={setCurrentPage} />
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="flex h-screen bg-app-bg-secondary dark:bg-app-bg-dark overflow-hidden">
      {
        isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />)}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentPage={currentPage} onPageChange={setCurrentPage} />


      <div className="flex-1 flex flex-col min-w-0">
        <Header
          toggleSidebar={() => setIsSidebarOpen(true)}
          currentPageTitle={getCurrentPageTitle()}
          onPageChange={setCurrentPage}
          onLogout={onLogout}
          notificationsOpen={notificationsOpen}
          onNotificationsToggle={setNotificationsOpen}
          userData={{
            name: 'Admin Integrallys',
            role: 'Administrador',
            initials: 'AD',
            initialsBg: 'bg-[#0039A6] text-white'
          }}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
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
