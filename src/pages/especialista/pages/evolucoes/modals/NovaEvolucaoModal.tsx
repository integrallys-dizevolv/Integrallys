import { Button } from '@/components/ui/Button'
import {
    Dialog,
    DialogContent,
    DialogFooter
} from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select"
import { ClipboardList, Save, X } from 'lucide-react'

interface NovaEvolucaoModalProps {
    isOpen: boolean
    onClose: () => void
}

export function NovaEvolucaoModal({ isOpen, onClose }: NovaEvolucaoModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                hideCloseButton={true}
                className="w-[95vw] sm:max-w-[600px] p-8 rounded-[24px] bg-white dark:bg-app-card-dark border-none shadow-2xl gap-0 block overflow-y-auto max-h-[90vh] custom-scrollbar animate-in bg-white dark:bg-app-card-dark"
            >
                {/* Header with Title, Icon and Close Button */}
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-gray-900 dark:text-white" />
                            <h2 className="text-xl font-normal text-gray-900 dark:text-white tracking-tight">
                                Nova evolução clínica
                            </h2>
                        </div>
                        <p className="text-[15px] text-app-text-muted dark:text-app-text-muted font-normal">
                            Registre uma nova evolução clínica do paciente
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 flex items-center justify-center rounded-lg border border-app-border dark:border-app-border-dark bg-white dark:bg-transparent hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors shrink-0"
                    >
                        <X className="h-4 w-4 text-app-text-muted" />
                    </button>
                </div>

                <div className="space-y-6 mb-6">
                    {/* Row 1: Paciente */}
                    <div className="space-y-2">
                        <Label className="text-[14px] font-normal text-gray-800 dark:text-gray-200">
                            Paciente *
                        </Label>
                        <Input
                            placeholder="Digite o nome do paciente..."
                            className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark focus:ring-[#0039A6]"
                        />
                    </div>

                    {/* Row 2: Data & Tipo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-[14px] font-normal text-gray-800 dark:text-gray-200">
                                Data da evolução *
                            </Label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark focus:ring-[#0039A6] block w-full"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[14px] font-normal text-gray-800 dark:text-gray-200">
                                Tipo *
                            </Label>
                            <Select>
                                <SelectTrigger className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark focus:ring-[#0039A6] text-gray-600 dark:text-white/80">
                                    <SelectValue preferPlaceholder placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent className="rounded-[12px]">
                                    <SelectItem value="consulta">Consulta</SelectItem>
                                    <SelectItem value="retorno">Retorno</SelectItem>
                                    <SelectItem value="exame">Exame</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Row 3: Resumo/Notas */}
                    <div className="space-y-2">
                        <Label className="text-[14px] font-normal text-gray-800 dark:text-gray-200">
                            Resumo/notas *
                        </Label>
                        <Textarea
                            placeholder="Descreva a evolução clínica..."
                            className="min-h-[100px] rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark resize-none p-4 text-[15px] focus:ring-[#0039A6] focus:border-[#0039A6]"
                        />
                    </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800 mb-2">
                    <h3 className="text-[16px] font-normal text-gray-900 dark:text-white">Retorno da recepção</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[14px] font-normal text-gray-800 dark:text-gray-200">
                                Status do retorno
                            </Label>
                            <Select>
                                <SelectTrigger className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark focus:ring-[#0039A6] text-gray-600 dark:text-white/80">
                                    <SelectValue preferPlaceholder placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-[12px]">
                                    <SelectItem value="avisado">Paciente avisado</SelectItem>
                                    <SelectItem value="confirmado">Retorno confirmado</SelectItem>
                                    <SelectItem value="nao_localizado">Não localizado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[14px] font-normal text-gray-800 dark:text-gray-200">
                                Detalhes do retorno (Opcional)
                            </Label>
                            <Textarea
                                placeholder="Observações da recepção..."
                                className="min-h-[80px] rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark resize-none p-4 text-[15px] focus:ring-[#0039A6] focus:border-[#0039A6]"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer with Actions */}
                <DialogFooter className="flex flex-col sm:flex-row items-center gap-3 sm:justify-end w-full border-t border-gray-100 dark:border-gray-800 pt-4">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="w-full sm:w-auto h-12 rounded-[12px] font-normal text-gray-700 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 border border-app-border dark:border-app-border-dark"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="w-full sm:w-auto px-8 h-12 bg-[#0039A6] hover:bg-[#002d82] text-white rounded-[12px] font-normal shadow-lg shadow-[#0039A6]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        onClick={onClose}
                    >
                        <Save className="h-4 w-4" />
                        Criar evolução
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

