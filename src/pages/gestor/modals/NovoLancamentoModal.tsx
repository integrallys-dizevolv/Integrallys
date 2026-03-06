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
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[500px] w-full gap-0 h-auto max-h-[90vh] flex flex-col p-0 rounded-[24px] overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                    <DialogTitle className="text-xl font-normal text-[#101828] dark:text-white">
                        Novo lançamento
                    </DialogTitle>
                    <DialogDescription className="text-app-text-muted mt-1.5 font-normal">
                        Preencha os detalhes do lançamento financeiro abaixo.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-2 pb-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-normal text-[#101828] dark:text-white">Tipo *</Label>
                            <Select defaultValue="entrada">
                                <SelectTrigger className="h-11 rounded-lg border-app-border bg-[#F9FAFB] dark:bg-[#0c1e3d] dark:border-app-border-dark text-app-text-muted text-sm font-normal">
                                    <SelectValue preferPlaceholder placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="entrada">Entrada</SelectItem>
                                    <SelectItem value="saida">Saída</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm font-normal text-[#101828] dark:text-white">Categoria *</Label>
                            <Select>
                                <SelectTrigger className="h-11 rounded-lg border-app-border bg-[#F9FAFB] dark:bg-[#0c1e3d] dark:border-app-border-dark text-app-text-muted text-sm font-normal">
                                    <SelectValue preferPlaceholder placeholder="Selecione a categoria" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="consultas">Consultas</SelectItem>
                                    <SelectItem value="procedimentos">Procedimentos</SelectItem>
                                    <SelectItem value="aluguel">Aluguel</SelectItem>
                                    <SelectItem value="salarios">Salários</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-normal text-[#101828] dark:text-white">Descrição * (mín. 5 caracteres)</Label>
                        <Input
                            placeholder="Ex: Pagamento de aluguel da clínica"
                            className="h-11 rounded-lg border-app-border bg-app-card dark:bg-[#0c1e3d] dark:border-app-border-dark text-sm placeholder:text-app-text-muted font-normal"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-normal text-[#101828] dark:text-white">Valor (R$) *</Label>
                            <Input
                                type="text"
                                placeholder="0,00"
                                className="h-11 rounded-lg border-app-border bg-app-card dark:bg-[#0c1e3d] dark:border-app-border-dark text-sm placeholder:text-app-text-muted font-normal"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm font-normal text-[#101828] dark:text-white">Data de baixa *</Label>
                            <Input
                                type="date"
                                className="h-11 rounded-lg border-app-border bg-app-card dark:bg-[#0c1e3d] dark:border-app-border-dark text-sm font-normal"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-6 pt-4 shrink-0 gap-3 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="h-11 px-6 rounded-lg border-app-border text-gray-700 hover:bg-app-bg-secondary dark:border-app-border-dark dark:text-white/80 dark:hover:bg-app-card/5 font-normal"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="h-11 px-8 rounded-lg bg-[#0039A6] hover:bg-[#002d82] text-white shadow-sm font-normal"
                    >
                        Salvar lançamento
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

