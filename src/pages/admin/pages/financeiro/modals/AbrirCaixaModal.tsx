import React, { useState } from 'react'
import { Wallet, AlertCircle, TrendingUp, Info, Unlock } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

interface AbrirCaixaModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (valor: number) => void
}

export function AbrirCaixaModal({ isOpen, onClose, onConfirm }: AbrirCaixaModalProps) {
    const [valor, setValor] = useState('250,00')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const numValor = parseFloat(valor.replace('.', '').replace(',', '.')) || 0
        onConfirm(numValor)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[450px] w-[95%] bg-app-card dark:bg-app-card-dark p-0 overflow-hidden border-none rounded-[24px]">
                <div className="p-6 md:p-8 space-y-6">
                    {/* Header Padrão Integrallys */}
                    <div className="space-y-1 pr-8">
                        <h2 className="text-xl md:text-2xl font-normal flex items-center gap-2 text-[#0039A6]">
                            <Wallet className="h-5 w-5 md:h-6 md:w-6" />
                            Abrir caixa
                        </h2>
                        <p className="text-[#667085] dark:text-app-text-muted text-xs md:text-sm font-medium">
                            Informe o saldo inicial para começar o dia
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-sm md:text-[15px] font-normal text-[#344054] dark:text-white/80">
                                Saldo inicial em dinheiro
                            </Label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-normal text-[#0039A6]">R$</span>
                                <input
                                    type="text"
                                    value={valor}
                                    onChange={(e) => setValor(e.target.value)}
                                    className="w-full h-12 md:h-14 pl-12 pr-4 text-lg md:text-xl font-normal rounded-2xl bg-app-bg-secondary/50 dark:bg-app-card/5 border-2 border-gray-100 dark:border-gray-800 text-app-text-primary dark:text-white focus:border-[#0039A6] focus:outline-none transition-all shadow-sm group-hover:border-app-border dark:group-hover:border-gray-700"
                                    required
                                />
                            </div>
                            <p className="text-[#667085] dark:text-app-text-muted text-[12px] md:text-[13px] font-medium leading-relaxed">
                                • Este valor deve corresponder ao dinheiro físico no caixa
                            </p>
                        </div>

                        <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="w-full sm:flex-1 h-11 md:h-12 rounded-[12px] font-normal text-[#667085] dark:text-white/80 border-app-border dark:border-gray-800 hover:bg-app-bg-secondary dark:hover:bg-app-card/5 transition-all"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="w-full sm:flex-1 h-11 md:h-12 bg-[#0039A6] hover:bg-[#002d82] text-white font-bold rounded-[12px] flex items-center justify-center gap-2 shadow-lg shadow-[#0039A6]/10 transition-all active:scale-[0.98]"
                            >
                                <Unlock className="h-4 w-4" />
                                Abrir caixa
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
