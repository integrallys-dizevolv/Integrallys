import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { AlertTriangle } from "lucide-react"

interface ExcluirPrescricaoModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

export function ExcluirPrescricaoModal({ isOpen, onClose, onConfirm }: ExcluirPrescricaoModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                hideCloseButton={true}
                className="sm:max-w-[480px] p-0 rounded-[20px] overflow-hidden border-none shadow-2xl"
            >
                <div className="bg-white dark:bg-app-card-dark p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                            <AlertTriangle className="h-6 w-6 text-[#DC2626]" />
                        </div>
                        <DialogTitle className="text-[22px] font-normal text-gray-900 dark:text-white tracking-tight">
                            Excluir prescrição
                        </DialogTitle>
                    </div>

                    <p className="text-[#6B7280] dark:text-app-text-muted text-[16px] mb-8 leading-relaxed pl-[64px]">
                        Tem certeza que deseja excluir esta prescrição?
                    </p>

                    <div className="flex items-center justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="h-10 px-6 rounded-lg border-app-border dark:border-gray-800 text-gray-700 dark:text-white/80 font-normal hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-all text-[15px]"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="h-10 px-8 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white font-normal shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02] text-[15px]"
                        >
                            Excluir
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
