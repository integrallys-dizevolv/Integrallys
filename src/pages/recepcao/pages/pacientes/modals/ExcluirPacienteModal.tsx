import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { AlertCircle, X, User, AlertTriangle } from "lucide-react"
import { Patient } from "@/pages/recepcao/context/types"

interface ExcluirPacienteModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    paciente: Patient | null
}

export function ExcluirPacienteModal({ isOpen, onClose, onConfirm, paciente }: ExcluirPacienteModalProps) {
    if (!paciente) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[550px] w-[95%] bg-app-card dark:bg-app-card-dark p-0 overflow-hidden border-none rounded-[24px]">
                <div className="p-5 md:p-8 space-y-6">
                    {/* Header */}
                    <div className="space-y-1 pr-8">
                        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5 md:h-6 md:w-6" />
                            Excluir Paciente
                        </h2>
                        <p className="text-app-text-secondary dark:text-white/60 text-xs md:text-sm font-medium">
                            Remova permanentemente o paciente do sistema
                        </p>
                    </div>

                    {/* Warning Box */}
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-start gap-3 shadow-sm">
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[12px] md:text-[13px] font-medium text-red-800 dark:text-red-400 leading-relaxed">
                            Esta ação não pode ser desfeita. Todos os dados do paciente serão permanentemente removidos do sistema.
                        </p>
                    </div>

                    {/* Patient Card */}
                    <div className="p-4 md:p-6 bg-app-bg-secondary dark:bg-white/5 rounded-[20px] border border-app-border dark:border-app-border-dark flex items-center gap-4">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-app-card dark:bg-app-bg-dark shadow-sm flex items-center justify-center border border-app-border dark:border-app-border-dark shrink-0">
                            <User className="h-5 w-5 md:h-6 md:w-6 text-app-text-muted" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                            <h3 className="text-base md:text-lg font-bold text-app-text-primary dark:text-white truncate">{paciente.name}</h3>
                            <p className="text-xs md:text-sm font-medium text-app-text-muted truncate">{paciente.email} • {paciente.phone}</p>
                            <p className="text-[11px] md:text-[12px] font-medium text-app-text-muted">CPF: {paciente.cpf || '---'}</p>
                        </div>
                    </div>

                    {/* Confirmation Text */}
                    <div className="space-y-3 px-1">
                        <h4 className="text-sm md:text-[15px] font-bold text-app-text-secondary dark:text-white/80">Tem certeza que deseja excluir este paciente?</h4>
                        <p className="text-[12px] md:text-[13px] text-app-text-muted dark:text-white/60 leading-relaxed">
                            • Histórico de consultas será mantido para fins de auditoria • O paciente não poderá mais agendar consultas • Esta ação é irreversível
                        </p>
                    </div>
                </div>

                <DialogFooter className="p-5 md:p-8 pt-0 flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:flex-1 h-11 md:h-12 rounded-[12px] font-bold text-app-text-secondary dark:text-white/80 border-app-border dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-all shadow-sm"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="w-full sm:flex-1 h-11 md:h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-[12px] shadow-md shadow-red-600/10 transition-all active:scale-[0.98]"
                    >
                        Confirmar Exclusão
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
