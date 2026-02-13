import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface CancelarConsultaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (reason: string) => void;
  consulta?: {
    paciente: string;
    especialista: string;
    horario: string;
    tipo: string;
  };
}

export function CancelarConsultaModal({
  isOpen,
  onClose,
  onConfirm,
  consulta = {
    paciente: "Maria Silva",
    especialista: "Dr. João Santos",
    horario: "08:00",
    tipo: "Consulta"
  }
}: CancelarConsultaModalProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) return;
    if (onConfirm) {
      onConfirm(reason);
    }
    onClose();
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[500px] bg-app-card dark:bg-app-card-dark">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-normal">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Justificativa de Cancelamento
          </DialogTitle>
          <DialogDescription>
            Informe o motivo do cancelamento para registro no histórico e relatórios.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-0 space-y-4">
          {/* Alert de Aviso */}
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-[10px] p-4 text-xs text-amber-700 dark:text-amber-400">
            <p>
              O agendamento permanecerá no histórico do cliente como "Cancelado", mas o horário ficará disponível para novos agendamentos na agenda.
            </p>
          </div>

          {/* Card de Consulta a ser Cancelada */}
          <div className="bg-app-bg-secondary dark:bg-app-bg-dark/50 rounded-[10px] p-4 space-y-2">
            <h4 className="text-[11px] font-medium text-app-text-muted dark:text-white/40 uppercase tracking-wider">Atendimento selecionado</h4>
            <div className="space-y-1 text-xs">
              <p className="text-app-text-primary dark:text-white">
                <span className="text-app-text-secondary dark:text-app-text-muted">Paciente:</span> {consulta.paciente}
              </p>
              <p className="text-app-text-primary dark:text-white">
                <span className="text-app-text-secondary dark:text-app-text-muted">Horário:</span> {consulta.horario} • {consulta.tipo}
              </p>
            </div>
          </div>

          {/* Motivo do Cancelamento */}
          <div className="space-y-2">
            <Label className="text-sm">Motivo do cancelamento (Obrigatório) *</Label>
            <Input
              placeholder="Ex: Cliente não pôde comparecer por motivos de saúde"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-11 border-app-border dark:border-gray-700"
            />
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-0 p-6 pt-0">
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full sm:w-auto h-11 px-6 rounded-[10px]"
          >
            Voltar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="w-full sm:w-auto h-11 px-8 bg-red-600 hover:bg-red-700 text-white font-normal rounded-[10px] shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar e Liberar Horário
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
