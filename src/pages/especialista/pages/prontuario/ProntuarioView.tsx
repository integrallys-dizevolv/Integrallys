import { useState } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb';
import { PageHeader } from '../../ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { Search, Plus, MoreHorizontal, Eye, FileText, Filter, ChevronDown, Download, Home, Edit3, Trash2 } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table"
import { NovoProntuarioModal, EditarProntuarioModal, ExcluirProntuarioModal } from '../../modals'
import { MOCK_PRONTUARIOS, type Prontuario } from '@/mocks/especialista/prontuarios'

interface ProntuarioViewProps {
    onPageChange: (page: string) => void
}

export const ProntuarioView = ({ onPageChange }: ProntuarioViewProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('Todos os Status')
    const [typeFilter, setTypeFilter] = useState('Todos os Tipos')
    const [isNovoProntuarioModalOpen, setIsNovoProntuarioModalOpen] = useState(false)
    const [isEditarModalOpen, setIsEditarModalOpen] = useState(false)
    const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false)
    const [selectedPaciente, setSelectedPaciente] = useState('')

    const handleEditar = (paciente: string) => {
        setSelectedPaciente(paciente)
        setIsEditarModalOpen(true)
    }

    const handleExcluir = (paciente: string) => {
        setSelectedPaciente(paciente)
        setIsExcluirModalOpen(true)
    }

    const filteredProntuarios = MOCK_PRONTUARIOS.filter(p => {
        const matchesSearch = p.paciente.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'Todos os Status' || p.status === statusFilter
        const matchesType = typeFilter === 'Todos os Tipos' ||
            (typeFilter === 'Consultas' && p.tipo.toLowerCase().includes('consulta')) ||
            (typeFilter === 'Avaliações' && p.tipo.toLowerCase().includes('avaliação'))
        return matchesSearch && matchesStatus && matchesType
    })

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => onPageChange?.('inicio')} className="cursor-pointer text-[#1A1A1AB2] dark:text-[#c3cec9] hover:text-[#0039A6] dark:hover:text-white">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-app-text-primary dark:text-white font-normal">Prontuário</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <PageHeader
                title="Prontuários de atendimento"
                subtitle="Gerencie os prontuários de atendimento dos pacientes."
                onPageChange={onPageChange}
                primaryAction={{
                    label: "Novo prontuário",
                    onClick: () => setIsNovoProntuarioModalOpen(true)
                }}
            />

            {/* Main Content Card */}
            <div className="bg-white dark:bg-app-card-dark rounded-[14px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-8 space-y-8">
                    {/* List Title */}
                    <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-gray-900 dark:text-white" />
                        <h2 className="text-xl font-normal text-gray-900 dark:text-white tracking-tight">
                            Lista de prontuários
                        </h2>
                    </div>

                    {/* Filter Bar - Modern Single Row Layout */}
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-app-text-muted" />
                            <Input
                                placeholder="Buscar por nome do paciente..."
                                className="pl-12 h-12 rounded-[12px] border-gray-100 dark:border-gray-800 bg-app-bg-secondary/50 dark:bg-app-table-header-dark focus-visible:ring-[#0039A6] transition-all w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            {/* Filter Status */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="h-12 px-5 rounded-[12px] border-gray-100 dark:border-gray-800 flex items-center gap-3 font-normal text-gray-600 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-all min-w-[180px] justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Filter className="h-4 w-4 text-app-text-muted" />
                                            <span className="whitespace-nowrap">
                                                {statusFilter === 'Todos os Status' ? 'Todos os status' : statusFilter}
                                            </span>
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-app-text-muted" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[200px] rounded-[14px] p-2 bg-white dark:bg-app-card-dark border-gray-100 dark:border-gray-800">
                                    <DropdownMenuItem onClick={() => setStatusFilter('Todos os Status')}>Todos os status</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter('Em Andamento')}>Em andamento</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter('Finalizado')}>Finalizado</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Filter Type */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="h-12 px-5 rounded-[12px] border-gray-100 dark:border-gray-800 flex items-center gap-3 font-normal text-gray-600 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-all min-w-[180px] justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Filter className="h-4 w-4 text-app-text-muted" />
                                            <span className="whitespace-nowrap">
                                                {typeFilter === 'Todos os Tipos' ? 'Todos os tipos' : typeFilter}
                                            </span>
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-app-text-muted" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[220px] rounded-[14px] p-2 bg-white dark:bg-app-card-dark border-gray-100 dark:border-gray-800">
                                    <DropdownMenuItem onClick={() => setTypeFilter('Todos os Tipos')}>Todos os tipos</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTypeFilter('Consultas')}>Consultas</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTypeFilter('Avaliações')}>Avaliações</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-gray-100 dark:border-gray-800 hover:bg-transparent">
                                <TableHead className="font-normal text-app-text-muted py-4 px-6">Paciente</TableHead>
                                <TableHead className="font-normal text-app-text-muted py-4">Data</TableHead>
                                <TableHead className="font-normal text-app-text-muted py-4">Tipo de consulta</TableHead>
                                <TableHead className="font-normal text-app-text-muted py-4 text-center">Status</TableHead>
                                <TableHead className="font-normal text-app-text-muted py-4 text-center">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProntuarios.map((prontuario) => (
                                <TableRow key={prontuario.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-app-bg-secondary dark:hover:bg-app-bg-dark/50 transition-colors">
                                    <TableCell className="font-normal text-gray-900 dark:text-white px-6">
                                        {prontuario.paciente}
                                    </TableCell>
                                    <TableCell className="text-gray-600 dark:text-white/80">
                                        {prontuario.data}
                                    </TableCell>
                                    <TableCell className="text-app-text-muted dark:text-app-text-muted">
                                        {prontuario.tipo}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={`
                                            rounded-lg text-[10px] tracking-wider px-2.5 py-1 border-0 transition-all shadow-sm font-normal
                                            ${prontuario.status === 'Finalizado'
                                                ? 'bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white'
                                                : 'bg-blue-600 dark:bg-blue-900/40 dark:text-blue-100 text-white'
                                            }
                                        `}>
                                            {prontuario.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button className="h-9 w-9 p-0 bg-transparent hover:bg-transparent shadow-none border-none flex items-center justify-center mx-auto transition-none">
                                                    <MoreHorizontal className="h-5 w-5 text-gray-900 dark:text-white shrink-0" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[200px] rounded-[14px] p-2 shadow-xl border-gray-100 dark:border-gray-800 bg-white dark:bg-app-card-dark">
                                                <DropdownMenuItem
                                                    className="cursor-pointer py-3 rounded-[10px] flex items-center gap-3 text-gray-700 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors"
                                                    onClick={() => onPageChange('visualizar-prontuario')}
                                                >
                                                    <Eye className="h-4 w-4 text-app-text-muted shrink-0" />
                                                    <span className="font-normal whitespace-nowrap">Visualizar</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="cursor-pointer py-3 rounded-[10px] flex items-center gap-3 text-gray-700 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors"
                                                    onClick={() => handleEditar(prontuario.paciente)}
                                                >
                                                    <Edit3 className="h-4 w-4 text-app-text-muted shrink-0" />
                                                    <span className="font-normal whitespace-nowrap">Editar</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="cursor-pointer py-3 rounded-[10px] flex items-center gap-3 text-red-600 focus:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                                    onClick={() => handleExcluir(prontuario.paciente)}
                                                >
                                                    <Trash2 className="h-4 w-4 shrink-0" />
                                                    <span className="font-normal whitespace-nowrap">Excluir</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <NovoProntuarioModal
                isOpen={isNovoProntuarioModalOpen}
                onClose={() => setIsNovoProntuarioModalOpen(false)}
            />

            <EditarProntuarioModal
                isOpen={isEditarModalOpen}
                onClose={() => setIsEditarModalOpen(false)}
                pacienteNome={selectedPaciente}
            />

            <ExcluirProntuarioModal
                isOpen={isExcluirModalOpen}
                onClose={() => setIsExcluirModalOpen(false)}
                pacienteNome={selectedPaciente}
            />
        </div>
    )
}
