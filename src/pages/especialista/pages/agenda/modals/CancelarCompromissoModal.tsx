import {
    Dialog,
    DialogContent,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { Label } from "@/components/ui/Label"
import { X, AlertCircle } from "lucide-react"

interface Appointment {
    id: number
    title: string
    type: string
}

interface CancelarCompromissoModalProps {
    isOpen: boolean
    onClose: () => void
    appointment: Appointment | null
}

export function CancelarCompromissoModal({ isOpen, onClose, appointment }: CancelarCompromissoModalProps) {
    if (!appointment) return null;

    const isMeeting = appointment.type === 'reuniao' || appointment.type === 'administrativo';
    const title = isMeeting ? 'Cancelar reunião' : 'Cancelar consulta';
    const subtitle = isMeeting
        ? 'Tem certeza que deseja cancelar esta reunião? Todos os participantes serão notificados sobre o cancelamento.'
        : 'Tem certeza que deseja cancelar esta consulta? O paciente será notificado sobre o cancelamento.';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                hideCloseButton={true}
                className="w-[95vw] sm:max-w-[600px] p-8 rounded-[24px] bg-white dark:bg-app-card-dark border-none shadow-2xl gap-8 overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
                {/* Header with Circle Icon */}
                <div className="flex items-start gap-5">
                    <div className="h-14 w-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                        <X className="h-7 w-7 text-red-600 dark:text-red-500" />
                    </div>
                    <div className="space-y-1 pr-8">
                        <h2 className="text-2xl font-normal text-gray-900 dark:text-white leading-tight">
                            {title}
                        </h2>
                        <p className="text-app-text-muted dark:text-app-text-muted text-base leading-relaxed">
                            {subtitle}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute right-8 top-8 h-8 w-8 flex items-center justify-center rounded-lg border border-app-border dark:border-app-border-dark bg-white dark:bg-transparent hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors shrink-0"
                    >
                        <X className="h-4 w-4 text-app-text-muted" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Attention Alert Box */}
                    <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-[14px] p-5 space-y-2">
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-500 font-normal">
                            <X className="h-4 w-4" />
                            <span>Atenção: esta ação não pode ser desfeita</span>
                        </div>
                        <p className="text-red-800/80 dark:text-red-400/80 text-sm leading-relaxed">
                            {isMeeting
                                ? 'A reunião será marcada como cancelada e removida da agenda de todos os participantes.'
                                : 'A consulta será marcada como cancelada e o horário será liberado na sua agenda.'
                            }
                        </p>
                    </div>

                    {/* Reason Textarea */}
                    <div className="space-y-3">
                        <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                            Motivo do cancelamento (opcional)
                        </Label>
                        <Textarea
                            placeholder="Ex: Reunião não é mais necessária, mudança de prioridades..."
                            className="min-h-[120px] rounded-[14px] border-app-border dark:border-app-border-dark bg-white dark:bg-transparent p-4 placeholder:text-app-text-muted focus-visible:ring-red-500/50 resize-none text-base"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="h-12 px-8 rounded-[12px] border-app-border text-gray-700 hover:bg-app-bg-secondary dark:border-app-border-dark dark:text-white/80 dark:hover:bg-white/5 font-normal"
                        >
                            {isMeeting ? 'Manter reunião' : 'Manter consulta'}
                        </Button>
                        <Button
                            className="h-12 px-8 rounded-[12px] bg-[#d93f48] hover:bg-[#c1323a] text-white font-normal shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] flex items-center gap-2"
                            onClick={() => {
                                // Lógica de cancelamento aqui
                                onClose();
                            }}
                        >
                            <X className="h-4 w-4" />
                            <span>Confirmar cancelamento</span>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
