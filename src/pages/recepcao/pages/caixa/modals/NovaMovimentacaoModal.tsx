import React, { useState } from 'react'
import { Plus, Banknote, CreditCard, Smartphone } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'

interface NovaMovimentacaoModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (transaction: { description: string, value: number, method: 'cash' | 'credit' | 'debit' | 'pix', type: 'income' | 'expense' }) => void
}

export function NovaMovimentacaoModal({ isOpen, onClose, onConfirm }: NovaMovimentacaoModalProps) {
    const [description, setDescription] = useState('')
    const [value, setValue] = useState('')
    const [method, setMethod] = useState<'cash' | 'credit' | 'debit' | 'pix'>('cash')
    const [type, setType] = useState<'income' | 'expense'>('income')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const numValue = parseFloat(value.replace('.', '').replace(',', '.')) || 0
        if (numValue > 0 && description) {
            onConfirm({
                description,
                value: numValue,
                method,
                type
            })
            onClose()
            // Reset form
            setDescription('')
            setValue('')
            setMethod('cash')
            setType('income')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[500px] w-[95%] bg-app-card dark:bg-app-card-dark p-0 overflow-hidden border-none rounded-[24px]">
                <div className="p-6 md:p-8 space-y-6">
                    <div className="space-y-1 pr-8">
                        <h2 className="text-xl md:text-2xl font-normal flex items-center gap-2 text-[#0039A6]">
                            <Plus className="h-5 w-5 md:h-6 md:w-6" />
                            Nova Movimentação
                        </h2>
                        <p className="text-[#667085] dark:text-app-text-muted text-xs md:text-sm font-medium">
                            Adicione uma transação manual para simulação
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-normal text-[#667085]">Descrição</Label>
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ex: Venda de produto, Pagamento particular..."
                                className="h-12 rounded-xl bg-app-bg-secondary/50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-normal text-[#667085]">Valor</Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-normal text-[#0039A6]">R$</span>
                                    <Input
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        placeholder="0,00"
                                        className="h-12 pl-10 rounded-xl bg-app-bg-secondary/50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-normal text-[#667085]">Tipo</Label>
                                <Select value={type} onValueChange={(v) => setType(v as 'income' | 'expense')}>
                                    <SelectTrigger className="h-12 rounded-xl bg-app-bg-secondary/50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="income">Entrada (+)</SelectItem>
                                        <SelectItem value="expense">Saída (-)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-normal text-[#667085]">Forma de Pagamento</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <div
                                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 transition-all ${method === 'cash' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-green-200'}`}
                                    onClick={() => setMethod('cash')}
                                >
                                    <Banknote size={18} />
                                    <span className="text-sm font-medium">Dinheiro</span>
                                </div>
                                <div
                                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 transition-all ${method === 'pix' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-blue-200'}`}
                                    onClick={() => setMethod('pix')}
                                >
                                    <Smartphone size={18} />
                                    <span className="text-sm font-medium">PIX</span>
                                </div>
                                <div
                                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 transition-all ${method === 'debit' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-purple-200'}`}
                                    onClick={() => setMethod('debit')}
                                >
                                    <CreditCard size={18} />
                                    <span className="text-sm font-medium">Débito</span>
                                </div>
                                <div
                                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 transition-all ${method === 'credit' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-orange-200'}`}
                                    onClick={() => setMethod('credit')}
                                >
                                    <CreditCard size={18} />
                                    <span className="text-sm font-medium">Crédito</span>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-2 flex gap-3">
                            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12 rounded-xl">Cancelar</Button>
                            <Button type="submit" className="flex-1 h-12 rounded-xl bg-[#0039A6] hover:bg-[#002d82] text-white">Adicionar</Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
