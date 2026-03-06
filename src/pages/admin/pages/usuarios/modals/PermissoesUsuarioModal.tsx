import { Shield, Settings, Users, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import type { User } from '../../../components/types'

interface PermissoesUsuarioModalProps {
    isOpen: boolean
    onClose: (open: boolean) => void
    user: User | null
}

export function PermissoesUsuarioModal({ isOpen, onClose, user }: PermissoesUsuarioModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[750px] w-full gap-0 overflow-hidden rounded-[24px]">
                <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                    <DialogTitle className="text-xl font-normal">Alterar permissões</DialogTitle>
                    <DialogDescription className="text-app-text-muted mt-1.5">
                        Selecione as permissões específicas para este usuário.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-4 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                    {/* User Banner */}
                    <div className="flex items-center justify-between p-4 bg-app-bg-secondary dark:bg-app-card/5 rounded-xl border border-gray-100 dark:border-app-border-dark">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-[#E8F5E9] dark:bg-[#0039A6]/20 flex items-center justify-center text-[#0039A6] dark:text-[#4ADE80]">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-normal text-app-text-primary dark:text-white text-base">{user?.nome}</h4>
                                <p className="text-sm text-app-text-muted dark:text-app-text-muted">Perfil: {user?.perfil}</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="h-8 px-3 rounded-lg border-app-border text-gray-600 dark:text-white/80 font-normal bg-app-card dark:bg-transparent shield-badge gap-2">
                            <Shield className="h-3.5 w-3.5" />
                            13 permissões disponíveis
                        </Badge>
                    </div>

                    {/* Permissions Group */}
                    <div className="border rounded-xl border-app-border dark:border-app-border-dark p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Settings className="h-4.5 w-4.5 text-[#0039A6] dark:text-[#4ADE80]" />
                                <h5 className="font-normal text-app-text-primary dark:text-white">Administrativo</h5>
                            </div>
                            <Badge variant="secondary" className="bg-app-bg-secondary text-gray-600 dark:bg-app-card/10 dark:text-white rounded-md">4 permissões</Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                'Visualizar Dashboard', 'Gerenciar Usuários', 'Editar Permissões', 'Acessar Configurações'
                            ].map((perm) => (
                                <div key={perm} className="flex items-center gap-3 p-3 hover:bg-app-bg-secondary dark:hover:bg-app-card/5 rounded-lg transition-colors cursor-pointer group">
                                    <CheckCircle2 className="h-5 w-5 text-[#0039A6] dark:text-[#4ADE80] fill-[#E8F5E9] dark:fill-[#0039A6]/40" />
                                    <span className="text-sm font-normal text-app-text-primary dark:text-gray-200 group-hover:text-[#0039A6] dark:group-hover:text-[#4ADE80]">{perm}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-6 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => onClose(false)}
                        className="h-11 px-6 rounded-lg border-app-border text-gray-700 hover:bg-app-bg-secondary dark:border-app-border-dark dark:text-white/80 dark:hover:bg-app-card/5"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="h-11 px-8 rounded-lg bg-[#0039A6] hover:bg-[#002d82] text-white shadow-sm font-normal"
                    >
                        Salvar alterações
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
