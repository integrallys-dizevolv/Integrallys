import { Button } from '@/components/ui/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/Dialog'

interface CancelarModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

export function CancelarModal({ isOpen, onClose, onConfirm }: CancelarModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[440px] w-[95vw] max-h-[85vh] p-0 rounded-[24px] border-none bg-white dark:bg-[#0c1e3d] shadow-2xl overflow-hidden flex flex-col transition-all duration-300">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Cancelar Consulta</DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-0 mt-2 px-6 pb-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="whitespace-nowrap rounded-[5px]"
                    >
                        Não, manter consulta
                    </Button>
                    <Button
                        className="whitespace-nowrap bg-red-600 hover:bg-red-700 text-white rounded-[5px]"
                        onClick={onConfirm}
                    >
                        Sim, cancelar consulta
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
