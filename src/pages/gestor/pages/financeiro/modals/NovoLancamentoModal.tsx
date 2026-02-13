import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select'

interface NovoLancamentoModalProps {
    isOpen: boolean
    onClose: () => void
}

export const NovoLancamentoModal = ({ isOpen, onClose }: NovoLancamentoModalProps) => {
    const [natureza, setNatureza] = useState<'entrada' | 'saida'>('entrada')

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[600px] w-full gap-0 h-auto max-h-[90vh] flex flex-col p-0 rounded-[24px] overflow-hidden bg-app-card dark:bg-[#0c1e3d] border border-gray-100 dark:border-app-border-dark">
                <DialogHeader className="px-8 pt-8 pb-6 shrink-0">
                    <DialogTitle className="text-2xl font-semibold text-[#101828] dark:text-white tracking-tight">
                        Novo Lançamento
                    </DialogTitle>
                    <DialogDescription className="text-app-text-muted mt-2 text-sm">
                        Registre uma nova entrada ou saída financeira com suporte a pagamento parcial.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-8 py-2 pb-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                    {/* Natureza Toggle */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-[#101828] dark:text-white">Natureza</Label>
                        <div className="flex p-1 bg-app-bg-secondary dark:bg-black/20 rounded-lg">
                            <button
                                onClick={() => setNatureza('entrada')}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${natureza === 'entrada'
                                    ? 'bg-[#0039A6] text-white shadow-sm'
                                    : 'text-app-text-muted hover:text-gray-900 dark:text-app-text-muted dark:hover:text-white'
                                    }`}
                            >
                                Entrada
                            </button>
                            <button
                                onClick={() => setNatureza('saida')}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${natureza === 'saida'
                                    ? 'bg-[#B42318] text-white shadow-sm'
                                    : 'text-app-text-muted hover:text-gray-900 dark:text-app-text-muted dark:hover:text-white'
                                    }`}
                            >
                                Saída
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#101828] dark:text-white">Unidade *</Label>
                            <Select>
                                <SelectTrigger className="h-11 rounded-xl border-app-border bg-[#F9FAFB] dark:bg-app-card/5 dark:border-app-border-dark text-app-text-muted text-sm">
                                    <SelectValue preferPlaceholder placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="central">Clínica Central</SelectItem>
                                    <SelectItem value="norte">Unidade Norte</SelectItem>
                                    <SelectItem value="sul">Consultório Sul</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#101828] dark:text-white">Categoria *</Label>
                            <Select>
                                <SelectTrigger className="h-11 rounded-xl border-app-border bg-[#F9FAFB] dark:bg-app-card/5 dark:border-app-border-dark text-app-text-muted text-sm">
                                    <SelectValue preferPlaceholder placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="consultas">Consultas</SelectItem>
                                    <SelectItem value="procedimentos">Procedimentos</SelectItem>
                                    <SelectItem value="produtos">Prescrição/Venda de Produtos</SelectItem>
                                    <SelectItem value="fornecedores">Fornecedores</SelectItem>
                                    <SelectItem value="impostos">Impostos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-[#101828] dark:text-white">Descrição *</Label>
                        <Input
                            placeholder="Descreva o lançamento"
                            className="h-11 rounded-xl border-app-border bg-[#F9FAFB] dark:bg-app-card/5 dark:border-app-border-dark text-sm placeholder:text-app-text-muted"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#101828] dark:text-white">Valor Total *</Label>
                            <Input
                                placeholder="R$ 0,00"
                                className="h-11 rounded-xl border-app-border bg-[#F9FAFB] dark:bg-app-card/5 dark:border-app-border-dark text-sm placeholder:text-app-text-muted font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#101828] dark:text-white">Valor Pago Agora</Label>
                            <Input
                                placeholder="R$ 0,00"
                                className="h-11 rounded-xl border-app-border bg-[#F9FAFB] dark:bg-app-card/5 dark:border-app-border-dark text-sm placeholder:text-app-text-muted font-medium"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#101828] dark:text-white">Saldo</Label>
                            <Input
                                placeholder="R$ 0,00"
                                readOnly
                                className="h-11 rounded-xl border-app-border bg-app-bg-secondary/50 dark:bg-app-card/5 dark:border-app-border-dark text-sm placeholder:text-app-text-muted text-app-text-muted cursor-not-allowed"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#101828] dark:text-white">Método de Pagamento</Label>
                            <Select>
                                <SelectTrigger className="h-11 rounded-xl border-app-border bg-[#F9FAFB] dark:bg-app-card/5 dark:border-app-border-dark text-app-text-muted text-sm">
                                    <SelectValue preferPlaceholder placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                    <SelectItem value="pix">PIX</SelectItem>
                                    <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                                    <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                                    <SelectItem value="boleto">Boleto</SelectItem>
                                    <SelectItem value="transferencia">Transferência</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-app-border-dark flex items-center justify-end gap-3 sm:gap-0 bg-app-bg-secondary/50 dark:bg-app-card/5 -mx-8 px-8 py-6 -mb-8">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="h-11 px-6 rounded-[10px] border-app-border text-gray-700 hover:bg-app-card dark:border-app-border-dark dark:text-white/80 dark:hover:bg-app-card/5 bg-app-card dark:bg-transparent shadow-sm mr-3"
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="h-11 px-8 rounded-[10px] bg-[#0039A6] hover:bg-[#002a75] text-white shadow-md font-medium"
                        >
                            Salvar Lançamento
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

