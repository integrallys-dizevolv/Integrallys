import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Clock, Users, MapPin, AlertCircle } from 'lucide-react'
import type { AgendaPersonalItem } from '@/types/agenda'

interface EditarCompromissoPayload {
  titulo: string;
  tipo: AgendaPersonalItem['tipo'];
  data: string;
  horario: string;
  duracao: string;
  local: string;
  participantes: string;
  descricao: string;
}

interface EditarCompromissoModalProps {
  isOpen: boolean;
  onClose: () => void;
  compromisso: AgendaPersonalItem | null;
  onSave: (id: number, data: EditarCompromissoPayload) => void;
}

export function EditarCompromissoModal({ isOpen, onClose, compromisso, onSave }: EditarCompromissoModalProps) {
  const [formData, setFormData] = useState<EditarCompromissoPayload>({
    titulo: '',
    tipo: 'Reunião',
    data: '',
    horario: '',
    duracao: '30',
    local: '',
    participantes: '',
    descricao: '',
  });

  useEffect(() => {
    if (compromisso) {
      setFormData({
        titulo: compromisso.titulo || '',
        tipo: compromisso.tipo || '',
        data: compromisso.data || '',
        horario: compromisso.hora || '',
        duracao: compromisso.duracao?.replace('min', '') || '30',
        local: compromisso.local || '',
        participantes: compromisso.participantes || '',
        descricao: compromisso.descricao || '',
      });
    }
  }, [compromisso]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compromisso) return;
    onSave(compromisso.id, formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] bg-app-card dark:bg-app-card-dark">
        <DialogHeader>
          <DialogTitle className="font-normal">Editar compromisso</DialogTitle>
          <DialogDescription className="font-normal">
            Edite os dados do compromisso agendado na sua agenda pessoal
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
          <div className="space-y-2">
            <Label className="font-normal">TÃ­tulo *</Label>
            <Input
              required
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ex: ReuniÃ£o de planejamento trimestral"
              className="font-normal"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-normal">Tipo de compromisso *</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  tipo: value as EditarCompromissoPayload['tipo'],
                })
              }
            >
              <SelectTrigger className="font-normal">
                <SelectValue preferPlaceholder placeholder="Selecione o tipo">
                  {formData.tipo ? (formData.tipo.charAt(0).toUpperCase() + formData.tipo.slice(1)) : 'Selecione o tipo'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ReuniÃ£o" className="font-normal">ReuniÃ£o</SelectItem>
                <SelectItem value="Tarefa" className="font-normal">Tarefa</SelectItem>
                <SelectItem value="Lembrete" className="font-normal">Lembrete</SelectItem>
                <SelectItem value="Evento" className="font-normal">Evento</SelectItem>
                <SelectItem value="AprovaÃ§Ã£o" className="font-normal">AprovaÃ§Ã£o</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
            <Label className="font-normal">Data *</Label>
              <Input type="date"
                required
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="font-normal"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-normal">
                <Clock className="h-4 w-4 text-[#0039A6]" />
                HorÃ¡rio *
              </Label>
              <Input
                type="time"
                required
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                className="font-normal"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-normal">DuraÃ§Ã£o</Label>
            <Select
              value={formData.duracao}
              onValueChange={(value) => setFormData({ ...formData, duracao: value })}
            >
              <SelectTrigger className="font-normal">
                <SelectValue>
                  {formData.duracao ? (
                    formData.duracao === "15" ? "15 minutos" :
                      formData.duracao === "30" ? "30 minutos" :
                        formData.duracao === "45" ? "45 minutos" :
                          formData.duracao === "60" ? "1 hora" :
                            formData.duracao === "90" ? "1 hora e 30 min" :
                              formData.duracao === "120" ? "2 horas" : formData.duracao
                  ) : 'Selecione a duraÃ§Ã£o'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15" className="font-normal">15 minutos</SelectItem>
                <SelectItem value="30" className="font-normal">30 minutos</SelectItem>
                <SelectItem value="45" className="font-normal">45 minutos</SelectItem>
                <SelectItem value="60" className="font-normal">1 hora</SelectItem>
                <SelectItem value="90" className="font-normal">1 hora e 30 min</SelectItem>
                <SelectItem value="120" className="font-normal">2 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-normal">
              <MapPin className="h-4 w-4 text-[#0039A6]" />
              Local
            </Label>
            <Input
              value={formData.local}
              onChange={(e) => setFormData({ ...formData, local: e.target.value })}
              placeholder="Ex: Sala de reuniÃµes 2 - Andar 3"
              className="font-normal"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-normal">
              <Users className="h-4 w-4 text-[#0039A6]" />
              Participantes
            </Label>
            <Input
              value={formData.participantes}
              onChange={(e) => setFormData({ ...formData, participantes: e.target.value })}
              placeholder="Ex: 8 pessoas"
              className="font-normal"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-normal">DescriÃ§Ã£o/observaÃ§Ãµes</Label>
            <Textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Adicione detalhes sobre o compromisso..."
              rows={3}
              className="resize-none font-normal"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-[8px] p-3 flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 dark:text-blue-300 leading-relaxed font-normal">
              As alteraÃ§Ãµes serÃ£o aplicadas imediatamente ao compromisso.
            </p>
          </div>

          <DialogFooter className="pt-2 gap-3 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto h-11 px-6 rounded-[10px] font-normal">
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto h-11 px-8 bg-[#0039A6] hover:bg-[#1d3b2e] text-white font-normal rounded-[10px] shadow-sm transition-all active:scale-[0.98]">
              Salvar alteraÃ§Ãµes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
