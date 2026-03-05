import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Label } from '@/components/ui/Label'
import { salvarPrescricaoComplementar } from '@/services/especialistaPrescricoes.service'

export function PrescricaoComplementarModal({
  isOpen,
  onClose,
  paciente,
}: {
  isOpen: boolean
  onClose: () => void
  paciente: string
}) {
  const [produto, setProduto] = useState('Vitamina D3 1000UI')
  const [quantidade, setQuantidade] = useState(1)
  const [valor, setValor] = useState(45)
  const [posologia, setPosologia] = useState('1 cápsula ao dia')
  const [formaPagamento, setFormaPagamento] = useState<'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito'>('dinheiro')

  const handleSave = async () => {
    await salvarPrescricaoComplementar(
      paciente,
      [{ nome: produto, quantidade, valorUnitario: valor, posologia }],
      formaPagamento,
    )
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[620px]">
        <DialogHeader>
          <DialogTitle>Prescrição complementar</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>Produto</Label>
            <Input value={produto} onChange={(e) => setProduto(e.target.value)} />
          </div>
          <div>
            <Label>Quantidade</Label>
            <Input type="number" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value) || 1)} />
          </div>
          <div>
            <Label>Valor unitário</Label>
            <Input type="number" value={valor} onChange={(e) => setValor(Number(e.target.value) || 0)} />
          </div>
          <div className="md:col-span-2">
            <Label>Posologia</Label>
            <Input value={posologia} onChange={(e) => setPosologia(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label>Forma de pagamento</Label>
            <Select value={formaPagamento} onValueChange={(v) => setFormaPagamento(v as typeof formaPagamento)}>
              <SelectTrigger><SelectValue preferPlaceholder placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="cartao_credito">Cartão Crédito</SelectItem>
                <SelectItem value="cartao_debito">Cartão Débito</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} className="bg-[#0039A6] text-white hover:bg-[#002d82]">Salvar complementar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
