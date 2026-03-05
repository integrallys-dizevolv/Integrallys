import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { PrescricaoAtiva, salvarAjustePosologia } from '@/services/especialistaPrescricoes.service'

export function AjustePosologiaModal({
  isOpen,
  onClose,
  prescricao,
}: {
  isOpen: boolean
  onClose: () => void
  prescricao: PrescricaoAtiva | null
}) {
  const [observacao, setObservacao] = useState('')
  const [produtos, setProdutos] = useState<PrescricaoAtiva['produtos']>([])

  useEffect(() => {
    if (!prescricao) return
    setProdutos(prescricao.produtos)
    setObservacao(prescricao.observacao || '')
  }, [prescricao])

  const handleSave = () => {
    if (!prescricao) return
    salvarAjustePosologia(prescricao.id, produtos, observacao)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[760px]">
        <DialogHeader>
          <DialogTitle>Ajuste de posologia</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {produtos.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-xl border p-3">
              <div>
                <Label>Produto</Label>
                <Input value={item.nome} readOnly />
              </div>
              <div>
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  value={item.quantidade}
                  onChange={(e) => {
                    const value = Number(e.target.value) || 1
                    setProdutos((prev) =>
                      prev.map((p, i) => (i === index ? { ...p, quantidade: value } : p)),
                    )
                  }}
                />
              </div>
              <div className="md:col-span-3">
                <Label>Posologia</Label>
                <Input
                  value={item.posologia}
                  onChange={(e) => {
                    const value = e.target.value
                    setProdutos((prev) =>
                      prev.map((p, i) => (i === index ? { ...p, posologia: value } : p)),
                    )
                  }}
                />
              </div>
            </div>
          ))}

          <div>
            <Label>Observação do Dr.</Label>
            <Textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} className="bg-[#0039A6] text-white hover:bg-[#002d82]">Salvar ajuste</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
