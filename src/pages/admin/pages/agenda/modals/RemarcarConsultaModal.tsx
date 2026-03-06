import { Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';


interface RemarcarConsultaModalProps {
  isOpen: boolean;
  onClose: () => void;
  consulta?: {
    paciente: string;
    especialista: string;
    horario: string;
    tipo: string;
  };
}

export function RemarcarConsultaModal({
  isOpen,
  onClose,
  consulta = {
    paciente: "Maria Silva",
    especialista: "Dr. JoÃ£o Santos",
    horario: "08:00",
    tipo: "Consulta"
  }
}: RemarcarConsultaModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] bg-app-card dark:bg-app-card-dark">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-normal">
            <Calendar className="h-5 w-5 text-[#0039A6]" />
            Remarcar consulta
          </DialogTitle>
          <DialogDescription className="font-normal">
            Altere a data e horÃ¡rio da consulta agendada
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-0 space-y-4">
          {/* Card de Consulta Atual */}
          <div className="bg-app-bg-secondary dark:bg-app-bg-dark/50 rounded-[10px] p-4 space-y-2">
            <h4 className="text-sm font-normal text-app-text-primary dark:text-white uppercase tracking-wider">Consulta atual</h4>
            <div className="space-y-1 text-xs">
              <p className="text-[#4a5565] dark:text-app-text-muted font-normal">
                <span className="font-normal">Paciente:</span> {consulta.paciente}
              </p>
              <p className="text-[#4a5565] dark:text-app-text-muted font-normal">
                <span className="font-normal">Especialista:</span> {consulta.especialista}
              </p>
              <p className="text-[#4a5565] dark:text-app-text-muted font-normal">
                <span className="font-normal">HorÃ¡rio:</span> {consulta.horario}
              </p>
              <p className="text-[#4a5565] dark:text-app-text-muted font-normal">
                <span className="font-normal">Tipo:</span> {consulta.tipo}
              </p>
            </div>
          </div>

          {/* Nova Data e Novo HorÃ¡rio */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-normal">Nova data *</Label>
              <Input type="date"
                className="font-normal"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-normal">Novo horÃ¡rio *</Label>
              <Select>
                <SelectTrigger className="font-normal">
                  <SelectValue preferPlaceholder placeholder="HorÃ¡rio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00" className="font-normal">08:00</SelectItem>
                  <SelectItem value="08:30" className="font-normal">08:30</SelectItem>
                  <SelectItem value="09:00" className="font-normal">09:00</SelectItem>
                  <SelectItem value="09:30" className="font-normal">09:30</SelectItem>
                  <SelectItem value="10:00" className="font-normal">10:00</SelectItem>
                  <SelectItem value="10:30" className="font-normal">10:30</SelectItem>
                  <SelectItem value="11:00" className="font-normal">11:00</SelectItem>
                  <SelectItem value="14:00" className="font-normal">14:00</SelectItem>
                  <SelectItem value="14:30" className="font-normal">14:30</SelectItem>
                  <SelectItem value="15:00" className="font-normal">15:00</SelectItem>
                  <SelectItem value="15:30" className="font-normal">15:30</SelectItem>
                  <SelectItem value="16:00" className="font-normal">16:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Motivo da RemarcaÃ§Ã£o */}
          <div className="space-y-2">
            <Label className="font-normal">Motivo da remarcaÃ§Ã£o</Label>
            <Input
              placeholder="Motivo (opcional)"
              className="font-normal"
            />
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto h-11 px-6 rounded-[10px] font-normal"
          >
            Cancelar
          </Button>
          <Button
            onClick={onClose}
            className="w-full sm:w-auto h-11 px-8 bg-[#0039A6] hover:bg-[#002d82] text-white font-normal rounded-[10px] shadow-sm transition-all active:scale-[0.98]"
          >
            Remarcar agora
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}






