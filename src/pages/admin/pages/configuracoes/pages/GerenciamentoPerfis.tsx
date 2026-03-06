import { useState, useMemo } from 'react'
import { Search, Eye, Edit, Trash2, MoreVertical, Shield } from 'lucide-react'
import { SubNavigation } from '../components/SubNavigation'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/Breadcrumb'
import { GerenciarPerfisView } from './GerenciarPerfisView'
import type { User, Unit } from '../../../components/types'
import { UseTable } from '../components/UseTable'
import {
  PerfilModal,
  VisualizarPerfilModal,
  ExcluirPerfilModal
} from '../../permissoes/modals'
import { VisualizarUsuarioModal } from '../../usuarios/modals'
import { MOCK_PERFIS } from '@/mocks/gestor/perfis'
import { mockUnits } from '@/mocks/admin/unidades'
import type { PerfilPermissaoModal } from '@/types/permissoes'
import { useUsuariosAdmin } from '@/hooks/useUsuariosAdmin'

interface GerenciamentoPerfisProps {
  onPageChange?: (page: string) => void
}

const navigationItems = [
  { value: 'usuarios', label: 'Usuários' },
  { value: 'permissoes', label: 'Permissões' },
  { value: 'unidades', label: 'Unidades' },
  { value: 'gerenciar-perfis', label: 'Gerenciar perfis' },
]

