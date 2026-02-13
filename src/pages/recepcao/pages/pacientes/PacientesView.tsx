import { useState } from 'react'
import {
    Search,
    Plus,
    Trash2,
    Phone,
    Mail,
    Edit,
    MoreVertical,
    FileText
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Patient } from '../../context/types'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu'
import { NovoPacienteModal } from './modals/NovoPacienteModal'
import { EditarPacienteModal } from './modals/EditarPacienteModal'
import { ExcluirPacienteModal } from './modals/ExcluirPacienteModal'
import { ManualServicosModal } from './modals/ManualServicosModal'
import { MOCK_PACIENTES } from '@/mocks/recepcionista/pacientes'

interface PacientesViewProps {
    onPageChange: (page: string) => void
}

export const PacientesView = ({ onPageChange }: PacientesViewProps) => {
    const setCurrentPage = onPageChange;
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('todos')
    const [unitFilter, setUnitFilter] = useState('todos')
    const [isNewPatientOpen, setIsNewPatientOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isManualOpen, setIsManualOpen] = useState(false)
    const [selectedPaciente, setSelectedPaciente] = useState<Patient | null>(null)

    const patients = MOCK_PACIENTES

    const filteredPatients = patients.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.cpf.includes(searchTerm) ||
            p.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'todos' ||
            (statusFilter === 'ativo' && (p.activeStatus || 'Ativo') === 'Ativo') ||
            (statusFilter === 'inativo' && (p.activeStatus || 'Ativo') === 'Inativo') ||
            (statusFilter === 'obito' && p.activeStatus === 'Óbito');

        // Note: unit is not in mock data yet, so we only filter if it's 'todos' or skip
        const matchesUnit = unitFilter === 'todos';

        return matchesSearch && matchesStatus && matchesUnit;
    });



    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => setCurrentPage?.('inicio')} className="cursor-pointer text-app-text-primary/70 dark:text-white/80 hover:text-[#0039A6] dark:hover:text-white">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-app-text-primary dark:text-white font-normal">Pacientes</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Modais */}

            <NovoPacienteModal
                isOpen={isNewPatientOpen}
                onClose={() => setIsNewPatientOpen(false)}
            />
            <EditarPacienteModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                paciente={selectedPaciente}
            />
            <ExcluirPacienteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={() => {
                    console.log('Excluindo paciente:', selectedPaciente?.name);
                    setIsDeleteOpen(false);
                }}
                paciente={selectedPaciente}
            />
            <ManualServicosModal
                isOpen={isManualOpen}
                onClose={() => setIsManualOpen(false)}
                paciente={selectedPaciente}
            />

            {/* Header com Busca e Filtros */}
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
                    <div className="relative w-full sm:max-w-xs lg:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-primary/70 dark:text-white/40" />
                        <Input
                            placeholder="Buscar por nome ou CPF..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-10 pl-9 bg-app-card dark:bg-app-card-dark border-app-border dark:border-app-border-dark rounded-lg text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-40 h-10 text-xs">
                                <SelectValue preferPlaceholder placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos os status</SelectItem>
                                <SelectItem value="ativo">Ativo</SelectItem>
                                <SelectItem value="inativo">Inativo</SelectItem>
                                <SelectItem value="obito">Óbito</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={unitFilter} onValueChange={setUnitFilter}>
                            <SelectTrigger className="w-full sm:w-40 h-10 text-xs">
                                <SelectValue preferPlaceholder placeholder="Unidade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todas as unidades</SelectItem>
                                <SelectItem value="central">Central</SelectItem>
                                <SelectItem value="norte">Norte</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button
                    onClick={() => setIsNewPatientOpen(true)}
                    className="h-10 px-4 bg-[#0039A6] hover:bg-[#002d82] text-white rounded-lg flex items-center justify-center gap-2 shadow-sm shrink-0 whitespace-nowrap font-normal"
                >
                    <Plus className="h-4 w-4" />
                    <span>Novo paciente</span>
                </Button>
            </div>

            {/* Tabela de Pacientes */}
            <Card className="rounded-[16px] border-app-border dark:border-app-border-dark overflow-hidden">
                <CardContent className="p-0">
                    <div className="px-8 pt-8 pb-4">
                        <h2 className="text-lg font-normal text-app-text-primary dark:text-white">Lista de pacientes ({filteredPatients.length})</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[200px] pl-8 font-normal">Nome</TableHead>
                                    <TableHead className="min-w-[200px] font-normal">Contato</TableHead>
                                    <TableHead className="min-w-[150px] font-normal">Plano de saúde</TableHead>
                                    <TableHead className="min-w-[200px] font-normal">Status</TableHead>
                                    <TableHead className="min-w-[150px] font-normal">Última consulta</TableHead>
                                    <TableHead className="text-center min-w-[100px] font-normal">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPatients.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="pl-8">
                                            <div className="space-y-0.5 py-1">
                                                <p className="font-normal text-app-text-primary dark:text-white text-[14px]">{p.name}</p>
                                                <p className="text-[12px] text-app-text-muted font-normal">{p.age}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1.5 py-1">
                                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                    <Phone size={14} className="text-app-text-muted/80" />
                                                    <span className="text-[13px] font-normal tracking-tight">{p.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                    <Mail size={14} className="text-app-text-muted/80" />
                                                    <span className="text-[13px] font-normal tracking-tight">{p.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="px-4 py-1.5 rounded-[12px] border-app-border dark:border-app-border-dark text-[12px] text-app-text-secondary dark:text-white/80 font-normal bg-app-card dark:bg-transparent shadow-sm">
                                                {p.plan}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1.5 py-1">
                                                <Badge className={`w-fit text-[10px] tracking-wider font-normal px-4 py-1 rounded-full border-none shadow-sm text-white ${p.status === 'complete'
                                                    ? 'bg-blue-600 dark:bg-blue-900/60 dark:text-blue-100'
                                                    : 'bg-amber-500 dark:bg-amber-900/60 dark:text-amber-100'
                                                    }`}>
                                                    {p.status === 'complete' ? 'Cadastro completo' : 'Cadastro incompleto'}
                                                </Badge>
                                                <Badge className={`w-fit text-[10px] tracking-wider font-normal px-4 py-1 rounded-full border-none transition-all shadow-sm text-white ${
                                                    (p.activeStatus || 'Ativo') === 'Óbito'
                                                        ? 'bg-gray-700 dark:bg-gray-900 dark:text-gray-200'
                                                        : (p.activeStatus || 'Ativo') === 'Inativo'
                                                            ? 'bg-slate-500 dark:bg-slate-800 dark:text-slate-300'
                                                            : 'bg-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-100'
                                                    }`}>
                                                    {p.activeStatus || 'Ativo'}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-[13px] text-app-text-secondary dark:text-white/60 font-normal">
                                                {p.lastVisit ? new Date(p.lastVisit).toLocaleDateString('pt-BR') : '---'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 mx-auto">
                                                        <MoreVertical className="h-4 w-4 text-app-text-secondary dark:text-white/60" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-[12px]">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedPaciente(p);
                                                            setIsEditOpen(true);
                                                        }}
                                                        className="gap-2 focus:bg-app-bg-secondary dark:focus:bg-white/5 cursor-pointer py-2.5 font-normal"
                                                    >
                                                        <Edit size={14} className="text-gray-400" />
                                                        Editar cadastro
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedPaciente(p);
                                                            setIsManualOpen(true);
                                                        }}
                                                        className="gap-2 focus:bg-app-bg-secondary dark:focus:bg-white/5 cursor-pointer py-2.5 font-normal"
                                                    >
                                                        <FileText size={14} className="text-[#0039A6]" />
                                                        Manual de Serviços
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedPaciente(p);
                                                            setIsDeleteOpen(true);
                                                        }}
                                                        className="gap-2 focus:bg-red-50 dark:focus:bg-red-900/10 text-red-600 dark:text-red-400 cursor-pointer py-2.5 font-normal"
                                                    >
                                                        <Trash2 size={14} />
                                                        Excluir paciente
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
