import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Clock, Lock, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface BloqueioAgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    data?: string;
    horario?: string;
    profissional?: string;
  };
}

type TipoBloqueio = 'ferias' | 'folga' | 'reuniao' | 'outro';

export function BloqueioAgendaModal({
  isOpen,
  onClose,
  initialData
}: BloqueioAgendaModalProps) {
  const [formData, setFormData] = useState({
    dataInicio: initialData?.data || '',
    dataFim: initialData?.data || '',
    horarioInicio: initialData?.horario || '08:00',
    horarioFim: initialData?.horario || '18:00',
    profissional: initialData?.profissional || '',
    tipo: '' as TipoBloqueio | '',
    justificativa: '',
    bloquearDiaInteiro: false
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.dataInicio) {
      newErrors.dataInicio = 'Data de início é obrigatória';
    }
    if (!formData.dataFim) {
      newErrors.dataFim = 'Data de fim é obrigatória';
    }
    if (!formData.profissional) {
      newErrors.profissional = 'Profissional é obrigatório';
    }
    if (!formData.tipo) {
      newErrors.tipo = 'Tipo de bloqueio é obrigatório';
    }
    if (!formData.justificativa.trim()) {
      newErrors.justificativa = 'Justificativa é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Aqui seria chamada a API para salvar o bloqueio
    console.log('Bloqueio criado:', formData);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      dataInicio: '',
      dataFim: '',
      horarioInicio: '08:00',
      horarioFim: '18:00',
      profissional: '',
      tipo: '',
      justificativa: '',
      bloquearDiaInteiro: false
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[550px] bg-app-card dark:bg-app-card-dark rounded-[14px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-normal">
            <Lock className="h-5 w-5 text-[#0039A6]" />
            Bloquear Agenda
          </DialogTitle>
          <DialogDescription className="text-app-text-muted mt-1.5">
            Bloqueie horários na agenda do profissional informando o motivo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5 pb-8">
          {/* Alerta informativo */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-[10px] p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                O bloqueio impedirá novos agendamentos no período selecionado.
                O horário ficará indisponível na grade da agenda.
              </p>
            </div>
          </div>

          {/* Profissional */}
          <div className="space-y-1.5">
            <Label className="text-[13px] font-normal text-gray-700 dark:text-white/80">
              Profissional *
            </Label>
            <Select
              value={formData.profissional}
              onValueChange={(v) => setFormData({ ...formData, profissional: v })}
            >
              <SelectTrigger className={`h-11 rounded-[10px] dark:bg-app-bg-dark ${errors.profissional ? 'border-red-500' : ''}`}>
                <SelectValue preferPlaceholder placeholder="Selecione o profissional" />
              </SelectTrigger>
              <SelectContent className="rounded-[10px]">
                <SelectItem value="joao">Dr. João Santos</SelectItem>
                <SelectItem value="ana">Dra. Ana Lima</SelectItem>
                <SelectItem value="flavia">Dra. Flávia Alves</SelectItem>
                <SelectItem value="sofia">Dra. Sofia Castro</SelectItem>
              </SelectContent>
            </Select>
            {errors.profissional && (
              <p className="text-[10px] text-red-500">{errors.profissional}</p>
            )}
          </div>

          {/* Período */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2 text-[13px] font-normal">
                Data início *
              </Label>
              <Input type="date"
                value={formData.dataInicio}
                onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                className={`h-11 rounded-[10px] dark:bg-app-bg-dark ${errors.dataInicio ? 'border-red-500' : ''}`}
              />
              {errors.dataInicio && (
                <p className="text-[10px] text-red-500">{errors.dataInicio}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2 text-[13px] font-normal">
                Data fim *
              </Label>
              <Input type="date"
                value={formData.dataFim}
                onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                className={`h-11 rounded-[10px] dark:bg-app-bg-dark ${errors.dataFim ? 'border-red-500' : ''}`}
              />
              {errors.dataFim && (
                <p className="text-[10px] text-red-500">{errors.dataFim}</p>
              )}
            </div>
          </div>

          {/* Checkbox bloquear dia inteiro */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="diaInteiro"
              checked={formData.bloquearDiaInteiro}
              onChange={(e) => setFormData({ ...formData, bloquearDiaInteiro: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#0039A6] focus:ring-[#0039A6]"
            />
            <Label htmlFor="diaInteiro" className="text-[13px] font-normal text-gray-700 dark:text-white/80 cursor-pointer">
              Bloquear dia inteiro
            </Label>
          </div>

          {/* Horários (só aparece se não for dia inteiro) */}
          {!formData.bloquearDiaInteiro && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-[13px] font-normal">
                  <Clock className="h-4 w-4 text-[#0039A6]" /> Horário início
                </Label>
                <Input
                  type="time"
                  value={formData.horarioInicio}
                  onChange={(e) => setFormData({ ...formData, horarioInicio: e.target.value })}
                  className="h-11 rounded-[10px] dark:bg-app-bg-dark"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-[13px] font-normal">
                  <Clock className="h-4 w-4 text-[#0039A6]" /> Horário fim
                </Label>
                <Input
                  type="time"
                  value={formData.horarioFim}
                  onChange={(e) => setFormData({ ...formData, horarioFim: e.target.value })}
                  className="h-11 rounded-[10px] dark:bg-app-bg-dark"
                />
              </div>
            </div>
          )}

          {/* Tipo de bloqueio */}
          <div className="space-y-1.5">
            <Label className="text-[13px] font-normal text-gray-700 dark:text-white/80">
              Tipo de bloqueio *
            </Label>
            <Select
              value={formData.tipo}
              onValueChange={(v) => setFormData({ ...formData, tipo: v as TipoBloqueio })}
            >
              <SelectTrigger className={`h-11 rounded-[10px] dark:bg-app-bg-dark ${errors.tipo ? 'border-red-500' : ''}`}>
                <SelectValue preferPlaceholder placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="rounded-[10px]">
                <SelectItem value="ferias">Férias</SelectItem>
                <SelectItem value="folga">Folga</SelectItem>
                <SelectItem value="reuniao">Reunião</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo && (
              <p className="text-[10px] text-red-500">{errors.tipo}</p>
            )}
          </div>

          {/* Justificativa */}
          <div className="space-y-1.5">
            <Label className="text-[13px] font-normal text-gray-700 dark:text-white/80">
              Justificativa *
            </Label>
            <Textarea
              placeholder="Informe o motivo do bloqueio..."
              value={formData.justificativa}
              onChange={(e) => setFormData({ ...formData, justificativa: e.target.value })}
              className={`min-h-[80px] rounded-[10px] dark:bg-app-bg-dark resize-none ${errors.justificativa ? 'border-red-500' : ''}`}
            />
            {errors.justificativa && (
              <p className="text-[10px] text-red-500">{errors.justificativa}</p>
            )}
          </div>

          <DialogFooter className="pt-2 gap-3 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full sm:w-auto h-11 px-6 rounded-[10px]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto h-11 px-8 rounded-[10px] bg-[#0039A6] hover:bg-[#002d82] text-white font-normal shadow-sm transition-all active:scale-[0.98]"
            >
              Bloquear agenda
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}








