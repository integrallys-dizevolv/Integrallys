import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import type { User } from '../../../components/types'

interface ExcluirUsuarioModalProps {
    isOpen: boolean
    onClose: (open: boolean) => void
    user: User | null
}

export function ExcluirUsuarioModal({ isOpen, onClose, user }: ExcluirUsuarioModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[450px] w-full gap-0 overflow-hidden rounded-[24px]">
                <div className="px-6 pt-8 pb-4 flex flex-col items-center text-center">
                    <div className="h-14 w-14 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
                        <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-app-text-primary dark:text-white mb-2">Confirmar Exclusão</DialogTitle>
                    <DialogDescription className="text-app-text-muted mb-6 max-w-xs mx-auto">
                        Deseja realmente excluir este item? Esta ação não poderá ser desfeita. Todos os dados relacionados a este registro serão permanentemente removidos da plataforma.
                    </DialogDescription>

                    <div className="w-full p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl mb-2">
                        <p className="text-sm font-bold text-red-700 dark:text-red-300">
                            Usuário: <span className="font-extrabold">{user?.nome}</span>
                        </p>
                    </div>
                </div>

                <DialogFooter className="px-6 pb-8 pt-2 sm:justify-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => onClose(false)}
                        className="h-11 px-8 rounded-lg border-app-border text-gray-700 hover:bg-app-bg-secondary dark:border-app-border-dark dark:text-white/80 dark:hover:bg-app-card/5 w-full sm:w-auto"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="h-11 px-8 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm font-medium w-full sm:w-auto"
                    >
                        Excluir
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
