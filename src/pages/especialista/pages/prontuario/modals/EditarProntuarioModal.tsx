import React from 'react'
import {
    Dialog,
    DialogContent,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select"
import { X, Calendar, ChevronDown } from "lucide-react"

interface EditarProntuarioModalProps {
    isOpen: boolean
    onClose: () => void
    pacienteNome?: string
}

export function EditarProntuarioModal({ isOpen, onClose, pacienteNome = "Maria Silva" }: EditarProntuarioModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                hideCloseButton={true}
                className="sm:max-w-[650px] p-0 rounded-[20px] overflow-hidden border-none shadow-2xl"
            >
                <div className="bg-white dark:bg-app-card-dark p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div className="space-y-1.5">
                            <h2 className="text-2xl font-normal text-gray-900 dark:text-white leading-tight">
                                Editar prontuário
                            </h2>
                            <p className="text-app-text-muted dark:text-app-text-muted text-[15px] font-normal">
                                Faça alterações no prontuário do paciente
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-all shrink-0"
                        >
                            <X className="h-5 w-5 text-app-text-muted" />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="space-y-8">
                        {/* Paciente */}
                        <div className="space-y-3">
                            <Label className="text-[15px] font-normal text-gray-900 dark:text-white tracking-tight">
                                Paciente
                            </Label>
                            <Input
                                value={pacienteNome}
                                disabled
                                className="h-12 rounded-[12px] border border-gray-100 dark:border-gray-800 bg-app-bg-secondary/50 dark:bg-app-table-header-dark px-4 text-app-text-muted dark:text-app-text-muted font-normal cursor-not-allowed shadow-none"
                            />
                        </div>

                        {/* Data do Atendimento */}
                        <div className="space-y-3">
                            <Label className="text-[15px] font-normal text-gray-900 dark:text-white tracking-tight">
                                Data do atendimento
                            </Label>
                            <div className="relative group">
                                <Input
                                    type="text"
                                    defaultValue="15/11/2024"
                                    className="h-12 rounded-[12px] border border-app-border dark:border-app-border-dark bg-white dark:bg-app-card-dark px-4 focus-visible:ring-[#1a342b] transition-all font-normal text-gray-900 dark:text-white"
                                />
                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-app-text-muted group-focus-within:text-[#1a342b] transition-colors pointer-events-none" />
                            </div>
                        </div>

                        {/* Tipo de Consulta */}
                        <div className="space-y-3">
                            <Label className="text-[15px] font-normal text-gray-900 dark:text-white tracking-tight">
                                Tipo de consulta
                            </Label>
                            <Select defaultValue="biorressonancia">
                                <SelectTrigger className="h-12 rounded-[12px] border border-app-border dark:border-app-border-dark bg-white dark:bg-app-card-dark px-4 text-gray-700 dark:text-white/80 font-normal focus:ring-[#1a342b]">
                                    <SelectValue preferPlaceholder placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent className="rounded-[14px] border-gray-100 dark:border-gray-800 shadow-xl">
                                    <SelectItem value="biorressonancia">Consulta Biorressonância Quântica</SelectItem>
                                    <SelectItem value="geral">Consulta Geral</SelectItem>
                                    <SelectItem value="nutricional">Avaliação Nutricional</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Queixa Principal */}
                        <div className="space-y-3">
                            <Label className="text-[15px] font-normal text-gray-900 dark:text-white tracking-tight">
                                Queixa principal
                            </Label>
                            <Textarea
                                defaultValue="Fadiga crônica e insônia"
                                className="min-h-[120px] rounded-[12px] border border-app-border dark:border-app-border-dark bg-white dark:bg-app-card-dark p-4 text-gray-700 dark:text-white/80 font-normal placeholder:text-app-text-muted focus-visible:ring-[#1a342b] resize-none leading-relaxed"
                            />
                        </div>

                        {/* Diagnóstico */}
                        <div className="space-y-3">
                            <Label className="text-[15px] font-normal text-gray-900 dark:text-white tracking-tight">
                                Diagnóstico
                            </Label>
                            <Textarea
                                defaultValue="Em avaliação"
                                className="min-h-[120px] rounded-[12px] border border-app-border dark:border-app-border-dark bg-white dark:bg-app-card-dark p-4 text-gray-700 dark:text-white/80 font-normal placeholder:text-app-text-muted focus-visible:ring-[#1a342b] resize-none leading-relaxed"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-6">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="h-12 px-8 rounded-[14px] border-gray-100 dark:border-gray-800 text-gray-600 dark:text-app-text-muted hover:bg-app-bg-secondary dark:hover:bg-white/5 font-normal transition-all"
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="h-12 px-10 rounded-[14px] bg-[#1a342b] hover:bg-[#152a22] text-white font-normal shadow-lg shadow-[#1a342b]/20 transition-all hover:scale-[1.02] hover:shadow-xl"
                                onClick={() => {
                                    onClose();
                                }}
                            >
                                Salvar alterações
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

