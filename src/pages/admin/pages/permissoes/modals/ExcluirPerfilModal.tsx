import { Button } from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { Permission } from '../../../components/types'

interface ExcluirPerfilModalProps {
    isOpen: boolean
    onClose: (open: boolean) => void
    profile: Permission | null
    onConfirm: (profileId: number) => void
}

export function ExcluirPerfilModal({ isOpen, onClose, profile, onConfirm }: ExcluirPerfilModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[450px] w-[95%] sm:w-full gap-0 overflow-hidden rounded-[24px] dark:bg-app-bg-dark dark:border-[#2d5a46]">
                <DialogHeader className="px-6 pt-8 pb-4 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                        <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-500" />
                    </div>
                    <DialogTitle className="text-xl font-bold dark:text-white">Excluir Perfil</DialogTitle>
                    <DialogDescription className="text-app-text-muted mt-2 dark:text-app-text-muted">
                        Você está prestes a excluir o perfil <span className="font-bold text-gray-900 dark:text-white">"{profile?.perfil || (profile as any)?.nome}"</span>.
                        Esta ação não pode ser desfeita e afetará todos os usuários vinculados.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="px-6 py-8 pt-4 flex flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onClose(false)}
                        className="flex-1 h-11 rounded-lg border-app-border text-gray-700 hover:bg-app-bg-secondary dark:border-app-border-dark dark:text-white/80 dark:hover:bg-app-card/5"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => profile && onConfirm(profile.id)}
                        className="flex-1 h-11 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm font-medium transition-colors"
                    >
                        Confirmar Exclusão
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
