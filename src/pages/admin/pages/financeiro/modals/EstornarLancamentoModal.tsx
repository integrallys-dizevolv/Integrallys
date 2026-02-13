import React from 'react'
import { AlertTriangle, RotateCcw, X } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

interface EstornarLancamentoModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (id: number) => void
    transaction: any
}

export function EstornarLancamentoModal({ isOpen, onClose, onConfirm, transaction }: EstornarLancamentoModalProps) {
    if (!transaction) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent hideCloseButton={true} className="max-w-[500px] w-[95%] bg-app-card dark:bg-app-bg-dark p-0 overflow-hidden border-none rounded-[24px]">
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute right-4 top-4 text-app-text-muted hover:text-gray-600 dark:hover:text-gray-200 z-10"
                    >
                        <X size={20} />
                    </Button>

                    <DialogHeader className="p-6 pb-2">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="space-y-0.5">
                                <DialogTitle className="text-xl font-normal text-red-600 tracking-tight">Estornar</DialogTitle>
                                <DialogDescription className="text-sm font-normal text-[#64748B] dark:text-app-text-muted">
                                    Ação irreversível
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="px-6 pb-6 space-y-4">
                        <div className="space-y-3 mt-2">
                            <p className="text-sm text-[#334155] dark:text-white/80 leading-relaxed font-normal">
                                Deseja realmente estornar o lançamento "<span className="font-normal text-app-text-primary dark:text-white underline underline-offset-4 decoration-red-500/30">{transaction.descricao}</span>"?
                            </p>
                            <div className="p-4 bg-app-bg-secondary/50 dark:bg-app-card/[0.02] rounded-xl border border-gray-100 dark:border-app-border-dark space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-[#64748B] dark:text-app-text-muted font-normal">Valor:</span>
                                    <span className="font-normal text-red-600">R$ {(transaction.valor || transaction.valorTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-[#64748B] dark:text-app-text-muted font-normal">Data/Hora:</span>
                                    <span className="font-normal text-app-text-primary dark:text-white">{transaction.data || transaction.hora}</span>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="w-full sm:flex-1 h-11 rounded-xl font-normal text-[#64748B] dark:text-white/80 border-app-border dark:border-gray-800 hover:bg-app-bg-secondary dark:hover:bg-app-card/5 text-sm"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={() => {
                                    onConfirm(transaction.id)
                                    onClose()
                                }}
                                className="w-full sm:flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-normal rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 text-sm"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Confirmar
                            </Button>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
