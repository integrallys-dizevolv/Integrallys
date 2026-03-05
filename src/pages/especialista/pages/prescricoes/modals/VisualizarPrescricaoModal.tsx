import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { FileText, X, Printer, Download } from "lucide-react"

interface VisualizarPrescricaoModalProps {
    isOpen: boolean
    onClose: () => void
    prescricao: {
        numero: string
        paciente: string
        data: string
        tipo: string
        medico: string
        validade: string
        validaAtre: string
        instrucoes: string[]
        status: string
    } | null
}

export function VisualizarPrescricaoModal({ isOpen, onClose, prescricao }: VisualizarPrescricaoModalProps) {
    if (!prescricao) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                hideCloseButton={true}
                className="w-[95vw] sm:max-w-[650px] p-0 rounded-[24px] overflow-hidden border-none shadow-2xl bg-white dark:bg-app-card-dark overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-app-bg-secondary dark:bg-app-table-header-dark flex items-center justify-center">
                                <FileText className="h-5 w-5 text-gray-900 dark:text-white" />
                            </div>
                            <div className="space-y-0.5">
                                <DialogTitle className="text-xl font-normal text-gray-900 dark:text-white">
                                    Prescrição médica {prescricao.numero}
                                </DialogTitle>
                                <p className="text-[15px] text-app-text-muted dark:text-app-text-muted font-normal">
                                    Visualização completa da prescrição
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-app-bg-secondary dark:hover:bg-white/5 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5 text-app-text-muted" />
                        </button>
                    </div>

                    {/* Info Grid Card */}
                    <div className="bg-app-bg-secondary/50 dark:bg-app-table-header-dark rounded-[20px] p-8 border border-gray-100 dark:border-gray-800 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12">
                            <div className="space-y-2">
                                <span className="text-[13px] font-normal text-app-text-muted dark:text-app-text-muted">Paciente</span>
                                <p className="text-[17px] font-normal text-gray-900 dark:text-white">{prescricao.paciente}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[13px] font-normal text-app-text-muted dark:text-app-text-muted">Data de emissão</span>
                                <p className="text-[17px] font-normal text-gray-900 dark:text-white">{prescricao.data}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[13px] font-normal text-app-text-muted dark:text-app-text-muted">Tipo</span>
                                <div>
                                    <Badge variant="outline" className="rounded-full border-gray-100 bg-white dark:bg-black/20 text-gray-600 dark:text-white/80 px-4 py-1 font-normal shadow-sm">
                                        {prescricao.tipo}
                                    </Badge>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[13px] font-normal text-app-text-muted dark:text-app-text-muted">Médico responsável</span>
                                <p className="text-[17px] font-normal text-gray-900 dark:text-white">{prescricao.medico}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[13px] font-normal text-app-text-muted dark:text-app-text-muted">Validade</span>
                                <p className="text-[17px] font-normal text-gray-900 dark:text-white">{prescricao.validade}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[13px] font-normal text-app-text-muted dark:text-app-text-muted">Válida até</span>
                                <p className="text-[17px] font-normal text-gray-900 dark:text-white">{prescricao.validaAtre}</p>
                            </div>
                        </div>
                    </div>

                    {/* Instructions Section */}
                    <div className="space-y-4 mb-8">
                        <h3 className="text-[18px] font-normal text-gray-900 dark:text-white tracking-tight">
                            Instruções e detalhes
                        </h3>
                        <div className="bg-white dark:bg-transparent rounded-[18px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm leading-relaxed">
                            <ul className="space-y-3">
                                {prescricao.instrucoes.map((item, index) => (
                                    <li key={index} className="text-[15px] text-gray-700 dark:text-white/80 flex gap-3">
                                        <span className="font-normal text-app-text-muted dark:text-app-text-muted">{index + 1}.</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    {/* Status and Print Action Card */}
                    <div className="bg-app-bg-secondary/50 dark:bg-app-table-header-dark rounded-[18px] p-4 flex items-center justify-between border border-gray-100 dark:border-gray-800 mb-8">
                        <Badge className={`
                            rounded-[8px] text-[11px] font-normal tracking-wider px-4 py-2 border-0 shadow-sm
                            ${prescricao.status === 'Ativa'
                                ? 'bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white'
                                : prescricao.status === 'Expirada'
                                    ? 'bg-orange-600 dark:bg-amber-900/40 dark:text-amber-100 text-white'
                                    : 'bg-red-600 dark:bg-red-900/40 dark:text-red-100 text-white'
                            }
                        `}>
                            {prescricao.status}
                        </Badge>
                        <Button
                            variant="outline"
                            className="h-10 px-6 rounded-xl bg-white dark:bg-transparent border-app-border dark:border-app-border-dark text-gray-900 dark:text-gray-100 font-normal shadow-sm transition-all hover:bg-app-bg-secondary dark:hover:bg-white/5 flex items-center gap-2"
                        >
                            <Printer className="h-4 w-4" />
                            Imprimir prescrição
                        </Button>
                    </div>

                    {/* Footer Close Button */}
                    <div className="flex justify-end">
                        <Button
                            onClick={onClose}
                            className="h-11 px-8 rounded-xl bg-[#0039A6] hover:bg-[#1d3b2e] text-white font-normal shadow-lg shadow-[#0039A6]/20 transition-all hover:scale-[1.02]"
                        >
                            Fechar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
