import React from 'react'
import {
    Dialog,
    DialogContent,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { X, Eye, Scale, Activity } from "lucide-react"

interface VisualizarAnamneseModalProps {
    isOpen: boolean
    onClose: () => void
    anamnese?: {
        paciente: string
        data: string
        tipo: string
        imc: number
        peso: number
        altura: number
        gordura: number
        queixa: string
        massaMuscular?: number
        gorduraVisceral?: number
        massaOssea?: number
        aguaCorporal?: number
    } | null
}

export function VisualizarAnamneseModal({ isOpen, onClose, anamnese }: VisualizarAnamneseModalProps) {
    if (!anamnese) return null

    const data = {
        massaMuscular: anamnese.massaMuscular || 24.3,
        gorduraVisceral: anamnese.gorduraVisceral || 8,
        massaOssea: anamnese.massaOssea || 2.4,
        aguaCorporal: anamnese.aguaCorporal || 52.3
    }

    const getIMCCategory = (imc: number) => {
        if (imc < 18.5) return { label: 'Abaixo do peso', color: 'text-blue-500' }
        if (imc < 25) return { label: 'Peso normal', color: 'text-emerald-500' }
        if (imc < 30) return { label: 'Sobrepeso', color: 'text-orange-500' }
        return { label: 'Obesidade', color: 'text-red-500' }
    }

    const imcCategory = getIMCCategory(anamnese.imc)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                hideCloseButton={true}
                className="sm:max-w-[650px] p-0 rounded-[24px] overflow-hidden border-none shadow-2xl"
            >
                <div className="bg-white dark:bg-app-card-dark p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1 focus:outline-none">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-app-bg-secondary dark:bg-app-table-header-dark flex items-center justify-center">
                                    <Eye className="h-5 w-5 text-gray-900 dark:text-white" />
                                </div>
                                <h2 className="text-xl font-normal text-gray-900 dark:text-white leading-tight">
                                    Visualizar anamnese
                                </h2>
                            </div>
                            <p className="text-app-text-muted dark:text-app-text-muted text-sm font-normal">
                                {anamnese.tipo} - {anamnese.paciente} - {anamnese.data}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-all shrink-0"
                        >
                            <X className="h-4 w-4 text-app-text-muted" />
                        </button>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-3 gap-6 mb-8 mt-4">
                        <div className="space-y-1">
                            <span className="text-[11px] font-normal text-app-text-muted tracking-wider">Paciente</span>
                            <p className="text-base font-normal text-gray-800 dark:text-gray-200">{anamnese.paciente}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[11px] font-normal text-app-text-muted tracking-wider">Tipo</span>
                            <div>
                                <Badge className="bg-blue-600 dark:bg-blue-900/40 dark:text-blue-100 text-white border-none px-3 py-0.5 font-normal rounded-lg shadow-sm">
                                    {anamnese.tipo}
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[11px] font-normal text-app-text-muted tracking-wider">Data</span>
                            <p className="text-base font-normal text-gray-800 dark:text-gray-200">{anamnese.data}</p>
                        </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Scale className="h-5 w-5 text-[#0039A6] dark:text-[#4da885]" />
                            <h3 className="text-lg font-normal text-gray-900 dark:text-white">Bioimpedância</h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {/* Peso */}
                            <div className="p-4 rounded-[12px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent shadow-sm space-y-1">
                                <span className="text-[10px] font-normal text-app-text-muted tracking-wider">Peso</span>
                                <p className="text-xl font-normal text-gray-900 dark:text-white">{anamnese.peso} kg</p>
                            </div>

                            {/* Altura */}
                            <div className="p-4 rounded-[12px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent shadow-sm space-y-1">
                                <span className="text-[10px] font-normal text-app-text-muted tracking-wider">Altura</span>
                                <p className="text-xl font-normal text-gray-900 dark:text-white">{anamnese.altura} cm</p>
                            </div>

                            {/* IMC */}
                            <div className="p-4 rounded-[12px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent shadow-sm space-y-0.5">
                                <span className="text-[10px] font-normal text-app-text-muted tracking-wider">IMC</span>
                                <p className={`text-xl font-normal ${imcCategory.color}`}>{anamnese.imc}</p>
                                <p className={`text-[10px] font-normal ${imcCategory.color}`}>{imcCategory.label}</p>
                            </div>

                            {/* Gordura Corporal */}
                            <div className="p-4 rounded-[12px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent shadow-sm space-y-1">
                                <span className="text-[10px] font-normal text-app-text-muted tracking-wider line-clamp-1">Gordura corporal</span>
                                <p className="text-xl font-normal text-gray-900 dark:text-white">{anamnese.gordura}%</p>
                            </div>

                            {/* Massa Muscular */}
                            <div className="p-4 rounded-[12px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent shadow-sm space-y-1">
                                <span className="text-[10px] font-normal text-app-text-muted tracking-wider line-clamp-1">Massa muscular</span>
                                <p className="text-xl font-normal text-gray-900 dark:text-white">{data.massaMuscular} kg</p>
                            </div>

                            {/* Gordura Visceral */}
                            <div className="p-4 rounded-[12px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent shadow-sm space-y-1">
                                <span className="text-[10px] font-normal text-app-text-muted tracking-wider line-clamp-1">Gordura visceral</span>
                                <p className="text-xl font-normal text-gray-900 dark:text-white">{data.gorduraVisceral}</p>
                            </div>

                            {/* Massa Óssea */}
                            <div className="p-4 rounded-[12px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent shadow-sm space-y-1">
                                <span className="text-[10px] font-normal text-app-text-muted tracking-wider line-clamp-1">Massa óssea</span>
                                <p className="text-xl font-normal text-gray-900 dark:text-white">{data.massaOssea} kg</p>
                            </div>

                            {/* Água Corporal */}
                            <div className="p-4 rounded-[12px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent shadow-sm space-y-1">
                                <span className="text-[10px] font-normal text-app-text-muted tracking-wider line-clamp-1">Água corporal</span>
                                <p className="text-xl font-normal text-gray-900 dark:text-white">{data.aguaCorporal}%</p>
                            </div>
                        </div>

                        {/* Metabolismo Basal */}
                        <div className="mt-6 p-8 rounded-[20px] bg-app-bg-secondary/50 dark:bg-app-table-header-dark border border-gray-100 dark:border-gray-800 flex flex-col items-start space-y-4">
                            <span className="text-[17px] font-normal text-app-text-muted dark:text-app-text-muted">Metabolismo basal</span>
                            <p className="text-4xl font-normal text-[#0039A6] dark:text-[#4da885]">1340 kcal/dia</p>
                        </div>
                    </div>

                    {/* Historico Diario Section */}
                    <div className="space-y-4 pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-[#0039A6] dark:text-[#4da885]" />
                            <h3 className="text-lg font-normal text-gray-900 dark:text-white">Histórico diário</h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="p-3.5 rounded-[12px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent flex justify-between items-center shadow-sm">
                                <span className="text-xs font-normal text-app-text-muted">Tabagismo</span>
                                <Badge className="bg-red-600 dark:bg-red-900/40 dark:text-red-100 text-white px-2 py-0.5 rounded-lg border-none text-[9px] font-normal tracking-wide">Não</Badge>
                            </div>
                            <div className="p-3.5 rounded-[12px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent flex justify-between items-center shadow-sm">
                                <span className="text-xs font-normal text-app-text-muted">Álcool</span>
                                <Badge className="bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white px-2 py-0.5 rounded-lg border-none text-[9px] font-normal tracking-wide">Sim</Badge>
                            </div>
                            <div className="p-3.5 rounded-[12px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent flex justify-between items-center shadow-sm">
                                <span className="text-xs font-normal text-app-text-muted">Atividade física</span>
                                <Badge className="bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white px-2 py-0.5 rounded-lg border-none text-[9px] font-normal tracking-wide">Sim</Badge>
                            </div>
                            <div className="p-3.5 rounded-[12px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent space-y-0.5 shadow-sm">
                                <span className="text-[10px] font-normal text-app-text-muted tracking-wider">Qualidade do sono</span>
                                <p className="text-sm font-normal text-gray-700 dark:text-white/80">Regular</p>
                            </div>
                            <div className="p-3.5 rounded-[12px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent space-y-0.5 shadow-sm">
                                <span className="text-[10px] font-normal text-app-text-muted tracking-wider">Água (l/dia)</span>
                                <p className="text-sm font-normal text-gray-700 dark:text-white/80">1.5L</p>
                            </div>
                            <div className="p-3.5 rounded-[12px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent space-y-0.5 shadow-sm">
                                <span className="text-[10px] font-normal text-app-text-muted tracking-wider">Intestino</span>
                                <p className="text-sm font-normal text-gray-700 dark:text-white/80">Regular</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-[12px] bg-white dark:bg-transparent border border-gray-100 dark:border-gray-800 space-y-0.5 shadow-sm">
                            <span className="text-[10px] font-normal text-app-text-muted tracking-wider">Nível de estresse</span>
                            <p className="text-sm font-normal text-gray-700 dark:text-white/80">Moderado</p>
                        </div>
                    </div>

                    <div className="space-y-6 pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="space-y-1.5">
                            <h3 className="text-[11px] font-normal text-app-text-muted tracking-wider">Queixa principal</h3>
                            <div className="p-4 rounded-[12px] bg-app-bg-secondary/20 dark:bg-app-table-header-dark border border-gray-50 dark:border-gray-800/50">
                                <p className="text-sm text-gray-600 dark:text-white/80 leading-relaxed font-normal">
                                    {anamnese.queixa || 'Fadiga constante, dificuldade para dormir, dores nas articulações.'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <h4 className="text-[11px] font-normal text-app-text-muted tracking-wider">Medicamentos em uso</h4>
                                <div className="p-4 rounded-[12px] bg-app-bg-secondary/20 dark:bg-app-table-header-dark border border-gray-50 dark:border-gray-800/50 min-h-[60px] flex items-center">
                                    <p className="text-sm text-gray-600 dark:text-white/80 font-normal">Vitamina D3 2000UI - 1x ao dia</p>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <h4 className="text-[11px] font-normal text-app-text-muted tracking-wider">Alergias</h4>
                                <div className="p-4 rounded-[12px] bg-app-bg-secondary/20 dark:bg-app-table-header-dark border border-gray-50 dark:border-gray-800/50 min-h-[60px] flex items-center">
                                    <p className="text-sm text-gray-600 dark:text-white/80 font-normal">Nenhuma alergia conhecida</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <h4 className="text-[11px] font-normal text-app-text-muted tracking-wider">Histórico familiar</h4>
                                <div className="p-4 rounded-[12px] bg-app-bg-secondary/20 dark:bg-app-table-header-dark border border-gray-50 dark:border-gray-800/50">
                                    <p className="text-sm text-gray-600 dark:text-white/80 font-normal">Mãe com diabetes tipo 2, pai com hipertensão</p>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <h4 className="text-[11px] font-normal text-app-text-muted tracking-wider">Observações adicionais</h4>
                                <div className="p-4 rounded-[12px] bg-app-bg-secondary/20 dark:bg-app-table-header-dark border border-gray-50 dark:border-gray-800/50">
                                    <p className="text-sm text-gray-600 dark:text-white/80 leading-relaxed font-normal">
                                        Paciente relata estresse no trabalho. Recomendado acompanhamento nutricional detalhado para suporte imunológico e melhora da qualidade do sono.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            onClick={onClose}
                            className="h-9 px-6 rounded-lg bg-[#0039A6] hover:bg-[#1d3b2e] text-white font-normal text-sm shadow-lg shadow-[#0039A6]/20 transition-all hover:scale-[1.02]"
                        >
                            Fechar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
