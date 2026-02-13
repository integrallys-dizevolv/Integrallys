import React, { useState } from 'react'
import { Lock, Unlock, Banknote } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'

interface FecharCaixaModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (valorTransferido: number) => void
    saldoAtual: number
    saldoInicial: number
}

export function FecharCaixaModal({ isOpen, onClose, onConfirm, saldoAtual, saldoInicial }: FecharCaixaModalProps) {
    const valorSugerido = Math.max(0, saldoAtual - saldoInicial)
    const [valorTransferido, setValorTransferido] = useState(valorSugerido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    const [isValid, setIsValid] = useState(true)

    const calcularDiferenca = () => {
        const valor = parseFloat(valorTransferido.replace(/\./g, '').replace(',', '.')) || 0
        setIsValid(valor >= 0 && valor <= saldoAtual)
    }

    // Update validation on change or mount
    React.useEffect(() => {
        const valor = parseFloat(valorTransferido.replace(/\./g, '').replace(',', '.')) || 0
        setIsValid(valor >= 0 && valor <= saldoAtual)
    }, [valorTransferido, saldoAtual])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        e.preventDefault()
        const numValor = parseFloat(valorTransferido.replace(/\./g, '').replace(',', '.')) || 0
        if (numValor >= 0 && numValor <= saldoAtual) {
            onConfirm(numValor)
            onClose()
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[500px] w-[95%] bg-app-card dark:bg-app-card-dark p-0 overflow-hidden border-none rounded-[24px]">
                <div className="p-6 md:p-8 space-y-6">
                    {/* Header Padrão Integrallys */}
                    <div className="space-y-1 pr-8">
                        <h2 className="text-xl md:text-2xl font-normal flex items-center gap-2 text-[#0039A6]">
                            <Lock className="h-5 w-5 md:h-6 md:w-6" />
                            Fechar caixa
                        </h2>
                        <p className="text-[#667085] dark:text-app-text-muted text-xs md:text-sm font-medium">
                            Transfira o saldo para o cofre e feche o caixa do dia
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-normal text-[#667085]">Saldo Inicial</Label>
                                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                    <span className="font-bold text-[#101828] dark:text-white">R$ {saldoInicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-normal text-[#667085]">Recebido no Dia</Label>
                                <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20">
                                    <span className="font-bold text-green-700 dark:text-green-400">+ R$ {(saldoAtual - saldoInicial).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                                <div className="bg-white dark:bg-[#0c1e3d] p-1 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm z-10">
                                    <Banknote size={16} className="text-[#0039A6]" />
                                </div>
                            </div>
                            <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-700 my-6"></div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm md:text-[15px] font-normal text-[#344054] dark:text-white/80">
                                Valor a transferir para o cofre (Sangria)
                            </Label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-normal text-[#0039A6]">R$</span>
                                <input
                                    type="text"
                                    value={valorTransferido}
                                    onChange={(e) => setValorTransferido(e.target.value)}
                                    onBlur={calcularDiferenca}
                                    className="w-full h-12 md:h-14 pl-12 pr-4 text-lg md:text-xl font-normal rounded-2xl bg-app-bg-secondary/50 dark:bg-app-card/5 border-2 border-gray-100 dark:border-gray-800 text-app-text-primary dark:text-white focus:border-[#0039A6] focus:outline-none transition-all shadow-sm group-hover:border-app-border dark:group-hover:border-gray-700"
                                    required
                                />
                            </div>
                            <p className="text-[#667085] dark:text-app-text-muted text-[12px] md:text-[13px] font-medium leading-relaxed">
                                Sugerimos transferir o valor recebido no dia, mantendo o saldo inicial para troco.
                            </p>
                        </div>

                        <div className="p-4 bg-app-bg-secondary dark:bg-white/5 rounded-[20px] flex items-center justify-between">
                            <span className="text-sm text-[#344054] dark:text-gray-300">Saldo remanescente (Troco)</span>
                            <span className="text-lg font-bold text-[#101828] dark:text-white">
                                R$ {Math.max(0, saldoAtual - (parseFloat(valorTransferido.replace(/\./g, '').replace(',', '.')) || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="w-full sm:flex-1 h-11 md:h-12 rounded-[12px] font-normal text-[#667085] dark:text-white/80 border-app-border dark:border-gray-800 hover:bg-app-bg-secondary dark:hover:bg-app-card/5 transition-all"
                            >
                                <Unlock className="h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={!isValid}
                                className={`w-full sm:flex-1 h-11 md:h-12 bg-[#0039A6] hover:bg-[#002d82] text-white font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-lg shadow-[#0039A6]/10 transition-all active:scale-[0.98] ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Lock className="h-4 w-4" />
                                Fechar caixa e transferir
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}