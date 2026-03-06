import { useState, useMemo } from 'react'
import { Plus, Search, Eye, Edit2, Trash2, MoreVertical, AlertTriangle, Building2 } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { Label } from '@/components/ui/Label'

interface Unit {
    id: number
    nome: string
    cnpj: string
    endereco: string
    gestor: string
    status: 'Ativa' | 'Em Manutenção' | 'Inativa'
}

const mockUnits: Unit[] = [
    { id: 1, nome: 'Clínica Central', cnpj: '12.345.678/0001-90', endereco: 'Av. Principal, 123 - Centro', gestor: 'Dr. João Silva', status: 'Ativa' },
    { id: 2, nome: 'Unidade Norte', cnpj: '23.456.789/0001-01', endereco: 'Rua Norte, 456 - Zona Norte', gestor: 'Dra. Maria Santos', status: 'Ativa' },
    { id: 3, nome: 'Consultório Sul', cnpj: '34.567.890/0001-12', endereco: 'Av. Sul, 789 - Zona Sul', gestor: 'Dr. Paulo Gestor', status: 'Em Manutenção' },
    { id: 4, nome: 'Sede Principal', cnpj: '45.678.901/0001-23', endereco: 'Rua Sede, 321 - Centro', gestor: 'Carlos Admin', status: 'Ativa' },
]

type ModalType = 'create' | 'edit' | 'view' | 'delete' | null

