import { useState } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { Search, Plus, Eye, Trash2, Filter, ChevronDown, FileText } from 'lucide-react'
import { PageHeader, StandardTable } from '../../ui'
import { VisualizarPrescricaoModal, NovaPrescricaoModal, ExcluirPrescricaoModal } from '../../modals'
import { MOCK_PRESCRICOES, type Prescricao } from '@/mocks/especialista/prescricoes'

interface PrescricoesViewProps {
    onPageChange: (page: string) => void
}

export const PrescricoesView = ({ onPageChange }: PrescricoesViewProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('Todos os Status')
    const [typeFilter, setTypeFilter] = useState('Todos os Tipos')
    const [isVisualizarModalOpen, setIsVisualizarModalOpen] = useState(false)
    const [isNovaPrescricaoModalOpen, setIsNovaPrescricaoModalOpen] = useState(false)
    const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false)
    const [selectedPrescricao, setSelectedPrescricao] = useState<(Prescricao & { medico: string; validaAtre: string; instrucoes: string[] }) | null>(null)
    const [prescricaoToDelete, setPrescricaoToDelete] = useState<Prescricao | null>(null)

    const handleVisualizar = (p: Prescricao) => {
        setSelectedPrescricao({
            ...p,
            medico: 'Dr. Adelmo Silva',
            validaAtre: '08/11/2025',
            instrucoes: [
                'Creatina Monohidratada 5g - 1x ao dia pela manhã',
                'Whey Protein Isolado 30g - 2x ao dia (pós-treino e antes de dormir)',
                'Ômega 3 1000mg - 2 cápsulas ao dia com refeições'
            ]
        })
        setIsVisualizarModalOpen(true)
    }

    const handleDeleteClick = (p: Prescricao) => {
        setPrescricaoToDelete(p)
        setIsExcluirModalOpen(true)
    }

    const handleConfirmDelete = () => {
        void prescricaoToDelete
        setIsExcluirModalOpen(false)
        setPrescricaoToDelete(null)
    }

    const filteredPrescricoes = MOCK_PRESCRICOES.filter(p => {
        const matchesSearch = p.paciente.toLowerCase().includes(searchTerm.toLowerCase()) || p.numero.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'Todos os Status' || p.status === statusFilter
        const matchesType = typeFilter === 'Todos os Tipos' || p.tipo === typeFilter ||
            (typeFilter === 'Medicamentos' && p.tipo === 'Medicamento')
        return matchesSearch && matchesStatus && matchesType
    })

    const columns = [
        { header: 'Número', key: 'numero' },
        { header: 'Paciente', key: 'paciente' },
        { header: 'Data', key: 'data' },
        { header: 'Tipo', key: 'tipo' },
        { header: 'Validade', key: 'validade' },
        { header: 'Status', key: 'status', align: 'center' as const },
        { header: 'Ações', key: 'acoes', align: 'center' as const }
    ]

    const renderCell = (p: Prescricao, key: string) => {
        switch (key) {
            case 'numero': return <span className="font-normal text-gray-900 dark:text-white px-2">{p.numero}</span>
            case 'paciente': return <span className="font-normal text-gray-900 dark:text-white">{p.paciente}</span>
            case 'data': return <span className="text-gray-600 dark:text-white/80">{p.data}</span>
            case 'tipo': return (
                <Badge variant="outline" className="rounded-full border-gray-100 bg-app-bg-secondary/50 text-gray-600 dark:bg-app-bg-dark/50 dark:text-app-text-muted dark:border-app-border-dark px-3 py-0.5 font-medium whitespace-nowrap">
                    {p.tipo}
                </Badge>
            )
            case 'validade': return <span className="text-gray-600 dark:text-white/80">{p.validade}</span>
            case 'status': return (
                <Badge className={`
                    rounded-[8px] text-[10px] font-normal tracking-wider px-3 py-1.5 border-0 transition-all shadow-sm
                    ${p.status === 'Ativa'
                        ? 'bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white'
                        : p.status === 'Expirada'
                            ? 'bg-orange-600 dark:bg-amber-900/40 dark:text-amber-100 text-white'
                            : 'bg-red-600 dark:bg-red-900/40 dark:text-red-100 text-white'
                    }
                `}>
                    {p.status}
                </Badge>
            )
            case 'acoes': return (
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={() => handleVisualizar(p)}
                        className="p-2 hover:bg-app-bg-secondary dark:hover:bg-white/5 rounded-lg transition-colors text-gray-900 dark:text-white"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleDeleteClick(p)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-gray-900 dark:text-white hover:text-red-600"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            )
            default: return null
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
                        <BreadcrumbPage className="text-app-text-primary dark:text-white font-normal">Prescrições</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <PageHeader
                title="Prescrições médicas"
                subtitle="Prescrições para uso externo (farmácias, exames, orientações)"
                onPageChange={onPageChange}
                primaryAction={{
                    label: 'Nova prescrição',
                    icon: Plus,
                    onClick: () => setIsNovaPrescricaoModalOpen(true)
                }}
            />

            {/* Main Content Card */}
            <div className="bg-white dark:bg-app-card-dark rounded-[14px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-8 space-y-8">
                    {/* List Title */}
                    <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-gray-900 dark:text-white" />
                        <h2 className="text-xl font-normal text-gray-900 dark:text-white tracking-tight">
                            Lista de prescrições
                        </h2>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-app-text-muted" />
                            <Input
                                placeholder="Buscar por paciente ou número..."
                                className="pl-12 h-12 rounded-[12px] border-gray-100 dark:border-gray-800 bg-app-bg-secondary/50 dark:bg-app-table-header-dark focus-visible:ring-[#0039A6] transition-all w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto">
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
                                    <DropdownMenuItem onClick={() => setStatusFilter('Ativa')}>Ativa</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter('Expirada')}>Expirada</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter('Cancelada')}>Cancelada</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

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
                                    <DropdownMenuItem onClick={() => setTypeFilter('Medicamento')}>Medicamento</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTypeFilter('Exame')}>Exame</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTypeFilter('Orientação')}>Orientação</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTypeFilter('Suplementação')}>Suplementação</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <StandardTable
                        columns={columns}
                        data={filteredPrescricoes}
                        renderCell={renderCell}
                    />
                </div>
            </div>

            <VisualizarPrescricaoModal
                isOpen={isVisualizarModalOpen}
                onClose={() => setIsVisualizarModalOpen(false)}
                prescricao={selectedPrescricao}
            />

            <NovaPrescricaoModal
                isOpen={isNovaPrescricaoModalOpen}
                onClose={() => setIsNovaPrescricaoModalOpen(false)}
            />

            <ExcluirPrescricaoModal
                isOpen={isExcluirModalOpen}
                onClose={() => setIsExcluirModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}
