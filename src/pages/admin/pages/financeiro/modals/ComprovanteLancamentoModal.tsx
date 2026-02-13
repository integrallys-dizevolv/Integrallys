import React from 'react'
import { FileText, Download, X, Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

interface ComprovanteLancamentoModalProps {
    isOpen: boolean
    onClose: () => void
    transaction: any
}

export function ComprovanteLancamentoModal({ isOpen, onClose, transaction }: ComprovanteLancamentoModalProps) {
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
                            <div className="h-10 w-10 rounded-2xl bg-[#0039A6]/10 flex items-center justify-center shrink-0">
                                <FileText className="h-5 w-5 text-[#0039A6]" />
                            </div>
                            <div className="space-y-0.5">
                                <DialogTitle className="text-xl font-normal text-app-text-primary dark:text-white tracking-tight">Comprovante</DialogTitle>
                                <DialogDescription className="text-sm font-normal text-[#64748B] dark:text-app-text-muted">
                                    Documento do lançamento
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="px-6 pb-6 space-y-4">
                        <div className="aspect-[16/9] bg-app-bg-secondary dark:bg-app-card/5 rounded-2xl border border-dashed border-app-border dark:border-app-border-dark flex flex-col items-center justify-center p-4 text-center mt-2">
                            <div className="h-12 w-12 rounded-full bg-app-bg-secondary dark:bg-app-card/5 flex items-center justify-center mb-3">
                                <FileText className="h-6 w-6 text-app-text-muted" />
                            </div>
                            <p className="text-xs font-normal text-app-text-primary dark:text-white mb-0.5 truncate max-w-full px-4">comprovante_lancamento_{transaction.id}.pdf</p>
                            <p className="text-[10px] text-[#64748B] dark:text-app-text-muted uppercase tracking-widest font-normal">PDF • 1.2 MB</p>
                        </div>

                        <div className="p-4 bg-app-bg-secondary/50 dark:bg-app-card/[0.02] rounded-xl border border-gray-100 dark:border-app-border-dark space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-[#64748B] dark:text-app-text-muted font-normal">Descrição:</span>
                                <span className="text-app-text-primary dark:text-white font-normal">{transaction.descricao}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-[#64748B] dark:text-app-text-muted font-normal">Valor:</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-normal">R$ {(transaction.valor || transaction.valorTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="w-full sm:flex-1 h-11 rounded-xl font-normal text-[#64748B] dark:text-white/80 border-app-border dark:border-gray-800 hover:bg-app-bg-secondary dark:hover:bg-app-card/5 flex items-center justify-center gap-2 text-sm"
                            >
                                <Eye className="h-4 w-4" />
                                Visualizar
                            </Button>
                            <Button
                                className="w-full sm:flex-1 h-11 bg-[#0039A6] hover:bg-[#1d3b2e] text-white font-normal rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0039A6]/10 text-sm"
                            >
                                <Download className="h-4 w-4" />
                                Download
                            </Button>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
