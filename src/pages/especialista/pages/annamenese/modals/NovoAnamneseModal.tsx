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
import { X, Calendar, Activity } from "lucide-react"

interface NovoAnamneseModalProps {
    isOpen: boolean
    onClose: () => void
}

export function NovoAnamneseModal({ isOpen, onClose }: NovoAnamneseModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                hideCloseButton={true}
                className="sm:max-w-[700px] p-0 rounded-[24px] overflow-hidden border-none shadow-2xl"
            >
                <div className="bg-white dark:bg-app-card-dark p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div className="space-y-1.5">
                            <h2 className="text-2xl font-normal text-gray-900 dark:text-white leading-tight">
                                Nova anamnese
                            </h2>
                            <p className="text-[#64748b] dark:text-app-text-muted text-[15px] font-normal">
                                Registre os dados clínicos e bioimpedância do paciente
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
                        {/* Paciente Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-[15px] font-normal text-gray-900 dark:text-white tracking-tight">
                                    Paciente <span className="text-red-500">*</span>
                                </Label>
                                <Select>
                                    <SelectTrigger className="h-12 rounded-[12px] border border-app-border dark:border-app-border-dark bg-white dark:bg-app-card-dark px-4 text-gray-700 dark:text-white/80 font-normal focus:ring-[#1a342b]">
                                        <SelectValue preferPlaceholder placeholder="Selecione o paciente" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-[14px] border-gray-100 dark:border-gray-800 shadow-xl">
                                        <SelectItem value="maria">Maria Silva</SelectItem>
                                        <SelectItem value="joao">João Oliveira</SelectItem>
                                        <SelectItem value="ana">Ana Costa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[15px] font-normal text-gray-900 dark:text-white tracking-tight">
                                    Data da avaliação <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative group">
                                    <Input
                                        type="text"
                                        placeholder="15/11/2025"
                                        className="h-12 rounded-[12px] border border-app-border dark:border-app-border-dark bg-white dark:bg-app-card-dark px-4 focus-visible:ring-[#1a342b] transition-all font-normal text-gray-900 dark:text-white"
                                    />
                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-app-text-muted group-focus-within:text-[#1a342b] transition-colors pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Bioimpedancia Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-normal text-gray-900 dark:text-white flex items-center gap-2">
                                <Activity className="h-5 w-5 text-[#0039A6] dark:text-[#4da885]" />
                                Bioimpedância
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-[15px] font-normal text-gray-900 dark:text-white tracking-tight">
                                        Peso (kg)
                                    </Label>
                                    <Input
                                        type="number"
                                        placeholder="00.0"
                                        className="h-12 rounded-[12px] border border-app-border dark:border-app-border-dark bg-white dark:bg-app-card-dark px-4 focus-visible:ring-[#1a342b] transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[15px] font-normal text-gray-900 dark:text-white tracking-tight">
                                        IMC
                                    </Label>
                                    <Input
                                        type="number"
                                        placeholder="00.0"
                                        className="h-12 rounded-[12px] border border-app-border dark:border-app-border-dark bg-white dark:bg-transparent px-4 focus-visible:ring-[#1a342b] transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[15px] font-normal text-gray-900 dark:text-white tracking-tight">
                                        Gordura (%)
                                    </Label>
                                    <Input
                                        type="number"
                                        placeholder="00.0"
                                        className="h-12 rounded-[12px] border border-app-border dark:border-app-border-dark bg-white dark:bg-app-card-dark px-4 focus-visible:ring-[#1a342b] transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Clinical Section */}
                        <div className="space-y-3">
                            <Label className="text-[15px] font-normal text-gray-900 dark:text-white tracking-tight">
                                Queixa principal <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                placeholder="Descreva os sintomas e queixas do paciente..."
                                className="min-h-[120px] rounded-[12px] border border-app-border dark:border-app-border-dark bg-white dark:bg-app-card-dark p-4 text-gray-700 dark:text-white/80 font-normal placeholder:text-app-text-muted focus-visible:ring-[#1a342b] resize-none leading-relaxed"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-6">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="h-12 px-8 rounded-[12px] border-app-border dark:border-gray-800 text-gray-700 dark:text-white font-normal text-base hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-all bg-white dark:bg-transparent"
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="h-12 px-10 rounded-[12px] bg-[#0039A6] hover:bg-[#002d82] text-white font-normal text-base shadow-lg shadow-[#0039A6]/20 transition-all hover:scale-[1.02] hover:shadow-xl"
                                onClick={() => {
                                    onClose();
                                }}
                            >
                                Salvar anamnese
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

