import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Calendar, Clock, AlertCircle } from 'lucide-react'
import type { AgendaPersonalItem } from '@/types/agenda'

interface AdiarCompromissoModalProps {
  isOpen: boolean;
  onClose: () => void;
  compromisso: AgendaPersonalItem | null;
  onAdiar: (id: number, novaData: string, novoHorario: string) => void;
}

export function AdiarCompromissoModal({ isOpen, onClose, compromisso, onAdiar }: AdiarCompromissoModalProps) {
  const [novaData, setNovaData] = useState('');
  const [novoHorario, setNovoHorario] = useState('');

  useEffect(() => {
    if (compromisso && isOpen) {
      setNovaData(compromisso.data || '');
      setNovoHorario(compromisso.hora || '');
    }
  }, [compromisso, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compromisso) return;
    onAdiar(compromisso.id, novaData, novoHorario);
    onClose();
  };

  if (!compromisso) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] bg-app-card dark:bg-app-card-dark">
        <DialogHeader>
          <DialogTitle>Agendar nova reunião</DialogTitle>
          <DialogDescription>
            Selecione a nova data e horário para este compromisso.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
          {/* Resumo do Compromisso Atual */}
          <div className="bg-app-bg-secondary dark:bg-app-bg-dark/50 border border-gray-100 dark:border-app-border-dark rounded-lg p-4 space-y-2">
            <p className="text-sm font-normal text-app-text-primary dark:text-white">
              {compromisso.titulo}
            </p>
            <div className="flex items-center gap-4 text-xs text-app-text-muted dark:text-app-text-muted">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#0039A6]" />
                {compromisso.data ? new Date(compromisso.data).toLocaleDateString('pt-BR') : 'Sem data'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-[#0039A6]" />
                {compromisso.hora}
              </span>
            </div>
          </div>

          {/* Grid de Inputs Responsivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nova data</Label>
              <Input type="date" hideDateIcon
                required
                value={novaData}
                onChange={(e) => setNovaData(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Novo horário</Label>
              <Input
                type="time"
                required
                value={novoHorario}
                onChange={(e) => setNovoHorario(e.target.value)}
              />
            </div>
          </div>

          {/* Aviso / Alert Box */}
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-lg p-3 flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-200/80 leading-relaxed">
              O sistema atualizará a agenda e notificará os envolvidos sobre a nova data.
            </p>
          </div>

          <DialogFooter className="pt-2 gap-3 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto h-11 px-6 rounded-[10px]">
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto h-11 px-8 bg-[#0039A6] hover:bg-[#1d3b2e] text-white font-normal rounded-[10px] shadow-sm transition-all active:scale-[0.98]">
              Adiar agora
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
