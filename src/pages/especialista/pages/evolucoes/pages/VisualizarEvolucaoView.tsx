import { useState } from 'react'
import { PageHeader } from '../../../ui/PageHeader'
import { ArrowLeft, Edit2, FilePlus, CalendarCheck, FileText, Plus, CheckCircle2, Home, ChevronRight, Phone, Mail, FileSignature, CalendarPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
    AdicionarNotaErrataModal,
    MarcarRetornoModal,
    NovaPrescricaoEvolucaoModal,
    EditarRetornoRecepcaoModal,
    AdicionarDocumentoEnviadoModal,
    AdicionarProdutoModal
} from '../../../modals'

interface VisualizarEvolucaoViewProps {
    onPageChange: (page: string) => void
}

export const VisualizarEvolucaoView = ({ onPageChange }: VisualizarEvolucaoViewProps) => {
    const [isNotaModalOpen, setIsNotaModalOpen] = useState(false)
    const [isRetornoModalOpen, setIsRetornoModalOpen] = useState(false)
    const [isPrescricaoModalOpen, setIsPrescricaoModalOpen] = useState(false)
    const [isEditarRetornoModalOpen, setIsEditarRetornoModalOpen] = useState(false)
    const [isAddDocumentoModalOpen, setIsAddDocumentoModalOpen] = useState(false)
    const [isAddProdutoModalOpen, setIsAddProdutoModalOpen] = useState(false)

    // Mock Data - In a real app this would be fetched based on ID
    const evolucao = {
        id: 1,
        paciente: {
            name: 'Maria Silva',
            id: '1',
            age: 45,
            phone: '(11) 98765-4321',
            email: 'maria.silva@email.com'
        },
        data: '08/10/2025',
        horario: '14:30',
        tipo: 'Consulta',
        status: 'Finalizado - Protegido pela RN-009',
        notas: 'Paciente refere queixas persistentes de fadiga; ultrassonografia abdominal solicitada para avaliação. Sinais vitais estáveis. Refere melhora parcial com uso de medicação sintomática prescrita anteriormente. Orientada a manter repouso relativo e hidratação.'
    }

    const breadcrumbs = [
        { label: 'Evoluções Clínicas', onClick: () => onPageChange('evolucoes') },
        { label: evolucao.paciente.name, isCurrent: false },
        { label: `Evolução de ${evolucao.data}`, isCurrent: true }
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <AdicionarNotaErrataModal
                isOpen={isNotaModalOpen}
                onClose={() => setIsNotaModalOpen(false)}
            />
            <MarcarRetornoModal
                isOpen={isRetornoModalOpen}
                onClose={() => setIsRetornoModalOpen(false)}
            />
            <NovaPrescricaoEvolucaoModal
                isOpen={isPrescricaoModalOpen}
                onClose={() => setIsPrescricaoModalOpen(false)}
            />
            <EditarRetornoRecepcaoModal
                isOpen={isEditarRetornoModalOpen}
                onClose={() => setIsEditarRetornoModalOpen(false)}
            />
            <AdicionarDocumentoEnviadoModal
                isOpen={isAddDocumentoModalOpen}
                onClose={() => setIsAddDocumentoModalOpen(false)}
            />
            <AdicionarProdutoModal
                isOpen={isAddProdutoModalOpen}
                onClose={() => setIsAddProdutoModalOpen(false)}
            />

            <PageHeader
                title={`Evolução clínica - ${evolucao.paciente.name}`}
                subtitle={`Registro detalhado do atendimento realizado em ${evolucao.data}`}
                breadcrumbs={breadcrumbs}
                onPageChange={onPageChange}
                backAction={{
                    label: "Voltar",
                    onClick: () => onPageChange('evolucoes')
                }}
            />

            {/* Patient Header Card */}
            <div className="bg-white dark:bg-app-card-dark rounded-[16px] p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-app-bg-secondary dark:bg-white/10 flex items-center justify-center shrink-0">
                        <span className="font-normal text-xl text-gray-600 dark:text-white/80">MS</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-normal text-gray-900 dark:text-white leading-none mb-1.5">{evolucao.paciente.name}</h2>
                        <div className="text-sm text-app-text-muted dark:text-app-text-muted font-medium mb-3">
                            ID: {evolucao.paciente.id} <span className="mx-2"></span> Idade: {evolucao.paciente.age} anos
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-app-table-header-dark text-sm font-normal text-gray-700 dark:text-white/80 border border-app-border dark:border-app-border-dark shadow-sm">
                                <Phone className="h-3.5 w-3.5" /> {evolucao.paciente.phone}
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-app-table-header-dark text-sm font-normal text-gray-700 dark:text-white/80 border border-app-border dark:border-app-border-dark shadow-sm">
                                <Mail className="h-3.5 w-3.5" /> {evolucao.paciente.email}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-2 xl:flex xl:flex-row xl:flex-wrap xl:justify-end items-center gap-3 w-full xl:w-auto">
                    <Button
                        variant="outline"
                        onClick={() => setIsNotaModalOpen(true)}
                        className="h-10 rounded-[10px] border-app-border dark:border-app-border-dark font-normal text-gray-700 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 gap-2 px-4 shadow-sm flex flex-row items-center justify-center whitespace-nowrap w-full xl:w-auto"
                    >
                        <FileSignature className="h-4 w-4 shrink-0" />
                        Adicionar nota/errata
                    </Button>
                    <Button
                        onClick={() => setIsRetornoModalOpen(true)}
                        className="h-10 rounded-[10px] bg-[#0039A6] hover:bg-[#1d3b2e] text-white font-normal gap-2 px-4 shadow-sm flex flex-row items-center justify-center whitespace-nowrap w-full xl:w-auto"
                    >
                        <CalendarPlus className="h-4 w-4 shrink-0" />
                        Marcar retorno
                    </Button>
                    <Button variant="outline" className="h-10 rounded-[10px] border-app-border dark:border-app-border-dark font-normal text-gray-700 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 gap-2 px-4 shadow-sm flex flex-row items-center justify-center whitespace-nowrap w-full xl:w-auto">
                        <FilePlus className="h-4 w-4 shrink-0" />
                        Gerar documento
                    </Button>
                    <Button
                        onClick={() => setIsPrescricaoModalOpen(true)}
                        className="h-10 rounded-[10px] bg-[#0039A6] hover:bg-[#1d3b2e] text-white font-normal gap-2 px-4 shadow-sm flex flex-row items-center justify-center whitespace-nowrap w-full xl:w-auto"
                    >
                        <Plus className="h-4 w-4 shrink-0" />
                        Nova prescrição
                    </Button>
                </div>
            </div>

            {/* Evolution Details Card */}
            <div className="bg-white dark:bg-app-card-dark rounded-[16px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                        <h3 className="text-lg font-normal text-gray-900 dark:text-white">Resumo da evolução</h3>
                        <div className="bg-orange-600 dark:bg-amber-900/40 dark:text-amber-100 text-white text-xs font-normal px-3 py-1.5 rounded-[6px] tracking-wide shadow-sm">
                            {evolucao.status.charAt(0).toUpperCase() + evolucao.status.slice(1).toLowerCase()}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-gray-100 dark:border-gray-800 pb-8">
                        <div>
                            <span className="block text-sm font-normal text-gray-900 dark:text-white mb-2">Tipo</span>
                            <Badge variant="outline" className="rounded-full border-app-border dark:border-app-border-dark bg-app-bg-secondary dark:bg-app-table-header-dark text-gray-700 dark:text-white/80 font-normal px-4 py-1">
                                {evolucao.tipo}
                            </Badge>
                        </div>
                        <div>
                            <span className="block text-sm font-normal text-gray-900 dark:text-white mb-1">Data</span>
                            <span className="text-gray-600 dark:text-app-text-muted">{evolucao.data}</span>
                        </div>
                        <div>
                            <span className="block text-sm font-normal text-gray-900 dark:text-white mb-1">Horário</span>
                            <span className="flex items-center gap-2 text-gray-600 dark:text-app-text-muted">
                                🕒 {evolucao.horario}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-normal text-gray-900 dark:text-white mb-3">Notas clínicas</h4>
                        <p className="text-gray-600 dark:text-white/80 leading-relaxed text-[15px] font-normal">
                            {evolucao.notas}
                        </p>
                    </div>
                </div>
            </div>

            {/* Retorno da Recepção Card */}
            <div className="bg-white dark:bg-app-card-dark rounded-[16px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-normal text-gray-900 dark:text-white">Retorno da recepção</h3>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditarRetornoModalOpen(true)}
                            className="h-9 rounded-[8px] border-app-border dark:border-app-border-dark font-medium text-gray-700 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 gap-2 px-4 shadow-sm flex flex-row items-center whitespace-nowrap"
                        >
                            <Edit2 className="h-3.5 w-3.5 shrink-0" />
                            Editar
                        </Button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <span className="block text-sm font-normal text-gray-900 dark:text-white mb-2">Status</span>
                            <span className="inline-flex bg-blue-600 dark:bg-blue-900/40 dark:text-blue-100 text-white rounded-full px-4 py-1.5 text-xs font-normal items-center gap-1.5 shadow-sm">
                                Paciente avisado
                            </span>
                        </div>
                        <div>
                            <span className="block text-sm font-normal text-gray-900 dark:text-white mb-2">Detalhes</span>
                            <p className="text-gray-600 dark:text-white/80 font-medium">Confirmado retorno para dia 23/10</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Documentos Enviados Card */}
            <div className="bg-white dark:bg-app-card-dark rounded-[16px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-normal text-gray-900 dark:text-white">Documentos enviados</h3>
                        <Button
                            onClick={() => setIsAddDocumentoModalOpen(true)}
                            className="h-10 rounded-[8px] bg-[#0039A6] hover:bg-[#1d3b2e] text-white font-normal gap-2 shadow-sm shadow-[#0039A6]/20 px-4 flex flex-row items-center whitespace-nowrap"
                        >
                            <Plus className="h-4 w-4 shrink-0" />
                            Adicionar documento
                        </Button>
                    </div>

                    <div className="p-6 rounded-[12px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-app-card-dark relative shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between mb-5">
                            <span className="inline-flex items-center justify-center rounded-full border border-app-border dark:border-app-border-dark bg-white dark:bg-app-table-header-dark px-3 py-1 text-xs font-normal text-gray-800 dark:text-gray-200 shadow-sm">
                                Prescrição
                            </span>
                            <button className="text-app-text-muted hover:text-gray-600 dark:hover:text-white transition-colors">
                                <Plus className="h-4 w-4 rotate-45" /> {/* Close icon using Plus rotated */}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                            <div className="space-y-4">
                                <div>
                                    <span className="block text-[13px] font-normal text-gray-900 dark:text-white mb-1">Data de envio</span>
                                    <span className="text-gray-600 dark:text-app-text-muted font-normal text-sm">07/10/2025</span>
                                </div>
                                <div>
                                    <span className="block text-[13px] font-normal text-gray-900 dark:text-white mb-1">Anexo/URL</span>
                                    <a href="#" className="text-[#0039A6] dark:text-[#4da885] hover:underline font-medium text-sm truncate block">
                                        https://exemplo.com/prescricao.pdf
                                    </a>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="block text-[13px] font-normal text-gray-900 dark:text-white">Recebimento confirmado</span>
                                    <div>
                                        <span className="bg-green-600 dark:bg-emerald-950 dark:text-emerald-200 text-white rounded-[6px] px-3 py-0.5 text-[11px] font-normal inline-block shadow-sm">
                                            Sim
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <span className="block text-[13px] font-normal text-gray-900 dark:text-white mb-1">Meio</span>
                                    <span className="text-gray-600 dark:text-app-text-muted font-medium text-sm">WhatsApp</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Prescrições do Paciente Card */}
            <div className="bg-white dark:bg-app-card-dark rounded-[16px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-normal text-gray-900 dark:text-white">Prescrições do paciente</h3>
                        <Button
                            onClick={() => setIsAddProdutoModalOpen(true)}
                            className="h-10 rounded-[8px] bg-[#0039A6] hover:bg-[#1d3b2e] text-white font-normal gap-2 shadow-sm shadow-[#0039A6]/20 px-4 flex flex-row items-center whitespace-nowrap"
                        >
                            <Plus className="h-4 w-4 shrink-0" />
                            Adicionar produto
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                    <th className="text-left font-normal text-gray-900 dark:text-white text-sm pb-4 pl-0">Nome</th>
                                    <th className="text-left font-normal text-gray-900 dark:text-white text-sm pb-4">Tipo</th>
                                    <th className="text-left font-normal text-gray-900 dark:text-white text-sm pb-4">Modo de uso</th>
                                    <th className="text-left font-normal text-gray-900 dark:text-white text-sm pb-4">Frequência</th>
                                    <th className="text-left font-normal text-gray-900 dark:text-white text-sm pb-4">Horário ideal</th>
                                    <th className="text-left font-normal text-gray-900 dark:text-white text-sm pb-4">Estoque</th>
                                    <th className="text-center font-normal text-gray-900 dark:text-white text-sm pb-4 pr-0">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                <tr className="group hover:bg-app-bg-secondary/50 dark:hover:bg-white/5 transition-colors">
                                    <td className="py-4 pl-0 text-sm font-normal text-gray-900 dark:text-white">Creatina</td>
                                    <td className="py-4 text-sm text-gray-600 dark:text-app-text-muted font-normal">Suplementação</td>
                                    <td className="py-4 text-sm text-gray-600 dark:text-app-text-muted font-medium">1 dose com água</td>
                                    <td className="py-4 text-sm text-gray-600 dark:text-app-text-muted font-medium">Diariamente</td>
                                    <td className="py-4 text-sm text-gray-600 dark:text-app-text-muted font-medium">Treino</td>
                                    <td className="py-4">
                                        <span className="inline-flex bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white rounded-full px-3 py-1 text-[11px] font-normal shadow-sm">
                                            Em estoque
                                        </span>
                                    </td>
                                    <td className="py-4 pr-0 text-center">
                                        <button className="text-app-text-muted hover:text-gray-600 dark:hover:text-white transition-colors">•••</button>
                                    </td>
                                </tr>
                                <tr className="group hover:bg-app-bg-secondary/50 dark:hover:bg-white/5 transition-colors">
                                    <td className="py-4 pl-0 text-sm font-normal text-gray-900 dark:text-white">Ômega 3</td>
                                    <td className="py-4 text-sm text-gray-600 dark:text-app-text-muted font-medium">Suplementação</td>
                                    <td className="py-4 text-sm text-gray-600 dark:text-app-text-muted font-medium">2 cápsulas</td>
                                    <td className="py-4 text-sm text-gray-600 dark:text-app-text-muted font-medium">2x ao dia</td>
                                    <td className="py-4 text-sm text-gray-600 dark:text-app-text-muted font-medium">Café da manhã e jantar</td>
                                    <td className="py-4">
                                        <span className="inline-flex bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white rounded-full px-3 py-1 text-[11px] font-normal shadow-sm">
                                            Em estoque
                                        </span>
                                    </td>
                                    <td className="py-4 pr-0 text-center">
                                        <button className="text-app-text-muted hover:text-gray-600 dark:hover:text-white transition-colors">•••</button>
                                    </td>
                                </tr>
                                <tr className="group hover:bg-app-bg-secondary/50 dark:hover:bg-white/5 transition-colors">
                                    <td className="py-4 pl-0 text-sm font-normal text-gray-900 dark:text-white">Vitamina D3</td>
                                    <td className="py-4 text-sm text-gray-600 dark:text-app-text-muted font-medium">Suplementação</td>
                                    <td className="py-4 text-sm text-gray-600 dark:text-app-text-muted font-medium">1 cápsula</td>
                                    <td className="py-4 text-sm text-gray-600 dark:text-app-text-muted font-medium">Diariamente</td>
                                    <td className="py-4 text-sm text-gray-600 dark:text-app-text-muted font-medium">Café da manhã</td>
                                    <td className="py-4">
                                        <span className="inline-flex bg-red-600 dark:bg-red-900/40 dark:text-red-100 text-white rounded-full px-3 py-1 text-[11px] font-normal shadow-sm">
                                            Baixo estoque
                                        </span>
                                    </td>
                                    <td className="py-4 pr-0 text-center">
                                        <button className="text-app-text-muted hover:text-gray-600 dark:hover:text-white transition-colors">•••</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
