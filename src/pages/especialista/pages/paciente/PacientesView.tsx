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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { Search, Plus, MoreHorizontal, FileText, Trash2, Users, Eye, ClipboardList, Pill, PlusCircle } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table"
import { FichaPacienteModal, RegistrarEvolucaoModal, ExcluirPacienteModal, AjustePosologiaModal, PrescricaoComplementarModal } from '../../modals'
import { MOCK_PACIENTES, type Paciente } from '@/mocks/especialista/pacientes'
import { getOrCreateUltimaPrescricao, PrescricaoAtiva } from '@/services/especialistaPrescricoes.service'

interface PacientesViewProps {
    onPageChange: (page: string) => void
}

export const PacientesView = ({ onPageChange }: PacientesViewProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null)
    const [isFichaModalOpen, setIsFichaModalOpen] = useState(false)
    const [isEvolucaoModalOpen, setIsEvolucaoModalOpen] = useState(false)
    const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false)
    const [isAjustePosologiaOpen, setIsAjustePosologiaOpen] = useState(false)
    const [isComplementarOpen, setIsComplementarOpen] = useState(false)
    const [prescricaoSelecionada, setPrescricaoSelecionada] = useState<PrescricaoAtiva | null>(null)

    const handleVerFicha = (paciente: Paciente) => {
        setSelectedPaciente(paciente)
        setIsFichaModalOpen(true)
    }

    const handleRegistrarEvolucao = (paciente: Paciente) => {
        setSelectedPaciente(paciente)
        setIsEvolucaoModalOpen(true)
    }

    const handleExcluirPaciente = (paciente: Paciente) => {
        setSelectedPaciente(paciente)
        setIsExcluirModalOpen(true)
    }

    const handleAjustePosologia = (paciente: Paciente) => {
        const prescricao = getOrCreateUltimaPrescricao(paciente.nome)
        setPrescricaoSelecionada(prescricao)
        setSelectedPaciente(paciente)
        setIsAjustePosologiaOpen(true)
    }

    const handlePrescricaoComplementar = (paciente: Paciente) => {
        setSelectedPaciente(paciente)
        setIsComplementarOpen(true)
    }

    const filteredPacientes = MOCK_PACIENTES.filter(p =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => onPageChange?.('inicio')} className="cursor-pointer text-[#1A1A1AB2] dark:text-[#c3cec9] hover:text-[#0039A6] dark:hover:text-white">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-app-text-primary dark:text-white font-normal">Pacientes</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <PageHeader
                title="Pacientes"
                subtitle="Gerencie seu cadastro de pacientes."
                onPageChange={onPageChange}
                primaryAction={{
                    label: "Novo paciente",
                    onClick: () => onPageChange('novo-paciente')
                }}
            />



            {/* Table Card */}
            <div className="bg-white dark:bg-app-card-dark rounded-[14px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-gray-900 dark:text-white" />
                        <h2 className="text-lg font-normal text-gray-900 dark:text-white">Lista de pacientes</h2>
                    </div>
                    <div className="relative w-full md:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted" />
                        <Input
                            placeholder="Buscar pacientes..."
                            className="pl-10 h-10 rounded-[10px] border-app-border dark:border-app-border-dark bg-white dark:bg-app-card-dark placeholder:text-app-text-muted focus-visible:ring-[#0039A6]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-gray-100 dark:border-gray-800 hover:bg-transparent">
                                <TableHead className="font-normal text-app-text-muted py-4">Nome</TableHead>
                                <TableHead className="font-normal text-app-text-muted py-4">Idade</TableHead>
                                <TableHead className="font-normal text-app-text-muted py-4">Plano de saúde</TableHead>
                                <TableHead className="font-normal text-app-text-muted py-4">Última consulta</TableHead>
                                <TableHead className="font-normal text-app-text-muted py-4 text-center">Status</TableHead>
                                <TableHead className="font-normal text-app-text-muted py-4 text-center">Ações</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredPacientes.map((paciente) => (
                                <TableRow key={paciente.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-app-bg-secondary dark:hover:bg-app-bg-dark/50 transition-colors">
                                    <TableCell className="font-normal text-gray-900 dark:text-white">
                                        {paciente.nome}
                                        <span className="block text-xs text-app-text-muted dark:text-app-text-muted">{paciente.telefone}</span>
                                    </TableCell>
                                    <TableCell className="text-gray-600 dark:text-white/80">{paciente.idade} anos</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="rounded-full border-gray-100 bg-app-bg-secondary/50 text-gray-600 dark:bg-app-bg-dark/50 dark:text-app-text-muted dark:border-app-border-dark px-3 py-0.5 font-normal whitespace-nowrap">
                                            {paciente.plano}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-600 dark:text-app-text-muted text-sm">{paciente.ultimaConsulta}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={`
                                            rounded-lg text-[10px] tracking-wider px-2.5 py-1 transition-colors
                                            ${paciente.status === 'Ativo'
                                                ? 'bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white border-none shadow-sm font-normal'
                                                : 'bg-gray-600 dark:bg-app-bg-dark dark:text-white/80 text-white border-none shadow-sm font-normal'}
                                        `}>
                                            {paciente.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button className="h-9 w-9 p-0 bg-transparent hover:bg-transparent shadow-none border-none flex items-center justify-center mx-auto transition-none">
                                                    <MoreHorizontal className="h-5 w-5 text-gray-900 dark:text-white shrink-0" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[220px] rounded-[14px] p-2 shadow-xl border-gray-100 dark:border-gray-800 bg-white dark:bg-app-card-dark">
                                                <DropdownMenuItem
                                                    className="cursor-pointer py-3 rounded-[10px] flex items-center gap-3 text-gray-700 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors"
                                                    onClick={() => handleVerFicha(paciente)}
                                                >
                                                    <Eye className="h-4 w-4 text-app-text-muted shrink-0" />
                                                    <span className="font-normal whitespace-nowrap">Ver ficha</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="cursor-pointer py-3 rounded-[10px] flex items-center gap-3 text-gray-700 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors"
                                                    onClick={() => handleRegistrarEvolucao(paciente)}
                                                >
                                                    <ClipboardList className="h-4 w-4 text-app-text-muted shrink-0" />
                                                    <span className="font-normal whitespace-nowrap">Registrar evolução</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="cursor-pointer py-3 rounded-[10px] flex items-center gap-3 text-gray-700 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors"
                                                    onClick={() => handleAjustePosologia(paciente)}
                                                >
                                                    <Pill className="h-4 w-4 text-app-text-muted shrink-0" />
                                                    <span className="font-normal whitespace-nowrap">Ajuste de posologia</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="cursor-pointer py-3 rounded-[10px] flex items-center gap-3 text-gray-700 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors"
                                                    onClick={() => handlePrescricaoComplementar(paciente)}
                                                >
                                                    <PlusCircle className="h-4 w-4 text-app-text-muted shrink-0" />
                                                    <span className="font-normal whitespace-nowrap">Prescrição complementar</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="cursor-pointer py-3 rounded-[10px] flex items-center gap-3 text-gray-700 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors"
                                                    onClick={() => onPageChange('visualizar-prontuario')}
                                                >
                                                    <FileText className="h-4 w-4 text-app-text-muted shrink-0" />
                                                    <span className="font-normal whitespace-nowrap">Visualizar prontuário</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="cursor-pointer py-3 rounded-[10px] flex items-center gap-3 text-red-600 focus:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                                    onClick={() => handleExcluirPaciente(paciente)}
                                                >
                                                    <Trash2 className="h-4 w-4 shrink-0" />
                                                    <span className="font-normal whitespace-nowrap">Excluir paciente</span>
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

            <FichaPacienteModal
                isOpen={isFichaModalOpen}
                onClose={() => setIsFichaModalOpen(false)}
                paciente={selectedPaciente}
            />

            <RegistrarEvolucaoModal
                isOpen={isEvolucaoModalOpen}
                onClose={() => setIsEvolucaoModalOpen(false)}
                paciente={selectedPaciente}
            />

            <ExcluirPacienteModal
                isOpen={isExcluirModalOpen}
                onClose={() => setIsExcluirModalOpen(false)}
                paciente={selectedPaciente}
            />

            <AjustePosologiaModal
                isOpen={isAjustePosologiaOpen}
                onClose={() => setIsAjustePosologiaOpen(false)}
                prescricao={prescricaoSelecionada}
            />

            <PrescricaoComplementarModal
                isOpen={isComplementarOpen}
                onClose={() => setIsComplementarOpen(false)}
                paciente={selectedPaciente?.nome || ''}
            />
        </div>
    )
}
