import React, { useState } from 'react'
import { PageHeader } from '../../../ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ChevronLeft, FileText, Calendar, Edit3, CheckCircle, Trash2, User, MessageSquare, Home, Stethoscope, ClipboardList, Box, ChevronDown, ChevronUp } from 'lucide-react'
import { EditarProntuarioModal, ExcluirProntuarioModal } from '../../../modals'

interface VisualizarProntuarioViewProps {
    onPageChange: (page: string) => void
}

export function VisualizarProntuarioView({ onPageChange }: VisualizarProntuarioViewProps) {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const consultasAnteriores = [
        {
            id: 1,
            data: '10/09/2024',
            status: 'Finalizado',
            tipo: 'Avaliação Nutricional Funcional',
            queixa: 'Ganho de peso progressivo nos últimos 6 meses',
            diagnostico: 'Desequilíbrio metabólico, deficiência de vitamina D',
            conduta: 'Prescrição de suplementação vitamínica e plano alimentar personalizado'
        },
        {
            id: 2,
            data: '05/06/2024',
            status: 'Finalizado',
            tipo: 'Primeira Consulta Geral',
            queixa: 'Cansaço constante e dores de cabeça',
            diagnostico: 'Stress crônico e má alimentação',
            conduta: 'Indicação de atividades físicas e ajuste na rotina de sono'
        }
    ];

    const breadcrumbs = [
        { label: 'Prontuários', onClick: () => onPageChange('prontuario') },
        { label: 'Maria Silva', isCurrent: true }
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <PageHeader
                title="Prontuário de atendimento"
                subtitle="Registro histórico e acompanhamento clínico do paciente"
                breadcrumbs={breadcrumbs}
                onPageChange={onPageChange}
                backAction={{
                    label: "Voltar para lista",
                    onClick: () => onPageChange('prontuario')
                }}
            />

            {/* Profile Header Card */}
            <div className="bg-white dark:bg-app-card-dark rounded-[24px] p-8 shadow-sm border border-gray-100 dark:border-gray-800/50 space-y-8 relative">
                {/* Top Row: Info and Badge */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-full bg-app-bg-secondary dark:bg-app-table-header-dark flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <User className="h-8 w-8 text-app-text-muted" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-normal text-gray-900 dark:text-white tracking-tight">Maria Silva</h1>
                            <div className="flex items-center gap-2 text-app-text-muted dark:text-app-text-muted">
                                <Calendar className="h-4 w-4" />
                                <span className="text-base font-normal">Atendimento em 15/11/2024</span>
                            </div>
                        </div>
                    </div>
                    <Badge className="bg-blue-600 dark:bg-blue-900/40 dark:text-blue-100 text-white border-none font-normal px-4 py-2 text-sm rounded-lg absolute sm:relative top-6 right-6 sm:top-0 sm:right-0 shadow-sm">
                        Em andamento
                    </Badge>
                </div>

                {/* Bottom Row: Action Buttons */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setIsEditModalOpen(true)}
                        className="h-11 px-4 rounded-[12px] border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white font-normal hover:bg-app-bg-secondary dark:hover:bg-white/5 flex items-center gap-2 transition-all bg-white dark:bg-transparent shadow-sm w-full sm:min-w-[170px] sm:w-auto justify-center text-[10px] xs:text-xs sm:text-sm"
                    >
                        <Edit3 className="h-4 w-4 text-app-text-muted shrink-0" />
                        <span className="truncate">Editar prontuário</span>
                    </Button>
                    <Button
                        className="h-11 px-4 rounded-[12px] bg-[#1a342b] hover:bg-[#152a22] text-white font-normal flex items-center gap-2 shadow-lg shadow-[#1a342b]/20 transition-all hover:scale-[1.02] w-full sm:min-w-[210px] sm:w-auto justify-center text-[10px] xs:text-xs sm:text-sm"
                    >
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        <span className="truncate">Finalizar atendimento</span>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="h-11 px-4 rounded-[12px] border-gray-100 dark:border-gray-800 text-app-text-muted dark:text-app-text-muted font-normal hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 transition-all bg-white dark:bg-transparent shadow-sm w-full sm:min-w-[120px] sm:w-auto justify-center text-[10px] xs:text-xs sm:text-sm"
                    >
                        <Trash2 className="h-4 w-4 shrink-0" />
                        <span className="truncate">Excluir</span>
                    </Button>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-2">
                {/* Column 1: Informações do Atendimento */}
                <div className="bg-white dark:bg-app-card-dark rounded-[24px] p-8 shadow-sm border border-gray-100 dark:border-gray-800/50 space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-app-bg-secondary dark:bg-app-table-header-dark p-2 rounded-lg">
                            <FileText className="h-5 w-5 text-[#0039A6] dark:text-[#4da885]" />
                        </div>
                        <h2 className="text-xl font-normal text-gray-900 dark:text-white">Informações do atendimento</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-normal text-app-text-muted dark:text-app-text-muted tracking-widest uppercase">
                                Data do atendimento
                            </Label>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-app-text-muted" />
                                <p className="text-lg font-normal text-gray-900 dark:text-white">15/11/2024</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-normal text-app-text-muted dark:text-app-text-muted tracking-widest uppercase">
                                Tipo de consulta
                            </Label>
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-app-text-muted" />
                                <p className="text-lg font-normal text-gray-900 dark:text-white">Consulta Biorressonância Quântica</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Queixa Principal */}
                <div className="bg-white dark:bg-app-card-dark rounded-[24px] p-8 shadow-sm border border-gray-100 dark:border-gray-800/50 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-app-bg-secondary dark:bg-app-table-header-dark p-2 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-[#0039A6] dark:text-[#4da885]" />
                        </div>
                        <h2 className="text-xl font-normal text-gray-900 dark:text-white">Queixa principal</h2>
                    </div>

                    <div className="bg-app-bg-secondary dark:bg-app-table-header-dark rounded-[16px] p-6 border border-gray-100/50 dark:border-app-border-dark">
                        <p className="text-lg text-gray-700 dark:text-white/80 font-normal leading-relaxed">
                            Fadiga crônica e insônia
                        </p>
                    </div>
                </div>
            </div>

            {/* Diagnóstico Section */}
            <div className="bg-white dark:bg-app-card-dark rounded-[24px] p-8 shadow-sm border border-gray-100 dark:border-gray-800/50 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="bg-app-bg-secondary dark:bg-app-table-header-dark p-2 rounded-lg">
                        <Stethoscope className="h-5 w-5 text-[#0039A6] dark:text-[#4da885]" />
                    </div>
                    <h2 className="text-xl font-normal text-gray-900 dark:text-white">Diagnóstico</h2>
                </div>

                <div className="bg-app-bg-secondary/50 dark:bg-app-table-header-dark rounded-[16px] p-6 border border-gray-100/50 dark:border-app-border-dark">
                    <p className="text-lg text-gray-900 dark:text-white font-normal">
                        Em avaliação
                    </p>
                </div>
            </div>

            {/* Observações e Conduta Section */}
            <div className="bg-white dark:bg-app-card-dark rounded-[24px] p-8 shadow-sm border border-gray-100 dark:border-gray-800/50 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-app-bg-secondary dark:bg-app-table-header-dark p-2 rounded-lg">
                            <ClipboardList className="h-5 w-5 text-[#0039A6] dark:text-[#4da885]" />
                        </div>
                        <h2 className="text-xl font-normal text-gray-900 dark:text-white">Observações e conduta</h2>
                    </div>
                    <Button
                        variant="outline"
                        className="h-10 px-4 rounded-[10px] border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white font-normal hover:bg-app-bg-secondary dark:hover:bg-white/5 flex items-center gap-2 transition-all transition-all bg-white dark:bg-transparent shadow-sm"
                    >
                        <Box className="h-4 w-4 text-app-text-muted" />
                        Visualizar anatomia 3D
                    </Button>
                </div>

                <div className="bg-app-bg-secondary/50 dark:bg-app-table-header-dark rounded-[16px] p-6 border border-gray-100/50 dark:border-app-border-dark">
                    <p className="text-lg text-app-text-muted dark:text-app-text-muted font-normal italic">
                        Paciente relata cansaço persistente há 3 meses
                    </p>
                </div>
            </div>

            {/* Histórico de Consultas Section */}
            <div className="bg-white dark:bg-app-card-dark rounded-[24px] p-8 shadow-sm border border-gray-100 dark:border-gray-800/50 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="bg-app-bg-secondary dark:bg-app-table-header-dark p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-[#0039A6] dark:text-[#4da885]" />
                    </div>
                    <h2 className="text-xl font-normal text-gray-900 dark:text-white">Histórico de consultas anteriores</h2>
                </div>

                <div className="space-y-4">
                    {consultasAnteriores.map((consulta) => (
                        <div
                            key={consulta.id}
                            className={`
                                overflow-hidden rounded-[20px] border border-gray-100 dark:border-gray-800/50 
                                transition-all duration-300 bg-white dark:bg-transparent
                                ${expandedId === consulta.id ? 'shadow-lg border-[#0039A6]/20 dark:border-app-border-dark' : 'shadow-sm hover:shadow-md'}
                            `}
                        >
                            {/* Header do Card (Sempre Visível) */}
                            <div
                                onClick={() => toggleExpand(consulta.id)}
                                className="flex items-center justify-between p-6 cursor-pointer hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="h-12 w-12 rounded-full bg-app-bg-secondary dark:bg-app-table-header-dark flex items-center justify-center border border-gray-100 dark:border-app-border-dark shrink-0">
                                        <Calendar className="h-5 w-5 text-app-text-muted" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[17px] font-normal text-gray-900 dark:text-white">{consulta.data}</span>
                                            <Badge className="bg-green-600 dark:bg-emerald-950 dark:text-emerald-200 text-white border-none font-normal px-2.5 py-1 text-[10px] rounded-[6px] uppercase tracking-wider shadow-sm">
                                                {consulta.status.charAt(0).toUpperCase() + consulta.status.slice(1).toLowerCase()}
                                            </Badge>
                                        </div>
                                        <p className="text-[15px] font-normal text-app-text-muted dark:text-app-text-muted tracking-tight">
                                            {consulta.tipo}
                                        </p>
                                    </div>
                                </div>
                                {expandedId === consulta.id ? (
                                    <ChevronUp className="h-5 w-5 text-[#0039A6] dark:text-[#4da885] shrink-0" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-300 shrink-0" />
                                )}
                            </div>

                            {/* Conteúdo Expandido */}
                            {expandedId === consulta.id && (
                                <div className="px-6 pb-8 space-y-8 animate-in slide-in-from-top-2 duration-300">
                                    <div className="h-px bg-app-bg-secondary dark:bg-app-table-header-dark mx-[-24px]" />

                                    {/* Queixa Principal */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4 text-app-text-muted" />
                                            <span className="text-[11px] font-normal text-app-text-muted dark:text-app-text-muted uppercase tracking-widest">
                                                Queixa principal
                                            </span>
                                        </div>
                                        <p className="text-lg font-normal text-gray-700 dark:text-white/80 leading-relaxed">
                                            {consulta.queixa}
                                        </p>
                                    </div>

                                    {/* Diagnóstico */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Stethoscope className="h-4 w-4 text-app-text-muted" />
                                            <span className="text-[11px] font-normal text-app-text-muted dark:text-app-text-muted uppercase tracking-widest">
                                                Diagnóstico
                                            </span>
                                        </div>
                                        <p className="text-lg font-normal text-gray-900 dark:text-white leading-relaxed">
                                            {consulta.diagnostico}
                                        </p>
                                    </div>

                                    {/* Observações e Conduta */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <ClipboardList className="h-4 w-4 text-app-text-muted" />
                                            <span className="text-[11px] font-normal text-app-text-muted dark:text-app-text-muted uppercase tracking-widest">
                                                Observações e conduta
                                            </span>
                                        </div>
                                        <p className="text-lg font-normal text-app-text-muted dark:text-app-text-muted italic leading-relaxed">
                                            {consulta.conduta}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <EditarProntuarioModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                pacienteNome="Maria Silva"
            />

            <ExcluirProntuarioModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                pacienteNome="Maria Silva"
            />
        </div>
    )
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <label className={className}>
            {children}
        </label>
    )
}
