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

import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import {
    Search, Eye, Trash2, FileText, User, ArrowUpRight
} from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table"
import { VisualizarAnamneseModal, ExcluirAnamneseModal } from '../../modals'

interface Anamnese {
    id: number
    paciente: string
    data: string
    tipo: 'Consulta' | 'Reconsulta'
    imc: number
    peso: number
    gordura: number
    queixa: string
}

const MOCK_ANAMNESES: Anamnese[] = [
    {
        id: 1,
        paciente: 'Maria Silva',
        data: '14/11/2025',
        tipo: 'Consulta',
        imc: 25.2,
        peso: 68.5,
        gordura: 32.5,
        queixa: 'Fadiga constante, dificuldade para dormir, dores ...'
    },
    {
        id: 2,
        paciente: 'João Santos',
        data: '10/11/2025',
        tipo: 'Reconsulta',
        imc: 24.1,
        peso: 72.0,
        gordura: 28.2,
        queixa: 'Melhora no sono, mas mantém dores leves ...'
    }
]

interface AnamneseViewProps {
    onPageChange: (page: string) => void
}

export const AnamneseView = ({ onPageChange }: AnamneseViewProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedAnamnese, setSelectedAnamnese] = useState<Anamnese | null>(null)
    const [isVisualizarModalOpen, setIsVisualizarModalOpen] = useState(false)
    const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false)

    const handleVisualizar = (anamnese: Anamnese) => {
        setSelectedAnamnese(anamnese)
        setIsVisualizarModalOpen(true)
    }

    const handleExcluir = (anamnese: Anamnese) => {
        setSelectedAnamnese(anamnese)
        setIsExcluirModalOpen(true)
    }

    const confirmExcluir = () => {
        void selectedAnamnese
    }

    const filteredAnamneses = MOCK_ANAMNESES.filter(a =>
        a.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const stats = [
        { title: 'Total de anamneses', value: '2', icon: FileText, color: 'text-app-text-muted' },
        { title: 'Consultas', value: '1', icon: User, color: 'text-blue-500' },
        { title: 'Reconsultas', value: '1', icon: ArrowUpRight, color: 'text-emerald-500' },
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => onPageChange?.('inicio')} className="cursor-pointer text-[#1A1A1AB2] dark:text-[#c3cec9] hover:text-[#0039A6] dark:hover:text-white">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-app-text-primary dark:text-white font-normal">Anamnese</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <PageHeader
                title="Anamnese"
                subtitle="Registro estruturado de anamnese com bioimpedância"
                onPageChange={onPageChange}
                primaryAction={{
                    label: "Nova anamnese",
                    onClick: () => onPageChange('criar-anamnese')
                }}
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="p-8 rounded-[14px] border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-app-card-dark">
                        <div className="flex justify-between items-start">
                            <div className="space-y-3">
                                <span className="text-sm font-normal text-app-text-muted dark:text-app-text-muted tracking-wider">{stat.title}</span>
                                <h3 className="text-3xl font-normal text-gray-900 dark:text-white">{stat.value}</h3>
                            </div>
                            <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-app-text-muted" />
                <Input
                    placeholder="Buscar por paciente ou tipo..."
                    className="pl-12 h-14 rounded-[14px] border-gray-100 dark:border-gray-800 bg-white dark:bg-app-card-dark focus-visible:ring-[#0039A6] shadow-sm text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table Card */}
            <div className="bg-white dark:bg-app-card-dark rounded-[14px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-8 pb-4">
                    <h2 className="text-lg font-normal text-gray-900 dark:text-white tracking-tight">
                        Histórico de anamneses
                    </h2>
                </div>

                <div className="overflow-x-auto px-2">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-gray-100 dark:border-gray-800 hover:bg-transparent">
                                <TableHead className="font-normal text-gray-900 dark:text-app-text-muted py-4 px-6">Paciente</TableHead>
                                <TableHead className="font-normal text-gray-900 dark:text-app-text-muted py-4">Data</TableHead>
                                <TableHead className="font-normal text-gray-900 dark:text-app-text-muted py-4">Tipo</TableHead>
                                <TableHead className="font-normal text-gray-900 dark:text-app-text-muted py-4">Imc</TableHead>
                                <TableHead className="font-normal text-gray-900 dark:text-app-text-muted py-4">Peso</TableHead>
                                <TableHead className="font-normal text-gray-900 dark:text-app-text-muted py-4">Gordura (%)</TableHead>
                                <TableHead className="font-normal text-gray-900 dark:text-app-text-muted py-4">Queixa principal</TableHead>
                                <TableHead className="font-normal text-gray-900 dark:text-app-text-muted py-4 text-center">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAnamneses.map((anamnese) => (
                                <TableRow key={anamnese.id} className="border-b border-transparent dark:border-transparent hover:bg-app-bg-secondary dark:hover:bg-app-bg-dark/50 transition-colors">
                                    <TableCell className="font-normal text-gray-900 dark:text-white px-6 py-5">
                                        {anamnese.paciente}
                                    </TableCell>
                                    <TableCell className="text-gray-600 dark:text-white/80">
                                        {anamnese.data}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`
                                            px-3 py-1 font-normal rounded-lg border-none text-white shadow-sm
                                            ${anamnese.tipo === 'Consulta' ? 'bg-blue-600 dark:bg-blue-900/40 dark:text-blue-100' : 'bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100'}
                                        `}>
                                            {anamnese.tipo}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-normal text-orange-600">
                                        {anamnese.imc}
                                    </TableCell>
                                    <TableCell className="text-gray-700 dark:text-white/80">
                                        {anamnese.peso} kg
                                    </TableCell>
                                    <TableCell className="text-gray-700 dark:text-white/80">
                                        {anamnese.gordura}%
                                    </TableCell>
                                    <TableCell className="text-app-text-muted dark:text-app-text-muted max-w-[200px] truncate">
                                        {anamnese.queixa}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => handleVisualizar(anamnese)}
                                                className="p-2 hover:bg-app-bg-secondary dark:hover:bg-white/5 rounded-lg transition-colors group"
                                            >
                                                <Eye className="h-4 w-4 text-gray-900 dark:text-white" />
                                            </button>
                                            <button
                                                onClick={() => handleExcluir(anamnese)}
                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors group"
                                            >
                                                <Trash2 className="h-4 w-4 text-gray-900 dark:text-white group-hover:text-red-600" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <VisualizarAnamneseModal
                isOpen={isVisualizarModalOpen}
                onClose={() => setIsVisualizarModalOpen(false)}
                anamnese={selectedAnamnese ? {
                    ...selectedAnamnese,
                    altura: 165 // Mock height
                } : null}
            />

            <ExcluirAnamneseModal
                isOpen={isExcluirModalOpen}
                onClose={() => setIsExcluirModalOpen(false)}
                onConfirm={confirmExcluir}
                pacienteNome={selectedAnamnese?.paciente}
            />
        </div>
    )
}
