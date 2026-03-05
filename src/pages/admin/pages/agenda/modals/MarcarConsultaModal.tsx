import React, { useState } from 'react'
import { Clock, User, Building, Phone, FileText, Fingerprint } from 'lucide-react'
import { Textarea } from '@/components/ui/Textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'

interface MarcarConsultaModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: {
    horario?: string
    data?: string
  }
}

export function MarcarConsultaModal({ isOpen, onClose, initialData }: MarcarConsultaModalProps) {
  const [formData, setFormData] = useState({
    paciente: '',
    cpf: '',
    telefone: '',
    especialista: '',
    data: initialData?.data || '',
    horario: initialData?.horario || '',
    tipo: '',
    unidade: '',
    observacoes: '',
  })

  // Mapeamento de unidades para exibiÃ§Ã£o formatada
  const unidadeLabels: Record<string, string> = {
    'central': 'ClÃ­nica Central',
    'norte': 'Unidade Norte',
    'sul': 'Unidade Sul'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] bg-app-card dark:bg-app-card-dark rounded-[14px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-normal">
            Marcar nova consulta
          </DialogTitle>
          <DialogDescription className="text-app-text-muted mt-1.5">
            Preencha os dados abaixo para realizar o agendamento.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5 pb-8">
          {/* Campo: Paciente */}
          <div className="space-y-1.5">
            <Label className="text-[13px] font-normal text-gray-700 dark:text-white/80">Paciente *</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-app-text-muted z-10" />
              <Input
                placeholder="Nome do paciente"
                value={formData.paciente}
                onChange={(e) => setFormData({ ...formData, paciente: e.target.value })}
                className="pl-11 h-11 rounded-[10px] bg-app-bg-secondary/50 dark:bg-app-bg-dark relative"
                required
              />
            </div>
          </div>

          {/* Grid: CPF e Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[13px] font-normal text-gray-700 dark:text-white/80">CPF</Label>
              <div className="relative">
                <Fingerprint className="absolute left-3 top-3 h-5 w-5 text-app-text-muted z-10" />
                <Input
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="pl-11 h-11 rounded-[10px] bg-app-bg-secondary/50 dark:bg-app-bg-dark"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] font-normal text-gray-700 dark:text-white/80">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-app-text-muted z-10" />
                <Input
                  placeholder="(00) 0 0000-0000"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="pl-11 h-11 rounded-[10px] bg-app-bg-secondary/50 dark:bg-app-bg-dark"
                />
              </div>
            </div>
          </div>

          {/* Campo: Especialista */}
          <div className="space-y-1.5">
            <Label className="text-[13px] font-normal text-gray-700 dark:text-white/80">Especialista *</Label>
            <Select value={formData.especialista} onValueChange={(v) => setFormData({ ...formData, especialista: v })}>
              <SelectTrigger className="h-11 rounded-[10px] dark:bg-app-bg-dark">
                <SelectValue preferPlaceholder placeholder="Selecione o profissional">
                  {formData.especialista === 'joao' ? 'Dr. JoÃ£o Silva' :
                    formData.especialista === 'maria' ? 'Dra. Maria Santos' : 'Selecione o profissional'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-[10px]">
                <SelectItem value="joao">Dr. JoÃ£o Silva</SelectItem>
                <SelectItem value="maria">Dra. Maria Santos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid: Data e HorÃ¡rio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[13px] font-normal">Data *</Label>
              <Input type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="h-11 rounded-[10px] dark:bg-app-bg-dark relative"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2 text-[13px] font-normal">
                <Clock className="h-4 w-4 text-[#0039A6]" /> HorÃ¡rio *
              </Label>
              <Input
                type="time"
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                className="h-11 rounded-[10px] dark:bg-app-bg-dark relative"
                required
              />
            </div>
          </div>

          {/* Grid: Tipo e Unidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[13px] font-normal">Tipo *</Label>
              <Select value={formData.tipo} onValueChange={(v) => setFormData({ ...formData, tipo: v })}>
                <SelectTrigger className="h-11 rounded-[10px] dark:bg-app-bg-dark">
                  <SelectValue preferPlaceholder placeholder="Selecione o tipo">
                    {formData.tipo ? formData.tipo.charAt(0).toUpperCase() + formData.tipo.slice(1) : 'Selecione o tipo'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-[10px]">
                  <SelectItem value="consulta">Consulta</SelectItem>
                  <SelectItem value="avaliacao">AvaliaÃ§Ã£o</SelectItem>
                  <SelectItem value="exame">Exame</SelectItem>
                  <SelectItem value="retorno">Retorno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2 text-[13px] font-normal">
                <Building className="h-4 w-4 text-[#0039A6]" /> Unidade *
              </Label>
              <Select value={formData.unidade} onValueChange={(v) => setFormData({ ...formData, unidade: v })}>
                <SelectTrigger className="h-11 rounded-[10px] dark:bg-app-bg-dark">
                  <SelectValue preferPlaceholder placeholder="Selecione a unidade">
                    {formData.unidade ? unidadeLabels[formData.unidade] || formData.unidade : 'Selecione a unidade'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-[10px]">
                  <SelectItem value="central">ClÃ­nica Central</SelectItem>
                  <SelectItem value="norte">Unidade Norte</SelectItem>
                  <SelectItem value="sul">Unidade Sul</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Campo: ObservaÃ§Ãµes */}
          <div className="space-y-1.5">
            <Label className="text-[13px] font-normal text-gray-700 dark:text-white/80">ObservaÃ§Ãµes</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-app-text-muted z-10" />
              <Textarea
                placeholder="Notas adicionais sobre o agendamento..."
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                className="pl-11 py-3 rounded-[10px] bg-app-bg-secondary/50 dark:bg-app-bg-dark min-h-[100px] resize-none"
              />
            </div>
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
              className="w-full sm:w-auto h-11 px-8 rounded-[10px] bg-[#0039A6] hover:bg-[#1d3b2e] text-white font-normal shadow-sm transition-all active:scale-[0.98]"
            >
              Agendar consulta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}



