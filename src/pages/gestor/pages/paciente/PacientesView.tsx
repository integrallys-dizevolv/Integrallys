import React, { useState, useMemo } from 'react'
import {
    Search,
    Plus,
    MoreVertical,
    Eye,
    Edit2,
    Trash2,
    Users,
    ClipboardList,
    Pill,
    PlusCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell
} from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb'
import { MOCK_PATIENTS, Patient } from '@/mocks/gestor/pacientes'
import { RegistrarEvolucaoModal } from '@/pages/especialista/pages/evolucoes/modals/RegistrarEvolucaoModal'
import { AjustePosologiaModal } from '@/pages/especialista/pages/paciente/modals/AjustePosologiaModal'
import { PrescricaoComplementarModal } from '@/pages/especialista/pages/paciente/modals/PrescricaoComplementarModal'
import { getOrCreateUltimaPrescricao, PrescricaoAtiva } from '@/services/especialistaPrescricoes.service'


interface PacientesViewProps {
    onPageChange?: (page: string) => void
}

export const PacientesView = ({ onPageChange }: PacientesViewProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
    const [isEvolucaoModalOpen, setIsEvolucaoModalOpen] = useState(false)
    const [isAjustePosologiaOpen, setIsAjustePosologiaOpen] = useState(false)
    const [isComplementarOpen, setIsComplementarOpen] = useState(false)
    const [prescricaoSelecionada, setPrescricaoSelecionada] = useState<PrescricaoAtiva | null>(null)

    // Mock data matching the image
    const [patients] = useState<Patient[]>(MOCK_PATIENTS)

    const handleRegistrarEvolucao = (patient: Patient) => {
        setSelectedPatient(patient)
        setIsEvolucaoModalOpen(true)
    }

    const handleAjustePosologia = (patient: Patient) => {
        const prescricao = getOrCreateUltimaPrescricao(patient.name)
        setPrescricaoSelecionada(prescricao)
        setSelectedPatient(patient)
        setIsAjustePosologiaOpen(true)
    }

    const handlePrescricaoComplementar = (patient: Patient) => {
        setSelectedPatient(patient)
        setIsComplementarOpen(true)
    }

    const filteredPatients = useMemo(() => {
        const term = searchTerm.toLowerCase()
        return patients.filter(patient =>
            patient.name.toLowerCase().includes(term) ||
            patient.email.toLowerCase().includes(term) ||
            patient.cpf.includes(term)
        )
    }, [searchTerm, patients])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Cadastro Completo':
                return (
                    <Badge className="bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white border-none shadow-sm font-normal rounded-lg px-3 py-1 whitespace-nowrap">
                        Cadastro Completo
                    </Badge>
                )
            case 'Cadastro Incompleto':
                return (
                    <Badge className="bg-amber-500 dark:bg-amber-900/40 dark:text-amber-100 text-white border-none shadow-sm font-normal rounded-lg px-3 py-1 whitespace-nowrap">
                        Cadastro Incompleto
                    </Badge>
                )
            case 'Inativo':
                return (
                    <Badge className="bg-gray-600 dark:bg-app-bg-dark dark:text-app-text-muted text-white border-none shadow-sm font-normal rounded-lg px-3 py-1 whitespace-nowrap">
                        Inativo
                    </Badge>
                )
            default:
                return (
                    <Badge className="bg-gray-600 dark:bg-app-bg-dark dark:text-app-text-muted text-white border-none shadow-sm font-normal rounded-lg px-3 py-1 whitespace-nowrap text-[10px]">
                        {status}
                    </Badge>
                )
        }
    }

    return (
        <div className="space-y-6">
            <RegistrarEvolucaoModal
                isOpen={isEvolucaoModalOpen}
                onClose={() => setIsEvolucaoModalOpen(false)}
                paciente={selectedPatient ? { id: selectedPatient.id, nome: selectedPatient.name } : null}
            />

            <AjustePosologiaModal
                isOpen={isAjustePosologiaOpen}
                onClose={() => setIsAjustePosologiaOpen(false)}
                prescricao={prescricaoSelecionada}
            />

            <PrescricaoComplementarModal
                isOpen={isComplementarOpen}
                onClose={() => setIsComplementarOpen(false)}
                paciente={selectedPatient?.name || ''}
            />
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
                        <BreadcrumbPage className="text-sm font-normal text-gray-900 dark:text-white">Pacientes</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-normal text-[#101828] dark:text-white">Pacientes</h2>
                    <p className="text-app-text-muted dark:text-app-text-muted text-sm mt-1 font-normal">Gerencie os pacientes cadastrados no sistema.</p>
                </div>

                <Button
                    className="h-11 px-6 bg-[#0039A6] hover:bg-[#002d82] text-white rounded-xl flex items-center justify-center gap-2 shadow-sm shrink-0 transition-all font-normal"
                >
                    <Plus className="h-5 w-5" />
                    <span>Novo paciente</span>
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-app-text-muted" />
                    <Input
                        placeholder="Buscar por nome, e-mail ou CPF..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-11 pl-11 bg-app-card dark:bg-[#020817] border-app-border dark:border-app-border-dark rounded-xl text-sm focus:ring-[#0039A6] transition-all font-normal"
                    />
                </div>
            </div>

            <Card className="border-app-border/60 dark:border-app-border-dark overflow-hidden rounded-2xl shadow-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto custom-scrollbar">
                        <Table>
                            <TableHeader className="bg-app-bg-secondary/50 dark:bg-app-card/5">
                                <TableRow className="hover:bg-transparent border-gray-100 dark:border-app-border-dark">
                                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Nome</TableHead>
                                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">E-mail</TableHead>
                                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Telefone</TableHead>
                                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">CPF</TableHead>
                                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Última consulta</TableHead>
                                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Status</TableHead>
                                    <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider text-right whitespace-nowrap">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPatients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-20">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 bg-app-bg-secondary dark:bg-app-card/5 rounded-full flex items-center justify-center mb-4 text-app-text-muted">
                                                    <Users className="h-8 w-8" />
                                                </div>
                                                <p className="text-[#6a7282] dark:text-app-text-muted font-normal text-base">
                                                    Nenhum paciente encontrado.
                                                </p>
                                                <p className="text-app-text-muted text-sm mt-1 font-normal">Experimente ajustar o filtro de busca.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPatients.map((patient) => (
                                        <TableRow key={patient.id} className="group hover:bg-app-bg-secondary/50 dark:hover:bg-app-card/5 transition-colors border-gray-100 dark:border-app-border-dark">
                                            <TableCell className="px-6 py-4">
                                                <span className="font-normal text-[#101828] dark:text-white whitespace-nowrap">{patient.name}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <span className="text-[#6a7282] dark:text-app-text-muted text-sm whitespace-nowrap font-normal">{patient.email}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <span className="text-[#6a7282] dark:text-app-text-muted text-sm whitespace-nowrap font-normal">{patient.phone}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <span className="text-[#6a7282] dark:text-app-text-muted text-sm whitespace-nowrap font-normal">{patient.cpf}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <span className="text-[#6a7282] dark:text-app-text-muted text-sm whitespace-nowrap font-normal">{patient.lastConsultation}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    {getStatusBadge(patient.status)}
                                                    {patient.activeStatus && (
                                                        <Badge className={patient.activeStatus === 'Ativo'
                                                            ? 'bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white w-fit text-[10px] rounded-md px-2 py-0.5 font-normal border-none shadow-sm'
                                                            : 'bg-gray-600 dark:bg-app-bg-dark dark:text-app-text-muted text-white w-fit text-[10px] rounded-md px-2 py-0.5 font-normal border-none shadow-sm'
                                                        }>
                                                            {patient.activeStatus}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-9 w-9 rounded-lg hover:bg-app-card hover:shadow-sm dark:hover:bg-app-card/10 font-normal"
                                                            >
                                                                <MoreVertical className="h-5 w-5 text-[#6a7282] dark:text-app-text-muted" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-app-border dark:border-app-border-dark dark:bg-[#0c1e3d]">
                                                            <DropdownMenuItem className="py-2.5 rounded-lg focus:bg-app-bg-secondary dark:focus:bg-app-card/10 group cursor-pointer font-normal">
                                                                <Eye className="h-4 w-4 mr-3 text-app-text-muted group-hover:text-[#0039A6] dark:group-hover:text-white" />
                                                                <span className="text-gray-700 dark:text-gray-200 group-hover:text-[#101828] dark:group-hover:text-white">Visualizar</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="py-2.5 rounded-lg focus:bg-app-bg-secondary dark:focus:bg-app-card/10 group cursor-pointer font-normal">
                                                                <Edit2 className="h-4 w-4 mr-3 text-app-text-muted group-hover:text-[#0039A6] dark:group-hover:text-white" />
                                                                <span className="text-gray-700 dark:text-gray-200 group-hover:text-[#101828] dark:group-hover:text-white">Editar</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleRegistrarEvolucao(patient)}
                                                                className="py-2.5 rounded-lg focus:bg-app-bg-secondary dark:focus:bg-app-card/10 group cursor-pointer font-normal"
                                                            >
                                                                <ClipboardList className="h-4 w-4 mr-3 text-app-text-muted group-hover:text-[#0039A6] dark:group-hover:text-white" />
                                                                <span className="text-gray-700 dark:text-gray-200 group-hover:text-[#101828] dark:group-hover:text-white">Registrar evolução</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleAjustePosologia(patient)}
                                                                className="py-2.5 rounded-lg focus:bg-app-bg-secondary dark:focus:bg-app-card/10 group cursor-pointer font-normal"
                                                            >
                                                                <Pill className="h-4 w-4 mr-3 text-app-text-muted group-hover:text-[#0039A6] dark:group-hover:text-white" />
                                                                <span className="text-gray-700 dark:text-gray-200 group-hover:text-[#101828] dark:group-hover:text-white">Ajuste de posologia</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handlePrescricaoComplementar(patient)}
                                                                className="py-2.5 rounded-lg focus:bg-app-bg-secondary dark:focus:bg-app-card/10 group cursor-pointer font-normal"
                                                            >
                                                                <PlusCircle className="h-4 w-4 mr-3 text-app-text-muted group-hover:text-[#0039A6] dark:group-hover:text-white" />
                                                                <span className="text-gray-700 dark:text-gray-200 group-hover:text-[#101828] dark:group-hover:text-white">Prescrição complementar</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="py-2.5 rounded-lg focus:bg-red-50 dark:focus:bg-red-900/20 text-red-600 dark:text-red-400 group cursor-pointer font-normal">
                                                                <Trash2 className="h-4 w-4 mr-3 text-red-400 group-hover:text-red-600" />
                                                                <span>Excluir</span>
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
        </div>

    )
}
