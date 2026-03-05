import { Button } from '@/components/ui/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/Dialog'
import { Trash2 } from 'lucide-react'

interface ExcluirModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    documentId?: string
}

export function ExcluirModal({ isOpen, onClose, onConfirm, documentId }: ExcluirModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[440px] w-[95vw] max-h-[85vh] p-0 rounded-[24px] border-none bg-white dark:bg-[#0c1e3d] shadow-2xl overflow-hidden flex flex-col transition-all duration-300">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-red-600" />
                        Confirmar Exclusão
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400 mt-2">
                        Tem certeza que deseja excluir o documento {documentId && <span className="font-bold text-gray-900 dark:text-gray-100">{documentId}</span>}?
                        Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-0 mt-2 px-6 pb-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="whitespace-nowrap rounded-[5px]"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="whitespace-nowrap bg-red-600 hover:bg-red-700 text-white rounded-[5px]"
                        onClick={onConfirm}
                    >
                        Sim, excluir documento
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
