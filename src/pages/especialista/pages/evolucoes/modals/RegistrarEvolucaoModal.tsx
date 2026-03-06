import {
    Dialog,
    DialogContent,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { X, Calendar } from "lucide-react"

interface Paciente {
    id: number
    nome: string
}

interface RegistrarEvolucaoModalProps {
    isOpen: boolean
    onClose: () => void
    paciente: Paciente | null
}

export function RegistrarEvolucaoModal({ isOpen, onClose, paciente }: RegistrarEvolucaoModalProps) {
    if (!paciente) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                hideCloseButton={true}
                className="sm:max-w-[600px] p-0 rounded-[14px] overflow-hidden border-none shadow-2xl"
            >
                <div className="bg-white dark:bg-app-card-dark p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-normal text-gray-900 dark:text-white leading-tight">
                                Registrar evolução - {paciente.nome}
                            </h2>
                            <p className="text-app-text-muted dark:text-app-text-muted text-base">
                                Registre a evolução e observações da consulta realizada.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="h-8 w-8 flex items-center justify-center rounded-lg border border-app-border dark:border-app-border-dark bg-white dark:bg-transparent hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors shrink-0"
                        >
                            <X className="h-4 w-4 text-app-text-muted" />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="space-y-6">
                        {/* Data da Consulta */}
                        <div className="space-y-2">
                            <Label className="text-sm font-normal text-gray-900 dark:text-white tracking-wider opacity-80">
                                Data da consulta
                            </Label>
                            <div className="relative">
                                <Input type="date" hideDateIcon
                                    className="h-12 rounded-[12px] border-app-border dark:border-app-border-dark bg-white dark:bg-app-card-dark px-4 focus-visible:ring-[#0039A6] w-full"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                />
                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted pointer-events-none" />
                            </div>
                        </div>

                        {/* Queixa Principal */}
                        <div className="space-y-2">
                            <Label className="text-sm font-normal text-gray-900 dark:text-white tracking-wider opacity-80">
                                Queixa principal
                            </Label>
                            <Textarea
                                placeholder="Descreva a queixa principal do paciente..."
                                className="min-h-[100px] rounded-[12px] border-app-border dark:border-app-border-dark bg-white dark:bg-app-card-dark p-4 placeholder:text-app-text-muted focus-visible:ring-[#0039A6] resize-none"
                            />
                        </div>

                        {/* Exame Físico */}
                        <div className="space-y-2">
                            <Label className="text-sm font-normal text-gray-900 dark:text-white tracking-wider opacity-80">
                                Exame físico
                            </Label>
                            <Textarea
                                placeholder="Descreva os achados do exame físico..."
                                className="min-h-[100px] rounded-[12px] border-app-border dark:border-app-border-dark bg-white dark:bg-app-card-dark p-4 placeholder:text-app-text-muted focus-visible:ring-[#0039A6] resize-none"
                            />
                        </div>

                        {/* Diagnóstico */}
                        <div className="space-y-2">
                            <Label className="text-sm font-normal text-gray-900 dark:text-white tracking-wider opacity-80">
                                Diagnóstico
                            </Label>
                            <Textarea
                                placeholder="Informe o diagnóstico..."
                                className="min-h-[100px] rounded-[12px] border-app-border dark:border-app-border-dark bg-white dark:bg-app-card-dark p-4 placeholder:text-app-text-muted focus-visible:ring-[#0039A6] resize-none"
                            />
                        </div>

                        {/* Conduta/Tratamento */}
                        <div className="space-y-2">
                            <Label className="text-sm font-normal text-gray-900 dark:text-white tracking-wider opacity-80">
                                Conduta/tratamento
                            </Label>
                            <Textarea
                                placeholder="Descreva a conduta e o tratamento proposto..."
                                className="min-h-[100px] rounded-[12px] border-app-border dark:border-app-border-dark bg-white dark:bg-app-card-dark p-4 placeholder:text-app-text-muted focus-visible:ring-[#0039A6] resize-none"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="h-11 px-6 rounded-[10px] border-app-border text-gray-600 hover:bg-app-bg-secondary dark:border-app-border-dark dark:text-app-text-muted dark:hover:bg-white/5 font-normal"
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="h-11 px-8 rounded-[10px] bg-[#0039A6] hover:bg-[#002d82] text-white font-normal shadow-lg shadow-[#0039A6]/20 transition-all hover:scale-[1.02]"
                                onClick={() => {
                                    // Aqui iria a lógica de salvar
                                    onClose();
                                }}
                            >
                                Salvar evolução
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

