import { useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import type { InventaryItem } from '@/mocks/recepcionista/estoque'
import { toast } from 'sonner'

export interface SaidaEstoqueData {
    produtoId: string
    quantidade: number
    justificativa: string
}

interface SaidaEstoqueModalProps {
    isOpen: boolean
    onClose: (open: boolean) => void
    items: InventaryItem[]
    onConfirm: (data: SaidaEstoqueData) => void
}

export function SaidaEstoqueModal({ isOpen, onClose, items, onConfirm }: SaidaEstoqueModalProps) {
    const [form, setForm] = useState<SaidaEstoqueData>({
        produtoId: '',
        quantidade: 0,
        justificativa: '',
    })

    const selectedItem = useMemo(
        () => items.find((item) => item.id === form.produtoId) || null,
        [items, form.produtoId],
    )

    const submit = () => {
        if (!form.produtoId || form.quantidade <= 0 || !form.justificativa.trim()) {
            toast.error('Preencha produto, quantidade e justificativa.')
            return
        }

        if (!selectedItem || form.quantidade > selectedItem.quantity) {
            toast.error('Quantidade de saída maior que o estoque disponível.')
            return
        }

        onConfirm(form)
        setForm({ produtoId: '', quantidade: 0, justificativa: '' })
        onClose(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[620px] rounded-[24px] overflow-hidden">
                <DialogHeader className="border-b border-app-border dark:border-app-border-dark">
                    <DialogTitle>Saída de estoque</DialogTitle>
                    <DialogDescription>Registre baixa de item que não seja venda.</DialogDescription>
                </DialogHeader>

                <div className="px-6 py-5 space-y-4">
                    <div className="space-y-1.5">
                        <Label>Produto *</Label>
                        <Select value={form.produtoId} onValueChange={(value) => setForm({ ...form, produtoId: value })}>
                            <SelectTrigger>
                                <SelectValue preferPlaceholder placeholder="Selecione o produto" />
                            </SelectTrigger>
                            <SelectContent>
                                {items.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedItem && (
                            <p className="text-xs text-app-text-muted">Disponível: {selectedItem.quantity} {selectedItem.unit}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label>Quantidade *</Label>
                        <Input
                            type="number"
                            min={1}
                            value={form.quantidade}
                            onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) || 0 })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Justificativa *</Label>
                        <Textarea
                            value={form.justificativa}
                            onChange={(e) => setForm({ ...form, justificativa: e.target.value })}
                            placeholder="Descreva o motivo da baixa de estoque"
                            className="min-h-[96px]"
                        />
                    </div>
                </div>

                <DialogFooter className="border-t border-app-border dark:border-app-border-dark pt-4">
                    <Button variant="outline" onClick={() => onClose(false)}>Cancelar</Button>
                    <Button className="bg-[#E53E3E] hover:bg-[#C53030] text-white" onClick={submit}>Salvar saída</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
