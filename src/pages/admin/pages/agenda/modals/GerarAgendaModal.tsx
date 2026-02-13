import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Clock, CalendarPlus } from 'lucide-react';

export interface GerarAgendaPayload {
  profissional: string;
  dataInicio: string;
  dataFim: string;
  considerarFeriados: boolean;
  diasSemana: number[];
  diasMes?: number[];
  horarios: { inicio: string; fim: string }[];
  duracaoPrimeira: number;
  duracaoRetorno: number;
}

interface GerarAgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionals: string[];
  onGenerate: (payload: GerarAgendaPayload) => void;
}

const WEEK_DAYS = [
  { label: 'Dom', value: 0 },
  { label: 'Seg', value: 1 },
  { label: 'Ter', value: 2 },
  { label: 'Qua', value: 3 },
  { label: 'Qui', value: 4 },
  { label: 'Sex', value: 5 },
  { label: 'Sáb', value: 6 },
];

type FormData = {
  profissional: string;
  dataInicio: string;
  dataFim: string;
  considerarFeriados: boolean;
  diasSemana: number[];
  diasMes: number[];
  horario1Inicio: string;
  horario1Fim: string;
  horario2Inicio: string;
  horario2Fim: string;
  duracaoPrimeira: number;
  duracaoRetorno: number;
};

