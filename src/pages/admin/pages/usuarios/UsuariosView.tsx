import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import type { User } from '../../components/types'

// Reusable Components
import { UserTable } from './components/UserTable'
import { mockUsers } from '@/mocks/admin/users'

// Modals
import {
  UsuarioModal,
  VisualizarUsuarioModal,
  PermissoesUsuarioModal,
  ExcluirUsuarioModal
} from './modals'

interface UsuariosViewProps {
  onPageChange?: (page: string) => void
  users?: User[]
  loading?: boolean
  error?: string | null
  onSaveUser?: (user: User) => Promise<void> | void
  onDeleteUser?: (id: number) => Promise<void> | void
}

export function UsuariosView({
  onPageChange,
  users = mockUsers,
  loading = false,
  error = null,
  onSaveUser,
  onDeleteUser,
}: UsuariosViewProps) {
  const [userFilter, setUserFilter] = useState('')
  const [userProfileFilter, setUserProfileFilter] = useState('todos')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Modal States
  const [isUsuarioModalOpen, setIsUsuarioModalOpen] = useState(false)
  const [usuarioModalMode, setUsuarioModalMode] = useState<'add' | 'edit'>('add')
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchesSearch = userFilter === '' ||
      user.nome.toLowerCase().includes(userFilter.toLowerCase()) ||
      user.email.toLowerCase().includes(userFilter.toLowerCase())

    const matchesProfile = userProfileFilter === 'todos' ||
      user.perfil.toLowerCase() === userProfileFilter.toLowerCase()

    return matchesSearch && matchesProfile
  })

  const handleOpenAdd = () => {
    setSelectedUser(null)
    setUsuarioModalMode('add')
    setIsUsuarioModalOpen(true)
  }

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user)
    setUsuarioModalMode('edit')
    setIsUsuarioModalOpen(true)
  }

  const handleOpenView = (user: User) => {
    setSelectedUser(user)
    setIsViewOpen(true)
  }

  const handleOpenPermissions = (user: User) => {
    setSelectedUser(user)
    setIsPermissionsOpen(true)
  }

  const handleOpenDelete = (user: User) => {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Original */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => onPageChange?.('inicio')}
              className="cursor-pointer hover:text-[#0039A6] dark:hover:text-white"
            >
              Início
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Usuários</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Original */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        <div className="flex flex-col lg:flex-row items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 w-full lg:w-auto">
          <div className="relative w-full lg:w-[480px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-app-text-muted dark:text-white/60" />
            <Input
              placeholder="Buscar usuário por nome ou e-mail..."
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="pl-11 font-normal w-full"
            />
          </div>

          <Select value={userProfileFilter} onValueChange={setUserProfileFilter}>
            <SelectTrigger className="w-full sm:w-60 lg:w-72">
              <SelectValue preferPlaceholder placeholder="Filtrar por perfil">
                {userProfileFilter === 'todos' ? 'Todos os perfis' :
                  userProfileFilter === 'administrador' ? 'Administrador' :
                    userProfileFilter === 'medico' ? 'Médico' :
                      userProfileFilter === 'especialista' ? 'Especialista' :
                        userProfileFilter === 'paciente' ? 'Paciente' : 'Filtrar por perfil'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-app-border dark:border-app-border-dark">
              <SelectItem value="todos">Todos os perfis</SelectItem>
              <SelectItem value="administrador">Administrador</SelectItem>
              <SelectItem value="medico">Médico</SelectItem>
              <SelectItem value="especialista">Especialista</SelectItem>
              <SelectItem value="paciente">Paciente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="h-11 px-6 bg-[#0039A6] hover:bg-[#1a3329] text-white rounded-xl flex items-center justify-center gap-2 shadow-sm shrink-0 whitespace-nowrap font-normal"
        >
          <Plus className="h-5 w-5" />
          <span>Adicionar usuário</span>
        </Button>
      </div>

      {/* Tabela de Usuários (Layout Original) */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <UserTable
        users={filteredUsers}
        loading={loading}
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onPermissions={handleOpenPermissions}
        onDelete={handleOpenDelete}
      />

      {/* Modals (Layout Original) */}
      <UsuarioModal
        isOpen={isUsuarioModalOpen}
        onClose={setIsUsuarioModalOpen}
        user={selectedUser}
        mode={usuarioModalMode}
        onSave={onSaveUser}
      />

      <VisualizarUsuarioModal
        isOpen={isViewOpen}
        onClose={setIsViewOpen}
        user={selectedUser}
      />

      <PermissoesUsuarioModal
        isOpen={isPermissionsOpen}
        onClose={setIsPermissionsOpen}
        user={selectedUser}
      />

      <ExcluirUsuarioModal
        isOpen={isDeleteOpen}
        onClose={setIsDeleteOpen}
        user={selectedUser}
        onConfirm={onDeleteUser}
      />
    </div>
  )
}
