import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ExcluirModeloModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documentName?: string;
}

export function ExcluirModeloModal({ open, onOpenChange, documentName }: ExcluirModeloModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-[32px] border-none bg-app-card dark:bg-[#0c1e3d] shadow-2xl">
                <div className="p-10 text-center space-y-6">
                    <div className="h-20 w-20 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto">
                        <AlertTriangle size={40} />
                    </div>

                    <div className="space-y-2">
                        <DialogTitle className="text-2xl font-medium text-[#101828] dark:text-white">
                            Excluir Modelo?
                        </DialogTitle>
                        <p className="text-sm text-app-text-muted dark:text-app-text-muted font-normal">
                            Você está prestes a excluir o modelo <span className="font-bold text-gray-900 dark:text-white">"{documentName}"</span>. Esta ação não poderá ser desfeita.
                        </p>
                    </div>
                </div>

                <DialogFooter className="px-6 py-6 sm:px-10 sm:py-8 bg-app-bg-secondary/50 dark:bg-app-card/5 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-12 w-full sm:w-auto px-8 rounded-xl border-app-border dark:border-app-border-dark text-app-text-muted dark:text-app-text-muted font-medium hover:bg-app-bg-secondary dark:hover:bg-app-card/5"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="h-12 w-full sm:w-auto px-8 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium flex gap-2 items-center justify-center"
                    >
                        <Trash2 size={18} /> Confirmar Exclusão
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
