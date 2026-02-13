import React, { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu'
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell
} from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { MOCK_WAITING_LIST } from '@/mocks/recepcionista/listaEspera'
import { Calendar, CheckCircle, Clock, Edit2, Moon, MoreVertical, Phone, Search, Sun, Sunset, Trash2, Users } from 'lucide-react'

interface ListaEsperaViewProps {
    onPageChange?: (page: string) => void;
}

export const ListaEsperaView = ({ onPageChange }: ListaEsperaViewProps) => {
    const setCurrentPage = onPageChange;
    const [searchTerm, setSearchTerm] = useState('')
    const [specialistFilter, setSpecialistFilter] = useState('todos')
    const [unitFilter, setUnitFilter] = useState('todos')
    const [priorityFilter, setPriorityFilter] = useState('todos')
    const [patients] = useState(MOCK_WAITING_LIST)

    const filteredPatients = useMemo(() => {
        return patients.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.specialist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.procedure.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesSpecialist = specialistFilter === 'todos' ||
                p.specialist.toLowerCase().includes(specialistFilter.toLowerCase());

            const matchesUnit = unitFilter === 'todos' ||
                p.unit.toLowerCase() === unitFilter.toLowerCase();

            const matchesPriority = priorityFilter === 'todos' ||
                p.priority.toLowerCase() === priorityFilter.toLowerCase();

            return matchesSearch && matchesSpecialist && matchesUnit && matchesPriority;
        })
    }, [searchTerm, patients, specialistFilter, unitFilter, priorityFilter])

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'Alta':
                return <Badge className="bg-red-600 dark:bg-red-900/60 text-white dark:text-red-100 border-none shadow-sm font-normal rounded-full px-4 py-1">Alta</Badge>
            case 'Média':
                return <Badge className="bg-amber-500 dark:bg-amber-900/60 text-white dark:text-amber-100 border-none shadow-sm font-normal rounded-full px-4 py-1">Média</Badge>
            case 'Baixa':
                return <Badge className="bg-emerald-600 dark:bg-emerald-900/60 text-white dark:text-emerald-100 border-none shadow-sm font-normal rounded-full px-4 py-1">Baixa</Badge>
            default:
                return <Badge variant="outline" className="rounded-full px-4 py-1 font-normal text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800">
                    {priority}
                </Badge>
        }
    }

    const getPreferenciaHorarioBadge = (preferencia: string | null | undefined) => {
        if (!preferencia) return <span className="text-xs text-app-text-muted dark:text-white/40">-</span>;

        switch (preferencia) {
            case 'Manhã':
                return (
                    <div className="flex items-center gap-1.5">
                        <Sun className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-xs text-app-text-secondary dark:text-white/80">Manhã</span>
                    </div>
                )
            case 'Tarde':
                return (
                    <div className="flex items-center gap-1.5">
                        <Sunset className="h-3.5 w-3.5 text-orange-500" />
                        <span className="text-xs text-app-text-secondary dark:text-white/80">Tarde</span>
                    </div>
                )
            case 'Final do dia':
                return (
                    <div className="flex items-center gap-1.5">
                        <Moon className="h-3.5 w-3.5 text-indigo-500" />
                        <span className="text-xs text-app-text-secondary dark:text-white/80">Final do dia</span>
                    </div>
                )
            default:
                return <span className="text-xs text-app-text-muted dark:text-white/40">-</span>;
        }
    }

    const stats = useMemo(() => {
        const total = patients.length;
        const highPriority = patients.filter(p => p.priority === 'Alta').length;
        const avgWaitTime = Math.round(patients.reduce((acc, curr) => acc + parseInt(curr.waitTime), 0) / total) || 0;

        return { total, highPriority, avgWaitTime };
    }, [patients]);


    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-full mx-auto pb-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => setCurrentPage?.('inicio')} className="cursor-pointer text-app-text-primary/70 dark:text-white/80 hover:text-[#0039A6] dark:hover:text-white">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-app-text-primary dark:text-white font-normal">Lista de Espera</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-sm border-app-border dark:border-app-border-dark">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-sm font-normal text-app-text-secondary dark:text-white/60">Total na espera</span>
                            <h2 className="text-2xl font-normal text-app-text-primary dark:text-white">{stats.total}</h2>
                            <p className="text-xs text-app-text-muted font-normal">Pacientes aguardando</p>
                        </div>
                        <div>
                            <Users size={28} className="text-app-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-app-border dark:border-app-border-dark">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-sm font-normal text-app-text-secondary dark:text-white/60">Alta prioridade</span>
                            <h2 className="text-2xl font-normal text-app-text-primary dark:text-white">{stats.highPriority}</h2>
                            <p className="text-xs text-app-text-muted font-normal">Casos urgentes</p>
                        </div>
                        <div>
                            <Clock size={28} className="text-red-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-app-border dark:border-app-border-dark">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-sm font-normal text-app-text-secondary dark:text-white/60">Tempo médio</span>
                            <h2 className="text-2xl font-normal text-app-text-primary dark:text-white">{stats.avgWaitTime} dias</h2>
                            <p className="text-xs text-app-text-muted font-normal">Tempo de espera</p>
                        </div>
                        <div>
                            <Calendar size={28} className="text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Action Bar & Filter */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                <div className="relative w-full lg:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted" />
                    <Input
                        placeholder="Buscar por paciente, especialista..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 bg-app-card dark:bg-app-card-dark border-app-border dark:border-app-border-dark rounded-xl font-normal focus-visible:ring-[#0039A6] focus-visible:border-[#0039A6]"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                    <Select value={specialistFilter} onValueChange={setSpecialistFilter}>
                        <SelectTrigger className="w-full lg:w-[180px] h-11 text-xs px-4 rounded-xl border-app-border dark:border-app-border-dark bg-app-card dark:bg-app-card-dark focus:ring-[#0039A6] focus:border-[#0039A6]">
                            <SelectValue preferPlaceholder placeholder="Especialista" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos os especialistas</SelectItem>
                            <SelectItem value="joao">João Santos</SelectItem>
                            <SelectItem value="ana">Ana Lima</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={unitFilter} onValueChange={setUnitFilter}>
                        <SelectTrigger className="w-full lg:w-[150px] h-11 text-xs px-4 rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0c1e3d] focus:ring-[#0039A6] focus:border-[#0039A6]">
                            <SelectValue preferPlaceholder placeholder="Unidade" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todas as unidades</SelectItem>
                            <SelectItem value="central">Central</SelectItem>
                            <SelectItem value="norte">Norte</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="w-full lg:w-[150px] h-11 text-xs px-4 rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0c1e3d] focus:ring-[#0039A6] focus:border-[#0039A6]">
                            <SelectValue preferPlaceholder placeholder="Prioridade" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todas as prioridades</SelectItem>
                            <SelectItem value="alta">Alta</SelectItem>
                            <SelectItem value="média">Média</SelectItem>
                            <SelectItem value="baixa">Baixa</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>


            {/* Tabela com Scroll Horizontal */}
            <div className="bg-app-card dark:bg-app-card-dark rounded-xl border border-app-border dark:border-app-border-dark shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-transparent hover:bg-transparent border-b border-app-border dark:border-app-border-dark">
                                <TableHead className="px-6 py-4 text-xs font-normal text-app-text-secondary dark:text-white/60 uppercase tracking-wide whitespace-nowrap">Paciente</TableHead>
                                <TableHead className="px-6 py-4 text-xs font-normal text-app-text-secondary dark:text-white/60 uppercase tracking-wide whitespace-nowrap">Contato</TableHead>
                                <TableHead className="px-6 py-4 text-xs font-normal text-app-text-secondary dark:text-white/60 uppercase tracking-wide whitespace-nowrap">Especialista</TableHead>
                                <TableHead className="px-6 py-4 text-xs font-normal text-app-text-secondary dark:text-white/60 uppercase tracking-wide whitespace-nowrap">Procedimento</TableHead>
                                <TableHead className="px-6 py-4 text-xs font-normal text-app-text-secondary dark:text-white/60 uppercase tracking-wide whitespace-nowrap">Unidade</TableHead>
                                <TableHead className="px-6 py-4 text-xs font-normal text-app-text-secondary dark:text-white/60 uppercase tracking-wide whitespace-nowrap">Tempo de espera</TableHead>
                                <TableHead className="px-6 py-4 text-xs font-normal text-app-text-secondary dark:text-white/60 uppercase tracking-wide whitespace-nowrap">Preferência</TableHead>
                                <TableHead className="px-6 py-4 text-xs font-normal text-app-text-secondary dark:text-white/60 uppercase tracking-wide whitespace-nowrap">Prioridade</TableHead>
                                <TableHead className="px-6 py-4 text-xs font-normal text-app-text-secondary dark:text-white/60 uppercase tracking-wide text-right whitespace-nowrap">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPatients.map((patient) => (
                                <TableRow key={patient.id} className="hover:bg-app-bg-secondary/50 dark:hover:bg-white/5 border-b border-app-border/50 dark:border-app-border-dark transition-colors">
                                    <TableCell className="px-6 py-5">
                                        <span className="font-normal text-app-text-primary dark:text-white whitespace-nowrap">{patient.name}</span>
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        <div className="flex flex-col gap-1 text-xs text-app-text-secondary dark:text-white/60 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <Phone size={12} />
                                                {patient.phone}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] w-3 text-center">@</span>
                                                {patient.email}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        <span className="text-sm font-normal text-app-text-secondary dark:text-white/80 whitespace-nowrap">{patient.specialist}</span>
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        <span className="text-sm text-app-text-secondary dark:text-white/60 whitespace-nowrap font-normal">{patient.procedure}</span>
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        <span className="text-sm text-app-text-secondary dark:text-white/60 whitespace-nowrap font-normal">{patient.unit}</span>
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        <div className="flex items-center gap-1.5 text-app-text-secondary dark:text-white/60 whitespace-nowrap">
                                            <Clock size={14} />
                                            <span className="text-sm">{patient.waitTime}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        {getPreferenciaHorarioBadge(patient.preferenciaHorario)}
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        {getPriorityBadge(patient.priority)}
                                    </TableCell>
                                    <TableCell className="px-6 py-5 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-2 hover:bg-app-bg-secondary dark:hover:bg-white/10 rounded-lg transition-all text-app-text-muted">
                                                    <MoreVertical size={20} />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40 p-1 rounded-xl shadow-xl border-app-border dark:border-app-border-dark dark:bg-app-bg-dark">
                                                <DropdownMenuItem
                                                    className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
                                                    onClick={() => {
                                                        onPageChange?.('agenda');
                                                        toast.success(`Iniciando agendamento para ${patient.name}`);
                                                    }}
                                                >
                                                    <CheckCircle size={16} className="text-green-600" />
                                                    <span className="text-sm font-normal text-app-text-secondary dark:text-white/60">Agendar</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5">
                                                    <Edit2 size={16} className="text-app-text-secondary dark:text-white/60" />
                                                    <span className="text-sm font-normal text-app-text-secondary dark:text-white/60">Editar</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600">
                                                    <Trash2 size={16} />
                                                    <span className="text-sm font-normal">Remover</span>
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
            {
                filteredPatients.length === 0 && (
                    <div className="text-center py-10 bg-app-card dark:bg-app-card-dark">
                        <p className="text-app-text-muted dark:text-white/60">Nenhum paciente encontrado na fila de espera.</p>
                    </div>
                )
            }
        </div>
    )
}

