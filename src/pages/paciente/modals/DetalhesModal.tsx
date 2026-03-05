import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/Dialog'
import { Badge } from '@/components/ui/Badge'
import type { PatientAppointment } from '@/types'

interface DetalhesModalProps {
    isOpen: boolean
    onClose: () => void
    consulta: PatientAppointment | null
}

export function DetalhesModal({ isOpen, onClose, consulta }: DetalhesModalProps) {
    if (!consulta) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[440px] w-[95vw] max-h-[85vh] p-0 rounded-[24px] border-none bg-white dark:bg-[#0c1e3d] shadow-2xl overflow-hidden flex flex-col transition-all duration-300">
                {/* Header - Ajustado para ser mais próximo do topo (pt-5) e textos próximos (space-y-0.5) */}
                <div className="px-2 pt-2 pb-2">
                    <DialogHeader className="text-left space-y-0.5">
                        <DialogTitle className="text-[18px] font-bold tracking-tight text-slate-900 dark:text-white">
                            Detalhes da Consulta
                        </DialogTitle>
                        <DialogDescription className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                            Visualize as informações completas da sua consulta
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Área de Conteúdo com Scroll Customizado e Leve */}
                <div className="px-8 pb-8 flex-1 overflow-y-auto 
        scrollbar-thin 
        scrollbar-thumb-slate-200 
        dark:scrollbar-thumb-slate-800 
        scrollbar-track-transparent 
        scrollbar-thumb-rounded-full
        hover:scrollbar-thumb-slate-300 
        transition-all">

                    {/* space-y-5 para aproximar um bloco do outro */}
                    <div className="flex flex-col space-y-5 mt-4">

                        {/* Item: Médico */}
                        <div className="flex flex-col space-y-0.5">
                            <span className="text-[13px] text-slate-600 font-bold tracking-wider">
                                Médico
                            </span>
                            <span className="text-[15px] text-slate-700 dark:text-slate-200">
                                {consulta.medico}
                            </span>
                        </div>

                        {/* Item: Especialidade */}
                        <div className="flex flex-col space-y-0.5">
                            <span className="text-[13px] text-slate-600 font-bold tracking-wider">
                                Especialidade
                            </span>
                            <span className="text-[15px] text-slate-700 dark:text-slate-200">
                                {consulta.especialidade}
                            </span>
                        </div>

                        {/* Item: Data e Hora */}
                        <div className="flex flex-col space-y-0.5">
                            <span className="text-[13px] text-slate-600 font-bold tracking-wider">
                                Data e Hora
                            </span>
                            <span className="text-[15px] text-slate-700 dark:text-slate-200">
                                {consulta.data}
                            </span>
                        </div>

                        {/* Item: Local */}
                        <div className="flex flex-col space-y-0.5">
                            <span className="text-[13px] text-slate-600 font-bold tracking-wider">
                                Local
                            </span>
                            <span className="text-[15px] text-slate-700 dark:text-slate-200">
                                {consulta.local}
                            </span>
                        </div>

                        {/* Item: Status */}
                        <div className="flex flex-col space-y-0.5">
                            <span className="text-[13px] text-slate-600 font-bold tracking-wider">
                                Status
                            </span>
                            <Badge
                                className={`
                            h-6 px-3 text-[12px] font-normal rounded-full border-none shadow-sm
                            ${consulta.status === 'Confirmada' || consulta.status === 'Concluído'
                                        ? 'bg-emerald-600 dark:bg-emerald-500 text-white'
                                        : consulta.status === 'Agendado'
                                            ? 'bg-blue-600 dark:bg-blue-500 text-white'
                                            : 'bg-red-600 dark:bg-red-500 text-white'
                                    }
                        `}
                            >
                                {consulta.status}
                            </Badge>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
