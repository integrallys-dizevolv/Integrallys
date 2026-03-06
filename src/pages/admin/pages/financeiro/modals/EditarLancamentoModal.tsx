import React, { useState, useEffect } from 'react'
import { Edit, X, Save } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import type { FinanceiroTransaction } from '@/types/financeiro'

interface EditarLancamentoModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (transaction: FinanceiroTransaction) => void
    transaction: FinanceiroTransaction | null
}

export function EditarLancamentoModal({ isOpen, onClose, onSave, transaction }: EditarLancamentoModalProps) {
    const [formData, setFormData] = useState<FinanceiroTransaction | null>(null)

    useEffect(() => {
        if (transaction) {
            setFormData({ ...transaction })
        }
    }, [transaction])

    if (!formData) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData) return
        onSave(formData)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent hideCloseButton={true} className="max-w-[500px] w-[95%] bg-app-card dark:bg-app-bg-dark p-0 overflow-hidden border-none rounded-[24px]">
                <form onSubmit={handleSubmit} className="relative">
                    <Button
                        type="button"
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
                                <Edit className="h-5 w-5 text-[#0039A6]" />
                            </div>
                            <div className="space-y-0.5">
                                <DialogTitle className="text-xl font-normal text-app-text-primary dark:text-white tracking-tight">Editar</DialogTitle>
                                <DialogDescription className="text-sm font-normal text-[#64748B] dark:text-app-text-muted">
                                    Ajuste as informações do registro
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="px-6 pb-6 space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted uppercase tracking-wide">Tipo</Label>
                                <Select
                                    value={formData.tipo?.toLowerCase()}
                                    onValueChange={(v) => setFormData({ ...formData, tipo: v.charAt(0).toUpperCase() + v.slice(1) })}
                                >
                                    <SelectTrigger className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl text-sm font-normal">
                                        <SelectValue>
                                            {formData.tipo ? (formData.tipo.charAt(0).toUpperCase() + formData.tipo.slice(1)) : 'Selecione'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="entrada" className="font-normal text-sm">Entrada</SelectItem>
                                        <SelectItem value="saída" className="font-normal text-sm">Saída</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted uppercase tracking-wide">Valor</Label>
                                <Input
                                    type="text"
                                    value={formData.valorTotal}
                                    onChange={(e) => setFormData({ ...formData, valorTotal: parseFloat(e.target.value) || 0 })}
                                    className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted uppercase tracking-wide">Descrição</Label>
                            <Input
                                value={formData.descricao}
                                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted uppercase tracking-wide">Forma de pagamento</Label>
                                <Select
                                    value={formData.forma}
                                    onValueChange={(v) => setFormData({ ...formData, forma: v })}
                                >
                                    <SelectTrigger className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl text-sm font-normal">
                                        <SelectValue>
                                            {formData.forma ? (formData.forma.charAt(0).toUpperCase() + formData.forma.slice(1)) : 'Selecione'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Dinheiro" className="font-normal text-sm">Dinheiro</SelectItem>
                                        <SelectItem value="Pix" className="font-normal text-sm">Pix / transferência</SelectItem>
                                        <SelectItem value="Cartão" className="font-normal text-sm">Cartão de crédito/débito</SelectItem>
                                        <SelectItem value="Cartão Empresarial" className="font-normal text-sm">Cartão de crédito empresarial</SelectItem>
                                        <SelectItem value="Boleto" className="font-normal text-sm">Boleto bancário</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted uppercase tracking-wide">Unidade</Label>
                                <Select
                                    value={formData.unidade || 'Clínica Central'}
                                    onValueChange={(v) => setFormData({ ...formData, unidade: v })}
                                >
                                    <SelectTrigger className="h-11 bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl text-sm font-normal">
                                        <SelectValue>
                                            {formData.unidade || 'Clínica Central'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Clínica Central" className="font-normal text-sm">Clínica Central</SelectItem>
                                        <SelectItem value="Unidade Norte" className="font-normal text-sm">Unidade Norte</SelectItem>
                                        <SelectItem value="Unidade Sul" className="font-normal text-sm">Unidade Sul</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {formData.forma === 'Cartão Empresarial' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-xl border border-app-border dark:border-app-border-dark bg-app-bg-secondary/30 dark:bg-app-card/5">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted uppercase tracking-wide">Bandeira</Label>
                                    <Input
                                        value={formData.cartaoBandeira || ''}
                                        onChange={(e) => setFormData({ ...formData, cartaoBandeira: e.target.value })}
                                        placeholder="Ex: Visa Business"
                                        className="h-11 bg-app-card dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted uppercase tracking-wide">Final</Label>
                                    <Input
                                        value={formData.cartaoFinal || ''}
                                        onChange={(e) => setFormData({ ...formData, cartaoFinal: e.target.value })}
                                        placeholder="0000"
                                        className="h-11 bg-app-card dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted uppercase tracking-wide">Titular corporativo</Label>
                                    <Input
                                        value={formData.cartaoTitular || ''}
                                        onChange={(e) => setFormData({ ...formData, cartaoTitular: e.target.value })}
                                        placeholder="Razão social"
                                        className="h-11 bg-app-card dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted uppercase tracking-wide">Fechamento</Label>
                                    <Input
                                        value={formData.fechamentoFatura || ''}
                                        onChange={(e) => setFormData({ ...formData, fechamentoFatura: e.target.value })}
                                        placeholder="Dia 10"
                                        className="h-11 bg-app-card dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted uppercase tracking-wide">Vencimento</Label>
                                    <Input
                                        value={formData.vencimentoFatura || ''}
                                        onChange={(e) => setFormData({ ...formData, vencimentoFatura: e.target.value })}
                                        placeholder="Dia 20"
                                        className="h-11 bg-app-card dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark rounded-xl font-normal text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        <DialogFooter className="pt-4 gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="w-full sm:flex-1 h-11 rounded-xl font-normal text-[#64748B] dark:text-white/80 border-app-border dark:border-gray-800 hover:bg-app-bg-secondary dark:hover:bg-app-card/5 text-sm"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="w-full sm:flex-1 h-11 bg-[#0039A6] hover:bg-[#002d82] text-white font-normal rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0039A6]/10 text-sm"
                            >
                                <Save className="h-4 w-4" />
                                Salvar
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
