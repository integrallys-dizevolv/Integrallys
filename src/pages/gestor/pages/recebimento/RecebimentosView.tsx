import React, { useMemo, useState } from 'react'
import {
  Clock,
  TrendingUp,
  DollarSign,
  CreditCard,
  MoreVertical,
  Calendar,
  Check,
  Search,
  Plus
} from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/Breadcrumb'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { EmitirNovaCobrancaModal } from '@/pages/admin/pages/financeiro/modals/EmitirNovaCobrancaModal'
import {
  GestorRecebimento,
  MOCK_RECEBIMENTOS,
  RecebimentoForma
} from '@/mocks/gestor/recebimentos'
import { toast } from 'sonner'

type RecebimentoStatusFilter = 'todos' | 'liquidado' | 'a vencer' | 'atrasado'
type FormaFilter = 'todas' | 'pix' | 'dinheiro' | 'cartao debito' | 'cartao credito' | 'boleto'

const formatMoney = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`
const formatDateBR = (iso: string) => {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}
const toISO = (brDate: string) => {
  const [day, month, year] = brDate.split('/')
  return `${year}-${month}-${day}`
}

const FORMA_OPTIONS: RecebimentoForma[] = ['PIX', 'Dinheiro', 'Cartao Debito', 'Cartao Credito', 'Boleto']
const getFormaLabel = (forma: string) => {
  if (forma === 'Cartao Debito') return 'Cartão Débito'
  if (forma === 'Cartao Credito') return 'Cartão Crédito'
  return forma
}
const normalizeStatus = (status: string) => {
  const normalized = status.toLowerCase()
  return normalized === 'em aberto' ? 'a vencer' : normalized
}

export function RecebimentosView({ onPageChange }: { onPageChange: (page: string) => void }) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false)
  const [isEmitirCobrancaOpen, setIsEmitirCobrancaOpen] = useState(false)
  const [isNovoRecebimentoOpen, setIsNovoRecebimentoOpen] = useState(false)
  const [isResumoOpen, setIsResumoOpen] = useState(false)
  const [resumoTipo, setResumoTipo] = useState<'aberto' | 'liquidado' | 'atrasado' | null>(null)
  const [selectedRecebimento, setSelectedRecebimento] = useState<GestorRecebimento | null>(null)
  const [recebimentos, setRecebimentos] = useState<GestorRecebimento[]>(MOCK_RECEBIMENTOS)
  const [filters, setFilters] = useState({
    dataInicio: '',
    dataFim: '',
    cliente: '',
    especialidade: 'todas',
    profissional: 'todos',
    produto: 'todos',
    formaRecebimento: 'todas' as FormaFilter,
    status: 'todos' as RecebimentoStatusFilter
  })
  const [novoRecebimento, setNovoRecebimento] = useState({
    dataEmissao: '2026-02-21',
    devedor: '',
    descricao: '',
    valor: '',
    formaRecebimento: 'PIX' as RecebimentoForma,
    parcelamento: '1/1',
    dataVencimento: '2026-02-28',
    categoria: 'Atendimento',
    profissional: '',
    especialidade: '',
    produto: '-'
  })

  const especialidades = useMemo(
    () => ['todas', ...Array.from(new Set(recebimentos.map((item) => item.especialidade.toLowerCase())))],
    [recebimentos]
  )
  const profissionais = useMemo(
    () => ['todos', ...Array.from(new Set(recebimentos.map((item) => item.profissional)))],
    [recebimentos]
  )
  const produtos = useMemo(
    () => ['todos', ...Array.from(new Set(recebimentos.filter((item) => item.produto !== '-').map((item) => item.produto)))],
    [recebimentos]
  )

  const filteredData = useMemo(() => {
    return recebimentos.filter((item) => {
      if (filters.cliente && !item.devedor.toLowerCase().includes(filters.cliente.toLowerCase())) return false
      if (filters.status !== 'todos' && normalizeStatus(item.status) !== filters.status) return false
      if (filters.formaRecebimento !== 'todas' && item.formaRecebimento.toLowerCase() !== filters.formaRecebimento) return false
      if (filters.especialidade !== 'todas' && item.especialidade.toLowerCase() !== filters.especialidade) return false
      if (filters.profissional !== 'todos' && item.profissional !== filters.profissional) return false
      if (filters.produto !== 'todos' && item.produto !== filters.produto) return false
      if (filters.dataInicio && item.dataVencimento < filters.dataInicio) return false
      if (filters.dataFim && item.dataVencimento > filters.dataFim) return false
      return true
    })
  }, [filters, recebimentos])

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => {
        acc.totalRecebido += item.valorRecebido
        acc.totalAberto += item.saldoAReceber
        if (item.status === 'Atrasado') acc.totalAtrasado += item.saldoAReceber
        return acc
      },
      { totalRecebido: 0, totalAberto: 0, totalAtrasado: 0 }
    )
  }, [filteredData])

  const resumoItens = useMemo(() => {
    if (resumoTipo === 'aberto') {
      return filteredData.filter((item) => item.status === 'A Vencer' || item.status === 'Em Aberto')
    }
    if (resumoTipo === 'liquidado') {
      return filteredData.filter((item) => item.status === 'Liquidado')
    }
    if (resumoTipo === 'atrasado') {
      return filteredData.filter((item) => item.status === 'Atrasado')
    }
    return filteredData
  }, [filteredData, resumoTipo])

  const clearFilters = () => {
    setFilters({
      dataInicio: '',
      dataFim: '',
      cliente: '',
      especialidade: 'todas',
      profissional: 'todos',
      produto: 'todos',
      formaRecebimento: 'todas',
      status: 'todos'
    })
  }

  const handleConfirmRecebimento = () => {
    if (!selectedRecebimento) return
    setRecebimentos((prev) =>
      prev.map((item) =>
        item.id === selectedRecebimento.id
          ? {
            ...item,
            status: 'Liquidado',
            valorRecebido: item.valorTotal,
            saldoAReceber: 0
          }
          : item
      )
    )
    setIsConfirmModalOpen(false)
  }

  const handleSalvarNovoRecebimento = () => {
    const valorTotal = Number(String(novoRecebimento.valor).replace(',', '.')) || 0
    const novo: GestorRecebimento = {
      id: `manual-${Date.now()}`,
      numeroDocumento: `REC-MAN-${String(recebimentos.length + 1).padStart(4, '0')}`,
      parcela: novoRecebimento.parcelamento,
      devedor: novoRecebimento.devedor || 'Cliente não informado',
      descricao: novoRecebimento.descricao || 'Recebimento avulso',
      profissional: novoRecebimento.profissional || '-',
      especialidade: novoRecebimento.especialidade || '-',
      produto: novoRecebimento.produto || '-',
      categoria: novoRecebimento.categoria || 'Atendimento',
      dataEmissao: novoRecebimento.dataEmissao,
      dataVencimento: novoRecebimento.dataVencimento,
      formaRecebimento: novoRecebimento.formaRecebimento,
      valorTotal,
      valorRecebido: 0,
      saldoAReceber: valorTotal,
      status: 'A Vencer'
    }
    setRecebimentos((prev) => [novo, ...prev])
    setIsNovoRecebimentoOpen(false)
    setNovoRecebimento({
      dataEmissao: '2026-02-21',
      devedor: '',
      descricao: '',
      valor: '',
      formaRecebimento: 'PIX',
      parcelamento: '1/1',
      dataVencimento: '2026-02-28',
      categoria: 'Atendimento',
      profissional: '',
      especialidade: '',
      produto: '-'
    })
  }

  const handleEmitirCobranca = (item: GestorRecebimento) => {
    setSelectedRecebimento(item)
    setIsEmitirCobrancaOpen(true)
  }

  const handleVisualizarRecebimento = (item: GestorRecebimento) => {
    setSelectedRecebimento(item)
    setIsDetalhesOpen(true)
  }

  const handlePrintReceipt = (item: GestorRecebimento) => {
    const w = window.open('', '_blank', 'width=720,height=880')
    if (!w) {
      toast.error('Não foi possível abrir a visualização para impressão.')
      return
    }

    w.document.write(`
      <html>
        <head><title>Recibo de Recebimento</title></head>
        <body style="font-family: Arial, sans-serif; padding: 24px;">
          <h2>Recibo de Recebimento</h2>
          <p><strong>Documento:</strong> ${item.numeroDocumento}</p>
          <p><strong>Devedor:</strong> ${item.devedor}</p>
          <p><strong>Descrição:</strong> ${item.descricao}</p>
          <p><strong>Forma:</strong> ${item.formaRecebimento}</p>
          <p><strong>Valor total:</strong> ${formatMoney(item.valorTotal)}</p>
          <p><strong>Valor recebido:</strong> ${formatMoney(item.valorRecebido)}</p>
          <p><strong>Status:</strong> ${item.status}</p>
          <hr />
          <p style="margin-top: 18px;">Assinatura: ______________________________</p>
        </body>
      </html>
    `)
    w.document.close()
    w.focus()
    w.print()
  }

  const getStatusBadge = (status: GestorRecebimento['status']) => {
    switch (status) {
      case 'Liquidado':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-normal bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">Liquidado</span>
      case 'Em Aberto':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-normal bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">A Vencer</span>
      case 'A Vencer':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-normal bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">A Vencer</span>
      case 'Atrasado':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-normal bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">Atrasado</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => onPageChange('inicio')} className="text-sm font-normal text-app-text-muted hover:text-gray-900 dark:text-app-text-muted dark:hover:text-white transition-colors cursor-pointer">
              Início
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => onPageChange('financeiro')} className="text-sm font-normal text-app-text-muted hover:text-gray-900 dark:text-app-text-muted dark:hover:text-white transition-colors cursor-pointer">
              Financeiro
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm font-normal text-gray-900 dark:text-white">Recebimentos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'A Vencer / Futuro', value: formatMoney(totals.totalAberto), sub: 'Inclui saldo de pagamentos antecipados', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', summaryType: 'aberto' as const },
          { title: 'Total Liquidado', value: formatMoney(totals.totalRecebido), sub: 'Valores conciliados', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', summaryType: 'liquidado' as const },
          { title: 'Atrasados', value: formatMoney(totals.totalAtrasado), sub: 'Recebimentos vencidos', icon: DollarSign, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10', summaryType: 'atrasado' as const },
        ].map((kpi, i) => (
          <div
            key={i}
            onClick={() => {
              setResumoTipo(kpi.summaryType)
              setIsResumoOpen(true)
            }}
            className="p-8 bg-app-card dark:bg-[#020817] border border-gray-100 dark:border-app-border-dark shadow-sm rounded-[24px] flex flex-col justify-between hover:shadow-md transition-all duration-300 h-[210px] cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <p className="text-sm font-normal text-gray-600 dark:text-white/80">{kpi.title}</p>
                <h3 className="text-3xl font-normal text-[#0039A6] dark:text-white mt-1 tracking-tight">{kpi.value}</h3>
                <p className="text-xs text-app-text-muted font-normal">{kpi.sub}</p>
              </div>
              <div className={`p-4 rounded-2xl ${kpi.bg}`}>
                <kpi.icon size={24} className={kpi.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-app-card dark:bg-[#020817] rounded-[24px] border border-gray-100 dark:border-app-border-dark shadow-sm overflow-hidden">
        <div className="p-8 flex flex-col sm:flex-row justify-between items-center gap-6 border-b border-gray-50 dark:border-app-border-dark">
          <div>
            <h2 className="text-xl font-normal text-[#101828] dark:text-white">Fluxo de Recebimentos</h2>
            <p className="text-app-text-muted text-sm font-normal">Liquidado e a vencer/futuro com saldo de agendamentos antecipados.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNovoRecebimentoOpen(true)}
              className="h-11 px-5 rounded-xl border border-app-border dark:border-app-border-dark text-sm font-normal text-app-text-secondary dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-app-card/10 transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> Novo recebimento
            </button>
            <button className="h-11 px-6 rounded-xl bg-[#0039A6] hover:bg-[#002d82] text-white font-normal text-sm shadow-sm transition-all flex items-center justify-center gap-2">
              <CreditCard size={18} /> Exportar
            </button>
          </div>
        </div>

        <div className="px-8 py-6 border-b border-gray-100 dark:border-app-border-dark bg-app-bg-secondary/40 dark:bg-app-card/5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="relative xl:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted" />
              <Input
                value={filters.cliente}
                onChange={(e) => setFilters({ ...filters, cliente: e.target.value })}
                placeholder="Buscar cliente..."
                className="h-11 pl-9 bg-app-card dark:bg-app-bg-dark border-app-border dark:border-app-border-dark rounded-[10px]"
              />
            </div>
            <Input
              type="date"
              hideDateIcon
              value={filters.dataInicio}
              onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
              className="h-11 px-4 bg-app-card dark:bg-[#12211C] border border-[#dee2e6] dark:border-[#2d5a46] rounded-lg text-sm transition-all focus:ring-2 focus:ring-[#0039A6]/10 outline-none"
            />
            <Input
              type="date"
              hideDateIcon
              value={filters.dataFim}
              onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
              className="h-11 px-4 bg-app-card dark:bg-[#12211C] border border-[#dee2e6] dark:border-[#2d5a46] rounded-lg text-sm transition-all focus:ring-2 focus:ring-[#0039A6]/10 outline-none"
            />

            <select value={filters.especialidade} onChange={(e) => setFilters({ ...filters, especialidade: e.target.value })} className="h-11 px-3 bg-app-card dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark rounded-[10px] text-sm text-app-text-primary dark:text-white">
              <option value="todas">Todas especialidades</option>
              {especialidades.filter((e) => e !== 'todas').map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <select value={filters.profissional} onChange={(e) => setFilters({ ...filters, profissional: e.target.value })} className="h-11 px-3 bg-app-card dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark rounded-[10px] text-sm text-app-text-primary dark:text-white">
              {profissionais.map((item) => (
                <option key={item} value={item}>{item === 'todos' ? 'Todos os profissionais' : item}</option>
              ))}
            </select>

            <select value={filters.produto} onChange={(e) => setFilters({ ...filters, produto: e.target.value })} className="h-11 px-3 bg-app-card dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark rounded-[10px] text-sm text-app-text-primary dark:text-white">
              {produtos.map((item) => (
                <option key={item} value={item}>{item === 'todos' ? 'Todos os produtos' : item}</option>
              ))}
            </select>

            <select value={filters.formaRecebimento} onChange={(e) => setFilters({ ...filters, formaRecebimento: e.target.value as FormaFilter })} className="h-11 px-3 bg-app-card dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark rounded-[10px] text-sm text-app-text-primary dark:text-white">
              <option value="todas">Todas as formas</option>
              <option value="pix">PIX</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao debito">Cartão Débito</option>
              <option value="cartao credito">Cartão Crédito</option>
              <option value="boleto">Boleto</option>
            </select>

            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value as RecebimentoStatusFilter })} className="h-11 px-3 bg-app-card dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark rounded-[10px] text-sm text-app-text-primary dark:text-white">
              <option value="todos">Todos os status</option>
              <option value="liquidado">Liquidado</option>
              <option value="a vencer">A vencer</option>
              <option value="atrasado">Atrasado</option>
            </select>
          </div>

          <div className="flex justify-end mt-3">
            <button type="button" onClick={clearFilters} className="h-10 px-4 rounded-[10px] border border-app-border dark:border-app-border-dark text-sm text-app-text-secondary dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-app-card/10 transition-colors">
              Limpar filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <Table>
            <TableHeader className="bg-[#F9FAFB] dark:bg-app-card/5 border-b border-gray-100 dark:border-app-border-dark">
              <TableRow className="hover:bg-transparent">
                {['Documento', 'Parcela', 'Devedor', 'Descrição', 'Profissional', 'Especialidade', 'Produto', 'Emissão', 'Vencimento', 'Forma', 'Valor', 'Recebido', 'Saldo', 'Status', 'Ações'].map((h) => (
                  <TableHead key={h} className="px-6 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider whitespace-nowrap">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id} className="border-b border-gray-50 dark:border-app-border-dark hover:bg-app-bg-secondary/50 dark:hover:bg-app-card/5 transition-colors">
                  <TableCell className="px-6 py-4 text-xs text-app-text-secondary dark:text-white/70">{row.numeroDocumento}</TableCell>
                  <TableCell className="px-6 py-4 text-xs text-app-text-secondary dark:text-white/70">{row.parcela}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-[#0039A6] dark:text-blue-300 font-normal">{row.devedor}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-700 dark:text-white/80">{row.descricao}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-app-text-secondary dark:text-white/70">{row.profissional}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-app-text-secondary dark:text-white/70">{row.especialidade}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-app-text-secondary dark:text-white/70">{row.produto}</TableCell>
                  <TableCell className="px-6 py-4 text-xs text-app-text-muted">{formatDateBR(row.dataEmissao)}</TableCell>
                  <TableCell className="px-6 py-4 text-xs text-app-text-muted"><span className="inline-flex items-center gap-2"><Calendar size={14} /> {formatDateBR(row.dataVencimento)}</span></TableCell>
                  <TableCell className="px-6 py-4 text-xs text-app-text-muted">{getFormaLabel(row.formaRecebimento)}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-700 dark:text-white/80">{formatMoney(row.valorTotal)}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-emerald-600">{formatMoney(row.valorRecebido)}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-amber-600">{formatMoney(row.saldoAReceber)}</TableCell>
                  <TableCell className="px-6 py-4">{getStatusBadge(row.status)}</TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg text-app-text-muted hover:text-[#0039A6] transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px] rounded-xl p-2 border border-gray-100 dark:border-app-border-dark bg-app-card dark:bg-[#020817]">
                        <DropdownMenuItem
                          onClick={() => handleVisualizarRecebimento(row)}
                          className="flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-500/10"
                        >
                          <Search className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-normal text-gray-700 dark:text-gray-200">Visualizar detalhes</span>
                        </DropdownMenuItem>
                        {row.saldoAReceber > 0 && (
                          <DropdownMenuItem
                            onClick={() => handleEmitirCobranca(row)}
                            className="flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer focus:bg-indigo-50 dark:focus:bg-indigo-500/10"
                          >
                            <CreditCard className="w-5 h-5 text-indigo-500" />
                            <span className="text-sm font-normal text-gray-700 dark:text-gray-200">Emitir cobrança</span>
                          </DropdownMenuItem>
                        )}
                        {row.saldoAReceber > 0 && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedRecebimento(row)
                              setIsConfirmModalOpen(true)
                            }}
                            className="flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer focus:bg-emerald-50 dark:focus:bg-emerald-500/10"
                          >
                            <Check className="w-5 h-5 text-emerald-500" />
                            <span className="text-sm font-normal text-gray-700 dark:text-gray-200">Marcar como liquidado</span>
                          </DropdownMenuItem>
                        )}
                        {row.status === 'Liquidado' && (
                          <DropdownMenuItem
                            onClick={() => handlePrintReceipt(row)}
                            className="flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer focus:bg-emerald-50 dark:focus:bg-emerald-500/10"
                          >
                            <Check className="w-5 h-5 text-emerald-500" />
                            <span className="text-sm font-normal text-gray-700 dark:text-gray-200">Imprimir recibo</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="max-w-[500px] w-full p-0 overflow-hidden rounded-[24px] bg-app-card dark:bg-[#020817] border border-app-border dark:border-app-border-dark shadow-2xl">
          <DialogHeader className="px-8 pt-8 pb-5 bg-app-bg-secondary/50 dark:bg-app-card/5 border-b border-app-border dark:border-app-border-dark">
            <DialogTitle className="text-2xl font-normal text-[#0039A6] dark:text-white">Confirmar Recebimento</DialogTitle>
          </DialogHeader>
          <div className="px-8 py-6 space-y-5">
            <div className="bg-app-bg-secondary dark:bg-[#020817] p-5 rounded-[16px] border border-gray-100 dark:border-app-border-dark space-y-3">
              <div>
                <p className="text-xs text-app-text-muted mb-1">Valor restante</p>
                <p className="text-3xl font-normal text-emerald-600 tracking-tight">{formatMoney(selectedRecebimento?.saldoAReceber || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-app-text-muted mb-1">Cliente</p>
                <p className="text-sm font-normal text-gray-700 dark:text-white">{selectedRecebimento?.devedor}</p>
              </div>
            </div>
          </div>
          <DialogFooter className="px-8 py-6 bg-app-bg-secondary/50 dark:bg-app-card/5 flex gap-3 border-t border-app-border dark:border-app-border-dark">
            <button onClick={() => setIsConfirmModalOpen(false)} className="flex-1 h-11 font-normal text-app-text-muted rounded-xl border border-app-border dark:border-app-border-dark">
              Cancelar
            </button>
            <button onClick={handleConfirmRecebimento} className="flex-1 h-11 bg-[#0039A6] text-white font-normal rounded-xl shadow-sm">
              Confirmar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetalhesOpen} onOpenChange={setIsDetalhesOpen}>
        <DialogContent className="max-w-[560px] w-full p-0 overflow-hidden rounded-[24px] bg-app-card dark:bg-[#020817] border border-app-border dark:border-app-border-dark shadow-2xl">
          <DialogHeader className="px-8 pt-8 pb-5 border-b border-app-border dark:border-app-border-dark">
            <DialogTitle className="text-2xl font-normal text-[#0039A6] dark:text-white">Detalhes do Recebimento</DialogTitle>
            <DialogDescription className="text-sm text-app-text-muted">
              Documento {selectedRecebimento?.numeroDocumento}
            </DialogDescription>
          </DialogHeader>
          <div className="px-8 py-6 space-y-3 text-sm">
            <p><strong>Devedor:</strong> {selectedRecebimento?.devedor}</p>
            <p><strong>Descrição:</strong> {selectedRecebimento?.descricao}</p>
            <p><strong>Profissional:</strong> {selectedRecebimento?.profissional}</p>
            <p><strong>Especialidade:</strong> {selectedRecebimento?.especialidade}</p>
            <p><strong>Forma:</strong> {selectedRecebimento?.formaRecebimento}</p>
            <p><strong>Status:</strong> {selectedRecebimento?.status}</p>
            <p><strong>Valor Total:</strong> {formatMoney(selectedRecebimento?.valorTotal || 0)}</p>
            <p><strong>Recebido:</strong> {formatMoney(selectedRecebimento?.valorRecebido || 0)}</p>
            <p><strong>Saldo:</strong> {formatMoney(selectedRecebimento?.saldoAReceber || 0)}</p>
          </div>
          <DialogFooter className="px-8 py-6 border-t border-app-border dark:border-app-border-dark">
            <button onClick={() => setIsDetalhesOpen(false)} className="h-11 px-6 font-normal text-app-text-muted rounded-xl border border-app-border dark:border-app-border-dark">
              Fechar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EmitirNovaCobrancaModal
        isOpen={isEmitirCobrancaOpen}
        onClose={() => setIsEmitirCobrancaOpen(false)}
        paciente={selectedRecebimento?.devedor}
        profissional={selectedRecebimento?.profissional}
        procedimento={selectedRecebimento?.descricao}
        valorProcedimento={selectedRecebimento?.valorTotal}
        pagamentos={
          selectedRecebimento && selectedRecebimento.valorRecebido > 0
            ? [{
                data: selectedRecebimento.dataEmissao,
                valor: selectedRecebimento.valorRecebido,
                metodo: selectedRecebimento.formaRecebimento
              }]
            : []
        }
      />

      <Dialog open={isNovoRecebimentoOpen} onOpenChange={setIsNovoRecebimentoOpen}>
        <DialogContent className="max-w-[720px] w-full p-0 overflow-hidden rounded-[24px] bg-app-card dark:bg-[#020817] border border-app-border dark:border-app-border-dark shadow-2xl">
          <DialogHeader className="px-8 pt-8 pb-5 border-b border-app-border dark:border-app-border-dark">
            <DialogTitle className="text-2xl font-normal text-[#0039A6] dark:text-white">Novo recebimento manual</DialogTitle>
          </DialogHeader>
          <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              hideDateIcon
              value={novoRecebimento.dataEmissao}
              onChange={(e) => setNovoRecebimento({ ...novoRecebimento, dataEmissao: e.target.value })}
              className="h-11 px-4 bg-app-card dark:bg-[#12211C] border border-[#dee2e6] dark:border-[#2d5a46] rounded-lg text-sm transition-all focus:ring-2 focus:ring-[#0039A6]/10 outline-none"
            />
            <Input
              type="date"
              hideDateIcon
              value={novoRecebimento.dataVencimento}
              onChange={(e) => setNovoRecebimento({ ...novoRecebimento, dataVencimento: e.target.value })}
              className="h-11 px-4 bg-app-card dark:bg-[#12211C] border border-[#dee2e6] dark:border-[#2d5a46] rounded-lg text-sm transition-all focus:ring-2 focus:ring-[#0039A6]/10 outline-none"
            />
            <Input placeholder="Devedor" value={novoRecebimento.devedor} onChange={(e) => setNovoRecebimento({ ...novoRecebimento, devedor: e.target.value })} />
            <Input placeholder="Valor" value={novoRecebimento.valor} onChange={(e) => setNovoRecebimento({ ...novoRecebimento, valor: e.target.value })} />
            <Input placeholder="Descrição" value={novoRecebimento.descricao} onChange={(e) => setNovoRecebimento({ ...novoRecebimento, descricao: e.target.value })} className="md:col-span-2" />
            <Input placeholder="Categoria DRE" value={novoRecebimento.categoria} onChange={(e) => setNovoRecebimento({ ...novoRecebimento, categoria: e.target.value })} />

            <select value={novoRecebimento.formaRecebimento} onChange={(e) => setNovoRecebimento({ ...novoRecebimento, formaRecebimento: e.target.value as RecebimentoForma })} className="h-11 px-3 bg-app-card dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark rounded-[10px] text-sm text-app-text-primary dark:text-white">
              {FORMA_OPTIONS.map((forma) => <option key={forma} value={forma}>{getFormaLabel(forma)}</option>)}
            </select>

            <select value={novoRecebimento.parcelamento} onChange={(e) => setNovoRecebimento({ ...novoRecebimento, parcelamento: e.target.value })} className="h-11 px-3 bg-app-card dark:bg-app-bg-dark border border-app-border dark:border-app-border-dark rounded-[10px] text-sm text-app-text-primary dark:text-white">
              {['1/1', '1/2', '1/3', '1/6', '1/10'].map((p) => <option key={p} value={p}>{p}</option>)}
            </select>

            <Input placeholder="Profissional" value={novoRecebimento.profissional} onChange={(e) => setNovoRecebimento({ ...novoRecebimento, profissional: e.target.value })} />
            <Input placeholder="Especialidade" value={novoRecebimento.especialidade} onChange={(e) => setNovoRecebimento({ ...novoRecebimento, especialidade: e.target.value })} />
            <Input placeholder="Produto (opcional)" value={novoRecebimento.produto} onChange={(e) => setNovoRecebimento({ ...novoRecebimento, produto: e.target.value })} />
          </div>
          <DialogFooter className="px-8 py-6 bg-app-bg-secondary/50 dark:bg-app-card/5 flex gap-3 border-t border-app-border dark:border-app-border-dark">
            <button onClick={() => setIsNovoRecebimentoOpen(false)} className="h-11 px-6 font-normal text-app-text-muted rounded-xl border border-app-border dark:border-app-border-dark">
              Cancelar
            </button>
            <button onClick={handleSalvarNovoRecebimento} className="h-11 px-6 bg-[#0039A6] text-white font-normal rounded-xl shadow-sm">
              Salvar recebimento
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isResumoOpen} onOpenChange={setIsResumoOpen}>
        <DialogContent className="max-w-[680px] w-full p-0 overflow-hidden rounded-[24px] bg-app-card dark:bg-[#020817] border border-app-border dark:border-app-border-dark shadow-2xl">
          <DialogHeader className="px-8 pt-8 pb-5 border-b border-app-border dark:border-app-border-dark">
            <DialogTitle className="text-2xl font-normal text-[#0039A6] dark:text-white">
              {resumoTipo === 'aberto' && 'Detalhamento — A Vencer / Futuro'}
              {resumoTipo === 'liquidado' && 'Detalhamento — Total Liquidado'}
              {resumoTipo === 'atrasado' && 'Detalhamento — Atrasados'}
            </DialogTitle>
            <DialogDescription>{resumoItens.length} registro(s) conforme filtros aplicados.</DialogDescription>
          </DialogHeader>

          <div className="px-8 py-6 space-y-3 max-h-[55vh] overflow-y-auto">
            {resumoItens.length === 0 ? (
              <p className="text-sm text-app-text-muted">Nenhum recebimento encontrado.</p>
            ) : resumoItens.map((item) => (
              <div key={item.id} className="rounded-xl border border-app-border dark:border-app-border-dark p-3">
                <p className="text-sm font-normal text-app-text-primary dark:text-white">{item.devedor}</p>
                <p className="text-xs text-app-text-secondary dark:text-white/70">{item.descricao} • {formatDateBR(item.dataVencimento)}</p>
                <p className="text-xs text-app-text-muted">{getFormaLabel(item.formaRecebimento)} • {item.status} • {formatMoney(item.saldoAReceber > 0 ? item.saldoAReceber : item.valorRecebido)}</p>
              </div>
            ))}
          </div>

          <DialogFooter className="px-8 py-6 border-t border-app-border dark:border-app-border-dark">
            <button onClick={() => setIsResumoOpen(false)} className="h-11 px-6 font-normal text-app-text-muted rounded-xl border border-app-border dark:border-app-border-dark">
              Fechar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
