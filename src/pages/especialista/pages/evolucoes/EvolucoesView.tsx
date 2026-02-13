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
import { Search, Plus, Home, Filter, ChevronDown, FileText, MoreHorizontal, Files, Eye, Trash2, FileSignature } from 'lucide-react'
import { NovaEvolucaoModal, AdicionarNotaErrataModal, ExcluirEvolucaoModal } from '../../modals'
import { DocumentosSheet } from '../../components/DocumentosSheet'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table"
import { MOCK_EVOLUCOES, type Evolucao } from '@/mocks/especialista/evolucoes'

interface EvolucoesViewProps {
    onPageChange: (page: string) => void
}

export const EvolucoesView = ({ onPageChange }: EvolucoesViewProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [patientFilter, setPatientFilter] = useState('Todos os Pacientes')
    const [typeFilter, setTypeFilter] = useState('Todos os Tipos')
    const [isNovaEvolucaoModalOpen, setIsNovaEvolucaoModalOpen] = useState(false)
    const [isDocumentsSheetOpen, setIsDocumentsSheetOpen] = useState(false)
    const [isNotaModalOpen, setIsNotaModalOpen] = useState(false)
    const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false)
    const [selectedPaciente, setSelectedPaciente] = useState('')

    const filteredEvolucoes = MOCK_EVOLUCOES.filter(ev => {
        const matchesSearch = ev.paciente.toLowerCase().includes(searchTerm.toLowerCase()) || ev.resumo.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = typeFilter === 'Todos os Tipos' || ev.tipo === typeFilter
        const matchesPatient = patientFilter === 'Todos os Pacientes' || ev.paciente === patientFilter
        return matchesSearch && matchesType && matchesPatient
    })

    const getRetornoBadgeColor = (status: string) => {
        switch (status) {
            case 'Paciente avisado':
                return 'bg-blue-600 dark:bg-blue-900/40 dark:text-blue-100 text-white'
            case 'Retorno confirmado':
                return 'bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white'
            case 'Não localizado':
                return 'bg-red-600 dark:bg-red-900/40 dark:text-red-100 text-white'
            default:
                return 'bg-gray-600 dark:bg-app-bg-dark dark:text-white/80 text-white'
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => onPageChange?.('inicio')} className="cursor-pointer text-[#1A1A1AB2] dark:text-[#c3cec9] hover:text-[#0039A6] dark:hover:text-white">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-app-text-primary dark:text-white font-normal">Evoluções</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <PageHeader
                title="Evoluções clínicas"
                subtitle="Acompanhe a evolução clínica dos pacientes"
                onPageChange={onPageChange}
                primaryAction={{
                    label: "Nova evolução clínica",
                    onClick: () => setIsNovaEvolucaoModalOpen(true)
                }}
            />

            {/* Main Content Card */}
            <div className="bg-white dark:bg-app-card-dark rounded-[14px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-8 space-y-8">
                    {/* List Title */}
                    <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-gray-900 dark:text-white" />
                        <h2 className="text-xl font-normal text-gray-900 dark:text-white tracking-tight">
                            Registro de evoluções
                        </h2>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-app-text-muted" />
                            <Input
                                placeholder="Buscar por paciente ou resumo..."
                                className="pl-12 h-12 rounded-[12px] border-gray-100 dark:border-gray-800 bg-app-bg-secondary/50 dark:bg-app-table-header-dark focus-visible:ring-[#0039A6] transition-all w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            {/* Filter Patient */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="h-12 px-5 rounded-[12px] border-gray-100 dark:border-gray-800 flex items-center gap-3 font-normal text-gray-600 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-all min-w-[200px] justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Filter className="h-4 w-4 text-app-text-muted" />
                                            <span className="whitespace-nowrap">
                                                {patientFilter === 'Todos os Pacientes' ? 'Todos os pacientes' : patientFilter}
                                            </span>
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-app-text-muted" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[220px] rounded-[14px] p-2 bg-white dark:bg-app-card-dark border-gray-100 dark:border-gray-800">
                                    <DropdownMenuItem onClick={() => setPatientFilter('Todos os Pacientes')}>Todos os pacientes</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setPatientFilter('Maria Silva')}>Maria Silva</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setPatientFilter('João Santos')}>João Santos</DropdownMenuItem>
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
                                <DropdownMenuContent align="end" className="w-[200px] rounded-[14px] p-2 bg-white dark:bg-app-card-dark border-gray-100 dark:border-gray-800">
                                    <DropdownMenuItem onClick={() => setTypeFilter('Todos os Tipos')}>Todos os tipos</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTypeFilter('Consulta')}>Consulta</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTypeFilter('Retorno')}>Retorno</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTypeFilter('Exame')}>Exame</DropdownMenuItem>
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
                                <TableHead className="font-normal text-app-text-muted py-4">Data da evolução</TableHead>
                                <TableHead className="font-normal text-app-text-muted py-4">Tipo</TableHead>
                                <TableHead className="font-normal text-app-text-muted py-4 w-[40%]">Resumo</TableHead>
                                <TableHead className="font-normal text-app-text-muted py-4 text-center">Retorno da recepção</TableHead>
                                <TableHead className="font-normal text-app-text-muted py-4 text-center">Docs</TableHead>
                                <TableHead className="font-normal text-app-text-muted py-4 text-center">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEvolucoes.map((evolucao) => (
                                <TableRow key={evolucao.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-app-bg-secondary dark:hover:bg-app-bg-dark/50 transition-colors">
                                    <TableCell className="font-normal text-gray-900 dark:text-white px-6">
                                        {evolucao.paciente}
                                    </TableCell>
                                    <TableCell className="text-gray-600 dark:text-white/80">
                                        {evolucao.data}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="rounded-full border-gray-100 bg-white text-gray-600 dark:bg-app-bg-dark/50 dark:text-app-text-muted dark:border-app-border-dark px-3 py-0.5 font-medium whitespace-nowrap shadow-sm">
                                            {evolucao.tipo}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-app-text-muted dark:text-app-text-muted">
                                        <div className="truncate max-w-[400px]" title={evolucao.resumo}>
                                            {evolucao.resumo}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={`
                                            rounded-[8px] text-[10px] font-normal px-3 py-1.5 border-0 shadow-sm whitespace-nowrap tracking-wider
                                            ${getRetornoBadgeColor(evolucao.retornoRecepcao)}
                                        `}>
                                            {evolucao.retornoRecepcao}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <button
                                            onClick={() => setIsDocumentsSheetOpen(true)}
                                            className="flex items-center justify-center gap-1.5 text-gray-600 dark:text-app-text-muted font-medium bg-app-bg-secondary dark:bg-app-table-header-dark hover:bg-app-bg-secondary dark:hover:bg-white/10 rounded-lg py-1 px-2 w-fit mx-auto border border-gray-100 dark:border-gray-800 transition-colors"
                                        >
                                            <Files className="h-3.5 w-3.5" />
                                            <span>{evolucao.docsCount}</span>
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button className="h-9 w-9 p-0 bg-transparent hover:bg-transparent shadow-none border-none flex items-center justify-center mx-auto transition-none">
                                                    <MoreHorizontal className="h-5 w-5 text-gray-900 dark:text-white shrink-0" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[240px] rounded-[16px] p-2 shadow-xl border-gray-100 dark:border-gray-800 bg-white dark:bg-app-card-dark">
                                                <DropdownMenuItem
                                                    onClick={() => onPageChange('visualizar-evolucao')}
                                                    className="cursor-pointer py-3 px-3 rounded-[12px] flex items-center gap-3.5 text-gray-700 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors group"
                                                >
                                                    <Eye className="h-[20px] w-[20px] text-app-text-muted group-hover:text-gray-600 dark:group-hover:text-white shrink-0" />
                                                    <span className="font-normal text-[15px]">Visualizar</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setIsNotaModalOpen(true)}
                                                    className="cursor-pointer py-3 px-3 rounded-[12px] flex items-center gap-3.5 text-gray-700 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors group"
                                                >
                                                    <FileSignature className="h-[20px] w-[20px] text-app-text-muted group-hover:text-gray-600 dark:group-hover:text-white shrink-0" />
                                                    <span className="font-normal text-[15px]">Adicionar nota/errata</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedPaciente(evolucao.paciente)
                                                        setIsExcluirModalOpen(true)
                                                    }}
                                                    className="cursor-pointer py-3 px-3 rounded-[12px] flex items-center gap-3.5 text-gray-700 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors group"
                                                >
                                                    <Trash2 className="h-[20px] w-[20px] text-app-text-muted group-hover:text-red-500 dark:group-hover:text-red-400 shrink-0" />
                                                    <span className="font-normal text-[15px]">Excluir</span>
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

            <NovaEvolucaoModal
                isOpen={isNovaEvolucaoModalOpen}
                onClose={() => setIsNovaEvolucaoModalOpen(false)}
            />

            <DocumentosSheet
                open={isDocumentsSheetOpen}
                onOpenChange={setIsDocumentsSheetOpen}
            />

            <AdicionarNotaErrataModal
                isOpen={isNotaModalOpen}
                onClose={() => setIsNotaModalOpen(false)}
            />

            <ExcluirEvolucaoModal
                isOpen={isExcluirModalOpen}
                onClose={() => setIsExcluirModalOpen(false)}
                pacienteNome={selectedPaciente}
            />
        </div>
    )
}
