import { useState, useMemo } from 'react'
import { Plus, Search, Eye, Edit, Trash2, MoreVertical, AlertTriangle } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog'
import { Label } from '@/components/ui/Label'
import type { Unit } from '../../components/types'
import { mockUnits } from '@/mocks/admin/unidades'

interface UnidadesViewProps {
  onPageChange?: (page: string) => void
  units?: Unit[]
  loading?: boolean
  error?: string | null
}

type ModalType = 'create' | 'edit' | 'view' | 'delete' | null

export function UnidadesView({
  onPageChange,
  units = mockUnits,
  loading = false,
  error = null,
}: UnidadesViewProps) {
  const [searchFilter, setSearchFilter] = useState('')
  const [modalType, setModalType] = useState<ModalType>(null)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    gestor: '',
  })

  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      const matchesSearch = searchFilter === '' ||
        unit.nome.toLowerCase().includes(searchFilter.toLowerCase()) ||
        unit.cnpj?.toLowerCase().includes(searchFilter.toLowerCase())
      return matchesSearch
    })
  }, [searchFilter, units])

  const handleOpenModal = (type: ModalType, unit?: Unit) => {
    setModalType(type)
    if (unit) {
      setSelectedUnit(unit)
      setFormData({
        nome: unit.nome,
        endereco: unit.endereco,
        gestor: unit.gestor,
      })
    } else {
      setSelectedUnit(null)
      setFormData({
        nome: '',
        endereco: '',
        gestor: '',
      })
    }
  }

  const handleCloseModal = () => {
    setModalType(null)
    setSelectedUnit(null)
    setFormData({
      nome: '',
      endereco: '',
      gestor: '',
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleCloseModal()
  }

  const handleDelete = () => {
    handleCloseModal()
  }

  const isModalOpen = modalType !== null

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
            <BreadcrumbPage>Unidades</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1A1A1AB2] dark:text-white/40" />
          <Input
            placeholder="Buscar por nome ou CNPJ..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="h-10 pl-9 bg-app-card dark:bg-app-bg-dark border-app-border dark:border-app-border-dark rounded-lg text-sm"
          />
        </div>

        <Button
          onClick={() => handleOpenModal('create')}
          className="h-10 px-4 bg-[#0039A6] hover:bg-[#1a3329] text-white rounded-lg flex items-center justify-center gap-2 shadow-sm shrink-0 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar unidade</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Nome da clínica</TableHead>
                  <TableHead className="min-w-[250px]">Endereço</TableHead>
                  <TableHead className="min-w-[180px]">Gestor</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="text-center min-w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <p className="text-app-text-secondary dark:text-app-text-muted">
                        Carregando unidades...
                      </p>
                    </TableCell>
                  </TableRow>
                ) : filteredUnits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <p className="text-app-text-secondary dark:text-app-text-muted">
                        Nenhuma unidade encontrada com os filtros aplicados.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUnits.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell className="font-normal text-app-text-primary dark:text-white">
                        {unit.nome}
                      </TableCell>
                      <TableCell className="text-app-text-secondary dark:text-app-text-muted">
                        {unit.endereco}
                      </TableCell>
                      <TableCell className="text-app-text-secondary dark:text-app-text-muted">
                        {unit.gestor}
                      </TableCell>
                      <TableCell>
                        <Badge className={`
                          shadow-sm font-normal rounded-md px-3 py-1 whitespace-nowrap
                          ${unit.status === 'Ativa'
                            ? 'bg-[#0039A6] text-white'
                            : unit.status === 'Em Manutenção'
                              ? 'bg-orange-600 dark:bg-orange-900 text-white dark:text-orange-100'
                              : 'bg-red-600 dark:bg-red-900 text-white dark:text-red-100'}
                        `}>
                          {unit.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 transition-all hover:bg-app-bg-secondary dark:hover:bg-app-card/10">
                                <MoreVertical className="h-4 w-4 text-app-text-secondary dark:text-app-text-muted" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 shadow-lg border-[#dee2e6] dark:border-app-border-dark">
                              <DropdownMenuItem onClick={() => handleOpenModal('view', unit)} className="flex items-center gap-2 cursor-pointer">
                                <Eye className="h-4 w-4 text-app-text-secondary" />
                                <span className="text-sm">Visualizar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenModal('edit', unit)} className="flex items-center gap-2 cursor-pointer">
                                <Edit className="h-4 w-4 text-app-text-secondary" />
                                <span className="text-sm">Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                                onClick={() => handleOpenModal('delete', unit)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="text-sm font-normal">Excluir</span>
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

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Modal Create/Edit/View */}
      {(modalType === 'create' || modalType === 'edit' || modalType === 'view') && (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="max-w-[500px]">

            <DialogHeader>
              <DialogTitle className="font-normal">
                {modalType === 'create' ? 'Nova unidade' : modalType === 'edit' ? 'Editar unidade' : 'Visualizar unidade'}
              </DialogTitle>
              <DialogDescription>
                {modalType === 'create' ? 'Preencha os dados para adicionar uma nova unidade' : modalType === 'edit' ? 'Edite as informações da unidade' : 'Informações da unidade'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6">
              <div>
                <Label className="font-normal">Nome da unidade</Label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  disabled={modalType === 'view'}
                  className="mt-1"
                  required={modalType !== 'view'}
                />
              </div>
              <div>
                <Label className="font-normal">Endereço</Label>
                <Input
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  disabled={modalType === 'view'}
                  className="mt-1"
                  required={modalType !== 'view'}
                />
              </div>
              <div>
                <Label className="font-normal">Gestor responsável</Label>
                <Input
                  value={formData.gestor}
                  onChange={(e) => setFormData({ ...formData, gestor: e.target.value })}
                  disabled={modalType === 'view'}
                  className="mt-1"
                  required={modalType !== 'view'}
                />
              </div>
              {modalType !== 'view' && (
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#0039A6] hover:bg-[#1a3329] text-white"
                  >
                    Salvar
                  </Button>
                </div>
              )}
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal Delete */}
      {modalType === 'delete' && (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="max-w-[500px]">
            <DialogHeader>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <DialogTitle className="text-red-600 font-normal">
                    Confirmar exclusão
                  </DialogTitle>
                  <DialogDescription className="text-[#1A1A1AB2] dark:text-app-text-muted mt-2">
                    Deseja realmente excluir este item? Esta ação não poderá ser desfeita...
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="px-6 pb-6 space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm font-normal text-red-800 dark:text-red-300">
                  Unidade: {selectedUnit?.nome}
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="px-4 border-slate-300 dark:border-slate-600"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 bg-red-600 hover:bg-red-700 text-white"
                >
                  Excluir
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
