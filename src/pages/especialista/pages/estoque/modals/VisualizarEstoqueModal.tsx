import { X } from 'lucide-react'
import {
    Dialog,
    DialogContent,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"

interface VisualizarEstoqueModalProps {
    isOpen: boolean
    onClose: () => void
    item: {
        nome: string
        categoria: string
        unidade: string
        aguaBoa: {
            qtd: number
            unidade: string
        }
        querencia: {
            qtd: number
            unidade: string
        }
        minimo: number
        valor: string
    } | null
}

export function VisualizarEstoqueModal({ isOpen, onClose, item }: VisualizarEstoqueModalProps) {
    if (!item) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                hideCloseButton={true}
                className="w-[95vw] sm:max-w-[600px] p-8 rounded-[24px] bg-white dark:bg-app-bg-dark border-none shadow-2xl block overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-normal text-gray-900 dark:text-white tracking-tight">
                            Detalhes do item
                        </h2>
                        <p className="text-[15px] text-app-text-muted dark:text-app-text-muted font-normal">
                            Visualização das informações de estoque
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors shrink-0"
                    >
                        <X className="h-5 w-5 text-app-text-muted" />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Nome do Produto */}
                    <div className="space-y-1.5">
                        <p className="text-[13px] font-normal text-app-text-muted tracking-wider">Nome do produto</p>
                        <p className="text-xl font-normal text-gray-900 dark:text-white">{item.nome}</p>
                    </div>

                    {/* Categoria e Unidade */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1.5">
                            <p className="text-[13px] font-normal text-app-text-muted tracking-wider">Categoria</p>
                            <p className="text-lg font-normal text-gray-900 dark:text-white">{item.categoria}</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-[13px] font-normal text-app-text-muted tracking-wider">Unidade</p>
                            <p className="text-lg font-normal text-gray-900 dark:text-white">{item.unidade}</p>
                        </div>
                    </div>

                    {/* Estoques por Unidade */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <p className="text-[13px] font-normal text-app-text-muted tracking-wider">Estoque água boa</p>
                            <p className="text-2xl font-normal text-gray-900 dark:text-white">{item.aguaBoa.qtd} {item.aguaBoa.unidade}</p>
                            <Badge className="bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white px-4 py-1.5 rounded-full text-xs font-normal border-0 transition-colors shadow-sm">
                                Disponível
                            </Badge>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[13px] font-normal text-app-text-muted tracking-wider">Estoque querência</p>
                            <p className="text-2xl font-normal text-gray-900 dark:text-white">{item.querencia.qtd} {item.querencia.unidade}</p>
                            <Badge className="bg-orange-600 dark:bg-amber-900/40 dark:text-amber-100 text-white px-4 py-1.5 rounded-full text-xs font-normal border-0 transition-colors shadow-sm">
                                Estoque baixo
                            </Badge>
                        </div>
                    </div>

                    {/* Mínimo e Valor */}
                    <div className="space-y-6 pt-2">
                        <div className="space-y-1.5">
                            <p className="text-[13px] font-normal text-app-text-muted tracking-wider">Estoque mínimo recomendado</p>
                            <p className="text-lg font-normal text-gray-900 dark:text-white">{item.minimo} {item.unidade}(s)</p>
                        </div>

                        <div className="space-y-1.5">
                            <p className="text-[13px] font-normal text-app-text-muted tracking-wider">Valor de referência</p>
                            <p className="text-lg font-normal text-gray-900 dark:text-white">R$ {item.valor}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end mt-12">
                    <Button
                        onClick={onClose}
                        className="bg-[#0039A6] hover:bg-[#1d3b2e] text-white px-10 h-12 rounded-[12px] font-normal shadow-lg shadow-[#0039A6]/20 transition-all hover:scale-[1.02]"
                    >
                        Fechar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
