import React, { useState } from 'react'
import { Clock, Users, MapPin } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'

interface AgendarReuniaoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AgendarReuniaoModal({ isOpen, onClose }: AgendarReuniaoModalProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: '',
    data: '',
    horario: '',
    duracao: '30',
    local: '',
    participantes: '',
    descricao: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Integrar com Supabase
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] bg-app-card dark:bg-app-card-dark">
        <DialogHeader>
          <DialogTitle>Agendar reuniÃ£o</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar uma nova reuniÃ£o
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>TÃ­tulo da reuniÃ£o *</Label>
            <Input
              placeholder="Ex: ReuniÃ£o de Planejamento Trimestral"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de compromisso *</Label>
            <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
              <SelectTrigger>
                <SelectValue preferPlaceholder placeholder="Selecione o tipo">
                  {formData.tipo || 'Selecione o tipo'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ReuniÃ£o">ReuniÃ£o</SelectItem>
                <SelectItem value="Tarefa">Tarefa</SelectItem>
                <SelectItem value="Lembrete">Lembrete</SelectItem>
                <SelectItem value="Evento">Evento</SelectItem>
                <SelectItem value="AprovaÃ§Ã£o">AprovaÃ§Ã£o</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data *</Label>
              <Input type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#0039A6]" />
                HorÃ¡rio *
              </Label>
              <Input
                type="time"
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>DuraÃ§Ã£o</Label>
            <Select value={formData.duracao} onValueChange={(value) => setFormData({ ...formData, duracao: value })}>
              <SelectTrigger>
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
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="45">45 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="90">1 hora e 30 min</SelectItem>
                <SelectItem value="120">2 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#0039A6]" />
              Local
            </Label>
            <Input
              placeholder="Ex: Sala de ReuniÃµes 2 - Andar 3"
              value={formData.local}
              onChange={(e) => setFormData({ ...formData, local: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#0039A6]" />
              Participantes
            </Label>
            <Input
              placeholder="Ex: 8 pessoas"
              value={formData.participantes}
              onChange={(e) => setFormData({ ...formData, participantes: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>DescriÃ§Ã£o/ObservaÃ§Ãµes</Label>
            <Textarea
              placeholder="Adicione detalhes sobre a reuniÃ£o..."
              rows={3}
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            />
          </div>

          <DialogFooter className="pt-2 gap-3 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto h-11 px-6 rounded-[10px]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto h-11 px-8 bg-[#0039A6] hover:bg-[#002d82] text-white font-normal rounded-[10px] shadow-sm transition-all active:scale-[0.98]"
            >
              Agendar reuniÃ£o
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}




