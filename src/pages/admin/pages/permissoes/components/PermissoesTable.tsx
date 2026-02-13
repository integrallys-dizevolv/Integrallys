import { useState, useMemo } from 'react'
import { Plus, Search, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { mockDetailedPermissions as mockPermissions } from '@/mocks/admin/permissions'

interface PermissoesTableProps {
  onPageChange?: (page: string) => void
}

export function PermissoesTable({ onPageChange }: PermissoesTableProps) {
  const [searchFilter, setSearchFilter] = useState('')

  const filteredPermissions = useMemo(() => {
    return mockPermissions.filter(permission => {
      const matchesSearch = searchFilter === '' ||
        permission.perfil.toLowerCase().includes(searchFilter.toLowerCase()) ||
        permission.descricao.toLowerCase().includes(searchFilter.toLowerCase()) ||
        permission.modulo.toLowerCase().includes(searchFilter.toLowerCase())
      return matchesSearch
    })
  }, [searchFilter])

  return (
    <div className="space-y-6">
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
        <div className="relative flex-1 sm:max-w-xs lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1A1A1AB2] dark:text-white/40" />
          <Input
            placeholder="Buscar perfis..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="h-10 pl-9 bg-app-card dark:bg-app-bg-dark border-app-border dark:border-app-border-dark rounded-lg text-sm"
          />
        </div>

        <Button className="h-10 px-4 bg-[#0039A6] hover:bg-[#1a3329] text-white rounded-lg">
          <Plus className="h-4 w-4 mr-2" />
          Criar Perfil
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Perfil</TableHead>
                  <TableHead className="min-w-[150px]">Módulo</TableHead>
                  <TableHead className="min-w-[300px]">Descrição</TableHead>
                  <TableHead className="min-w-[150px]">Usuários</TableHead>
                  <TableHead className="text-right min-w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <p className="text-[#1A1A1AB2] dark:text-white/40">
                        Nenhum perfil encontrado com os filtros aplicados.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPermissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-bold text-app-text-primary dark:text-white">
                        {permission.perfil}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-app-text-primary dark:text-white border-app-border dark:border-slate-700">
                          {permission.modulo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#1A1A1AB2] dark:text-white/40">
                        {permission.descricao}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-app-text-primary dark:text-white">
                          {permission.usuarios} usuários
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4 text-[#1A1A1AB2] dark:text-white/40" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
