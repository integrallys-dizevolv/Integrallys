import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Badge } from '@/components/ui/Badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import type { User } from '../../../components/types'

interface VisualizarUsuarioModalProps {
    isOpen: boolean
    onClose: (open: boolean) => void
    user: User | null
}

export function VisualizarUsuarioModal({ isOpen, onClose, user }: VisualizarUsuarioModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[700px] w-full gap-0 overflow-hidden rounded-[24px]">
                <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                    <DialogTitle className="text-xl font-normal">Visualizar usuário</DialogTitle>
                    <DialogDescription className="text-app-text-muted mt-1.5 font-normal">
                        Detalhes completos do usuário selecionado.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
                    <div className="space-y-1.5">
                        <Label className="text-sm font-normal text-app-text-primary dark:text-white">Nome completo</Label>
                        <div className="h-11 px-3 flex items-center rounded-lg border border-gray-100 bg-app-bg-secondary dark:bg-app-card/5 dark:border-app-border-dark text-sm text-app-text-primary dark:text-white/80 font-normal">
                            {user?.nome}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-normal text-app-text-primary dark:text-white">E-mail</Label>
                        <div className="h-11 px-3 flex items-center rounded-lg border border-gray-100 bg-app-bg-secondary dark:bg-app-card/5 dark:border-app-border-dark text-sm text-app-text-primary dark:text-white/80 font-normal">
                            {user?.email}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-normal text-app-text-primary dark:text-white">Perfil</Label>
                        <div className="h-11 px-3 flex items-center rounded-lg border border-gray-100 bg-app-bg-secondary dark:bg-app-card/5 dark:border-app-border-dark text-sm text-app-text-primary dark:text-white/80 font-normal">
                            {user?.perfil}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-normal text-app-text-primary dark:text-white">Unidade</Label>
                        <div className="h-11 px-3 flex items-center rounded-lg border border-gray-100 bg-app-bg-secondary dark:bg-app-card/5 dark:border-app-border-dark text-sm text-app-text-primary dark:text-white/80 font-normal">
                            {user?.unidade}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-normal text-app-text-primary dark:text-white">Status</Label>
                        <div className="h-11 px-3 flex items-center rounded-lg border border-gray-100 bg-app-bg-secondary dark:bg-app-card/5 dark:border-app-border-dark text-sm">
                            <Badge className={user?.status === 'Ativo'
                                ? 'bg-[#0039A6] text-white shadow-sm font-normal'
                                : 'bg-[#F2F4F7] text-[#3b414e] border border-[#D0D5DD] dark:bg-[#0c1e3d] dark:text-gray-300 dark:border-app-border-dark font-normal'
                            }>
                                {user?.status}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-normal text-app-text-primary dark:text-white">Conselho de classe</Label>
                        <div className="h-11 px-3 flex items-center rounded-lg border border-gray-100 bg-app-bg-secondary dark:bg-app-card/5 dark:border-app-border-dark text-sm text-app-text-primary dark:text-white/80 font-normal">
                            {user?.crth || 'N/A'}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-normal text-app-text-primary dark:text-white">UF do conselho</Label>
                        <div className="h-11 px-3 flex items-center rounded-lg border border-gray-100 bg-app-bg-secondary dark:bg-app-card/5 dark:border-app-border-dark text-sm text-app-text-primary dark:text-white/80 font-normal">
                            SP
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-6 pt-4">
                    <Button
                        onClick={() => onClose(false)}
                        className="h-11 px-8 rounded-lg bg-[#0039A6] hover:bg-[#002d82] text-white font-normal shadow-sm"
                    >
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
