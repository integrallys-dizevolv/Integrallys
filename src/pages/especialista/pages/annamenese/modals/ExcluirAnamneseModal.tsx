import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { AlertTriangle } from "lucide-react"

interface ExcluirAnamneseModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    pacienteNome?: string
}

export function ExcluirAnamneseModal({ isOpen, onClose, onConfirm, pacienteNome }: ExcluirAnamneseModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                hideCloseButton={true}
                className="sm:max-w-[500px] p-0 rounded-[24px] overflow-hidden border-none shadow-2xl"
            >
                <div className="bg-white dark:bg-app-card-dark p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-normal text-gray-900 dark:text-white">
                                Excluir anamnese
                            </DialogTitle>
                        </DialogHeader>
                    </div>

                    <p className="text-app-text-muted dark:text-app-text-muted text-base mb-8 leading-relaxed">
                        Tem certeza que deseja excluir a anamnese de <span className="font-normal text-gray-900 dark:text-white">{pacienteNome}</span>? Esta ação não poderá ser desfeita.
                    </p>

                    <div className="flex items-center justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="h-11 px-6 rounded-xl border-app-border dark:border-gray-800 text-gray-600 dark:text-app-text-muted font-normal hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-all"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="h-11 px-8 rounded-xl bg-red-600 hover:bg-red-700 text-white font-normal shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02]"
                        >
                            Excluir
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
