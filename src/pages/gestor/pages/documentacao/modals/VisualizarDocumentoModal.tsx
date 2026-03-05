import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { FileText, Download, Printer, X } from 'lucide-react';

interface VisualizarDocumentoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document: {
        nome: string;
        categoria: string;
        desc: string;
    } | null;
}

export function VisualizarDocumentoModal({ open, onOpenChange, document }: VisualizarDocumentoModalProps) {
    if (!document) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden rounded-[32px] border-none bg-app-card dark:bg-[#0c1e3d] shadow-2xl">
                <DialogHeader className="px-10 pt-10 pb-6 bg-app-bg-secondary/50 dark:bg-app-card/5 flex flex-row items-center justify-between">
                    <div className="space-y-1">
                        <DialogTitle className="text-2xl font-medium text-[#101828] dark:text-white leading-none">
                            Visualizar Modelo
                        </DialogTitle>
                        <p className="text-sm text-app-text-muted dark:text-app-text-muted font-normal">
                            {document.nome} • {document.categoria}
                        </p>
                    </div>
                </DialogHeader>

                <div className="px-10 py-8 bg-app-card dark:bg-[#0c1e3d]">
                    <div className="w-full aspect-[1/1.4] bg-app-bg-secondary dark:bg-[#020817] rounded-2xl border border-dashed border-app-border dark:border-app-border-dark p-12 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-20 w-20 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-[#0039A6] dark:text-emerald-400">
                            <FileText size={40} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-medium text-[#101828] dark:text-white">Pré-visualização do Documento</h4>
                            <p className="text-sm text-app-text-muted dark:text-app-text-muted max-w-xs mx-auto">
                                O conteúdo do documento será renderizado aqui com as variáveis preenchidas.
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-6 sm:px-10 sm:py-8 bg-app-bg-secondary/50 dark:bg-app-card/5 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-12 w-full sm:w-auto px-8 rounded-xl border-app-border dark:border-app-border-dark text-app-text-muted dark:text-app-text-muted font-medium hover:bg-app-bg-secondary dark:hover:bg-app-card/5"
                    >
                        Fechar
                    </Button>
                    <div className="flex flex-col sm:flex-row flex-1 gap-3 sm:justify-end">
                        <Button
                            variant="outline"
                            className="h-12 w-full sm:w-auto px-6 rounded-xl border-app-border dark:border-app-border-dark text-gray-700 dark:text-white/80 font-medium flex gap-2 items-center justify-center whitespace-nowrap"
                        >
                            <Printer size={18} className="shrink-0" /> <span className="shrink-0">Imprimir</span>
                        </Button>
                        <Button
                            className="h-12 w-full sm:w-auto px-6 rounded-xl bg-[#1F382C] hover:bg-[#15251f] text-white font-medium flex gap-2 items-center justify-center whitespace-nowrap"
                        >
                            <Download size={18} className="shrink-0" /> <span className="shrink-0">Baixar PDF</span>
                        </Button>
                    </div>
                </DialogFooter>            </DialogContent>
        </Dialog>
    );
}
