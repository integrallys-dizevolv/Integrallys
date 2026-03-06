import { Button } from '@/components/ui/Button'
import {
    Dialog,
    DialogContent,
    DialogFooter
} from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { X, Save, Plus } from 'lucide-react'

interface AdicionarNotaErrataModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AdicionarNotaErrataModal({ isOpen, onClose }: AdicionarNotaErrataModalProps) {
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
                            Adicionar nota/errata
                        </h2>
                        <p className="text-[15px] text-app-text-muted dark:text-app-text-muted font-normal">
                            Adicione observações ou correções à evolução finalizada (RN-009)
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 flex items-center justify-center rounded-lg border border-app-border dark:border-app-border-dark bg-white dark:bg-transparent hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors shrink-0"
                    >
                        <X className="h-4 w-4 text-app-text-muted" />
                    </button>
                </div>

                <div className="space-y-5 mb-8">
                    {/* Paciente */}
                    <div className="space-y-2">
                        <Label className="text-[14px] font-normal text-gray-900 dark:text-white">
                            Paciente
                        </Label>
                        <Input
                            readOnly
                            value="Maria Silva"
                            className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-gray-100 dark:border-gray-800 focus:ring-[#0039A6] text-app-text-muted dark:text-app-text-muted font-normal"
                        />
                    </div>

                    {/* Data da Nota */}
                    <div className="space-y-2">
                        <Label className="text-[14px] font-normal text-gray-900 dark:text-white">
                            Data da nota
                        </Label>
                        <Input
                            readOnly
                            value="15/01/2026"
                            className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-gray-100 dark:border-gray-800 focus:ring-[#0039A6] text-app-text-muted dark:text-app-text-muted font-normal"
                        />
                    </div>

                    {/* Texto da Nota */}
                    <div className="space-y-2">
                        <Label className="text-[14px] font-normal text-gray-900 dark:text-white">
                            Texto da nota/errata
                        </Label>
                        <Textarea
                            placeholder="Descreva a observação adicional ou correção necessária..."
                            className="min-h-[120px] rounded-[12px] bg-white dark:bg-black/20 border-app-border dark:border-app-border-dark resize-none p-4 text-[15px] focus:ring-[#0039A6] focus:border-[#0039A6]"
                        />
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="flex flex-col sm:flex-row items-center gap-3 sm:justify-end w-full border-t border-gray-100 dark:border-gray-800 pt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto h-11 rounded-[10px] font-normal text-gray-700 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 border-app-border dark:border-app-border-dark"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="w-full sm:w-auto px-6 h-11 bg-[#0039A6] hover:bg-[#002d82] text-white rounded-[10px] font-normal shadow-lg shadow-[#0039A6]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        onClick={onClose}
                    >
                        Adicionar nota/errata
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
