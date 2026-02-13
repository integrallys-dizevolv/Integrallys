import React from 'react'
import {
    Dialog,
    DialogContent,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { AlertTriangle } from "lucide-react"

interface ExcluirProntuarioModalProps {
    isOpen: boolean
    onClose: () => void
    pacienteNome?: string
}

export function ExcluirProntuarioModal({ isOpen, onClose, pacienteNome = "Maria Silva" }: ExcluirProntuarioModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                hideCloseButton={true}
                className="sm:max-w-[550px] p-0 rounded-[20px] overflow-hidden border-none shadow-2xl"
            >
                <div className="bg-white dark:bg-app-card-dark p-10">
                    {/* Header with Icon and Title */}
                    <div className="flex items-center gap-5 mb-6">
                        <div className="h-14 w-14 rounded-full bg-[#fef2f2] dark:bg-red-900/20 flex items-center justify-center shrink-0">
                            <AlertTriangle className="h-7 w-7 text-[#dc2626] dark:text-red-500" />
                        </div>
                        <h2 className="text-2xl font-normal text-gray-900 dark:text-white tracking-tight">
                            Excluir prontuário
                        </h2>
                    </div>

                    {/* Description */}
                    <p className="text-[#64748b] dark:text-app-text-muted text-lg leading-relaxed mb-10 font-normal">
                        Tem certeza que deseja excluir o prontuário de <span className="font-normal text-gray-900 dark:text-white">{pacienteNome}</span>? Esta ação não pode ser desfeita.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="h-12 px-8 rounded-[12px] border-app-border dark:border-gray-800 text-gray-700 dark:text-white font-normal text-base hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-all bg-white dark:bg-transparent"
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="h-12 px-10 rounded-[12px] bg-[#e11d48] hover:bg-[#be123c] text-white font-normal text-base shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02]"
                            onClick={() => {
                                // Lógica de exclusão aqui
                                onClose();
                            }}
                        >
                            Excluir
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
