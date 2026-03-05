import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import type { PerfilPermissaoModal } from '@/types/permissoes'

interface PerfilModalProps {
    isOpen: boolean
    onClose: (open: boolean) => void
    profile: PerfilPermissaoModal | null
    mode: 'add' | 'edit'
}

export function PerfilModal({ isOpen, onClose, profile, mode }: PerfilModalProps) {
    const isEdit = mode === 'edit'

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[500px] w-[95%] sm:w-full gap-0 h-auto max-h-[90vh] flex flex-col p-0 rounded-[24px] overflow-hidden dark:bg-app-bg-dark dark:border-[#2d5a46]">
                <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                    <DialogTitle className="text-xl font-bold dark:text-white">
                        {isEdit ? 'Editar Perfil de Acesso' : 'Novo Perfil de Acesso'}
                    </DialogTitle>
                    <DialogDescription className="text-app-text-muted mt-1.5 dark:text-app-text-muted">
                        {isEdit
                            ? 'Atualize as permissões e informações deste perfil de acesso.'
                            : 'Crie um novo perfil de acesso definindo suas permissões e responsabilidades.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-2 pb-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                    <div className="space-y-1.5">
                        <Label className="text-sm font-semibold text-app-text-primary dark:text-white">Nome do Perfil</Label>
                        <Input
                            placeholder="Ex: Enfermeiro"
                            defaultValue={profile?.perfil || profile?.nome || ''}
                            className="h-11 rounded-lg border-app-border bg-app-card dark:bg-app-bg-dark dark:border-app-border-dark text-sm placeholder:text-app-text-muted"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-semibold text-app-text-primary dark:text-white">Descrição</Label>
                        <Textarea
                            placeholder="Descreva as responsabilidades deste perfil"
                            defaultValue={profile?.descricao || ''}
                            className="min-h-[80px] p-2.5 rounded-lg border-app-border bg-app-card dark:bg-app-bg-dark dark:border-app-border-dark text-sm placeholder:text-app-text-muted focus-visible:ring-0 resize-none"
                        />
                    </div>

                    <div className="space-y-3 pt-1">
                        <Label className="text-sm font-semibold text-app-text-primary dark:text-white">Permissões</Label>
                        <div className="space-y-3">
                            {[
                                'Visualizar Pacientes',
                                'Editar Prontuários',
                                'Agendar Consultas',
                                'Visualizar Agenda Simultânea',
                                'Gerar Relatórios'
                            ].map((perm) => (
                                <label
                                    key={perm}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5 cursor-pointer transition-colors group"
                                >
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            defaultChecked={isEdit && Math.random() > 0.5}
                                            className="peer sr-only"
                                        />
                                        <div className="h-5 w-5 rounded-md border-2 border-app-border dark:border-white/20 bg-app-card dark:bg-app-card/5 peer-checked:bg-emerald-600 peer-checked:border-emerald-600 dark:peer-checked:bg-emerald-500 dark:peer-checked:border-emerald-500 transition-all flex items-center justify-center">
                                            <svg
                                                className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={3}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <svg
                                            className="absolute inset-0 h-5 w-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={3}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-app-text-primary dark:text-white/80">
                                        {perm}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-6 pt-4 shrink-0">
                    <Button
                        variant="outline"
                        onClick={() => onClose(false)}
                        className="h-11 px-6 rounded-lg border-app-border text-gray-700 hover:bg-app-bg-secondary dark:border-app-border-dark dark:text-white/80 dark:hover:bg-app-card/5"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="h-11 px-6 rounded-lg bg-[#0039A6] hover:bg-[#002d82] text-white shadow-sm font-medium"
                    >
                        {isEdit ? 'Salvar Alterações' : 'Criar Perfil'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