export function GerenciamentoPerfis({ onPageChange }: GerenciamentoPerfisProps) {
  const { usuarios } = useUsuariosAdmin()
  const [activeTab, setActiveTab] = useState('usuarios')
  const [searchFilter, setSearchFilter] = useState('')
  const [moduleFilter, setModuleFilter] = useState('Todos')
  const [profileFilter, setProfileFilter] = useState('Todos')
  const [selectedItem, setSelectedItem] = useState<User | Unit | PerfilPermissaoModal | null>(null)

  // Modal States
  const [isPerfilModalOpen, setIsPerfilModalOpen] = useState(false)
  const [perfilModalMode, setPerfilModalMode] = useState<'add' | 'edit'>('add')
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isUserViewOpen, setIsUserViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const filteredUsers = useMemo(() => {
    return usuarios.filter(user => {
      const matchesSearch = searchFilter === '' ||
        user.nome.toLowerCase().includes(searchFilter.toLowerCase()) ||
        user.email.toLowerCase().includes(searchFilter.toLowerCase())
      const matchesProfile = profileFilter === 'Todos' ||
        user.perfil.toLowerCase() === profileFilter.toLowerCase()
      return matchesSearch && matchesProfile
    })
  }, [searchFilter, profileFilter, usuarios])

  const filteredPermissions = useMemo(() => {
    return MOCK_PERFIS.filter(permission => {
      const matchesSearch = searchFilter === '' ||
        permission.nome.toLowerCase().includes(searchFilter.toLowerCase()) ||
        permission.descricao.toLowerCase().includes(searchFilter.toLowerCase())
      // O MOCK_PERFIS não tem módulo, então ignoramos o moduleFilter por enquanto ou adaptamos
      return matchesSearch
    })
  }, [searchFilter])

  const filteredUnits = useMemo(() => {
    return mockUnits.filter(unit => {
      const matchesSearch = searchFilter === '' ||
        unit.nome.toLowerCase().includes(searchFilter.toLowerCase()) ||
        unit.cnpj?.toLowerCase().includes(searchFilter.toLowerCase())
      return matchesSearch
    })
  }, [searchFilter])

  const selectedProfile = useMemo<PerfilPermissaoModal | null>(() => {
    if (!selectedItem) return null
    if ('email' in selectedItem) {
      return {
        id: selectedItem.id,
        nome: selectedItem.nome,
        descricao: selectedItem.email,
      }
    }
    if ('endereco' in selectedItem) {
      return {
        id: selectedItem.id,
        nome: selectedItem.nome,
        descricao: selectedItem.endereco,
      }
    }
    return selectedItem
  }, [selectedItem])

  const selectedUser = selectedItem && 'email' in selectedItem ? selectedItem : null

  const userColumns = [
    { header: 'Nome', render: (u: User) => <span className="font-normal text-app-text-primary dark:text-white">{u.nome}</span> },
    { header: 'E-mail', render: (u: User) => <span className="text-[#1A1A1AB2] dark:text-[#c3cec9]">{u.email}</span> },
    {
      header: 'Perfil',
      render: (u: User) => (
        <Badge variant="outline" className="border-app-border dark:border-app-border-dark dark:text-white font-normal">
          {u.perfil}
        </Badge>
      )
    },
    {
      header: 'Unidade',
      render: (u: User) => (
        <button className="text-sm font-normal text-[#0039A6] dark:text-emerald-400 hover:underline">
          {u.unidade}
        </button>
      )
    },
    {
      header: 'Status',
      render: (u: User) => (
        <Badge className={u.status === 'Ativo'
          ? 'bg-emerald-600 dark:bg-emerald-900 text-white dark:text-emerald-100 border-none shadow-sm font-normal rounded-md px-3 py-1 whitespace-nowrap'
          : 'bg-gray-600 dark:bg-app-bg-dark text-white dark:text-gray-200 border-none shadow-sm font-normal rounded-md px-3 py-1 whitespace-nowrap'
        }>
          {u.status}
        </Badge>
      )
    },
    {
      header: 'Ações',
      className: 'text-right',
      render: (u: User) => (
        <TableActions
          onView={() => { setSelectedItem(u); setIsUserViewOpen(true); }}
          onEdit={() => { setSelectedItem(u); setPerfilModalMode('edit'); setIsPerfilModalOpen(true); }}
          onDelete={() => { setSelectedItem(u); setIsDeleteOpen(true); }}
        />
      )
    },
  ]

  const permissionColumns = [
    { header: 'Perfil', render: (p: PerfilPermissaoModal) => <span className="font-normal text-app-text-primary dark:text-white">{p.nome}</span> },
    {
      header: 'Descrição',
      render: (p: PerfilPermissaoModal) => <span className="text-[#1A1A1AB2] dark:text-[#c3cec9] max-w-xs block truncate">{p.descricao}</span>
    },
    {
      header: 'Escopo',
      render: (p: PerfilPermissaoModal) => (
        <Badge variant="secondary" className="bg-[#0039A6]/10 text-[#0039A6] dark:bg-[#0039A6]/20 dark:text-emerald-400 border-none font-normal">
          {p.escopo}
        </Badge>
      )
    },
    {
      header: 'Ações',
      className: 'text-right',
      render: (p: PerfilPermissaoModal) => (
        <TableActions
          onView={() => { setSelectedItem(p); setIsViewOpen(true); }}
          onEdit={() => { setSelectedItem(p); setPerfilModalMode('edit'); setIsPerfilModalOpen(true); }}
          onDelete={() => { setSelectedItem(p); setIsDeleteOpen(true); }}
        />
      )
    },
  ]

  const unitColumns = [
    { header: 'Nome', render: (un: Unit) => <span className="font-normal text-app-text-primary dark:text-white">{un.nome}</span> },
    { header: 'CNPJ', render: (un: Unit) => <span className="text-[#1A1A1AB2] dark:text-[#c3cec9]">{un.cnpj || 'N/A'}</span> },
    {
      header: 'Endereço',
      render: (un: Unit) => <span className="text-[#1A1A1AB2] dark:text-[#c3cec9] block max-w-[200px] truncate">{un.endereco}</span>
    },
    { header: 'Gestor', render: (un: Unit) => <span className="text-[#1A1A1AB2] dark:text-[#c3cec9]">{un.gestor}</span> },
    {
      header: 'Status',
      render: (un: Unit) => (
        <Badge className={
          un.status === 'Ativa'
            ? 'bg-emerald-600 dark:bg-emerald-900 text-white dark:text-emerald-100 border-none shadow-sm font-normal rounded-md px-3 py-1 whitespace-nowrap'
            : un.status === 'Em Manutenção'
              ? 'bg-orange-600 dark:bg-orange-900 text-white dark:text-orange-100 border-none shadow-sm font-normal rounded-md px-3 py-1 whitespace-nowrap'
              : 'bg-gray-600 dark:bg-app-bg-dark text-white dark:text-gray-200 border-none shadow-sm font-normal rounded-md px-3 py-1 whitespace-nowrap'
        }>
          {un.status}
        </Badge>
      )
    },
    {
      header: 'Ações',
      className: 'text-right',
      render: (un: Unit) => (
        <TableActions
          onView={() => { setSelectedItem(un); setIsViewOpen(true); }}
          onEdit={() => { setSelectedItem(un); setPerfilModalMode('edit'); setIsPerfilModalOpen(true); }}
          onDelete={() => { setSelectedItem(un); setIsDeleteOpen(true); }}
        />
      )
    },
  ]

  const getActiveTabLabel = () => {
    const tabMap: Record<string, string> = {
      'usuarios': 'Usuários',
      'permissoes': 'Permissões',
      'unidades': 'Unidades',
      'gerenciar-perfis': 'Gerenciar perfis',
    }
    return tabMap[activeTab] || 'Permissões'
  }

  return (
    <div className="space-y-6 min-h-screen bg-transparent dark:bg-app-bg-dark transition-colors duration-300">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => onPageChange?.('inicio')}
              className="cursor-pointer text-[#1A1A1AB2] dark:text-[#c3cec9] hover:text-[#0039A6] dark:hover:text-white"
            >
              Início
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => onPageChange?.('permissoes')}
              className="cursor-pointer text-[#1A1A1AB2] dark:text-[#c3cec9] hover:text-[#0039A6] dark:hover:text-white"
            >
              Permissões
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-app-text-primary dark:text-white font-normal">
              {getActiveTabLabel()}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-[#0039A6] dark:text-white" />
          <h1 className="text-2xl font-normal text-app-text-primary dark:text-white">
            Gerenciamento de Perfis de Acesso
          </h1>
        </div>
        <p className="text-[#1A1A1AB2] dark:text-[#c3cec9] ml-9 font-normal">
          Configure as permissões granulares para cada perfil de usuário no sistema Integrallys.
        </p>
      </div>

      <SubNavigation
        items={navigationItems}
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val)
          setSearchFilter('')
        }}
      />

      {activeTab !== 'gerenciar-perfis' && (
        <div className="flex flex-col lg:flex-row items-stretch gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="relative w-full lg:w-[480px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-app-text-muted dark:text-[#c3cec9]" />
            <Input
              placeholder={
                activeTab === 'usuarios' ? 'Buscar usuários por nome ou e-mail...' :
                  activeTab === 'unidades' ? 'Buscar unidades por nome ou CNPJ...' :
                    'Buscar perfis por nome ou descrição...'
              }
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-11 font-normal w-full"
            />
          </div>

          {activeTab === 'usuarios' && (
            <Select value={profileFilter} onValueChange={setProfileFilter}>
              <SelectTrigger className="w-full sm:w-60 lg:w-72">
                <SelectValue preferPlaceholder placeholder="Todos os perfis" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-app-border dark:border-app-border-dark">
                <SelectItem value="Todos">Todos os perfis</SelectItem>
                <SelectItem value="Administrador">Administrador</SelectItem>
                <SelectItem value="Médico">Médico</SelectItem>
                <SelectItem value="Recepcionista">Recepcionista</SelectItem>
              </SelectContent>
            </Select>
          )}

          {activeTab === 'permissoes' && (
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-full sm:w-60 lg:w-72">
                <SelectValue preferPlaceholder placeholder="Filtrar por módulo" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-app-border dark:border-app-border-dark">
                <SelectItem value="Todos">Todos os módulos</SelectItem>
                <SelectItem value="Agenda">Agenda</SelectItem>
                <SelectItem value="Gestão">Gestão</SelectItem>
                <SelectItem value="Prontuário">Prontuário</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      <div className="mt-6">
        {activeTab === 'usuarios' && (
          <UseTable
            data={filteredUsers}
            columns={userColumns}
            rowKey={(u) => u.id}
            emptyMessage="Nenhum usuário encontrado."
          />
        )}
        {activeTab === 'permissoes' && (
          <UseTable
            data={filteredPermissions}
            columns={permissionColumns}
            rowKey={(p) => p.id}
            emptyMessage="Nenhum perfil encontrado."
          />
        )}
        {activeTab === 'unidades' && (
          <UseTable
            data={filteredUnits}
            columns={unitColumns}
            rowKey={(un) => un.id}
            emptyMessage="Nenhuma unidade encontrada."
          />
        )}
        {activeTab === 'gerenciar-perfis' && <GerenciarPerfisView />}
      </div>

      {/* Modais de Ação */}
      <PerfilModal
        isOpen={isPerfilModalOpen}
        onClose={setIsPerfilModalOpen}
        profile={selectedProfile}
        mode={perfilModalMode}
      />

      <VisualizarPerfilModal
        isOpen={isViewOpen}
        onClose={setIsViewOpen}
        profile={selectedProfile}
      />

      <VisualizarUsuarioModal
        isOpen={isUserViewOpen}
        onClose={setIsUserViewOpen}
        user={selectedUser}
      />

      <ExcluirPerfilModal
        isOpen={isDeleteOpen}
        onClose={setIsDeleteOpen}
        profile={selectedProfile}
        onConfirm={(id) => {
          void id
          setIsDeleteOpen(false)
        }}
      />
    </div>
  )
}

function TableActions({ onView, onEdit, onDelete }: { onView?: () => void, onEdit?: () => void, onDelete?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#0039A6]/10 dark:hover:bg-app-card/10 rounded-lg">
          <MoreVertical className="h-4 w-4 text-[#1A1A1AB2] dark:text-[#c3cec9]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dark:bg-[#0c1e3d] dark:border-app-border-dark rounded-xl shadow-xl">
        <DropdownMenuItem onClick={onView} className="dark:text-white dark:hover:bg-[#0039A6] cursor-pointer">
          <Eye className="h-4 w-4 mr-2" />
          Visualizar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit} className="dark:text-white dark:hover:bg-[#0039A6] cursor-pointer">
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600 dark:text-red-400 dark:hover:bg-red-900/20 cursor-pointer">
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
