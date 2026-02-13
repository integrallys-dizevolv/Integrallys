import { useState, useMemo } from 'react'
import { Plus, Search, Shield, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { GerenciamentoPerfis } from '../configuracoes/pages/GerenciamentoPerfis'
import { Permission } from '../../components/types'
import {
  PerfilModal,
  VisualizarPerfilModal,
  ExcluirPerfilModal
} from './modals'
import { MOCK_PERFIS } from '@/mocks/gestor/perfis'

interface PermissoesViewProps {
  onPageChange?: (page: string) => void
  view?: 'lista' | 'gerenciar'
}

export function PermissoesView({ onPageChange, view = 'lista' }: PermissoesViewProps) {
  const [searchFilter, setSearchFilter] = useState('')
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null)

  // Modal States
  const [isPerfilModalOpen, setIsPerfilModalOpen] = useState(false)
  const [perfilModalMode, setPerfilModalMode] = useState<'add' | 'edit'>('add')
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const filteredPermissions = useMemo(() => {
    return MOCK_PERFIS.filter(permission => {
      const matchesSearch = searchFilter === '' ||
        permission.nome.toLowerCase().includes(searchFilter.toLowerCase()) ||
        permission.descricao.toLowerCase().includes(searchFilter.toLowerCase())
      return matchesSearch
    })
  }, [searchFilter])

  if (view === 'gerenciar') {
    return <GerenciamentoPerfis onPageChange={onPageChange} />
  }

  return (
    <div className="space-y-6 min-h-screen dark:bg-app-bg-dark p-1 transition-colors duration-300">
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
            <BreadcrumbPage>Permissões</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        <div className="relative w-full lg:w-[480px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-app-text-muted dark:text-app-text-muted" />
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-11 font-normal w-full"
          />
        </div>

        <div className="flex gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={() => onPageChange?.('gerenciar-perfis')}
            className="h-11 px-6 rounded-xl flex items-center gap-2 whitespace-nowrap font-normal"
          >
            <Shield className="h-5 w-5" />
            Gerenciar perfis
          </Button>
          <Button
            onClick={() => {
              setSelectedProfile(null)
              setPerfilModalMode('add')
              setIsPerfilModalOpen(true)
            }}
            className="h-11 px-6 rounded-xl flex items-center gap-2 whitespace-nowrap bg-[#0039A6] hover:bg-[#1a3329] text-white font-normal"
          >
            <Plus className="h-5 w-5" />
            Criar perfil
          </Button>
        </div>
      </div>

      <Card className="border-app-border/60 dark:border-app-border-dark overflow-hidden rounded-2xl shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px] font-normal">Perfil</TableHead>
                  <TableHead className="min-w-[300px] font-normal">Descrição</TableHead>
                  <TableHead className="min-w-[150px] font-normal">Escopo</TableHead>
                  <TableHead className="text-center min-w-[100px] font-normal">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <p className="text-[#1A1A1AB2] dark:text-white/40">
                        Nenhum perfil encontrado com os filtros aplicados.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPermissions.map((permission: any) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-normal text-app-text-primary dark:text-white">
                        {permission.nome}
                      </TableCell>
                      <TableCell className="text-[#1A1A1AB2] dark:text-white/40">
                        {permission.descricao}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-app-text-primary dark:text-white font-normal">
                          {permission.escopo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4 text-[#1A1A1AB2] dark:text-white/40" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="dark:bg-app-bg-dark dark:border-[#2d5a46] rounded-xl shadow-xl">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedProfile(permission)
                                  setIsViewOpen(true)
                                }}
                                className="dark:text-white dark:hover:bg-[#0039A6] cursor-pointer"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedProfile(permission)
                                  setPerfilModalMode('edit')
                                  setIsPerfilModalOpen(true)
                                }}
                                className="dark:text-white dark:hover:bg-[#0039A6] cursor-pointer"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedProfile(permission)
                                  setIsDeleteOpen(true)
                                }}
                                className="text-red-600 dark:text-red-400 dark:hover:bg-red-900/20 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

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

      <ExcluirPerfilModal
        isOpen={isDeleteOpen}
        onClose={setIsDeleteOpen}
        profile={selectedProfile}
        onConfirm={(id) => {
          console.log('Excluindo perfil:', id)
          setIsDeleteOpen(false)
        }}
      />
    </div>
  )
}
