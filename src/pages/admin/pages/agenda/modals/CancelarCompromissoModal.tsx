import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { AlertTriangle, Calendar, Clock } from 'lucide-react'
import type { AgendaPersonalItem } from '@/types/agenda'

interface CancelarCompromissoModalProps {
  isOpen: boolean;
  onClose: () => void;
  compromisso: AgendaPersonalItem | null;
  onCancelar: (id: number, motivo: string) => void;
}

export function CancelarCompromissoModal({ isOpen, onClose, compromisso, onCancelar }: CancelarCompromissoModalProps) {
  const [motivo, setMotivo] = useState('');

  const handleConfirmar = () => {
    if (!compromisso) return;
    onCancelar(compromisso.id, motivo);
    setMotivo('');
    onClose();
  };

  const handleClose = () => {
    setMotivo('');
    onClose();
  };

  if (!compromisso) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[500px] bg-app-card dark:bg-app-card-dark">
        <DialogHeader>
          <DialogTitle>Cancelar compromisso</DialogTitle>
          <DialogDescription>
            Confirme o cancelamento do compromisso e adicione um motivo
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-0 space-y-5">
          {/* Aviso */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-[10px] p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-normal text-red-900 dark:text-red-300">
                Atenção: esta ação não pode ser desfeita
              </p>
              <p className="text-xs text-red-800 dark:text-red-400 leading-relaxed">
                O compromisso será cancelada permanentemente e você precisará reagendá-lo caso necessário.
              </p>
            </div>
          </div>

          {/* Informações do compromisso */}
          <div className="bg-app-bg-secondary dark:bg-app-bg-dark rounded-[8px] p-4 space-y-3">
            <p className="text-sm font-normal text-app-text-primary dark:text-white">
              {compromisso.titulo}
            </p>
            <div className="flex items-center gap-2">
              <span className="bg-[#0039A6] text-white px-2 py-0.5 rounded text-[10px] font-normal">
                {compromisso.tipo}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-app-text-muted dark:text-app-text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#0039A6]" />
                {compromisso.data ? new Date(compromisso.data).toLocaleDateString('pt-BR') : 'Data não definida'}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#0039A6]" />
                {compromisso.hora}
              </span>
            </div>
            {compromisso.local && (
              <p className="text-xs text-app-text-muted dark:text-app-text-muted">
                Local: {compromisso.local}
              </p>
            )}
            {compromisso.participantes && (
              <p className="text-xs text-app-text-muted dark:text-app-text-muted">
                Participantes: {compromisso.participantes}
              </p>
            )}
          </div>

          {/* Motivo do Cancelamento */}
          <div className="space-y-2">
            <Label>Motivo do cancelamento (opcional)</Label>
            <Textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Descreva o motivo do cancelamento..."
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="pt-0 gap-3 sm:gap-0">
          <Button type="button" variant="outline" onClick={handleClose} className="w-full sm:w-auto h-11 px-6 rounded-[10px]">
            Voltar
          </Button>
          <Button type="button" onClick={handleConfirmar} className="w-full sm:w-auto h-11 px-8 bg-red-600 hover:bg-red-700 text-white font-normal rounded-[10px] shadow-sm transition-all active:scale-[0.98]">
            Confirmar cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
