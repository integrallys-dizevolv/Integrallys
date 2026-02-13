import { Button } from '@/components/ui/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/Dialog'


interface ExcluirCartaoModalProps {
    isOpen: boolean
    onClose: () => void
    cardLastDigits: string
}

export function ExcluirCartaoModal({ isOpen, onClose, cardLastDigits }: ExcluirCartaoModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-[95vw] sm:max-w-[480px] p-8 rounded-[24px] bg-white dark:bg-[#0c1e3d] border-none shadow-2xl gap-6">
                <DialogHeader className="text-left space-y-2">
                    <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                        Excluir Cartão
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400 text-base">
                        Tem certeza que deseja remover o cartão com final <span className="font-semibold text-slate-900 dark:text-white">{cardLastDigits}</span>? Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex flex-col-reverse gap-2 mt-2 sm:flex-row sm:justify-end sm:gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex flex-row items-center justify-center gap-2 whitespace-nowrap h-11 px-6 shrink-0 rounded-[10px] w-full sm:w-auto border-slate-200 dark:border-slate-700"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="flex flex-row items-center justify-center gap-2 whitespace-nowrap h-11 px-6 shrink-0 w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-[10px]"
                        onClick={onClose}
                    >
                        Excluir Cartão
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
