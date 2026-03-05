import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Boxes, ClipboardList } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/Breadcrumb'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  loadSuprimentos,
  loadSuprimentoMovs,
} from '@/services/suprimentos.service'
import type { SuprimentoItem, SuprimentoMovimentacao } from '@/mocks/suprimentos.mock'

interface SuprimentosViewProps {
  onPageChange?: (page: string) => void
}

export const SuprimentosView = ({ onPageChange }: SuprimentosViewProps) => {
  const [items, setItems] = useState<SuprimentoItem[]>(() => loadSuprimentos())
  const [movs, setMovs] = useState<SuprimentoMovimentacao[]>(() => loadSuprimentoMovs())

  useEffect(() => {
    const syncData = () => {
      setItems(loadSuprimentos())
      setMovs(loadSuprimentoMovs())
    }

    window.addEventListener('storage', syncData)
    return () => window.removeEventListener('storage', syncData)
  }, [])

  const baixos = useMemo(
    () => items.filter((item) => item.quantidadeAtual <= item.quantidadeMinima),
    [items],
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => onPageChange?.('inicio')}
              className="cursor-pointer text-app-text-primary/70 dark:text-white/80 hover:text-[#0039A6] dark:hover:text-white"
            >
              Início
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-app-text-primary dark:text-white font-normal">Suprimentos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-normal text-app-text-primary dark:text-white tracking-tight italic">Suprimentos</h1>
          <p className="text-app-text-secondary dark:text-white/60 mt-1">Controle de itens vinculados a procedimentos</p>
        </div>
        <Button className="h-10 px-4 bg-[#0039A6] hover:bg-[#002d82] text-white" onClick={() => {
          setItems(loadSuprimentos())
          setMovs(loadSuprimentoMovs())
        }}>
          Atualizar
        </Button>
      </div>

      {baixos.length > 0 && (
        <div className="rounded-xl border border-amber-200/70 bg-amber-50/80 dark:bg-amber-900/10 dark:border-amber-900/30 p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-700 dark:text-amber-400" />
          <p className="text-sm text-amber-800 dark:text-amber-300">{baixos.length} suprimento(s) em estoque mínimo ou abaixo.</p>
        </div>
      )}

      <Card className="rounded-2xl border border-app-border dark:border-app-border-dark">
        <CardContent className="p-0">
          <div className="px-5 py-4 border-b border-app-border/60 dark:border-app-border-dark/60 flex items-center gap-2">
            <Boxes className="h-4 w-4 text-app-text-muted" />
            <h3 className="text-base font-normal text-app-text-primary dark:text-white">Itens de suprimentos</h3>
          </div>
          <div className="p-5 space-y-3">
            {items.length === 0 ? (
              <p className="text-sm text-app-text-muted">Nenhum suprimento cadastrado.</p>
            ) : items.map((item) => {
              const isLow = item.quantidadeAtual <= item.quantidadeMinima
              return (
                <div key={item.id} className="rounded-xl border border-app-border dark:border-app-border-dark p-3 flex justify-between items-center gap-3">
                  <div>
                    <p className="text-sm font-normal text-app-text-primary dark:text-white">{item.nome}</p>
                    <p className="text-xs text-app-text-muted mt-1">
                      Lote: {item.lote || '-'} • Validade: {item.validade || '-'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-app-text-secondary dark:text-white/80">
                      {item.quantidadeAtual} {item.unidadeMedida} (mín: {item.quantidadeMinima})
                    </p>
                    <Badge className={isLow ? 'bg-amber-500 text-white border-none' : 'bg-emerald-600 text-white border-none'}>
                      {isLow ? 'Baixo' : 'Ok'}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-app-border dark:border-app-border-dark">
        <CardContent className="p-0">
          <div className="px-5 py-4 border-b border-app-border/60 dark:border-app-border-dark/60 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-app-text-muted" />
            <h3 className="text-base font-normal text-app-text-primary dark:text-white">Movimentações automáticas</h3>
          </div>
          <div className="p-5 space-y-3">
            {movs.length === 0 ? (
              <p className="text-sm text-app-text-muted">Ainda não há movimentações de suprimentos.</p>
            ) : movs.slice(0, 12).map((mov) => (
              <div key={mov.id} className="rounded-xl border border-app-border dark:border-app-border-dark p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-app-text-primary dark:text-white">{mov.suprimento}</p>
                  <Badge className={mov.tipo === 'entrada' ? 'bg-emerald-600 text-white border-none' : 'bg-red-600 text-white border-none'}>
                    {mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                  </Badge>
                </div>
                <p className="text-xs text-app-text-secondary dark:text-white/70 mt-1">
                  {mov.data} • {mov.procedimento} • Paciente: {mov.paciente}
                </p>
                <p className="text-xs text-app-text-muted mt-1">
                  Usuário: {mov.usuario} • Qtd: {mov.quantidade}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
