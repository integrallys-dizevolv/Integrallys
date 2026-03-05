import { Button } from '@/components/ui/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/Dialog'
import { FileText, Download } from 'lucide-react'
import type { PatientPaymentInvoice } from '@/types'

interface BoletoModalProps {
    isOpen: boolean
    onClose: () => void
    paymentData: PatientPaymentInvoice | null
}

export function BoletoModal({ isOpen, onClose, paymentData }: BoletoModalProps) {
    if (!paymentData) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[480px] w-[90vw] p-4 sm:p-4 rounded-[20px] sm:rounded-[24px] bg-white dark:bg-[#0c1e3d] gap-0 border-none shadow-xl outline-none overflow-hidden">
                <DialogHeader className="mb-1 text-left space-y-0.5">
                    <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        Gerar Boleto
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Boleto para pagamento da consulta
                    </DialogDescription>
                </DialogHeader>

                {/* Central Box */}
                <div className="my-4 sm:my-6 rounded-[20px] border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-black/20 p-5 sm:p-8 flex flex-col items-center text-center">
                    <div className="mb-3 sm:mb-4 text-slate-400 dark:text-slate-500">
                        <FileText strokeWidth={1.5} className="h-12 w-12 sm:h-16 sm:w-16" />
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                        Boleto Bancário
                    </h3>

                    <p className="text-xs sm:text-base text-slate-500 dark:text-slate-400 mb-4 sm:mb-6 leading-tight max-w-[90%]">
                        {paymentData.descricao} - {paymentData.doutor || 'Dr. Especialista'}
                    </p>

                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8">
                        {paymentData.valor}
                    </div>

                    <Button
                        className="bg-[#0039A6] hover:bg-[#1d3b2e] text-white rounded-[10px] h-10 sm:h-11 px-6 flex items-center justify-center gap-2 w-full sm:w-auto font-medium transition-colors"
                        onClick={() => undefined}
                    >
                        <Download className="h-4 w-4" />
                        <span className="whitespace-nowrap">Baixar Boleto PDF</span>
                    </Button>
                </div>

                {/* Footer Info */}
                <div className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-sm leading-relaxed text-left">
                    O boleto será gerado com vencimento de 3 dias úteis. Após o pagamento, a confirmação será processada em até 2 dias úteis.
                </div>
            </DialogContent>
        </Dialog>
    )
}