export function GerarAgendaModal({ isOpen, onClose, professionals, onGenerate }: GerarAgendaModalProps) {
  const [formData, setFormData] = useState<FormData>({
    profissional: '',
    dataInicio: '',
    dataFim: '',
    considerarFeriados: false,
    diasSemana: [1, 2, 3, 4, 5],
    diasMes: [],
    horario1Inicio: '08:00',
    horario1Fim: '12:00',
    horario2Inicio: '14:00',
    horario2Fim: '18:00',
    duracaoPrimeira: 60,
    duracaoRetorno: 45,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleToggleDia = (value: number) => {
    setFormData((prev) => {
      const exists = prev.diasSemana.includes(value);
      return {
        ...prev,
        diasSemana: exists
          ? prev.diasSemana.filter((day) => day !== value)
          : [...prev.diasSemana, value],
      };
    });
  };

  const handleToggleDiaMes = (value: number) => {
    setFormData((prev) => {
      const exists = prev.diasMes.includes(value);
      return {
        ...prev,
        diasMes: exists
          ? prev.diasMes.filter((day) => day !== value)
          : [...prev.diasMes, value],
      };
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.profissional) newErrors.profissional = 'Selecione o profissional';
    if (!formData.dataInicio) newErrors.dataInicio = 'Data inicial obrigatória';
    if (!formData.dataFim) newErrors.dataFim = 'Data final obrigatória';
    if (formData.diasSemana.length === 0 && formData.diasMes.length === 0) newErrors.diasSemana = 'Selecione ao menos um dia';
    if (!formData.horario1Inicio || !formData.horario1Fim) newErrors.horario1 = 'Informe o horário';
    if (!formData.duracaoPrimeira || formData.duracaoPrimeira < 15) newErrors.duracaoPrimeira = 'Mínimo 15 minutos';
    if (!formData.duracaoRetorno || formData.duracaoRetorno < 15) newErrors.duracaoRetorno = 'Mínimo 15 minutos';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const payload = useMemo<GerarAgendaPayload>(() => ({
    profissional: formData.profissional,
    dataInicio: formData.dataInicio,
    dataFim: formData.dataFim,
    considerarFeriados: formData.considerarFeriados,
    diasSemana: formData.diasSemana,
    diasMes: formData.diasMes,
    horarios: [
      { inicio: formData.horario1Inicio, fim: formData.horario1Fim },
      { inicio: formData.horario2Inicio, fim: formData.horario2Fim },
    ].filter(h => h.inicio && h.fim),
    duracaoPrimeira: formData.duracaoPrimeira,
    duracaoRetorno: formData.duracaoRetorno,
  }), [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onGenerate(payload);
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[620px] bg-app-card dark:bg-app-card-dark rounded-[14px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-normal">
            <CalendarPlus className="h-5 w-5 text-[#0039A6]" />
            Gerar Agenda
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5 pb-8">
          <div className="space-y-1.5">
            <Label className="text-[13px] font-normal text-gray-700 dark:text-white/80">
              Profissional *
            </Label>
            <Select
              value={formData.profissional}
              onValueChange={(value) => setFormData({ ...formData, profissional: value })}
            >
              <SelectTrigger className={`h-11 rounded-[10px] dark:bg-app-bg-dark ${errors.profissional ? 'border-red-500' : ''}`}>
                <SelectValue preferPlaceholder placeholder="Selecione o profissional" />
              </SelectTrigger>
              <SelectContent className="rounded-[10px]">
                {professionals.map((prof) => (
                  <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.profissional && <p className="text-[10px] text-red-500">{errors.profissional}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[13px] font-normal">Data inicial *</Label>
              <Input type="date"
                value={formData.dataInicio}
                onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                className={`h-11 rounded-[10px] dark:bg-app-bg-dark ${errors.dataInicio ? 'border-red-500' : ''}`}
              />
              {errors.dataInicio && <p className="text-[10px] text-red-500">{errors.dataInicio}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] font-normal">Data final *</Label>
              <Input type="date"
                value={formData.dataFim}
                onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                className={`h-11 rounded-[10px] dark:bg-app-bg-dark ${errors.dataFim ? 'border-red-500' : ''}`}
              />
              {errors.dataFim && <p className="text-[10px] text-red-500">{errors.dataFim}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px] font-normal text-gray-700 dark:text-white/80">
              Dias de atendimento *
            </Label>
            <div className="grid grid-cols-7 gap-2">
              {WEEK_DAYS.map((day) => (
                <button
                  type="button"
                  key={day.value}
                  onClick={() => handleToggleDia(day.value)}
                  className={`h-9 rounded-[10px] text-xs font-normal border transition-all ${
                    formData.diasSemana.includes(day.value)
                      ? 'bg-[#0039A6] text-white border-[#0039A6]'
                      : 'bg-app-card text-app-text-secondary border-app-border dark:bg-app-bg-dark'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
            {errors.diasSemana && <p className="text-[10px] text-red-500">{errors.diasSemana}</p>}
            <p className="text-[11px] text-app-text-muted mt-1">
              Se preferir, selecione dias específicos do mês abaixo.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px] font-normal text-gray-700 dark:text-white/80">
              Dias do mês (opcional)
            </Label>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 31 }, (_, idx) => idx + 1).map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => handleToggleDiaMes(day)}
                  className={`h-9 rounded-[10px] text-xs font-normal border transition-all ${
                    formData.diasMes.includes(day)
                      ? 'bg-[#0039A6] text-white border-[#0039A6]'
                      : 'bg-app-card text-app-text-secondary border-app-border dark:bg-app-bg-dark'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-app-text-muted mt-1">
              Quando preenchido, o sistema usa os dias do mês escolhidos.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2 text-[13px] font-normal">
                <Clock className="h-4 w-4 text-[#0039A6]" /> Horário 1 (início/fim)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="time"
                  value={formData.horario1Inicio}
                  onChange={(e) => setFormData({ ...formData, horario1Inicio: e.target.value })}
                  className="h-11 rounded-[10px] dark:bg-app-bg-dark"
                />
                <Input
                  type="time"
                  value={formData.horario1Fim}
                  onChange={(e) => setFormData({ ...formData, horario1Fim: e.target.value })}
                  className="h-11 rounded-[10px] dark:bg-app-bg-dark"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2 text-[13px] font-normal">
                <Clock className="h-4 w-4 text-[#0039A6]" /> Horário 2 (opcional)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="time"
                  value={formData.horario2Inicio}
                  onChange={(e) => setFormData({ ...formData, horario2Inicio: e.target.value })}
                  className="h-11 rounded-[10px] dark:bg-app-bg-dark"
                />
                <Input
                  type="time"
                  value={formData.horario2Fim}
                  onChange={(e) => setFormData({ ...formData, horario2Fim: e.target.value })}
                  className="h-11 rounded-[10px] dark:bg-app-bg-dark"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[13px] font-normal text-gray-700 dark:text-white/80">
                Duração primeira consulta (min) *
              </Label>
              <Input
                type="number"
                min={15}
                step={5}
                value={formData.duracaoPrimeira}
                onChange={(e) => setFormData({ ...formData, duracaoPrimeira: Number(e.target.value) })}
                className={`h-11 rounded-[10px] dark:bg-app-bg-dark ${errors.duracaoPrimeira ? 'border-red-500' : ''}`}
              />
              {errors.duracaoPrimeira && <p className="text-[10px] text-red-500">{errors.duracaoPrimeira}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] font-normal text-gray-700 dark:text-white/80">
                Duração retorno (min) *
              </Label>
              <Input
                type="number"
                min={15}
                step={5}
                value={formData.duracaoRetorno}
                onChange={(e) => setFormData({ ...formData, duracaoRetorno: Number(e.target.value) })}
                className={`h-11 rounded-[10px] dark:bg-app-bg-dark ${errors.duracaoRetorno ? 'border-red-500' : ''}`}
              />
              {errors.duracaoRetorno && <p className="text-[10px] text-red-500">{errors.duracaoRetorno}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="considerarFeriados"
              type="checkbox"
              checked={formData.considerarFeriados}
              onChange={(e) => setFormData({ ...formData, considerarFeriados: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#0039A6] focus:ring-[#0039A6]"
            />
            <Label htmlFor="considerarFeriados" className="text-[13px] font-normal text-gray-700 dark:text-white/80 cursor-pointer">
              Considerar feriados nacionais
            </Label>
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
              Gerar agenda
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}




