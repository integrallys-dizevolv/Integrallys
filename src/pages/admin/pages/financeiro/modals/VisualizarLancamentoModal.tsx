import React from 'react'
import { Eye, X, Clock, MapPin, Tag, CreditCard, User, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import type { FinanceiroDailyMovement, FinanceiroTransaction } from '@/types/financeiro'

type FinanceiroModalTransaction = FinanceiroTransaction | FinanceiroDailyMovement

interface VisualizarLancamentoModalProps {
    isOpen: boolean
    onClose: () => void
    transaction: FinanceiroModalTransaction | null
}

export function VisualizarLancamentoModal({ isOpen, onClose, transaction }: VisualizarLancamentoModalProps) {
    if (!transaction) return null

    const valor = 'valorTotal' in transaction ? transaction.valorTotal : transaction.valor
    const dataHora = 'data' in transaction ? transaction.data : transaction.hora
    const unidade = 'unidade' in transaction ? transaction.unidade : 'Clínica Central'
    const operador = 'operador' in transaction ? transaction.operador : 'Sistema'

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

                    <DialogHeader className="p-6 pb-0">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="h-10 w-10 rounded-2xl bg-app-bg-secondary dark:bg-app-card/5 flex items-center justify-center shrink-0">
                                <Eye className="h-5 w-5 text-gray-600 dark:text-app-text-muted" />
                            </div>
                            <div className="space-y-0.5">
                                <DialogTitle className="text-xl font-normal text-app-text-primary dark:text-white tracking-tight">Detalhes</DialogTitle>
                                <DialogDescription className="text-sm font-normal text-[#64748B] dark:text-app-text-muted">
                                    Informações da movimentação
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="px-6 pb-6 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            <div className="p-3 bg-app-bg-secondary/50 dark:bg-app-card/[0.02] rounded-xl border border-gray-100 dark:border-app-border-dark">
                                <p className="text-[10px] text-[#64748B] dark:text-app-text-muted mb-0.5 flex items-center gap-1.5 uppercase tracking-wider font-normal">
                                    <Tag className="h-3 w-3" /> Descrição
                                </p>
                                <p className="text-sm font-normal text-app-text-primary dark:text-white truncate">{transaction.descricao}</p>
                            </div>

                            <div className="p-3 bg-app-bg-secondary/50 dark:bg-app-card/[0.02] rounded-xl border border-gray-100 dark:border-app-border-dark">
                                <p className="text-[10px] text-[#64748B] dark:text-app-text-muted mb-0.5 flex items-center gap-1.5 uppercase tracking-wider font-normal">
                                    <CreditCard className="h-3 w-3" /> Valor total
                                </p>
                                <p className={`text-lg font-normal ${transaction.tipo === 'Entrada' ? 'text-green-600' : 'text-red-500'}`}>
                                    R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>

                            <div className="p-3 bg-app-bg-secondary/50 dark:bg-app-card/[0.02] rounded-xl border border-gray-100 dark:border-app-border-dark">
                                <p className="text-[10px] text-[#64748B] dark:text-app-text-muted mb-0.5 flex items-center gap-1.5 uppercase tracking-wider font-normal">
                                    <Clock className="h-3 w-3" /> Data e hora
                                </p>
                                <p className="text-sm font-normal text-app-text-primary dark:text-white">{dataHora}</p>
                            </div>

                            <div className="p-3 bg-app-bg-secondary/50 dark:bg-app-card/[0.02] rounded-xl border border-gray-100 dark:border-app-border-dark">
                                <p className="text-[10px] text-[#64748B] dark:text-app-text-muted mb-0.5 flex items-center gap-1.5 uppercase tracking-wider font-normal">
                                    <MapPin className="h-3 w-3" /> Unidade
                                </p>
                                <p className="text-sm font-normal text-app-text-primary dark:text-white">{unidade}</p>
                            </div>

                            <div className="p-3 bg-app-bg-secondary/50 dark:bg-app-card/[0.02] rounded-xl border border-gray-100 dark:border-app-border-dark">
                                <p className="text-[10px] text-[#64748B] dark:text-app-text-muted mb-0.5 flex items-center gap-1.5 uppercase tracking-wider font-normal">
                                    <CreditCard className="h-3 w-3" /> Forma
                                </p>
                                <p className="text-sm font-normal text-app-text-primary dark:text-white">{transaction.forma}</p>
                            </div>

                            <div className="p-3 bg-app-bg-secondary/50 dark:bg-app-card/[0.02] rounded-xl border border-gray-100 dark:border-app-border-dark">
                                <p className="text-[10px] text-[#64748B] dark:text-app-text-muted mb-0.5 flex items-center gap-1.5 uppercase tracking-wider font-normal">
                                    <User className="h-3 w-3" /> Operador
                                </p>
                                <p className="text-sm font-normal text-app-text-primary dark:text-white">{operador}</p>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-dashed border-app-border dark:border-app-border-dark p-3 flex items-center gap-3 bg-app-bg-secondary/30 dark:bg-transparent">
                                <AlertCircle className="h-4 w-4 text-[#0039A6] shrink-0" />
                                <p className="text-[11px] text-[#64748B] dark:text-app-text-muted leading-relaxed italic font-normal">
                                    Registro gerado por {operador} em {dataHora}.
                                </p>
                            </div>

                        <DialogFooter className="pt-2">
                            <Button
                                onClick={onClose}
                                className="w-full h-11 bg-[#0039A6] hover:bg-[#002d82] text-white font-normal rounded-xl shadow-lg shadow-[#0039A6]/10"
                            >
                                Fechar
                            </Button>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
