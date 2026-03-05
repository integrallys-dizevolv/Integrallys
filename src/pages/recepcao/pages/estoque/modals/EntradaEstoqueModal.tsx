import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import type { InventaryItem } from '@/mocks/estoque.mock'

export interface EntradaEstoqueData {
    nf: string
    fornecedor: string
    data: string
    produto: string
    quantidade: number
    precoCusto: number
    lote: string
    validade: string
}

interface EntradaEstoqueModalProps {
    isOpen: boolean
    onClose: (open: boolean) => void
    items: InventaryItem[]
    onConfirm: (data: EntradaEstoqueData, options?: { atualizarCustoExistente?: boolean }) => void
}

const initialState: EntradaEstoqueData = {
    nf: '',
    fornecedor: '',
    data: new Date().toISOString().split('T')[0],
    produto: '',
    quantidade: 0,
    precoCusto: 0,
    lote: '',
    validade: '',
}

const pickXmlTag = (xml: string, tag: string) => {
    const match = xml.match(new RegExp(`<${tag}>(.*?)</${tag}>`, 'i'))
    return match?.[1]?.trim() || ''
}

export function EntradaEstoqueModal({ isOpen, onClose, onConfirm, items }: EntradaEstoqueModalProps) {
    const [form, setForm] = useState<EntradaEstoqueData>(initialState)

    const handleXmlImport = async (file?: File) => {
        if (!file) return

        try {
            const content = await file.text()
            const imported: EntradaEstoqueData = {
                nf: pickXmlTag(content, 'nNF') || form.nf,
                fornecedor: pickXmlTag(content, 'xNome') || form.fornecedor,
                data: form.data,
                produto: pickXmlTag(content, 'xProd') || form.produto,
                quantidade: Number(pickXmlTag(content, 'qCom')) || form.quantidade,
                precoCusto: Number(pickXmlTag(content, 'vUnCom')) || form.precoCusto,
                lote: pickXmlTag(content, 'nLote') || form.lote,
                validade: pickXmlTag(content, 'dVal') || form.validade,
            }
            setForm(imported)
            toast.success('XML importado. Você pode editar os dados antes de salvar.')
        } catch {
            toast.error('Não foi possível importar o XML da NF.')
        }
    }

    const submit = () => {
        if (!form.produto.trim() || !form.fornecedor.trim() || form.quantidade <= 0 || form.precoCusto <= 0) {
            toast.error('Preencha os campos obrigatórios da entrada.')
            return
        }
        let atualizarCustoExistente = false
        const existing = items.find((item) => item.name.trim().toLowerCase() === form.produto.trim().toLowerCase())
        if (existing && typeof existing.costPrice === 'number' && existing.costPrice > 0 && form.precoCusto > 0 && existing.costPrice !== form.precoCusto) {
            atualizarCustoExistente = window.confirm(
                `O custo atual de ${existing.name} é R$ ${existing.costPrice.toFixed(2)} e a NF trouxe R$ ${form.precoCusto.toFixed(2)}.\n\nClique em OK para atualizar o custo cadastrado, ou Cancelar para manter o valor atual.`,
            )
        }

        onConfirm(form, { atualizarCustoExistente })
        setForm(initialState)
        onClose(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[720px] rounded-[24px] overflow-hidden">
                <DialogHeader className="border-b border-app-border dark:border-app-border-dark">
                    <DialogTitle>Entrada de estoque</DialogTitle>
                    <DialogDescription>Registre entrada via NF e edite os dados antes de salvar.</DialogDescription>
                </DialogHeader>

                <div className="px-6 py-5 space-y-4">
                    <div className="flex items-center justify-between rounded-xl border border-dashed border-app-border dark:border-app-border-dark p-3">
                        <p className="text-xs text-app-text-muted">Importar XML da NF (com edição manual)</p>
                        <label className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-app-border dark:border-app-border-dark cursor-pointer text-xs font-normal hover:bg-app-bg-secondary dark:hover:bg-white/5">
                            <Upload className="h-4 w-4" />
                            Importar XML
                            <input
                                type="file"
                                accept=".xml,text/xml"
                                className="hidden"
                                onChange={(e) => handleXmlImport(e.target.files?.[0])}
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>NF</Label>
                            <Input value={form.nf} onChange={(e) => setForm({ ...form, nf: e.target.value })} placeholder="Número da NF" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Fornecedor *</Label>
                            <Input value={form.fornecedor} onChange={(e) => setForm({ ...form, fornecedor: e.target.value })} placeholder="Fornecedor" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Data *</Label>
                            <Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Produto *</Label>
                            <Input value={form.produto} onChange={(e) => setForm({ ...form, produto: e.target.value })} placeholder="Produto" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Quantidade *</Label>
                            <Input type="number" min={1} value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) || 0 })} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Preço de custo *</Label>
                            <Input type="number" min={0} step="0.01" value={form.precoCusto} onChange={(e) => setForm({ ...form, precoCusto: Number(e.target.value) || 0 })} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Lote</Label>
                            <Input value={form.lote} onChange={(e) => setForm({ ...form, lote: e.target.value })} placeholder="Lote" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Validade</Label>
                            <Input type="date" value={form.validade} onChange={(e) => setForm({ ...form, validade: e.target.value })} />
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t border-app-border dark:border-app-border-dark pt-4">
                    <Button variant="outline" onClick={() => onClose(false)}>Cancelar</Button>
                    <Button className="bg-[#0039A6] hover:bg-[#002d82] text-white" onClick={submit}>Salvar entrada</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
