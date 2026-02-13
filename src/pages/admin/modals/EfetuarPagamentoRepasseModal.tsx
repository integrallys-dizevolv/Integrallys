import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Check, DollarSign, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface EfetuarPagamentoRepasseModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    repasse: any;
}

export function EfetuarPagamentoRepasseModal({ isOpen, onClose, repasse }: EfetuarPagamentoRepasseModalProps) {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const isParceiro = repasse?.tipoVinculo === 'Parceiro';

    if (!repasse) return null;

    const handleConfirm = () => {
        toast.success(isParceiro ? 'Recebimento baixado com sucesso!' : 'Pagamento realizado com sucesso!');
        setStep('success');
    };

    const handleClose = () => {
        onClose(false);
        setTimeout(() => setStep('form'), 300);
    };

    const handlePrintReceipt = () => {
        const w = window.open('', '_blank', 'width=720,height=880');
        if (!w) {
            toast.error('Não foi possível abrir a impressão do recibo.');
            return;
        }

        w.document.write(`
          <html>
            <head><title>Recibo de Repasse</title></head>
            <body style="font-family: Arial, sans-serif; padding: 24px;">
              <h2>Recibo de Repasse</h2>
              <p><strong>Especialista:</strong> ${repasse.especialista}</p>
              <p><strong>Período:</strong> ${repasse.periodo}</p>
              <p><strong>Valor:</strong> ${repasse.valorRepasse}</p>
              <p><strong>Status:</strong> ${repasse.status}</p>
              <p><strong>Tipo:</strong> ${repasse.tipoVinculo}</p>
              <hr />
              <p style="margin-top: 18px;">Assinatura: ______________________________</p>
            </body>
          </html>
        `);
        w.document.close();
        w.focus();
        w.print();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-[500px] p-0 overflow-hidden border-none rounded-[24px] dark:bg-app-bg-dark">
                {step === 'form' ? (
                    <>
                        <DialogHeader className="px-8 pt-8 pb-4">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`h-12 w-12 rounded-2xl ${isParceiro ? 'bg-orange-50 dark:bg-orange-500/10' : 'bg-[#e7f3ef] dark:bg-[#0039A6]/20'} flex items-center justify-center shrink-0`}>
                                    <DollarSign className={`h-6 w-6 ${isParceiro ? 'text-orange-600' : 'text-[#0039A6]'}`} />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-normal text-app-text-primary dark:text-white uppercase tracking-tight">
                                        {isParceiro ? 'Confirmar recebimento' : 'Efetuar pagamento'}
                                    </DialogTitle>
                                    <DialogDescription className="text-sm font-normal text-app-text-muted">
                                        {isParceiro ? 'Baixar taxa de repasse do parceiro' : 'Realizar repasse para o especialista'}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="px-8 pb-8 space-y-5">
                            <div className="bg-app-bg-secondary/50 dark:bg-app-card/5 p-4 rounded-2xl border border-gray-100 dark:border-app-border-dark space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-app-text-muted font-normal">Visualizar especialista</span>
                                    <span className="text-app-text-primary dark:text-white font-normal">{repasse.especialista}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-app-text-muted font-normal">Período</span>
                                    <span className="text-app-text-muted dark:text-app-text-muted">{repasse.periodo}</span>
                                </div>
                                <div className="h-px bg-app-bg-secondary dark:bg-app-card/10 my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-app-text-muted font-normal">{isParceiro ? 'Valor a receber' : 'Valor a pagar'}</span>
                                    <span className={`text-xl font-normal ${isParceiro ? 'text-orange-600' : 'text-[#0039A6] dark:text-[#4da885]'}`}>
                                        {repasse.valorRepasse}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted uppercase tracking-wider">Forma de pagamento</Label>
                                    <Select defaultValue="pix">
                                        <SelectTrigger className="h-11 bg-app-card dark:bg-app-bg-dark border-app-border dark:border-app-border-dark rounded-xl text-sm font-normal">
                                            <SelectValue>PIX</SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pix">PIX</SelectItem>
                                            <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                            <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                                            <SelectItem value="cartao">Cartão</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted uppercase tracking-wider">Conta / Caixa de origem</Label>
                                    <Select defaultValue="itau">
                                        <SelectTrigger className="h-11 bg-app-card dark:bg-app-bg-dark border-app-border dark:border-app-border-dark rounded-xl text-sm font-normal">
                                            <SelectValue>Banco Itaú - Principal</SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="itau">Banco Itaú - Principal</SelectItem>
                                            <SelectItem value="caixa">Caixa Clínica</SelectItem>
                                            <SelectItem value="nubank">Nubank - Outras</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-normal text-[#64748B] dark:text-app-text-muted uppercase tracking-wider">Data do movimento</Label>
                                    <Input
                                        type="date"
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                        className="h-11 bg-app-card dark:bg-app-bg-dark border-app-border dark:border-app-border-dark rounded-xl text-sm font-normal"
                                    />
                                </div>
                            </div>

                            <DialogFooter className="pt-2 gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleClose}
                                    className="flex-1 h-12 rounded-xl text-app-text-muted font-normal border-app-border"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    className={`flex-1 h-12 rounded-xl text-white font-normal shadow-lg ${isParceiro ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/10' : 'bg-[#0039A6] hover:bg-[#1d3b2e] shadow-[#0039A6]/10'}`}
                                >
                                    Confirmar
                                </Button>
                            </DialogFooter>
                        </div>
                    </>
                ) : (
                    <div className="p-8 text-center space-y-6">
                        <div className="mx-auto h-20 w-20 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                            <Check className="h-10 w-10 text-emerald-600" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-app-text-primary dark:text-white">Processado com Sucesso!</h3>
                            <p className="text-sm text-app-text-muted max-w-[300px] mx-auto">
                                O {isParceiro ? 'recebimento' : 'repasse'} foi registrado no financeiro e o comprovante já está disponível.
                            </p>
                        </div>

                        <div className="bg-app-bg-secondary dark:bg-app-card/5 p-6 rounded-3xl border border-gray-100 dark:border-app-border-dark text-left space-y-4">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-app-text-muted" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-app-text-muted tracking-widest">Recibo gerado</p>
                                    <p className="text-sm font-normal text-app-text-primary dark:text-white">REC-{Math.floor(Math.random() * 90000) + 10000}</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full h-11 rounded-xl border-[#0039A6] text-[#0039A6] dark:text-[#4da885] dark:border-[#4da885] font-normal gap-2"
                                onClick={handlePrintReceipt}
                            >
                                <FileText size={18} /> Imprimir recibo
                            </Button>
                        </div>

                        <Button
                            onClick={handleClose}
                            className="w-full h-12 bg-[#0039A6] hover:bg-[#1d3b2e] text-white rounded-xl font-normal shadow-lg shadow-[#0039A6]/10"
                        >
                            Fechar
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
