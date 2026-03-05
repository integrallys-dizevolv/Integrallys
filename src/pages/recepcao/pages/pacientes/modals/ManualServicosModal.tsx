import { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Printer, FileText, Share2, X, CheckCircle } from 'lucide-react';
import { Patient } from '../../../context/types';
import { DocumentoCadastro } from '../components/DocumentoCadastro';

interface ManualServicosModalProps {
    isOpen: boolean;
    onClose: () => void;
    paciente: Patient | null;
}

export function ManualServicosModal({ isOpen, onClose, paciente }: ManualServicosModalProps) {
    const documentRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showWhatsAppInput, setShowWhatsAppInput] = useState(false);
    const [whatsAppNumber, setWhatsAppNumber] = useState('');
    const [messageSent, setMessageSent] = useState(false);

    const calculateAge = (birthDate?: string) => {
        if (!birthDate) return null;
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const patientAge = paciente?.age || calculateAge(paciente?.birthDate)?.toString();
    const respAge = paciente?.responsible?.age || calculateAge(paciente?.responsible?.birthDate)?.toString();

    const [manualText, setManualText] = useState(`1. DO AGENDAMENTO: As consultas devem ser agendadas previamente. Em caso de atraso superior a 15 minutos, o atendimento poderá ser reduzido ou remarcado, sujeitando-se à disponibilidade.

2. DO CANCELAMENTO: Cancelamentos devem ser informados com antecedência mínima de 24 horas. O não comparecimento sem aviso prévio poderá acarretar cobrança ou perda do horário fixo.

3. DOS PAGAMENTOS: Os pagamentos deverão ser realizados conforme modalidade acordada (particular/convênio) nas datas estipuladas.

4. DA EMISSÃO DE NOTA FISCAL: As notas fiscais de serviço serão emitidas conforme os dados informados neste cadastro. Alterações cadastrais devem ser comunicadas imediatamente.

Declaro estar ciente e de acordo com as normas estabelecidas neste manual de serviços.`);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [manualText, isOpen]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        // Simulação de download de PDF
        // Em produção, usar bibliotecas como jsPDF ou html2pdf
        window.print();
    };

    const handleWhatsAppShare = () => {
        if (!whatsAppNumber) {
            setShowWhatsAppInput(true);
            return;
        }

        const message = `Olá ${paciente?.name}! Segue o seu Manual de Serviços da Integrallys.\n\n` +
            `Acesse o documento completo em: [LINK_DO_DOCUMENTO]\n\n` +
            `Agradecemos pela confiança!`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsAppNumber.replace(/\D/g, '')}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
        setMessageSent(true);

        setTimeout(() => {
            setMessageSent(false);
            setShowWhatsAppInput(false);
            setWhatsAppNumber('');
        }, 3000);
    };

    const handleClose = () => {
        setShowWhatsAppInput(false);
        setWhatsAppNumber('');
        setMessageSent(false);
        onClose();
    };

    if (!paciente) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-[1000px] w-[95%] max-h-[90vh] bg-app-card dark:bg-app-card-dark p-0 overflow-hidden border-none rounded-[28px] print:hidden flex flex-col">
                <DialogHeader className="p-6 md:p-8 pb-4 border-b border-app-border dark:border-white/5 shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle className="text-2xl font-bold text-app-text-primary dark:text-white flex items-center gap-2">
                                <FileText className="h-6 w-6 text-[#0039A6]" />
                                Cadastro & Manual
                            </DialogTitle>
                            <DialogDescription className="text-app-text-secondary dark:text-white/60">
                                Visualize, imprima ou envie o documento completo do paciente
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-8 py-6 bg-app-bg-secondary dark:bg-transparent">
                    {/* Preview do Documento */}
                    <div className="bg-white dark:bg-white/5 rounded-lg shadow-sm border border-app-border dark:border-white/10 overflow-hidden">
                        <div className="p-8 text-black dark:text-white/90">
                            {/* Cabeçalho */}
                            <div className="flex items-center justify-between mb-8 border-b-2 border-[#0039A6] pb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-[#0039A6]">Integrallys</h1>
                                    <p className="text-gray-600 dark:text-white/60 text-sm">Centro de Desenvolvimento Humano</p>
                                </div>
                                <div className="text-right text-sm text-gray-600 dark:text-white/60">
                                    <p className="font-semibold">Ficha Cadastral & Manual de Serviços</p>
                                    <p>{new Date().toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>

                            {/* Dados do Paciente */}
                            <section className="mb-6">
                                <h2 className="text-lg font-bold mb-3 uppercase border-b border-app-border dark:border-white/10 pb-1 text-[#0039A6]">1. Dados do Paciente</h2>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div><span className="font-semibold">Nome:</span> {paciente.name}</div>
                                    <div><span className="font-semibold">CPF:</span> {paciente.cpf}</div>
                                    <div><span className="font-semibold">RG:</span> {paciente.rg || '-'}</div>
                                    <div><span className="font-semibold">Inscrição Estadual:</span> {paciente.inscricaoEstadual || '-'}</div>
                                    <div><span className="font-semibold">Data de Nasc.:</span> {paciente.birthDate ? new Date(paciente.birthDate).toLocaleDateString('pt-BR') : '-'}</div>
                                    <div><span className="font-semibold">Idade:</span> {patientAge ? `${patientAge}` : '-'}</div>
                                    <div><span className="font-semibold">Telefone:</span> {paciente.phone}</div>
                                    <div><span className="font-semibold">E-mail:</span> {paciente.email}</div>
                                    <div><span className="font-semibold">Gênero:</span> {paciente.gender || '-'}</div>
                                    <div className="col-span-2"><span className="font-semibold">Endereço:</span> {paciente.address} - {paciente.addressDetails?.city}/{paciente.addressDetails?.state} - CEP: {paciente.addressDetails?.zipCode}</div>
                                </div>
                            </section>

                            {/* Necessidades Especiais */}
                            {paciente.specialNeeds?.hasNeeds && (
                                <section className="mb-6">
                                    <h2 className="text-lg font-bold mb-3 uppercase border-b border-app-border dark:border-white/10 pb-1 text-[#0039A6]">2. Necessidades Especiais</h2>
                                    <div className="text-sm">
                                        <div><span className="font-semibold">Tipo:</span> {paciente.specialNeeds.categories?.join(', ')}</div>
                                        {paciente.specialNeeds.details && (
                                            <div><span className="font-semibold">Detalhes:</span> {paciente.specialNeeds.details}</div>
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* Responsável */}
                            {paciente.responsible && (
                                <section className="mb-6">
                                    <h2 className="text-lg font-bold mb-3 uppercase border-b border-app-border dark:border-white/10 pb-1 text-[#0039A6]">{paciente.specialNeeds?.hasNeeds ? '3' : '2'}. Dados do Responsável</h2>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><span className="font-semibold">Nome:</span> {paciente.responsible.name}</div>
                                        <div><span className="font-semibold">CPF:</span> {paciente.responsible.cpf}</div>
                                        <div><span className="font-semibold">Data de Nasc.:</span> {paciente.responsible.birthDate ? new Date(paciente.responsible.birthDate).toLocaleDateString('pt-BR') : '-'}</div>
                                        <div><span className="font-semibold">Idade:</span> {respAge ? `${respAge} anos` : '-'}</div>
                                        <div><span className="font-semibold">Telefone:</span> {paciente.responsible.phone}</div>
                                        <div><span className="font-semibold">Vínculo:</span> {paciente.responsible.relationship || '-'}</div>
                                    </div>
                                </section>
                            )}

                            {/* Dados Financeiros */}
                            <section className="mb-6">
                                <h2 className="text-lg font-bold mb-3 uppercase border-b border-app-border dark:border-white/10 pb-1 text-[#0039A6]">
                                    {paciente.responsible ? (paciente.specialNeeds?.hasNeeds ? '4' : '3') : (paciente.specialNeeds?.hasNeeds ? '3' : '2')}. Dados Financeiros
                                </h2>
                                <div className="text-sm">
                                    <div><span className="font-semibold">Exige NF:</span> {paciente.financial?.requiresReceipt ? 'Sim' : 'Não'}</div>
                                    {paciente.financial?.requiresReceipt && (
                                        <div className="text-xs text-gray-600 italic mt-1">
                                            {paciente.financial.receiptData?.useProfileData
                                                ? 'Usar dados do paciente para emissão.'
                                                : `Emitir para: ${paciente.financial.receiptData?.name} (CPF/CNPJ: ${paciente.financial.receiptData?.taxId})`}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Manual de Serviços (Editável) */}
                            <section className="mb-8 text-justify leading-relaxed text-xs no-print">
                                <h2 className="text-lg font-bold mb-3 uppercase border-b border-app-border dark:border-white/10 pb-1 text-[#0039A6]">Manual de Serviços e Termos (Edite aqui)</h2>
                                <textarea
                                    ref={textareaRef}
                                    value={manualText}
                                    onChange={(e) => setManualText(e.target.value)}
                                    className="w-full p-4 border border-app-border dark:border-white/10 rounded-lg bg-white dark:bg-white/5 focus:ring-1 focus:ring-[#0039A6] outline-none text-xs text-app-text-primary dark:text-white resize-none overflow-hidden"
                                />
                            </section>

                            <section className="mb-8 text-justify leading-relaxed text-xs hidden print:block whitespace-pre-wrap">
                                <h2 className="text-lg font-bold mb-3 uppercase border-b border-app-border dark:border-white/10 pb-1 text-[#0039A6]">Manual de Serviços e Termos</h2>
                                {manualText}
                            </section>

                            {/* Assinaturas */}
                            <div className="mt-12 grid grid-cols-2 gap-12 text-center">
                                <div className="border-t border-black pt-2">
                                    <p className="font-bold">{paciente.name}</p>
                                    <p className="text-xs">Paciente / Responsável</p>
                                </div>
                                <div className="border-t border-black pt-2">
                                    <p className="font-bold">Integrallys</p>
                                    <p className="text-xs">Administração</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Componente oculto para impressão */}
                    <div className="hidden print:block">
                        <DocumentoCadastro ref={documentRef} data={paciente} manualText={manualText} />
                    </div>
                </div>

                <DialogFooter className="p-6 md:p-8 pt-6 border-t border-app-border dark:border-white/5 bg-app-bg-secondary dark:bg-app-card-dark/50 flex justify-between items-center shrink-0">
                    {showWhatsAppInput ? (
                        <div className="flex items-center gap-2 flex-1">
                            <input
                                type="text"
                                placeholder="(11) 98765-4321"
                                value={whatsAppNumber}
                                onChange={(e) => setWhatsAppNumber(e.target.value)}
                                className="flex-1 h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                            />
                            <Button
                                onClick={handleWhatsAppShare}
                                disabled={messageSent}
                                className="h-10 bg-green-600 hover:bg-green-700 text-white"
                            >
                                {messageSent ? (
                                    <><CheckCircle className="h-4 w-4 mr-1" /> Enviado</>
                                ) : (
                                    'Enviar'
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowWhatsAppInput(false)}
                                className="h-10 w-10"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                className="h-11 px-6 rounded-[12px] font-normal"
                            >
                                Fechar
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleDownloadPDF}
                                className="h-11 px-4 rounded-[12px] font-normal gap-2"
                            >
                                <FileText className="h-4 w-4" />
                                Salvar PDF
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowWhatsAppInput(true)}
                                className="h-11 px-4 rounded-[12px] font-normal gap-2 border-green-600 text-green-600 hover:bg-green-50"
                            >
                                <Share2 className="h-4 w-4" />
                                WhatsApp
                            </Button>
                            <Button
                                onClick={handlePrint}
                                className="h-11 px-6 bg-[#0039A6] hover:bg-[#002d82] text-white rounded-[12px] font-normal gap-2"
                            >
                                <Printer className="h-4 w-4" />
                                Imprimir
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
