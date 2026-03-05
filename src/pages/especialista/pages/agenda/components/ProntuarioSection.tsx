import React, { useState } from 'react'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, ClipboardList, ChevronDown, ChevronUp, Link } from 'lucide-react'
import { useAtendimento } from '../../../context/AtendimentoContext'
import { Badge } from '@/components/ui/Badge'

interface ProntuarioSectionProps {
    onBack: () => void
    onNext: () => void
}

interface ConsultasAnterioresProps {
    date: string
    doctor: string
    anamneseType: 'consulta' | 'reconsulta'
    anamnese: {
        weight: string
        height: string
        queixa: string
        historicos: { label: string, value: string }[]
        diagnose: string
    }
    evolucao: string
    prescricoes: string[]
}

const CONSULTAS_MOCK: ConsultasAnterioresProps[] = [
    {
        date: '15/11/2025',
        doctor: 'Dr. João Santos',
        anamneseType: 'consulta',
        anamnese: {
            weight: '75.5',
            height: '175',
            queixa: 'Fadiga crônica, dores de cabeça frequentes e dificuldade para dormir.',
            historicos: [
                { label: 'Tabagismo', value: 'Não' },
                { label: 'Etilismo', value: 'Sim - Social, finais de semana' },
                { label: 'Atividade Física', value: 'Sim - Caminhada 3x/semana' },
                { label: 'Uso de Antidepressivo', value: 'Não' },
                { label: 'Cirurgias', value: 'Sim - Apendicectomia (2018)' }
            ],
            diagnose: 'Paciente apresenta sinais de estresse crônico e deficiência nutricional. Solicitados exames de sangue completos para avaliação detalhada.'
        },
        evolucao: 'Avaliação inicial realizada. Paciente relata estresse relacionado ao trabalho. Exame físico normal. Recomendada suplementação e acompanhamento em 30 dias.',
        prescricoes: [
            'Vitamina D3 2000 UI - 1 cápsula ao dia, pela manhã',
            'Magnésio Dimalato 500mg - 1 cápsula à noite antes de dormir',
            'Ômega 3 1000mg - 2 cápsulas ao dia com as refeições'
        ]
    },
    {
        date: '01/12/2025',
        doctor: 'Dr. João Santos',
        anamneseType: 'reconsulta',
        anamnese: {
            weight: '74.8',
            height: '175',
            queixa: 'Ainda relata cansaço, mas sono melhorou levemente.',
            historicos: [],
            diagnose: 'Reavaliação. Melhora parcial.'
        },
        evolucao: 'Paciente retornou para mostrar exames. Colesterol levemente elevado. Mantida suplementação.',
        prescricoes: []
    }
]

