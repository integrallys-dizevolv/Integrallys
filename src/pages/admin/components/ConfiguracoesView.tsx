import { useState } from 'react'
import { Shield } from 'lucide-react'
import { SubNavigation } from '../pages/configuracoes/components/SubNavigation'
import { PermissoesTable } from '../pages/permissoes/components/PermissoesTable'
import { UnidadesTable } from '../pages/unidades/components/UnidadesTable'
import { GerenciarPerfisView } from '../pages/configuracoes/pages/GerenciarPerfisView'
import { UsuariosAdmin } from '@/components/features/admin/UsuariosAdmin'

interface ConfiguracoesViewProps {
  onPageChange?: (page: string) => void
}

const navigationItems = [
  { value: 'usuarios', label: 'Usuários' },
  { value: 'permissoes', label: 'Permissões' },
  { value: 'unidades', label: 'Unidades' },
  { value: 'gerenciar-perfis', label: 'Gerenciar Perfis' },
]

export function ConfiguracoesView({ onPageChange }: ConfiguracoesViewProps) {
  const [activeTab, setActiveTab] = useState('usuarios')

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-[#0039A6] dark:text-white" />
          <h1 className="text-2xl font-bold text-app-text-primary dark:text-white">
            Gerenciamento de Perfis de Acesso
          </h1>
        </div>
        <p className="text-app-text-secondary dark:text-white/40 ml-9">
          Configure as permissões granulares para cada perfil do sistema
        </p>
      </div>

      <SubNavigation
        items={navigationItems}
        value={activeTab}
        onValueChange={setActiveTab}
      />

      {activeTab === 'usuarios' && (
        <div className="mt-6">
          <UsuariosAdmin onPageChange={onPageChange} />
        </div>
      )}

      {activeTab === 'permissoes' && (
        <div className="mt-6">
          <PermissoesTable onPageChange={onPageChange} />
        </div>
      )}

      {activeTab === 'unidades' && (
        <div className="mt-6">
          <UnidadesTable onPageChange={onPageChange} />
        </div>
      )}

      {activeTab === 'gerenciar-perfis' && (
        <div className="mt-6">
          <GerenciarPerfisView />
        </div>
      )}
    </div>
  )
}