export function UnidadesView({ onPageChange }: { onPageChange?: (page: string) => void }) {
    const [searchFilter, setSearchFilter] = useState('')
    const [modalType, setModalType] = useState<ModalType>(null)
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
    const [formData, setFormData] = useState({
        nome: '',
        cnpj: '',
        endereco: '',
        gestor: '',
    })

    const filteredUnits = useMemo(() => {
        return mockUnits.filter(unit => {
            const matchesSearch = searchFilter === '' ||
                unit.nome.toLowerCase().includes(searchFilter.toLowerCase()) ||
                unit.cnpj?.toLowerCase().includes(searchFilter.toLowerCase())
            return matchesSearch
        })
    }, [searchFilter])

    const handleOpenModal = (type: ModalType, unit?: Unit) => {
        setModalType(type)
        if (unit) {
            setSelectedUnit(unit)
            setFormData({
                nome: unit.nome,
                cnpj: unit.cnpj,
                endereco: unit.endereco,
                gestor: unit.gestor,
            })
        } else {
            setSelectedUnit(null)
            setFormData({
                nome: '',
                cnpj: '',
                endereco: '',
                gestor: '',
            })
        }
    }

    const handleCloseModal = () => {
        setModalType(null)
        setSelectedUnit(null)
    }

    return (
        <div className="space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            onClick={() => onPageChange?.('inicio')}
                            className="text-sm font-normal text-app-text-muted hover:text-[#0039A6] dark:text-app-text-muted dark:hover:text-white transition-colors cursor-pointer"
                        >
                            Início
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-sm font-normal text-gray-900 dark:text-white">Unidades</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-normal text-[#101828] dark:text-white">Unidades</h2>
                    <p className="text-app-text-muted text-sm mt-1">Gerencie as unidades e clínicas sob sua gestão.</p>
                </div>

                <Button
                    onClick={() => handleOpenModal('create')}
                    className="h-11 px-6 bg-[#0039A6] hover:bg-[#002a7a] text-white rounded-xl flex items-center justify-center gap-2 shadow-sm shrink-0 transition-all font-normal"
                >
                    <Plus className="h-5 w-5" />
                    <span>Adicionar unidade</span>
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-app-text-muted" />
                    <Input
                        placeholder="Buscar por nome ou CNPJ..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="h-11 pl-11 bg-app-card dark:bg-[#0039A6] border-app-border dark:border-app-border-dark rounded-xl text-sm focus:ring-[#0039A6] transition-all font-normal"
                    />
                </div>
            </div>

            <Card className="border-app-border/60 dark:border-app-border-dark overflow-hidden rounded-2xl shadow-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto custom-scrollbar">
                        <Table>
                            <TableHeader className="bg-app-bg-secondary/50 dark:bg-app-card/5">
                                <TableRow className="hover:bg-transparent border-gray-100 dark:border-app-border-dark">
                                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider">Unidade</TableHead>
                                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider">Endereço</TableHead>
                                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider">Gestor</TableHead>
                                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider text-center">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUnits.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-20">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 bg-app-bg-secondary dark:bg-app-card/5 rounded-full flex items-center justify-center mb-4 text-app-text-muted">
                                                    <Building2 className="h-8 w-8" />
                                                </div>
                                                <p className="text-[#6a7282] dark:text-app-text-muted font-normal text-base">
                                                    Nenhuma unidade encontrada.
                                                </p>
                                                <p className="text-app-text-muted text-sm mt-1">Experimente ajustar o filtro de busca.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUnits.map((unit) => (
                                        <TableRow key={unit.id} className="group hover:bg-app-bg-secondary/50 dark:hover:bg-app-card/5 transition-colors border-gray-100 dark:border-app-border-dark">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-normal text-[#101828] dark:text-white truncate max-w-[200px]">{unit.nome}</span>
                                                    <span className="text-xs text-[#6a7282] dark:text-app-text-muted mt-0.5">{unit.cnpj}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <span className="text-[#6a7282] dark:text-app-text-muted text-sm line-clamp-1">{unit.endereco}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-[#6a7282] dark:text-app-text-muted text-sm">
                                                {unit.gestor}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-sm">
                                                <Badge
                                                    className={`
                                                        h-7 px-3 rounded-full font-normal border-none text-white shadow-sm transition-all
                                                        ${unit.status === 'Ativa'
                                                            ? 'bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100'
                                                            : unit.status === 'Em Manutenção'
                                                                ? 'bg-amber-500 dark:bg-amber-900/40 dark:text-amber-100'
                                                                : 'bg-red-600 dark:bg-red-900/40 dark:text-red-100'}
                                                    `}
                                                >
                                                    {unit.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center justify-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-9 w-9 rounded-lg hover:bg-app-card hover:shadow-sm dark:hover:bg-app-card/10"
                                                            >
                                                                <MoreVertical className="h-5 w-5 text-[#6a7282] dark:text-app-text-muted" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-app-border dark:border-app-border-dark">
                                                            <DropdownMenuItem
                                                                onClick={() => handleOpenModal('view', unit)}
                                                                className="py-2.5 rounded-lg focus:bg-app-bg-secondary dark:focus:bg-app-card/10 group"
                                                            >
                                                                <Eye className="h-4 w-4 mr-3 text-app-text-muted group-hover:text-[#0039A6]" />
                                                                Visualizar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleOpenModal('edit', unit)}
                                                                className="py-2.5 rounded-lg focus:bg-app-bg-secondary dark:focus:bg-app-card/10 group"
                                                            >
                                                                <Edit2 className="h-4 w-4 mr-3 text-app-text-muted group-hover:text-[#0039A6]" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="py-2.5 rounded-lg focus:bg-red-50 dark:focus:bg-red-900/20 text-red-600 dark:text-red-400 group"
                                                                onClick={() => handleOpenModal('delete', unit)}
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-3 text-red-400 group-hover:text-red-600" />
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

            {/* Modal Create/Edit/View */}
            {(modalType === 'create' || modalType === 'edit' || modalType === 'view') && (
                <Dialog open={modalType !== null} onOpenChange={handleCloseModal}>
                    <DialogContent className="max-w-[500px] w-full gap-0 overflow-hidden rounded-[24px]">
                        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                            <DialogTitle className="text-xl font-normal">
                                {modalType === 'create' ? 'Nova unidade' : modalType === 'edit' ? 'Editar unidade' : 'Visualizar unidade'}
                            </DialogTitle>
                            <DialogDescription className="text-app-text-muted mt-1.5 font-normal">
                                {modalType === 'create' ? 'Preencha os dados abaixo para cadastrar uma nova unidade.' : modalType === 'edit' ? 'Atualize as informações da unidade abaixo.' : 'Confira os detalhes da unidade selecionada.'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="px-6 py-4 space-y-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
                            <div className="space-y-1.5">
                                <Label className="text-sm font-normal text-[#101828] dark:text-white">Nome da unidade *</Label>
                                <Input
                                    value={formData.nome}
                                    placeholder="Ex: Clínica Central"
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    disabled={modalType === 'view'}
                                    className="h-11 rounded-lg border-app-border bg-app-card dark:bg-[#0c1e3d] dark:border-app-border-dark text-sm placeholder:text-app-text-muted font-normal"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-normal text-[#101828] dark:text-white">CNPJ</Label>
                                <Input
                                    value={formData.cnpj}
                                    placeholder="00.000.000/0000-00"
                                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                                    disabled={modalType === 'view'}
                                    className="h-11 rounded-lg border-app-border bg-app-card dark:bg-[#0c1e3d] dark:border-app-border-dark text-sm placeholder:text-app-text-muted font-normal"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-normal text-[#101828] dark:text-white">Endereço completo *</Label>
                                <Input
                                    value={formData.endereco}
                                    placeholder="Rua, Número, Bairro, Cidade - UF"
                                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                                    disabled={modalType === 'view'}
                                    className="h-11 rounded-lg border-app-border bg-app-card dark:bg-[#0c1e3d] dark:border-app-border-dark text-sm placeholder:text-app-text-muted font-normal"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-normal text-[#101828] dark:text-white">Gestor responsável *</Label>
                                <Input
                                    value={formData.gestor}
                                    placeholder="Nome do gestor"
                                    onChange={(e) => setFormData({ ...formData, gestor: e.target.value })}
                                    disabled={modalType === 'view'}
                                    className="h-11 rounded-lg border-app-border bg-app-card dark:bg-[#0c1e3d] dark:border-app-border-dark text-sm placeholder:text-app-text-muted font-normal"
                                    required
                                />
                            </div>
                        </div>

                        <DialogFooter className="px-6 py-6 shrink-0 gap-3 sm:gap-0">
                            <Button
                                variant="outline"
                                onClick={handleCloseModal}
                                className="h-11 px-6 rounded-lg border-app-border text-gray-700 hover:bg-app-bg-secondary dark:border-app-border-dark dark:text-white/80 dark:hover:bg-app-card/5 font-normal"
                            >
                                {modalType === 'view' ? 'Fechar' : 'Cancelar'}
                            </Button>
                            {modalType !== 'view' && (
                                <Button
                                    className="h-11 px-8 rounded-lg bg-[#0039A6] hover:bg-[#002d82] text-white shadow-sm font-normal"
                                >
                                    {modalType === 'create' ? 'Cadastrar unidade' : 'Salvar alterações'}
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Modal Delete */}
            {modalType === 'delete' && (
                <Dialog open={modalType !== null} onOpenChange={handleCloseModal}>
                    <DialogContent className="max-w-[450px] w-full gap-0 overflow-hidden rounded-[24px]">
                        <div className="px-6 pt-8 pb-4 flex flex-col items-center text-center">
                            <div className="h-14 w-14 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4 text-red-600">
                                <AlertTriangle className="h-8 w-8" />
                            </div>
                            <DialogTitle className="text-xl font-normal text-[#101828] dark:text-white">Confirmar exclusão</DialogTitle>
                            <DialogDescription className="text-app-text-muted mt-2 max-w-xs mx-auto text-sm font-normal">
                                Tem certeza que deseja remover esta unidade? Esta ação é irreversível e todos os dados vinculados serão afetados.
                            </DialogDescription>

                            <div className="w-full mt-6 p-4 bg-app-bg-secondary dark:bg-app-card/5 border border-gray-100 dark:border-app-border-dark rounded-xl flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-app-card dark:bg-app-card/10 shadow-sm flex items-center justify-center text-[#0039A6] dark:text-[#4ADE80]">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-normal text-app-text-muted uppercase tracking-wider">Unidade</p>
                                    <p className="text-sm font-normal text-[#101828] dark:text-white">{selectedUnit?.nome}</p>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="px-6 py-6 mt-2 shrink-0 gap-3">
                            <Button
                                variant="outline"
                                onClick={handleCloseModal}
                                className="flex-1 h-11 rounded-lg border-app-border text-gray-700 hover:bg-app-bg-secondary dark:border-app-border-dark dark:text-white/80 dark:hover:bg-app-card/5 font-normal"
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="flex-1 h-11 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm font-normal"
                            >
                                Excluir unidade
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