export const ProntuarioSection = ({ onBack, onNext }: ProntuarioSectionProps) => {
    const { evolucaoAtual, setEvolucaoAtual, status, anamneseData, anamneseType } = useAtendimento()
    const isReadOnly = status === 'read-only' || status === 'finalized'
    const [expandedConsulta, setExpandedConsulta] = useState<string | null>(null)

    const toggleConsulta = (date: string) => {
        if (expandedConsulta === date) {
            setExpandedConsulta(null)
        } else {
            setExpandedConsulta(date)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="space-y-1">
                <h2 className="text-xl font-normal text-gray-900 dark:text-white">Prontuário do Paciente</h2>
                <p className="text-app-text-muted dark:text-app-text-muted">Visualize o histórico completo e registre a evolução do atendimento</p>
            </div>

            {/* Current Anamnese Summary Card */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-[14px] border border-blue-100 dark:border-blue-900/20 flex items-start gap-4">
                <ClipboardList className="h-6 w-6 text-gray-700 dark:text-white/80 mt-1" />
                <div className="w-full">
                    <h4 className="font-normal text-gray-900 dark:text-white mb-2">
                        Anamnese registrada - {anamneseType === 'consulta' ? 'Consulta (Primeira Vez)' : 'Reconsulta'}
                    </h4>
                    <p className="text-app-text-muted dark:text-app-text-muted font-normal mb-4">
                        {anamneseData.queixa || 'Nenhuma queixa registrada'}
                    </p>
                    <div className="flex justify-between max-w-md text-sm text-app-text-muted dark:text-app-text-muted">
                        <span>Peso: {anamneseData.peso || '-'} kg</span>
                        <span>Altura: {anamneseData.altura || '-'} cm</span>
                    </div>
                </div>
            </div>

            {/* Historical Consultations */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-normal text-gray-900 dark:text-white">Histórico de Consultas Anteriores</h3>
                    <Badge variant="secondary" className="bg-blue-600 dark:bg-blue-900/40 dark:text-blue-100 text-white border-0 font-normal px-3 py-1 rounded-full shadow-sm">
                        {CONSULTAS_MOCK.length} consultas
                    </Badge>
                </div>

                <div className="space-y-4">
                    {CONSULTAS_MOCK.map((consulta) => (
                        <div key={consulta.date} className="bg-white dark:bg-app-card-dark border border-app-border dark:border-gray-800 rounded-[14px] overflow-hidden transition-all">
                            <div
                                className="p-6 flex items-center justify-between cursor-pointer hover:bg-app-bg-secondary dark:hover:bg-white/5"
                                onClick={() => toggleConsulta(consulta.date)}
                            >
                                <div>
                                    <div className="font-normal text-gray-900 dark:text-white text-lg">
                                        {consulta.anamneseType === 'reconsulta' ? 'Reconsulta' : 'Consulta'} - {consulta.date}
                                    </div>
                                    <div className="text-app-text-muted dark:text-app-text-muted text-sm">{consulta.doctor}</div>
                                </div>
                                <div className="flex items-center gap-2 text-app-text-muted dark:text-app-text-muted text-sm font-normal">
                                    Ver detalhes
                                    {expandedConsulta === consulta.date ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </div>
                            </div>

                            {expandedConsulta === consulta.date && (
                                <div className="px-6 pb-6 pt-0 space-y-6 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2">
                                    {/* Anamnese Details */}
                                    <div className="mt-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <ClipboardList className="h-4 w-4 text-app-text-muted" />
                                            <h4 className="font-normal text-gray-800 dark:text-gray-200">
                                                Anamnese - {consulta.anamneseType === 'reconsulta' ? 'Reconsulta' : 'Consulta (Primeira Vez)'}
                                            </h4>
                                        </div>

                                        <div className="pl-6 space-y-4">
                                            <div className="flex gap-12 text-gray-600 dark:text-app-text-muted">
                                                <span>Peso: <span className="text-gray-900 dark:text-white font-normal">{consulta.anamnese.weight} kg</span></span>
                                                <span>Altura: <span className="text-gray-900 dark:text-white font-normal">{consulta.anamnese.height} cm</span></span>
                                            </div>

                                            <div>
                                                <p className="text-app-text-muted text-sm mb-1">Queixa Principal:</p>
                                                <p className="text-gray-900 dark:text-white">{consulta.anamnese.queixa}</p>
                                            </div>

                                            {consulta.anamnese.historicos.length > 0 && (
                                                <div>
                                                    <p className="text-app-text-muted text-sm mb-2">Históricos:</p>
                                                    <div className="space-y-2">
                                                        {consulta.anamnese.historicos.map((hist, idx) => (
                                                            <div key={idx} className="flex items-start gap-2">
                                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                                                <span className="text-gray-700 dark:text-white/80">
                                                                    {hist.label}: <span className="font-normal text-gray-900 dark:text-white">{hist.value}</span>
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <p className="text-app-text-muted text-sm mb-1">Diagnose:</p>
                                                <p className="text-gray-900 dark:text-white">{consulta.anamnese.diagnose}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Prontuário / Evolução */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="text-app-text-muted">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                                            </div>
                                            <h4 className="font-normal text-gray-800 dark:text-gray-200">Prontuário / Evolução</h4>
                                        </div>
                                        <div className="bg-app-bg-secondary/50 dark:bg-app-table-header-dark p-4 rounded-[10px] text-gray-900 dark:text-white">
                                            {consulta.evolucao}
                                        </div>
                                    </div>

                                    {/* Prescrições */}
                                    {consulta.prescricoes.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Link className="h-4 w-4 text-app-text-muted" />
                                                <h4 className="font-normal text-gray-800 dark:text-gray-200">Prescrições ({consulta.prescricoes.length})</h4>
                                            </div>
                                            <div className="space-y-2">
                                                {consulta.prescricoes.map((presc, idx) => {
                                                    const [title, dosage] = presc.split(' - ')
                                                    return (
                                                        <div key={idx} className="bg-white dark:bg-app-card-dark border border-gray-100 dark:border-gray-800 p-4 rounded-[10px]">
                                                            <p className="font-normal text-gray-900 dark:text-white">{title}</p>
                                                            {dosage && <p className="text-sm text-app-text-muted dark:text-app-text-muted mt-1">{dosage}</p>}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Current Evolution Input */}
            <div className="space-y-2 pt-4">
                <Label className="font-normal text-gray-900 dark:text-white text-base">Evolução do Atendimento Atual *</Label>
                <Textarea
                    placeholder="Registre a evolução do atendimento atual, diagnóstico, conduta médica..."
                    className="min-h-[120px] p-4 bg-app-bg-secondary/50 dark:bg-app-table-header-dark border-app-border dark:border-gray-800 rounded-[10px] font-normal resize-none"
                    value={evolucaoAtual}
                    onChange={(e) => setEvolucaoAtual(e.target.value)}
                    readOnly={isReadOnly}
                />
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="h-12 px-6 rounded-[10px] border-app-border dark:border-app-border-dark text-gray-900 dark:text-white font-normal hover:bg-app-bg-secondary dark:hover:bg-white/5 flex items-center gap-2"
                >
                    <ChevronLeft className="h-4 w-4" /> Voltar: Anamnese
                </Button>
                <Button
                    onClick={onNext}
                    className="h-12 px-8 bg-[#0039A6] hover:bg-[#1d3b2e] text-white rounded-[10px] font-normal flex items-center gap-2"
                >
                    Próximo: Prescrição <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
