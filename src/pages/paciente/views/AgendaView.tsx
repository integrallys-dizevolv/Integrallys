import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, Calendar, Clock, MapPin, Eye, Edit2, X } from 'lucide-react'
import { DetalhesModal } from '../modals/DetalhesModal'
import { CancelarModal } from '../modals/CancelarModal'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/Breadcrumb'

interface AgendaViewProps {
    mockAgendamentos: any[]
    onPageChange: (page: string) => void
    onReagendar?: (appointment: any) => void
}

export function AgendaView({ mockAgendamentos, onPageChange, onReagendar }: AgendaViewProps) {
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isCancelOpen, setIsCancelOpen] = useState(false)

    const handleOpenDetails = (appointment: any) => {
        setSelectedAppointment(appointment)
        setIsDetailsOpen(true)
    }

    const handleOpenCancel = (appointment: any) => {
        setSelectedAppointment(appointment)
        setIsCancelOpen(true)
    }



    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            onClick={() => onPageChange('inicio')}
                            className="text-sm font-medium text-gray-500 hover:text-[#0039A6] dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
                        >
                            Início
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-sm font-medium text-gray-900 dark:text-white">Agenda</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-app-text-primary dark:text-white">Minha Agenda</h2>
                    <p className="text-sm text-app-text-muted dark:text-gray-400 mt-1">
                        {mockAgendamentos.length} consultas agendadas
                    </p>
                </div>
                <Button
                    className="bg-app-primary hover:bg-app-primary/90 text-white h-10 px-6 rounded-[10px] flex flex-row items-center justify-center gap-2 shadow-sm transition-all font-medium"
                    onClick={() => onPageChange('novo-agendamento')}
                >
                    <Plus className="h-4 w-4 shrink-0" />
                    Novo Agendamento
                </Button>
            </div>

            {/* Lista: Cards Compactos */}
            <div className="grid gap-4">
                {mockAgendamentos.map((item) => (
                    <div
                        key={item.id}
                        className="bg-app-card dark:bg-app-card-dark rounded-[14px] p-4 flex flex-col sm:flex-row sm:items-center gap-4 border border-app-border dark:border-app-border-dark shadow-sm transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-md cursor-pointer active:scale-95"
                    >
                        {/* Bloco de Cima: Ícone + Info (Sempre Lado a Lado) */}
                        <div className="flex flex-row items-center gap-4 flex-1 min-w-0">
                            {/* 1. Ícone Esquerdo */}
                            <div className="w-12 h-12 shrink-0 rounded-[12px] bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
                                <Calendar className="h-6 w-6" />
                            </div>

                            {/* 2. Informações Centrais */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                    <h3 className="font-bold text-[15px] sm:text-base text-[#1A1A1A] dark:text-white truncate">
                                        {item.medico}
                                    </h3>
                                    <Badge
                                        className={`
                                 h-5 px-2 text-[10px] font-semibold rounded-full border-none whitespace-nowrap
                                 ${item.status === 'Confirmada' || item.status === 'Concluído'
                                                ? 'bg-[#0039A6]/10 text-[#0039A6] dark:bg-[#0039A6]/20 dark:text-[#4ADE80]'
                                                : item.status === 'Agendado'
                                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                            }
                             `}
                                    >
                                        {item.status}
                                    </Badge>
                                </div>

                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">
                                    {item.especialidade}
                                </p>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-gray-500/80 dark:text-gray-400">
                                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                                        <Clock className="h-3.5 w-3.5 text-blue-500" />
                                        {item.data}
                                    </span>
                                    <span className="flex items-center gap-1.5 truncate">
                                        <MapPin className="h-3.5 w-3.5 text-red-400" />
                                        {item.local}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 3. Ações - Ajustadas para esconder texto no mobile */}
                        <div className="flex flex-row items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-app-border dark:border-app-border-dark sm:ml-auto shrink-0 w-full sm:w-auto">
                            {/* Botão Detalhes */}
                            <Button
                                variant="outline"
                                className="flex-1 sm:flex-none h-10 sm:h-9 px-2 sm:px-3 rounded-[10px] text-app-text-secondary dark:text-white dark:border-white/10 flex flex-row items-center justify-center gap-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDetails(item);
                                }}
                                title="Detalhes"
                            >
                                <Eye className="h-4 w-4 shrink-0" />
                                <span className="hidden sm:inline text-xs font-bold">Detalhes</span>
                            </Button>

                            {item.status === 'Agendado' && (
                                <>
                                    {/* Botão Reagendar */}
                                    <Button
                                        variant="outline"
                                        className="flex-1 sm:flex-none h-10 sm:h-9 px-2 sm:px-3 rounded-[10px] text-app-text-secondary dark:text-white dark:border-white/10 flex flex-row items-center justify-center gap-2"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onReagendar?.(item)
                                        }}
                                        title="Reagendar"
                                    >
                                        <Edit2 className="h-4 w-4 shrink-0" />
                                        <span className="hidden sm:inline text-xs font-bold">Reagendar</span>
                                    </Button>

                                    {/* Botão Cancelar */}
                                    <Button
                                        variant="outline"
                                        className="flex-1 sm:flex-none h-10 sm:h-9 px-2 sm:px-3 rounded-[10px] text-red-600 border-red-100 bg-red-50/30 dark:border-red-900/30 dark:bg-red-900/10 flex flex-row items-center justify-center gap-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenCancel(item);
                                        }}
                                        title="Cancelar"
                                    >
                                        <X className="h-4 w-4 shrink-0" />
                                        <span className="hidden sm:inline text-xs font-bold">Cancelar</span>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <DetalhesModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                consulta={selectedAppointment}
            />

            <CancelarModal
                isOpen={isCancelOpen}
                onClose={() => setIsCancelOpen(false)}
                onConfirm={() => {
                    // Lógica de cancelamento aqui
                    setIsCancelOpen(false)
                }}
            />
        </div>
    )
}
