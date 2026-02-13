import { useState, useEffect } from 'react'
import { X, Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import type { InventaryItem } from '@/mocks/recepcionista/estoque'
import { toast } from 'sonner'

interface EditarProdutoModalProps {
    isOpen: boolean
    onClose: (open: boolean) => void
    produto: InventaryItem | null
    onSave?: (produto: InventaryItem) => void
}

const CATEGORIAS = ['Medicamento', 'Consumível', 'EPI', 'Saneante', 'Equipamento']
const UNIDADES = ['unid', 'pacotes', 'caixas', 'litros', 'kg', 'ml']

export function EditarProdutoModal({ isOpen, onClose, produto, onSave }: EditarProdutoModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: 0,
        minQuantity: 0,
        unit: ''
    })

    useEffect(() => {
        if (produto) {
            setFormData({
                name: produto.name,
                category: produto.category,
                quantity: produto.quantity,
                minQuantity: produto.minQuantity,
                unit: produto.unit
            })
        }
    }, [produto])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!produto) return

        // Calcular status baseado na quantidade
        let status: 'available' | 'low' | 'critical' = 'available'
        if (formData.quantity <= formData.minQuantity / 2) {
            status = 'critical'
        } else if (formData.quantity <= formData.minQuantity) {
            status = 'low'
        }

        const updatedProduto: InventaryItem = {
            ...produto,
            ...formData,
            status
        }

        onSave?.(updatedProduto)
        toast.success('Produto atualizado com sucesso!')
        onClose(false)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onClose(false)} />

            <div className="relative bg-white dark:bg-[#0c1e3d] rounded-2xl shadow-xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#0039A6]/10 dark:bg-[#0039A6]/20 flex items-center justify-center">
                            <Package className="h-5 w-5 text-[#0039A6] dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Editar Produto</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Atualize as informações do produto</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onClose(false)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Produto</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nome do produto"
                            className="w-full"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</Label>
                            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                <SelectTrigger>
                                    <SelectValue preferPlaceholder placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIAS.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Unidade</Label>
                            <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                                <SelectTrigger>
                                    <SelectValue preferPlaceholder placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    {UNIDADES.map(unit => (
                                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantidade Atual</Label>
                            <Input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                min={0}
                                className="w-full"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantidade Mínima</Label>
                            <Input
                                type="number"
                                value={formData.minQuantity}
                                onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) || 0 })}
                                min={0}
                                className="w-full"
                                required
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onClose(false)}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-[#0039A6] hover:bg-[#002d82] text-white"
                        >
                            Salvar Alterações
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

