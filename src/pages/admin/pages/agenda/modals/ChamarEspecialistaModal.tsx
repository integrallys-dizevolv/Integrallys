import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Bell } from 'lucide-react';

interface ChamarEspecialistaModalProps {
  isOpen: boolean;
  onClose: () => void;
  paciente?: string;
  horario?: string;
  tipo?: string;
}

export function ChamarEspecialistaModal({
  isOpen,
  onClose,
  paciente = "Maria Silva",
  horario = "08:00",
  tipo = "Consulta"
}: ChamarEspecialistaModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] bg-app-card dark:bg-app-card-dark">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-normal">
            <Bell className="h-5 w-5 text-[#0039A6]" />
            Chamar especialista
          </DialogTitle>
          <DialogDescription>
            Envie uma notificação de alta prioridade ao especialista
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-0 space-y-4">
          {/* Card de Informações da Consulta */}
          <div className="bg-app-bg-secondary dark:bg-app-bg-dark/50 rounded-[10px] p-3 space-y-1">
            <p className="text-sm font-medium text-app-text-primary dark:text-white">Paciente: {paciente}</p>
            <p className="text-xs text-[#4a5565] dark:text-app-text-muted">{horario} • {tipo}</p>
          </div>

          {/* Especialista */}
          <div className="space-y-2">
            <Label>Especialista *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue preferPlaceholder placeholder="Selecione o especialista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="joao">Dr. João Santos</SelectItem>
                <SelectItem value="ana">Dra. Ana Lima</SelectItem>
                <SelectItem value="sofia">Dra. Sofia Castro</SelectItem>
                <SelectItem value="flavia">Dra. Flávia Alves</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mensagem */}
          <div className="space-y-2">
            <Label>Mensagem (opcional)</Label>
            <Textarea
              placeholder="Ex: Paciente aguardando na recepção."
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto h-11 px-6 rounded-[10px]"
          >
            Cancelar
          </Button>
          <Button
            onClick={onClose}
            className="w-full sm:w-auto h-11 px-8 bg-[#0039A6] hover:bg-[#002d82] text-white font-normal rounded-[10px] shadow-sm transition-all active:scale-[0.98]"
          >
            Notificar agora
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

