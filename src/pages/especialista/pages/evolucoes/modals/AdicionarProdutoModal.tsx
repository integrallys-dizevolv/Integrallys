import { Button } from '@/components/ui/Button'
import {
    Dialog,
    DialogContent,
    DialogFooter
} from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select"
import { X } from 'lucide-react'

interface AdicionarProdutoModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AdicionarProdutoModal({ isOpen, onClose }: AdicionarProdutoModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                hideCloseButton={true}
                className="w-[95vw] sm:max-w-[550px] p-6 md:p-8 rounded-[24px] bg-white dark:bg-app-card-dark border-none shadow-2xl block overflow-y-auto max-h-[90vh] custom-scrollbar animate-in"
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-normal text-gray-900 dark:text-white tracking-tight">
                            Adicionar produto
                        </h2>
                        <p className="text-[15px] text-app-text-muted dark:text-app-text-muted font-normal">
                            Adicione um produto à prescrição do paciente
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
                    {/* Nome do Produto */}
                    <div className="space-y-2">
                        <Label className="text-[14px] font-normal text-gray-900 dark:text-white">
                            Nome do produto
                        </Label>
                        <Input
                            placeholder="Digite o nome do produto..."
                            className="h-12 rounded-[12px] bg-white dark:bg-black/20 border-gray-400 dark:border-gray-500 focus:ring-[#0039A6] text-gray-900 dark:text-white placeholder:text-app-text-muted border-2"
                        />
                    </div>

                    {/* Tipo */}
                    <div className="space-y-2">
                        <Label className="text-[14px] font-normal text-gray-900 dark:text-white">
                            Tipo
                        </Label>
                        <Select>
                            <SelectTrigger className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark focus:ring-[#0039A6] text-gray-600 dark:text-white/80">
                                <SelectValue preferPlaceholder placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[12px]">
                                <SelectItem value="medicamento">Medicamento</SelectItem>
                                <SelectItem value="suplemento">Suplemento</SelectItem>
                                <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Modo de Uso */}
                    <div className="space-y-2">
                        <Label className="text-[14px] font-normal text-gray-900 dark:text-white">
                            Modo de uso
                        </Label>
                        <Input
                            placeholder="Ex: 1 dose com água"
                            className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark focus:ring-[#0039A6] text-gray-900 dark:text-white placeholder:text-app-text-muted"
                        />
                    </div>

                    {/* Frequência */}
                    <div className="space-y-2">
                        <Label className="text-[14px] font-normal text-gray-900 dark:text-white">
                            Frequência
                        </Label>
                        <Input
                            placeholder="Ex: Diariamente"
                            className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark focus:ring-[#0039A6] text-gray-900 dark:text-white placeholder:text-app-text-muted"
                        />
                    </div>

                    {/* Horário Ideal */}
                    <div className="space-y-2">
                        <Label className="text-[14px] font-normal text-gray-900 dark:text-white">
                            Horário ideal
                        </Label>
                        <Input
                            placeholder="Ex: Café da manhã"
                            className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark focus:ring-[#0039A6] text-gray-900 dark:text-white placeholder:text-app-text-muted"
                        />
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="flex flex-col sm:flex-row items-center gap-3 sm:justify-end w-full border-t border-gray-100 dark:border-gray-800 pt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto h-11 px-6 rounded-[10px] font-normal text-gray-700 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 border-app-border dark:border-app-border-dark"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="w-full sm:w-auto px-6 h-11 bg-[#0039A6] hover:bg-[#002d82] text-white rounded-[10px] font-normal shadow-lg shadow-[#0039A6]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        onClick={onClose}
                    >
                        Adicionar produto
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

