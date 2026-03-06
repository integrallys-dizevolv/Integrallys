import { toast } from 'sonner'
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/Dialog';
import { Printer, Download, X } from 'lucide-react';
import { useAtendimento } from '../../../context/AtendimentoContext';

interface DocumentPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    docTitle: string;
    docContent: string;
}

export function DocumentPreviewModal({ isOpen, onClose, docTitle, docContent }: DocumentPreviewModalProps) {
    const { patientName, signature } = useAtendimento();
    const today = new Date().toLocaleDateString('pt-BR');

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0 border-none bg-app-bg dark:bg-[#0c1e3d]">
                <div className="sticky top-0 z-10 bg-white dark:bg-[#0c1e3d] border-b border-gray-100 dark:border-gray-800 p-4 flex items-center justify-between">
                    <DialogTitle className="text-lg font-normal text-gray-900 dark:text-white">PRÉ-VISUALIZAÇÃO</DialogTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="p-12">
                    {/* Document Page Simulation */}
                    <div className="bg-white text-black p-12 shadow-2xl min-h-[800px] flex flex-col justify-between border border-gray-100">
                        {/* Clinical Header */}
                        <div className="border-b-2 border-[#0039A6] pb-6 mb-8 text-center space-y-2">
                            <h1 className="text-3xl font-bold text-[#0039A6]">CLÍNICA INTEGRALLYS</h1>
                            <p className="text-sm text-gray-600 uppercase tracking-widest">Saúde & Bem-Estar Avançado</p>
                            <div className="text-[10px] text-gray-500 pt-2 font-mono">
                                AV. DOUTORES, 1234 - CENTRO | (11) 99999-9999 | WWW.INTEGRALLYS.COM.BR
                            </div>
                        </div>

                        {/* Document Content */}
                        <div className="flex-1 space-y-10">
                            <div className="text-center">
                                <h2 className="text-xl font-bold decoration-2 underline underline-offset-8 uppercase tracking-wider">{docTitle}</h2>
                            </div>

                            <div className="space-y-1 text-sm">
                                <p><strong>Paciente:</strong> {patientName}</p>
                                <p><strong>Data de Emissão:</strong> {today}</p>
                            </div>

                            <div className="text-sm leading-loose whitespace-pre-wrap font-serif text-gray-800 pt-4">
                                {docContent}
                            </div>
                        </div>

                        {/* Signature Section */}
                        <div className="mt-20 pt-10 border-t border-gray-200 flex flex-col items-center gap-4">
                            {signature ? (
                                <div className="flex flex-col items-center">
                                    <img src={signature} alt="Assinatura" className="max-h-24 grayscale brightness-125 contrast-125" />
                                    <div className="w-64 h-[1px] bg-black mt-2"></div>
                                    <p className="text-[12px] font-bold mt-2 uppercase tracking-tighter">Dr. Especialista Responsável</p>
                                    <p className="text-[10px] text-gray-500">CRM: 123456-SP</p>
                                </div>
                            ) : (
                                <div className="w-64 h-[1px] bg-black mt-16"></div>
                            )}

                            <div className="flex items-center gap-3 mt-4">
                                <div className="h-10 w-10 border border-black p-1">
                                    {/* Mock QR Code */}
                                    <div className="w-full h-full bg-black grid grid-cols-3 gap-0.5 p-0.5">
                                        {[...Array(9)].map((_, i) => (
                                            <div key={i} className={`bg-white ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-[9px] text-gray-400 font-mono leading-none">
                                    <p>VALIDAÇÃO ELETRÔNICA</p>
                                    <p>ID: {Math.random().toString(16).substring(2, 10).toUpperCase()}</p>
                                    <p>WWW.INTEGRALLYS.COM.BR/VALIDAR</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 z-10 bg-white dark:bg-[#0c1e3d] border-t border-gray-100 dark:border-gray-800 p-6 flex items-center justify-center gap-4">
                    <Button variant="outline" onClick={() => toast.info('Download disponível em breve.')} className="h-12 px-8 rounded-full border-gray-200 dark:border-gray-800 font-normal">
                        <Download className="h-4 w-4 mr-2" /> Baixar PDF
                    </Button>
                    <Button onClick={() => window.print()} className="h-12 px-10 rounded-full bg-[#0039A6] hover:bg-[#002d82] text-white font-normal flex items-center gap-2">
                        <Printer className="h-4 w-4" /> Imprimir Documento
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
