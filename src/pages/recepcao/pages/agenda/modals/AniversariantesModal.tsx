import { useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Cake, CheckSquare, Square } from 'lucide-react'
import { Aniversariante, mapPacientesToAniversariantes } from '@/mocks/shared/aniversariantes'

interface AniversariantesModalProps {
  isOpen: boolean
  onClose: () => void
}

const formatDateBR = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

export function AniversariantesModal({ isOpen, onClose }: AniversariantesModalProps) {
  const hoje = new Date()
  const [modo, setModo] = useState<'dia' | 'mes'>('dia')
  const [dataFiltro, setDataFiltro] = useState(hoje.toISOString().split('T')[0])
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>(() =>
    mapPacientesToAniversariantes(hoje)
  )

  const filtrados = useMemo(() => {
    const [ano, mes, dia] = dataFiltro.split('-').map(Number)
    return aniversariantes.filter((item) => {
      const [by, bm, bd] = item.dataNascimento.split('-').map(Number)
      if (modo === 'dia') return bm === mes && bd === dia
      return bm === mes
    })
  }, [aniversariantes, dataFiltro, modo])

  const toggleMensagem = (id: string) => {
    setAniversariantes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, mensagemEnviada: !item.mensagemEnviada } : item
      )
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[720px] bg-app-card dark:bg-app-card-dark rounded-[14px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0 p-6 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#0039A6]/10 flex items-center justify-center border border-[#0039A6]/20">
              <Cake className="h-6 w-6 text-[#0039A6]" />
            </div>
            <div>
              <DialogTitle className="text-xl font-normal text-app-text-primary dark:text-white">
                Lista de Aniversariantes
              </DialogTitle>
              <DialogDescription className="text-xs text-app-text-muted mt-0.5">
                Controle de mensagens de aniversario por dia ou mes.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-4 flex gap-3">
          <div className="flex rounded-[10px] border border-app-border dark:border-app-border-dark overflow-hidden">
            <button
              type="button"
              onClick={() => setModo('dia')}
              className={`h-10 px-4 text-sm ${modo === 'dia' ? 'bg-[#0039A6] text-white' : 'bg-app-card dark:bg-app-bg-dark text-app-text-secondary dark:text-white/80'}`}
            >
              Dia
            </button>
            <button
              type="button"
              onClick={() => setModo('mes')}
              className={`h-10 px-4 text-sm ${modo === 'mes' ? 'bg-[#0039A6] text-white' : 'bg-app-card dark:bg-app-bg-dark text-app-text-secondary dark:text-white/80'}`}
            >
              Mes
            </button>
          </div>
          <Input
            type="date"
            hideDateIcon
            value={dataFiltro}
            onChange={(e) => setDataFiltro(e.target.value)}
            className="h-10 max-w-[220px]"
          />
        </div>

        <div className="px-6 pb-6 overflow-auto">
          <div className="rounded-[12px] border border-app-border dark:border-app-border-dark overflow-hidden">
            <div className="grid grid-cols-12 bg-app-bg-secondary/60 dark:bg-app-bg-dark/60 border-b border-app-border dark:border-app-border-dark text-[11px] uppercase tracking-wider text-app-text-muted">
              <div className="col-span-4 px-4 py-3">Cliente</div>
              <div className="col-span-2 px-4 py-3">Nascimento</div>
              <div className="col-span-1 px-4 py-3">Idade</div>
              <div className="col-span-3 px-4 py-3">Telefone</div>
              <div className="col-span-2 px-4 py-3 text-center">OK mensagem</div>
            </div>

            {filtrados.length === 0 && (
              <div className="px-4 py-6 text-sm text-app-text-muted">Nenhum aniversariante para o filtro selecionado.</div>
            )}

            {filtrados.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 border-b last:border-b-0 border-app-border dark:border-app-border-dark items-center"
              >
                <div className="col-span-4 px-4 py-3 text-sm text-app-text-primary dark:text-white">{item.nome}</div>
                <div className="col-span-2 px-4 py-3 text-sm text-app-text-secondary dark:text-white/80">{formatDateBR(item.dataNascimento)}</div>
                <div className="col-span-1 px-4 py-3 text-sm text-app-text-secondary dark:text-white/80">{item.idade}</div>
                <div className="col-span-3 px-4 py-3 text-sm text-app-text-secondary dark:text-white/80">{item.telefone}</div>
                <div className="col-span-2 px-4 py-3 flex justify-center">
                  <button
                    type="button"
                    onClick={() => toggleMensagem(item.id)}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-[8px] hover:bg-app-bg-secondary dark:hover:bg-app-bg-dark transition-colors"
                    title="Marcar mensagem enviada"
                  >
                    {item.mensagemEnviada ? (
                      <CheckSquare className="h-5 w-5 text-[#0039A6]" />
                    ) : (
                      <Square className="h-5 w-5 text-app-text-muted" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6 flex justify-end">
          <Button variant="outline" onClick={onClose} className="h-10 px-5 rounded-[10px]">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

