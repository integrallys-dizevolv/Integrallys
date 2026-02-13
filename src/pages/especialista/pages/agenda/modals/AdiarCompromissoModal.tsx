import {
    Dialog,
    DialogContent,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { X, Calendar, Clock, AlertCircle } from "lucide-react"

interface Appointment {
    id: number
    time: string
    title: string
    date?: string // Adicionado para facilitar a visualização no modal
}

interface AdiarCompromissoModalProps {
    isOpen: boolean
    onClose: () => void
    appointment: Appointment | null
}

export function AdiarCompromissoModal({ isOpen, onClose, appointment }: AdiarCompromissoModalProps) {
    if (!appointment) return null;

    // Data fictícia para o exemplo se não vier no objeto
    const displayDate = appointment.date || '20/12/2025';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                hideCloseButton={true}
                className="w-[95vw] sm:max-w-[600px] p-8 rounded-[24px] bg-white dark:bg-app-card-dark border-none shadow-2xl gap-8 overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
                {/* Header */}
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-normal text-gray-900 dark:text-white leading-tight">
                        Adiar compromisso
                    </h2>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 flex items-center justify-center rounded-lg border border-app-border dark:border-app-border-dark bg-white dark:bg-transparent hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors shrink-0"
                    >
                        <X className="h-4 w-4 text-app-text-muted" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Appointment Summary Box */}
                    <div className="bg-app-bg-secondary dark:bg-app-table-header-dark border border-gray-100 dark:border-app-border-dark rounded-[12px] p-5">
                        <h4 className="font-normal text-gray-900 dark:text-white text-lg mb-2">
                            {appointment.title}
                        </h4>
                        <div className="flex items-center gap-4 text-app-text-muted dark:text-app-text-muted text-sm">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                <span>{displayDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                <span>{appointment.time}</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-[#0039A6] dark:text-[#4da885] font-normal">
                        Selecione a nova data e horário:
                    </p>

                    {/* Form Controls */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-normal text-gray-700 dark:text-white/80 flex items-center gap-2">
                                Nova data *
                            </Label>
                            <div className="relative">
                                <Input type="date" hideDateIcon
                                    className="h-12 rounded-[12px] border-app-border dark:border-app-border-dark bg-white dark:bg-transparent px-4 focus-visible:ring-[#0039A6]"
                                />
                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-normal text-gray-700 dark:text-white/80 flex items-center gap-2">
                                Novo horário *
                            </Label>
                            <div className="relative">
                                <Input
                                    type="time"
                                    className="h-12 rounded-[12px] border-app-border dark:border-app-border-dark bg-white dark:bg-transparent px-4 focus-visible:ring-[#0039A6]"
                                />
                                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Warning Box */}
                    <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-[12px] p-4 flex gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800 dark:text-amber-400 leading-relaxed">
                            O compromisso será reagendado para a nova data e horário. Todas as outras informações serão mantidas.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="h-12 px-8 rounded-[10px] border-app-border text-gray-700 hover:bg-app-bg-secondary dark:border-app-border-dark dark:text-white/80 dark:hover:bg-white/5 font-normal"
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="h-12 px-8 rounded-[10px] bg-[#0039A6] hover:bg-[#1d3b2e] text-white font-normal shadow-lg shadow-[#0039A6]/20 transition-all hover:scale-[1.02]"
                            onClick={() => {
                                // Lógica de adiamento aqui
                                onClose();
                            }}
                        >
                            Adiar compromisso
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

