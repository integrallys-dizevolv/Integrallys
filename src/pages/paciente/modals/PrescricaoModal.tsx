import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Download, X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react'
import {
    Dialog,
    DialogContent,
} from '@/components/ui/Dialog'
import type { PatientPrescriptionDoc } from '@/types'

interface PrescricaoModalProps {
    isOpen: boolean
    onClose: () => void
    selectedDoc: PatientPrescriptionDoc | null
}

export function PrescricaoModal({ isOpen, onClose, selectedDoc }: PrescricaoModalProps) {

    // Viewer State
    const [zoomLevel, setZoomLevel] = useState(100)
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = 3

    // Reset state when doc changes or modal opens
    useEffect(() => {
        if (isOpen) {
            setZoomLevel(100)
            setCurrentPage(1)
        }
    }, [isOpen, selectedDoc])

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200))
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50))
    const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
    const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-[94vw] max-h-[90vh] md:w-full md:max-w-[90vw] md:h-[90vh] p-0 gap-0 bg-white md:bg-slate-100/50 dark:bg-black md:dark:bg-slate-900/50 flex flex-col overflow-hidden outline-none border-none shadow-2xl rounded-[20px] md:rounded-[14px] ">

                {/* Toolbar - Adaptive */}
                <div className="flex flex-col md:flex-row items-center justify-between p-2 md:px-6 md:h-16 bg-white dark:bg-[#0c1e3d] border-b border-gray-200 dark:border-gray-800 z-10 shadow-sm shrink-0 gap-2 md:gap-4">

                    {/* Mobile Top Row: ID + Close Button */}
                    <div className="flex items-center justify-between w-full md:w-auto md:justify-start gap-2">
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-semibold text-gray-900 dark:text-white text-sm md:text-lg leading-tight truncate max-w-[120px] md:max-w-none">{selectedDoc?.id || 'DOC-000'}</span>
                            <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Página {currentPage} de {totalPages}</span>
                        </div>

                        {/* Mobile Close Button */}
                        <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full" onClick={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Center Controls (Zoom & Page) - Compact on Mobile */}
                    <div className="flex items-center justify-center gap-1 md:gap-2 bg-gray-100 dark:bg-[#020817] rounded-lg p-1 w-full md:w-auto">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 md:h-8 md:w-8 rounded-[8px] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center justify-center flex-1 md:flex-none"
                            onClick={handleZoomOut}
                            disabled={zoomLevel <= 50}
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-xs md:text-sm font-medium w-10 md:w-12 text-center text-gray-600 dark:text-gray-300 select-none hidden xs:block">{zoomLevel}%</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 md:h-8 md:w-8 rounded-[8px] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center justify-center flex-1 md:flex-none"
                            onClick={handleZoomIn}
                            disabled={zoomLevel >= 200}
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>

                        <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block" />

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 md:h-8 md:w-8 rounded-[8px] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center justify-center flex-1 md:flex-none"
                            onClick={handlePrevPage}
                            disabled={currentPage <= 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 md:h-8 md:w-8 rounded-[8px] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center justify-center flex-1 md:flex-none"
                            onClick={handleNextPage}
                            disabled={currentPage >= totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Group 3: Download & Close (Desktop) */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button onClick={() => toast.info('Download disponível em breve.')} className="flex flex-1 md:flex-initial flex-row items-center justify-center gap-2 h-10 px-4 whitespace-nowrap bg-[#0039A6] hover:bg-[#002d82] text-white rounded-[10px] shadow-sm transition-colors">
                            <Download className="h-4 w-4 shrink-0" />
                            <span className="hidden xs:inline">Download</span>
                        </Button>

                        {/* Desktop Close Button */}
                        <Button variant="ghost" size="icon" className="h-10 w-10 hidden md:flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full justify-center items-center" onClick={onClose}>
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                {/* Document Scroll Area */}
                <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 p-0 md:p-8 bg-white md:bg-slate-100/50 dark:bg-black md:dark:bg-black/20 flex items-start justify-center">
                    {/* A4 Paper Container with Zoom Transform */}
                    <div
                        className="bg-white dark:bg-[#0c1e3d] md:shadow-xl max-w-[800px] min-h-[100dvh] md:min-h-[1000px] w-full p-4 md:p-12 md:rounded-sm transition-transform duration-200 origin-top"
                        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                    >

                        {/* Paper Header */}
                        <div className="flex justify-between items-start mb-6 md:mb-12">
                            <div className="h-10 w-10 md:h-12 md:w-12 bg-[#0039A6] rounded-lg flex items-center justify-center shadow-sm">
                                <span className="text-white text-xl md:text-2xl font-bold">I</span>
                            </div>
                            <div className="text-right space-y-0.5 md:space-y-1">
                                <p className="text-xs md:text-sm text-gray-500 font-medium">Data: {selectedDoc?.data || '10/01/2024'}</p>
                                <p className="text-xs md:text-sm text-gray-400">Código: {Math.floor(Math.random() * 1000)}</p>
                            </div>
                        </div>

                        {/* Document Title & Doctor */}
                        <div className="mb-6 md:mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2 leading-tight">
                                {selectedDoc?.tipo === 'Atestado' ? 'Atestado Médico' :
                                    selectedDoc?.tipo === 'Exame' ? 'Pedido de Exame' : 'Prescrição Médica'}
                            </h1>
                            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 font-medium">
                                {selectedDoc?.profissional || 'Dr. Médico Responsável'} <span className="text-gray-400 font-normal text-sm md:text-base">- CRM 12345-SP</span>
                            </p>
                        </div>

                        <hr className="border-gray-200 dark:border-gray-700 mb-6 md:mb-8" />

                        {/* Patient Info */}
                        <div className="mb-8 md:mb-10">
                            <p className="text-gray-500 mb-1 text-xs md:text-sm uppercase tracking-wide font-semibold">Paciente:</p>
                            <p className="text-lg md:text-xl text-gray-900 dark:text-white font-medium">Maria Paciente</p>
                            <p className="text-sm md:text-base text-gray-500">CPF: 123.456.789-00</p>
                        </div>

                        {/* Dynamic Content Body */}
                        <div className="bg-gray-50 dark:bg-[#152520] border border-gray-100 dark:border-[#0039A6]/20 rounded-xl p-4 md:p-8 mb-8">
                            <p className="text-gray-500 mb-4 text-xs md:text-sm uppercase tracking-wide font-semibold">
                                {selectedDoc?.tipo === 'Atestado' ? 'Descrição do Atestado:' :
                                    selectedDoc?.tipo === 'Exame' ? 'Exames Solicitados:' : 'Medicamentos Prescritos:'}
                            </p>

                            <div className="space-y-4">
                                {selectedDoc?.tipo === 'Atestado' ? (
                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base md:text-lg">
                                        Atesto para os devidos fins que a paciente <strong>Maria Paciente</strong> deve permanecer em repouso domiciliar pelo período de <strong>03 (três) dias</strong>, a partir desta data, por motivo de doença (CID J00).
                                    </p>
                                ) : selectedDoc?.tipo === 'Exame' ? (
                                    <ul className="list-disc pl-5 space-y-2 text-gray-800 dark:text-gray-200 text-base md:text-lg">
                                        <li>Hemograma Completo</li>
                                        <li>Colesterol Total e Frações</li>
                                        <li>Glicemia em Jejum</li>
                                        <li>TSH e T4 Livre</li>
                                    </ul>
                                ) : (
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between items-baseline">
                                                <p className="font-bold text-gray-900 dark:text-white text-base md:text-lg">1. Paracetamol 500mg</p>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">Tomar 1 comprimido a cada 8 horas em caso de dor ou febre.</p>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-baseline">
                                                <p className="font-bold text-gray-900 dark:text-white text-base md:text-lg">2. Ibuprofeno 400mg</p>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">Tomar 1 comprimido a cada 12 horas por 3 dias. (Após as refeições)</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Signature Area (Visual only) */}
                        <div className="mt-16 md:mt-24 text-center">
                            <div className="w-48 md:w-64 mx-auto border-t border-gray-300 dark:border-gray-600 mb-2"></div>
                            <p className="text-gray-500 text-xs md:text-sm">Assinatura Digital</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
