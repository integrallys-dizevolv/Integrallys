import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/Dialog'
import { CreditCard, DollarSign, CheckCircle2, CheckCircle, Copy, QrCode } from 'lucide-react'
import type { PatientPaymentInvoice } from '@/types'

interface CheckoutModalProps {
    isOpen: boolean
    onClose: () => void
    paymentData: PatientPaymentInvoice | null
}

export function CheckoutModal({ isOpen, onClose, paymentData }: CheckoutModalProps) {
    const [method, setMethod] = useState<'credit' | 'pix' | null>(null)
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null)

    if (!paymentData) return null

    const savedCards = [
        { id: '1', number: '**** **** **** 1234', holder: 'João da Silva', brand: 'Visa' },
        { id: '2', number: '**** **** **** 5678', holder: 'João da Silva', brand: 'Mastercard' },
    ]

    const handleClose = () => {
        onClose()
        setTimeout(() => {
            setMethod(null)
            setSelectedCardId(null)
        }, 300)
    }

    const showConfirmButton = method === 'pix' || (method === 'credit' && !!selectedCardId)

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-[480px] w-[95vw] p-0 rounded-[24px] bg-white dark:bg-[#0c1e3d] border-none shadow-2xl outline-none gap-0 overflow-hidden">
                <div className="max-h-[85vh] w-full overflow-y-auto p-4 sm:p-6 
                    [&::-webkit-scrollbar]:w-1 
                    [&::-webkit-scrollbar-track]:bg-transparent 
                    [&::-webkit-scrollbar-thumb]:bg-slate-200 
                    [&::-webkit-scrollbar-thumb]:rounded-full 
                    dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">

                    <DialogHeader className="mb-4 text-left space-y-0.5">
                        <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                            Pagamento Online
                        </DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Realize o pagamento de forma rápida e segura
                        </DialogDescription>
                    </DialogHeader>

                    {/* Summary Card */}
                    <div className="bg-slate-50/50 dark:bg-black/20 rounded-[12px] p-4 mb-4 space-y-2 border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-slate-500">Serviço:</span>
                            <span className="text-slate-700 dark:text-slate-300 font-medium text-right line-clamp-1">{paymentData.descricao}</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-slate-500">Médico:</span>
                            <span className="text-slate-700 dark:text-slate-300 font-medium text-right">{paymentData.doutor || 'Dr. Especialista'}</span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base border-t border-slate-200 dark:border-slate-700 pt-2 mt-1">
                            <span className="text-slate-600 font-medium">Total:</span>
                            <span className="text-slate-900 dark:text-white font-bold">{paymentData.valor}</span>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-3 mb-4">
                        <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">Formas de Pagamento</h3>

                        <div className="grid gap-2 sm:gap-3">
                            {/* Option: Credit Card */}
                            <div
                                className={`
                                    relative rounded-[12px] border p-3 sm:p-4 cursor-pointer transition-all duration-200 flex items-center gap-3
                                    ${method === 'credit'
                                        ? 'bg-emerald-50/50 border-emerald-500 shadow-sm'
                                        : 'bg-white dark:bg-transparent border-slate-200 dark:border-slate-700 hover:border-emerald-200'}
                                `}
                                onClick={() => setMethod('credit')}
                            >
                                <CreditCard className={`h-4 w-4 sm:h-5 sm:w-5 ${method === 'credit' ? 'text-emerald-600' : 'text-slate-500'}`} />
                                <span className={`text-sm font-medium ${method === 'credit' ? 'text-emerald-900 dark:text-emerald-100' : 'text-slate-700 dark:text-slate-300'}`}>
                                    Cartão de Crédito
                                </span>
                            </div>

                            {/* Credit Card Expansion */}
                            {method === 'credit' && (
                                <div className="pl-4 border-l-2 border-slate-100 ml-4 space-y-2 animate-in slide-in-from-top-2 duration-300">
                                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">Selecione um cartão:</p>
                                    {savedCards.map(card => (
                                        <div
                                            key={card.id}
                                            className={`
                                                group relative p-3 rounded-[12px] border cursor-pointer flex items-center gap-3 transition-all
                                                ${selectedCardId === card.id
                                                    ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                                                    : 'bg-white dark:bg-black/20 border-slate-200 dark:border-slate-700 hover:border-slate-300'}
                                            `}
                                            onClick={() => setSelectedCardId(card.id)}
                                        >
                                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                                                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-mono text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{card.number}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <p className="text-[10px] sm:text-xs text-slate-500 truncate">{card.holder}</p>
                                                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">{card.brand}</span>
                                                </div>
                                            </div>
                                            {selectedCardId === card.id && (
                                                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 absolute top-3 right-3" />
                                            )}
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" className="w-full border-dashed text-slate-500 h-9 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50/50 text-xs">
                                        + Adicionar novo cartão
                                    </Button>
                                </div>
                            )}

                            {/* Option: PIX */}
                            <div
                                className={`
                                    relative rounded-[12px] border p-3 sm:p-4 cursor-pointer transition-all duration-200 flex items-center gap-3
                                    ${method === 'pix'
                                        ? 'bg-emerald-50/50 border-emerald-500 shadow-sm'
                                        : 'bg-white dark:bg-transparent border-slate-200 dark:border-slate-700 hover:border-emerald-200'}
                                `}
                                onClick={() => setMethod('pix')}
                            >
                                <DollarSign className={`h-4 w-4 sm:h-5 sm:w-5 ${method === 'pix' ? 'text-emerald-600' : 'text-slate-500'}`} />
                                <span className={`text-sm font-medium ${method === 'pix' ? 'text-emerald-900 dark:text-emerald-100' : 'text-slate-700 dark:text-slate-300'}`}>
                                    PIX (Instantâneo)
                                </span>
                            </div>

                            {/* PiX Expansion */}
                            {method === 'pix' && (
                                <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-[12px] border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-2 flex flex-col items-center text-center">
                                    <QrCode className="h-20 w-20 text-slate-800 dark:text-white mb-3" />
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3 max-w-[240px]">
                                        Escaneie o QR Code ou copie a chave abaixo para pagar
                                    </p>
                                    <Button variant="outline" size="sm" className="gap-2 w-full max-w-[240px] bg-white dark:bg-black/40 h-9 text-xs whitespace-nowrap flex items-center justify-center">
                                        <Copy className="h-3 w-3 shrink-0" />
                                        Copiar Chave PIX
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer - Only visible when ready to confirm */}
                    {showConfirmButton && (
                        <div className="mt-2 animate-in slide-in-from-bottom-2 fade-in duration-300">
                            <Button
                                className="w-full bg-[#0039A6] hover:bg-[#1d3b2e] text-white rounded-[10px] h-11 font-medium gap-2 flex items-center justify-center transition-all"
                                onClick={() => undefined}
                            >
                                {method === 'pix' ? <CheckCircle className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                                Confirmar Pagamento
                            </Button>
                            <p className="text-center text-[10px] text-slate-400 mt-2">
                                Este é um ambiente de demonstração. O pagamento será simulado.
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
