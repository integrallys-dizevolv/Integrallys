import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { formatDateBR } from '@/utils/dateUtils';
import { CreditCard, Calendar } from 'lucide-react';
import { MOCK_PROCEDIMENTOS } from '@/mocks/admin/cadastros';

interface PagamentoParcial {
  data: string;
  valor: number;
  metodo?: string;
}

interface EmitirNovaCobrancaModalProps {
  isOpen: boolean;
  onClose: () => void;
  paciente?: string;
  profissional?: string;
  horario?: string;
  procedimento?: string;
  valorProcedimento?: number;
  pagamentos?: PagamentoParcial[];
  onConfirm?: (payload: {
    valor: number;
    metodo: string;
    observacao?: string;
    data: string;
  }) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export function EmitirNovaCobrancaModal({
  isOpen,
  onClose,
  paciente = 'Maria Silva',
  profissional = 'Dr. João Santos',
  horario = '08:00',
  procedimento,
  valorProcedimento,
  pagamentos = [],
  onConfirm,
}: EmitirNovaCobrancaModalProps) {
  const valorEfetivo = useMemo(() => {
    let resolved = valorProcedimento;
    if (!resolved && procedimento) {
      const procMock = MOCK_PROCEDIMENTOS.find((p) => p.nome === procedimento);
      if (procMock) {
        resolved = procMock.valor;
      }
    }
    return resolved || 0;
  }, [valorProcedimento, procedimento]);

  const totalPago = pagamentos.reduce((acc, p) => acc + p.valor, 0);
  const saldoEmAberto = Math.max(0, valorEfetivo - totalPago);

  const [metodo, setMetodo] = useState<string>('');
  const [valorRecebido, setValorRecebido] = useState<string>('');
  const [observacao, setObservacao] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    setMetodo('');
    setValorRecebido(saldoEmAberto > 0 ? saldoEmAberto.toFixed(2) : '');
    setObservacao('');
    setError('');
  }, [isOpen, saldoEmAberto]);

  const handleConfirm = () => {
    if (saldoEmAberto <= 0) {
      onClose();
      return;
    }

    const parsed = Number(String(valorRecebido).replace(',', '.'));
    if (!metodo) {
      setError('Selecione o método de pagamento.');
      return;
    }
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError('Informe um valor válido.');
      return;
    }
    if (parsed > saldoEmAberto) {
      setError('O valor não pode ser maior que o saldo em aberto.');
      return;
    }

    onConfirm?.({
      valor: Number(parsed.toFixed(2)),
      metodo,
      observacao: observacao.trim() || undefined,
      data: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] bg-app-card dark:bg-app-card-dark">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-normal">
            <CreditCard className="h-5 w-5 text-[#0039A6]" />
            Emitir nova cobrança
          </DialogTitle>
          <DialogDescription>
            Preencha os dados para registrar o recebimento
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-0 space-y-4">
          <div className="bg-app-bg-secondary dark:bg-app-bg-dark/50 rounded-[10px] p-3">
            <p className="text-sm font-medium text-app-text-primary dark:text-white mb-1">
              Paciente: {paciente}
            </p>
            <p className="text-xs text-[#4a5565] dark:text-app-text-muted">
              {profissional} • {horario} {procedimento ? `• ${procedimento}` : ''}
            </p>
          </div>

          {pagamentos.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-app-text-secondary dark:text-app-text-muted flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Pagamentos realizados:
              </p>
              <div className="space-y-1.5">
                {pagamentos.map((pag, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
                    <span className="text-emerald-700 dark:text-emerald-400">{formatDateBR(pag.data)}</span>
                    <span className="font-medium text-emerald-800 dark:text-emerald-300">{formatCurrency(pag.valor)} {pag.metodo ? `(${pag.metodo})` : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-[#bedbff] dark:border-blue-800 rounded-[10px] p-4 space-y-3">
            <h4 className="text-sm font-normal text-[#1c398e] dark:text-blue-400">
              Resumo da cobrança
            </h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <p className="text-[#4a5565] dark:text-app-text-muted">Valor total do serviço:</p>
                <p className="text-app-text-primary dark:text-white font-normal">{formatCurrency(valorEfetivo)}</p>
              </div>

              <div className="flex items-center justify-between text-xs">
                <p className="text-[#4a5565] dark:text-app-text-muted">Total já pago:</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-normal">{formatCurrency(totalPago)}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#bedbff] dark:border-blue-800 text-xs">
                <p className="text-app-text-primary dark:text-white font-medium">Saldo a receber:</p>
                <p className="text-[#0039A6] dark:text-blue-400 font-bold text-sm">{formatCurrency(saldoEmAberto)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Método de pagamento *</Label>
            <Select value={metodo} onValueChange={(value) => {
              setMetodo(value);
              setError('');
            }}>
              <SelectTrigger>
                <SelectValue preferPlaceholder placeholder="Selecione o método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="debito">Cartão de Débito</SelectItem>
                <SelectItem value="credito">Cartão de Crédito</SelectItem>
                <SelectItem value="transferencia">Transferência</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Valor a receber agora (R$) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-app-text-secondary dark:text-app-text-muted">
                R$
              </span>
              <Input
                placeholder="0,00"
                type="number"
                step="0.01"
                className="pl-10 h-11"
                value={valorRecebido}
                onChange={(e) => {
                  setValorRecebido(e.target.value);
                  setError('');
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observação</Label>
            <Textarea
              placeholder="Informações adicionais sobre o recebimento..."
              className="min-h-[80px] resize-none"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}
        </div>

        <DialogFooter className="gap-3 sm:gap-0 p-6 pt-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto h-11 px-6 rounded-[10px]"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={saldoEmAberto <= 0}
            className="w-full sm:w-auto h-11 px-8 bg-[#0039A6] hover:bg-[#002d82] text-white font-normal rounded-[10px] shadow-sm transition-all active:scale-[0.98]"
          >
            Confirmar recebimento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
