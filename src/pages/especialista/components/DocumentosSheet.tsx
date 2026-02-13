import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/Sheet'
import { Button } from '@/components/ui/Button'
import { AdicionarDocumentoModal } from '../modals'

interface Documento {
    id: number
    tipo: string
    data: string
    meio: string
    anexoUrl: string
    recebido: boolean
}

interface DocumentosSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    documents?: Documento[]
}

export function DocumentosSheet({ open, onOpenChange, documents = [] }: DocumentosSheetProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    // Fallback mock data matching the image
    const displayDocs = documents.length > 0 ? documents : [
        {
            id: 1,
            tipo: 'Prescrição',
            data: '07/10/2025',
            meio: 'WhatsApp',
            anexoUrl: 'https://exemplo.com/prescricao.pdf',
            recebido: true
        }
    ]

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:max-w-[440px] flex flex-col p-6 bg-white dark:bg-app-bg-dark shadow-2xl h-full border-l border-gray-100 dark:border-gray-800">
                    <SheetHeader className="shrink-0 mb-8 p-0 border-0 flex flex-col items-start gap-1">
                        <div className="flex items-center justify-between w-full">
                            <SheetTitle className="text-[20px] font-bold text-gray-900 dark:text-white leading-tight">Documentos Enviados</SheetTitle>
                            <button onClick={() => onOpenChange(false)} className="text-app-text-muted hover:text-gray-600 dark:hover:text-white transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <SheetDescription className="text-[15px] text-app-text-muted dark:text-app-text-muted font-normal m-0">
                            Lista de documentos enviados ao paciente
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar -mr-2">
                        {displayDocs.length > 0 ? (
                            displayDocs.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="p-5 rounded-[12px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-app-card-dark relative shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                                >
                                    {/* Badge and Close */}
                                    <div className="flex items-center justify-between mb-5">
                                        <span className="inline-flex items-center justify-center rounded-full border border-app-border dark:border-app-border-dark bg-white dark:bg-app-table-header-dark px-3 py-1 text-xs font-semibold text-gray-900 dark:text-gray-100">
                                            {doc.tipo}
                                        </span>
                                        <button className="text-app-text-muted hover:text-gray-600 dark:hover:text-white transition-colors">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Data Fields */}
                                    <div className="space-y-2.5 text-[14px]">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-app-text-muted dark:text-app-text-muted font-normal">Data:</span>
                                            <span className="text-gray-900 dark:text-white font-normal">{doc.data}</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-app-text-muted dark:text-app-text-muted font-normal">Meio:</span>
                                            <span className="text-gray-900 dark:text-white font-normal">{doc.meio}</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-app-text-muted dark:text-app-text-muted font-normal">Anexo:</span>
                                            <a href="#" className="text-[#0039A6] dark:text-[#4da885] hover:underline font-normal truncate">
                                                {doc.anexoUrl}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-app-text-muted dark:text-app-text-muted font-normal">Recebido:</span>
                                            {doc.recebido ? (
                                                <span className="bg-[#1a3d2f] text-white rounded-[6px] px-2.5 py-0.5 text-[11px] font-bold">
                                                    Sim
                                                </span>
                                            ) : (
                                                <span className="bg-orange-600 text-white rounded-[6px] px-2.5 py-0.5 text-[11px] font-bold">
                                                    Não
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-sm text-app-text-muted dark:text-app-text-muted">Nenhum documento enviado.</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-0">
                        <Button
                            onClick={() => setIsAddModalOpen(true)}
                            className="w-full h-11 bg-[#1a3d2f] hover:bg-[#142e23] text-white rounded-[8px] font-semibold text-[14px] shadow-sm transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Adicionar Documento
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            <AdicionarDocumentoModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </>
    )
}
