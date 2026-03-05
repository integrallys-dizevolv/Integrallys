import { Button } from '@/components/ui/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { CreditCard } from 'lucide-react'

interface EditarCartaoModalProps {
    isOpen: boolean
    onClose: () => void
    cardData?: {
        number?: string
        holder?: string
        expiry?: string
        cvv?: string
    }
}

export function EditarCartaoModal({ isOpen, onClose, cardData }: EditarCartaoModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-[95vw] sm:max-w-[480px] p-8 rounded-[24px] bg-white dark:bg-[#0c1e3d] border-none shadow-2xl gap-6">
                <DialogHeader className="text-left space-y-2">
                    <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Editar Cartão
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-number" className="text-slate-600 dark:text-slate-300">Número do Cartão</Label>
                        <div className="relative">
                            <Input
                                id="edit-number"
                                defaultValue={cardData?.number || ''}
                                placeholder="0000 0000 0000 0000"
                                className="h-11 rounded-[10px] pl-10 bg-slate-50 border-slate-200 dark:bg-[#0c1e3d] dark:border-slate-700 font-mono"
                            />
                            <CreditCard className="h-5 w-5 text-slate-400 absolute left-3 top-3" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-holder" className="text-slate-600 dark:text-slate-300">Nome do Titular</Label>
                        <Input
                            id="edit-holder"
                            defaultValue={cardData?.holder || ''}
                            placeholder="Como está no cartão"
                            className="h-11 rounded-[10px] bg-slate-50 border-slate-200 dark:bg-[#0c1e3d] dark:border-slate-700"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-expiry" className="text-slate-600 dark:text-slate-300">Validade</Label>
                            <Input
                                id="edit-expiry"
                                defaultValue={cardData?.expiry || ''}
                                placeholder="MM/AA"
                                className="h-11 rounded-[10px] bg-slate-50 border-slate-200 dark:bg-[#0c1e3d] dark:border-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-cvv" className="text-slate-600 dark:text-slate-300">CVV</Label>
                            <Input
                                id="edit-cvv"
                                defaultValue={cardData?.cvv}
                                placeholder="123"
                                className="h-11 rounded-[10px] bg-slate-50 border-slate-200 dark:bg-[#0c1e3d] dark:border-slate-700"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex flex-col-reverse gap-2 mt-2 sm:flex-row sm:justify-end sm:gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex flex-row items-center justify-center gap-2 whitespace-nowrap h-11 px-6 shrink-0 rounded-[10px] w-full sm:w-auto border-slate-200 dark:border-slate-700"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="flex flex-row items-center justify-center gap-2 whitespace-nowrap h-11 px-6 shrink-0 w-full sm:w-auto bg-[#0039A6] hover:bg-[#1d3b2e] text-white rounded-[10px]"
                        onClick={onClose}
                    >
                        Salvar Alterações
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
