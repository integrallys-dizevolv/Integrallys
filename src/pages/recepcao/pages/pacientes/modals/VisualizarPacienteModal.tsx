import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Patient } from '../../../context/types'

interface VisualizarPacienteModalProps {
    isOpen: boolean
    onClose: () => void
    paciente: Patient | null
}

const getVinculoLabel = (vinculo?: Patient['vinculoTipo']) => {
  if (vinculo === 'fornecedor') return 'Fornecedor'
  if (vinculo === 'prestador') return 'Prestador'
  if (vinculo === 'profissional') return 'Profissional'
    if (vinculo === 'usuario') return 'Usuário'
    if (vinculo === 'outro') return 'Outro'
    return 'Cliente'
}

export function VisualizarPacienteModal({ isOpen, onClose, paciente }: VisualizarPacienteModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[560px] rounded-[24px] overflow-hidden">
                <DialogHeader className="border-b border-app-border dark:border-app-border-dark">
                    <DialogTitle>Visualizar paciente</DialogTitle>
                    <DialogDescription>Dados cadastrais e foto do paciente.</DialogDescription>
                </DialogHeader>

                <div className="px-6 py-5 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded-full overflow-hidden border border-app-border dark:border-app-border-dark bg-app-bg-secondary dark:bg-white/5 shrink-0">
                            {paciente?.photoUrl ? (
                                <img src={paciente.photoUrl} alt={paciente.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-app-text-muted text-xs font-semibold">{(paciente?.name || 'Paciente').split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
                            )}
                        </div>
                        <div>
                            <p className="text-base font-normal text-app-text-primary dark:text-white">{paciente?.name || '-'}</p>
                            <p className="text-sm text-app-text-secondary dark:text-white/70">CPF: {paciente?.cpf || '-'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <p><strong>Telefone:</strong> {paciente?.phone || '-'}</p>
                        <p><strong>E-mail:</strong> {paciente?.email || '-'}</p>
                        <p><strong>RG:</strong> {paciente?.rg || '-'}</p>
                        <p><strong>Inscrição Estadual:</strong> {paciente?.inscricaoEstadual || '-'}</p>
                        <p><strong>Nascimento:</strong> {paciente?.birthDate ? new Date(paciente.birthDate).toLocaleDateString('pt-BR') : '-'}</p>
                        <p><strong>Status:</strong> {paciente?.activeStatus || 'Ativo'}</p>
                    </div>

                    <div>
                        <p className="text-xs text-app-text-muted mb-2">Tipo de vínculo</p>
                        <Badge variant="outline" className="rounded-full px-3 py-1 border-app-border dark:border-app-border-dark">
                            {getVinculoLabel(paciente?.vinculoTipo)}
                        </Badge>
                    </div>
                </div>

                <DialogFooter className="border-t border-app-border dark:border-app-border-dark pt-4">
                    <Button variant="outline" onClick={onClose}>Fechar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
