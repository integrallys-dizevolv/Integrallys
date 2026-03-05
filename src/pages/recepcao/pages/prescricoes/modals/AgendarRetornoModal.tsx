import React from 'react'
import {
    Dialog,
    DialogContent,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

interface AgendarRetornoModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void // Navigate to Agenda
    onLater: () => void // Mark as pending return
    patientName?: string
}

export const AgendarRetornoModal = ({
    isOpen,
    onClose,
    onConfirm,
    onLater,
    patientName
}: AgendarRetornoModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-white dark:bg-[#0c1e3d] border-none rounded-[24px] shadow-2xl">
                <div className="p-8 flex flex-col items-center text-center space-y-6">

                    {/* Icon Header */}
                    <div className="h-20 w-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
                        <Calendar className="h-10 w-10 text-[#0039A6] dark:text-blue-400" strokeWidth={1.5} />
                    </div>

                    {/* Text Content */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-[#101828] dark:text-white">
                            Deseja agendar o retorno do paciente?
                        </h2>
                        <p className="text-[#667085] dark:text-gray-300 text-base leading-relaxed">
                            A Prescrição/Vendas foi concluída com sucesso.<br />
                            Paciente: <span className="font-bold text-[#101828] dark:text-white">{patientName}</span>
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="w-full bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-gray-800 text-left flex gap-3">
                        <div className="mt-0.5 min-w-[20px]">
                            <Clock className="h-5 w-5 text-[#667085] dark:text-gray-400" />
                        </div>
                        <p className="text-sm text-[#667085] dark:text-gray-400">
                            Se optar por <span className="font-semibold text-[#101828] dark:text-white">"Mais tarde"</span>, adicionaremos um lembrete de <strong>Retorno Pendente</strong> à lista.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 w-full pt-2">
                        <Button
                            variant="outline"
                            onClick={onLater}
                            className="flex-1 h-12 rounded-xl text-[#344054] dark:text-white border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 font-semibold"
                        >
                            Mais tarde
                        </Button>
                        <Button
                            onClick={onConfirm}
                            className="flex-1 h-12 rounded-xl bg-[#0039A6] hover:bg-[#002d82] text-white font-bold shadow-lg shadow-[#0039A6]/20 flex items-center justify-center gap-2"
                        >
                            Sim, agendar agora
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
