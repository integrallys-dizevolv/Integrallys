import React, { useState } from 'react'
import { DollarSign } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'

interface RegistrarRecebimentoModalProps {
  isOpen: boolean
  onClose: () => void
  paciente?: string
}

export function RegistrarRecebimentoModal({ isOpen, onClose, paciente = 'Maria Silva' }: RegistrarRecebimentoModalProps) {
  const [formData, setFormData] = useState({
    metodo: '',
    valor: '',
    observacao: '',
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
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[#0039A6]" />
            Registrar recebimento
          </DialogTitle>
          <DialogDescription>
            Registre o recebimento do paciente
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
          <div className="bg-app-bg-secondary dark:bg-app-bg-dark/50 rounded-lg p-3">
            <p className="text-sm font-medium text-app-text-primary dark:text-white">Paciente: {paciente}</p>
          </div>

          <div className="space-y-2">
            <Label>Método de pagamento *</Label>
            <Select value={formData.metodo} onValueChange={(value) => setFormData({ ...formData, metodo: value })}>
              <SelectTrigger>
                <SelectValue preferPlaceholder placeholder="Selecione o método">
                  {formData.metodo ? (
                    formData.metodo === 'dinheiro' ? 'Dinheiro' :
                      formData.metodo === 'pix' ? 'PIX' :
                        formData.metodo === 'debito' ? 'Cartão de Débito' :
                          formData.metodo === 'credito' ? 'Cartão de Crédito' :
                            formData.metodo === 'transferencia' ? 'Transferência' : formData.metodo
                  ) : 'Selecione o método'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="debito">Cartão de Débito</SelectItem>
                <SelectItem value="credito">Cartão de Crédito</SelectItem>
                <SelectItem value="transferencia">Transferência</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Valor (R$) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-app-text-secondary dark:text-app-text-muted">R$</span>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observação</Label>
            <Textarea
              placeholder="Informações adicionais sobre o recebimento..."
              rows={3}
              value={formData.observacao}
              onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
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
              className="w-full sm:w-auto h-11 px-8 bg-[#0039A6] hover:bg-[#1d3b2e] text-white font-normal rounded-[10px] shadow-sm transition-all active:scale-[0.98]"
            >
              Registrar recebimento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

