import {
  Calendar,
  Users,
  Activity,
  FileDown,
  DollarSign,
  Download,
  TrendingUp as TrendingUpIcon
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Card } from '@/components/ui/Card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { loadPrescricoesAtivas, type PrescricaoAtiva } from '@/services/especialistaPrescricoes.service'
import {
  getRelatoriosEspecialistaDesempenho,
  getRelatoriosEspecialistaRepasses,
  type EspecialistaDesempenhoData,
  type RelatorioPeriodo,
} from '@/services/relatorios.service'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { PageHeader } from '../../ui'
import { Button } from '@/components/ui/Button'

interface RelatoriosViewProps {
  onPageChange: (page: string) => void
}

const MOCK_COMISSOES_PRESCRICOES = [
  {
    id: 'pv-1281',
    data: '21/11/2025',
    descricao: 'Prescrição/Vendas #1281',
    cliente: 'Maria Silva Santos',
    valorBruto: 385.0,
    percentual: 10,
    valorComissao: 38.5,
    produtos: [
      { nome: 'Vitamina D3 1000UI', quantidade: 2, valorUnitario: 45 },
      { nome: 'Omega 3 Premium', quantidade: 1, valorUnitario: 95 },
      { nome: 'Probiotico 30 caps', quantidade: 1, valorUnitario: 200 },
    ]
  },
  {
    id: 'pv-1280',
    data: '20/11/2025',
    descricao: 'Prescrição/Vendas #1280',
    cliente: 'Joao Pedro Costa',
    valorBruto: 250.0,
    percentual: 10,
    valorComissao: 25.0,
    produtos: [
      { nome: 'Colageno Verisol', quantidade: 1, valorUnitario: 120 },
      { nome: 'Magnesio Quelato', quantidade: 2, valorUnitario: 65 },
    ]
  },
  {
    id: 'pv-1278',
    data: '19/11/2025',
    descricao: 'Prescrição/Vendas #1278',
    cliente: 'Ana Carolina Lima',
    valorBruto: 120.0,
    percentual: 5,
    valorComissao: 6.0,
    produtos: [
      { nome: 'Zinco + Vitamina C', quantidade: 1, valorUnitario: 120 },
    ]
  }
]

const EMPTY_DESEMPENHO: EspecialistaDesempenhoData = {
  resumo: {
    consultasRealizadas: 0,
    pacientesAtivos: 0,
    consultasUrgencia: 0,
    mediaMensal: 0,
    taxaOcupacao: 0,
    taxaRetorno: 0,
    satisfacao: 0,
    satisfacaoPercentual: 0,
  },
  consultasPorMes: [],
  distribuicaoProcedimentos: [],
}

export const RelatoriosView = ({ onPageChange }: RelatoriosViewProps) => {
  const [activeTab, setActiveTab] = useState<'desempenho' | 'repasses' | 'comissoes'>('desempenho')
  const [comissaoSelecionada, setComissaoSelecionada] = useState<(typeof MOCK_COMISSOES_PRESCRICOES)[number] | null>(null)
  const [prescricoesAtivas, setPrescricoesAtivas] = useState<PrescricaoAtiva[]>([])
  const [desempenhoData, setDesempenhoData] = useState<EspecialistaDesempenhoData>(EMPTY_DESEMPENHO)
  const [repassesData, setRepassesData] = useState<Awaited<ReturnType<typeof getRelatoriosEspecialistaRepasses>>>([])
  const [periodoSelecionado, setPeriodoSelecionado] = useState<RelatorioPeriodo>('30d')

  useEffect(() => {
    const syncFromStorage = () => {
      setPrescricoesAtivas(loadPrescricoesAtivas())
    }

    syncFromStorage()
    window.addEventListener('storage', syncFromStorage)
    return () => window.removeEventListener('storage', syncFromStorage)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      const [desempenho, repasses] = await Promise.all([
        getRelatoriosEspecialistaDesempenho(periodoSelecionado),
        getRelatoriosEspecialistaRepasses(),
      ])
      setDesempenhoData(desempenho)
      setRepassesData(repasses)
    }

    loadData()
  }, [periodoSelecionado])

  const comissoesData = useMemo(() => {
    if (prescricoesAtivas.length === 0) return MOCK_COMISSOES_PRESCRICOES

    return prescricoesAtivas.map((prescricao) => {
      const valorBruto = prescricao.produtos.reduce(
        (acc, produto) => acc + produto.quantidade * produto.valorUnitario,
        0,
      )
      const percentual = prescricao.tipo === 'complementar' ? 10 : 5

      return {
        id: prescricao.id,
        data: formatDateToBr(prescricao.data),
        descricao: `Prescrição/Vendas #${prescricao.id.slice(-4)}`,
        cliente: prescricao.paciente,
        valorBruto,
        percentual,
        valorComissao: Number(((valorBruto * percentual) / 100).toFixed(2)),
        produtos: prescricao.produtos.map((produto) => ({
          nome: produto.nome,
          quantidade: produto.quantidade,
          valorUnitario: produto.valorUnitario,
        })),
      }
    })
  }, [prescricoesAtivas])

  const totalPrescricoes = useMemo(
    () => comissoesData.reduce((acc, item) => acc + item.valorBruto, 0),
    [comissoesData],
  )

  const totalComissaoProdutos = useMemo(
    () => comissoesData.reduce((acc, item) => acc + item.valorComissao, 0),
    [comissoesData],
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <PageHeader
        title="Relatorios pessoais"
        subtitle="Acompanhe suas estatisticas e performance"
        onPageChange={onPageChange}
        breadcrumbs={[{ label: 'Relatorios', isCurrent: true }]}
        extra={
          <Button className="bg-[#0039A6] hover:bg-[#002d82] text-white flex items-center gap-2 px-4 h-11 rounded-[10px] font-normal transition-all shadow-md">
            <FileDown className="h-4 w-4" />
            Exportar PDF
          </Button>
        }
      />

      <div className="flex justify-center mb-8">
        <div className="w-full max-w-md">
          <SegmentedControl
            options={[
              { value: 'desempenho', label: 'Desempenho geral' },
              { value: 'repasses', label: 'Meus repasses' },
              { value: 'comissoes', label: 'Minhas comissoes' }
            ]}
            value={activeTab}
            onChange={(val) => setActiveTab(val as 'desempenho' | 'repasses' | 'comissoes')}
          />
        </div>
      </div>

      {activeTab === 'desempenho' ? (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 justify-end">
            {[
              ['7d', '7 dias'],
              ['30d', '30 dias'],
              ['90d', '90 dias'],
              ['12m', '12 meses'],
              ['all', 'Todo periodo'],
            ].map(([id, label]) => (
              <Button
                key={id}
                type="button"
                variant={periodoSelecionado === id ? 'primary' : 'outline'}
                onClick={() => setPeriodoSelecionado(id as RelatorioPeriodo)}
                className={periodoSelecionado === id ? 'bg-[#0039A6] text-white' : ''}
              >
                {label}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Consultas realizadas"
              value={String(desempenhoData.resumo.consultasRealizadas)}
              subtitle="consultas no periodo"
              icon={Calendar}
            />
            <SummaryCard
              title="Pacientes unicos"
              value={String(desempenhoData.resumo.pacientesAtivos)}
              subtitle="pacientes unicos atendidos"
              icon={Users}
            />
            <SummaryCard
              title="Consultas de urgencia"
              value={String(desempenhoData.resumo.consultasUrgencia)}
              subtitle="agendamentos urgentes"
              icon={TrendingUpIcon}
            />
            <SummaryCard
              title="Percentual satisfacao"
              value={`${desempenhoData.resumo.satisfacaoPercentual}%`}
              subtitle="media das notas de avaliacao"
              icon={Activity}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-app-card-dark p-8 rounded-[20px] shadow-sm border border-gray-100 dark:border-gray-800/50">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-normal text-gray-900 dark:text-white">Consultas por mes</h3>
              </div>
              <div className="h-[320px] w-full">
                {desempenhoData.consultasPorMes.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-app-text-muted">
                    <div className="text-center">
                      <Activity className="h-6 w-6 mx-auto mb-2" />
                      <p>Sem dados no período selecionado</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={desempenhoData.consultasPorMes} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 400 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 400 }}
                      domain={[0, 80]}
                      ticks={[0, 20, 40, 60, 80]}
                    />
                    <Tooltip
                      cursor={{ fill: '#f3f4f6', opacity: 0.6 }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-app-bg-dark p-4 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 min-w-[150px]">
                              <p className="font-normal text-gray-900 dark:text-white mb-2">{label}</p>
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-2 text-[13px] text-app-text-muted font-normal">
                                    <span className="w-2 h-2 rounded-full bg-[#8c8cf5]"></span>
                                    Consultas:
                                  </div>
                                  <span className="font-normal text-[#8c8cf5]">{payload[0].value}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-2 text-[13px] text-app-text-muted font-normal">
                                    <span className="w-2 h-2 rounded-full bg-[#70d9a6]"></span>
                                    Pacientes unicos:
                                  </div>
                                  <span className="font-normal text-[#70d9a6]">{payload[1].value}</span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="consultas" fill="#8c8cf5" radius={[2, 2, 0, 0]} barSize={8} />
                    <Bar dataKey="pacientes" fill="#70d9a6" radius={[2, 2, 0, 0]} barSize={8} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-app-card-dark p-8 rounded-[20px] shadow-sm border border-gray-100 dark:border-gray-800/50">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-normal text-gray-900 dark:text-white">Distribuicao de procedimentos</h3>
              </div>
              <div className="h-[320px] w-full flex items-center justify-center relative">
                {desempenhoData.distribuicaoProcedimentos.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-app-text-muted">
                    <div className="text-center">
                      <Activity className="h-6 w-6 mx-auto mb-2" />
                      <p>Sem dados no período selecionado</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                      data={desempenhoData.distribuicaoProcedimentos}
                      innerRadius={0}
                      outerRadius={100}
                      paddingAngle={0}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {desempenhoData.distribuicaoProcedimentos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="absolute inset-0 pointer-events-none text-[12px] font-normal p-2">
                  {desempenhoData.distribuicaoProcedimentos[0] && (
                    <div className="absolute top-2 left-2" style={{ color: desempenhoData.distribuicaoProcedimentos[0].color }}>
                      {desempenhoData.distribuicaoProcedimentos[0].name} ({desempenhoData.distribuicaoProcedimentos[0].value}%)
                    </div>
                  )}
                  {desempenhoData.distribuicaoProcedimentos[1] && (
                    <div className="absolute top-2 right-2 text-right" style={{ color: desempenhoData.distribuicaoProcedimentos[1].color }}>
                      {desempenhoData.distribuicaoProcedimentos[1].name} ({desempenhoData.distribuicaoProcedimentos[1].value}%)
                    </div>
                  )}
                  {desempenhoData.distribuicaoProcedimentos[2] && (
                    <div className="absolute bottom-2 left-2" style={{ color: desempenhoData.distribuicaoProcedimentos[2].color }}>
                      {desempenhoData.distribuicaoProcedimentos[2].name} ({desempenhoData.distribuicaoProcedimentos[2].value}%)
                    </div>
                  )}
                  {desempenhoData.distribuicaoProcedimentos[3] && (
                    <div className="absolute bottom-2 right-2 text-right" style={{ color: desempenhoData.distribuicaoProcedimentos[3].color }}>
                      {desempenhoData.distribuicaoProcedimentos[3].name} ({desempenhoData.distribuicaoProcedimentos[3].value}%)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Card className="bg-white dark:bg-app-card-dark p-8 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800/50">
            <h3 className="text-[17px] font-normal text-app-text-muted dark:text-app-text-muted tracking-wider mb-10">Estatisticas detalhadas</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-10">
              <div className="space-y-8">
                <h4 className="text-xl font-normal text-gray-900 dark:text-white">Performance geral</h4>
                <div className="space-y-4">
                  <StatLine label="Taxa de retorno:" value={`${desempenhoData.resumo.taxaRetorno}%`} />
                  <StatLine label="Satisfacao:" value={`${desempenhoData.resumo.satisfacao}/5`} />
                  <StatLine label="Pontualidade:" value="92%" />
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-xl font-normal text-gray-900 dark:text-white">Tempo medio</h4>
                <div className="space-y-4">
                  <StatLine label="Por consulta:" value="35 min" />
                  <StatLine label="Entre consultas:" value="5 min" />
                  <StatLine label="Espera do paciente:" value="8 min" />
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-xl font-normal text-gray-900 dark:text-white">Faixa etaria</h4>
                <div className="space-y-4">
                  <StatLine label="18-30 anos:" value="15%" />
                  <StatLine label="31-50 anos:" value="45%" />
                  <StatLine label="51+ anos:" value="40%" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : activeTab === 'repasses' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row justify-end items-center gap-3 md:gap-4 w-full">
            <Button className="flex flex-row items-center justify-center gap-2 h-11 px-4 bg-[#0039A6] hover:bg-[#002d82] text-white rounded-xl whitespace-nowrap w-full sm:w-auto min-w-fit shrink-0 transition-all active:scale-95 font-normal shadow-sm">
              <Download className="h-4 w-4 shrink-0" />
              <span className="text-sm leading-none">Baixar relatorio</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-[21px] bg-white dark:bg-[#1a2e23] border-[#dee2e6] dark:border-app-border-dark hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6c757d] dark:text-app-text-muted font-normal tracking-wider mb-1">Total em repasses</p>
                  <p className="text-2xl font-normal text-app-text-primary dark:text-white">R$ {repassesData.reduce((acc, item) => acc + item.valorRepasse, 0).toFixed(2)}</p>
                </div>
                <div className="bg-[#e6f0ff] dark:bg-[#0039A6]/20 p-3 rounded-2xl">
                  <DollarSign className="h-6 w-6 text-[#0039A6]" />
                </div>
              </div>
            </Card>

            <Card className="p-[21px] bg-white dark:bg-[#1a2e23] border-[#dee2e6] dark:border-app-border-dark hover:shadow-md transition-shadow border-l-4 border-l-[#0039A6]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6c757d] dark:text-app-text-muted font-normal tracking-wider mb-1">Percentual repasse</p>
                  <p className="text-2xl font-normal text-[#00a63e]">{Math.round(repassesData.reduce((acc, item) => acc + item.percentual, 0) / Math.max(repassesData.length, 1))}%</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-2xl">
                  <Activity className="h-6 w-6 text-[#00a63e]" />
                </div>
              </div>
            </Card>
          </div>

          <Card className="overflow-hidden bg-white dark:bg-[#1a2e23] border-[#dee2e6] dark:border-app-border-dark rounded-2xl shadow-sm">
            <Table>
              <TableHeader className="bg-app-bg-secondary/50 dark:bg-app-table-header-dark">
                <TableRow>
                  <TableHead className="px-6 py-4 text-xs font-normal text-[#64748B] tracking-wider uppercase">Data</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-normal text-[#64748B] tracking-wider uppercase">Atendimento</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-normal text-[#64748B] tracking-wider uppercase">Cliente</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-normal text-[#64748B] tracking-wider uppercase">Valor bruto</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-normal text-[#64748B] tracking-wider uppercase">Repasse</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repassesData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-app-bg-secondary/50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-app-border-dark">
                    <TableCell className="px-6 py-4 text-sm text-app-text-muted font-normal">{item.data}</TableCell>
                    <TableCell className="px-6 py-4 text-sm font-normal text-app-text-primary dark:text-white">{item.atendimento}</TableCell>
                    <TableCell className="px-6 py-4 text-sm text-app-text-muted font-normal">{item.cliente}</TableCell>
                    <TableCell className="px-6 py-4 text-sm font-normal text-gray-900 dark:text-gray-100">R$ {item.valorBruto.toFixed(2)}</TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-normal text-emerald-600">R$ {item.valorRepasse.toFixed(2)}</span>
                        <span className="text-[10px] text-app-text-muted font-normal">{item.percentual}% de repasse</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row justify-end items-center gap-3 md:gap-4 w-full">
            <Button className="flex flex-row items-center justify-center gap-2 h-11 px-4 bg-[#0039A6] hover:bg-[#002d82] text-white rounded-xl whitespace-nowrap w-full sm:w-auto min-w-fit shrink-0 transition-all active:scale-95 font-normal shadow-sm">
              <Download className="h-4 w-4 shrink-0" />
              <span className="text-sm leading-none">Baixar relatorio</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-[21px] bg-white dark:bg-[#1a2e23] border-[#dee2e6] dark:border-app-border-dark hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6c757d] dark:text-app-text-muted font-normal tracking-wider mb-1">Total em Prescrição/Vendas</p>
                  <p className="text-2xl font-normal text-app-text-primary dark:text-white">R$ {totalPrescricoes.toFixed(2)}</p>
                </div>
                <div className="bg-[#e6f0ff] dark:bg-[#0039A6]/20 p-3 rounded-2xl">
                  <DollarSign className="h-6 w-6 text-[#0039A6]" />
                </div>
              </div>
            </Card>

            <Card className="p-[21px] bg-white dark:bg-[#1a2e23] border-[#dee2e6] dark:border-app-border-dark hover:shadow-md transition-shadow border-l-4 border-l-[#0039A6]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6c757d] dark:text-app-text-muted font-normal tracking-wider mb-1">Comissao atendimentos</p>
                  <p className="text-2xl font-normal text-[#00a63e]">R$ {totalComissaoProdutos.toFixed(2)}</p>
                  <p className="text-[10px] text-app-text-muted font-normal">Percentual: variavel por tipo</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-2xl">
                  <Activity className="h-6 w-6 text-[#00a63e]" />
                </div>
              </div>
            </Card>

            <Card className="p-[21px] bg-white dark:bg-[#1a2e23] border-[#dee2e6] dark:border-app-border-dark hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6c757d] dark:text-app-text-muted font-normal tracking-wider mb-1">Repasse atendimentos</p>
                  <p className="text-2xl font-normal text-app-text-primary dark:text-white">R$ {repassesData.reduce((acc, item) => acc + item.valorRepasse, 0).toFixed(2)}</p>
                  <p className="text-[10px] text-app-text-muted font-normal">Percentual: {Math.round(repassesData.reduce((acc, item) => acc + item.percentual, 0) / Math.max(repassesData.length, 1))}%</p>
                </div>
                <div className="bg-[#e6f0ff] dark:bg-[#0039A6]/20 p-3 rounded-2xl">
                  <DollarSign className="h-6 w-6 text-[#0039A6]" />
                </div>
              </div>
            </Card>

            <Card className="p-[21px] bg-white dark:bg-[#1a2e23] border-[#dee2e6] dark:border-app-border-dark hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6c757d] dark:text-app-text-muted font-normal tracking-wider mb-1">Comissao produtos</p>
                  <p className="text-2xl font-normal text-[#00a63e]">R$ {totalComissaoProdutos.toFixed(2)}</p>
                  <p className="text-[10px] text-app-text-muted font-normal">Percentual: variavel por tipo</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-2xl">
                  <Activity className="h-6 w-6 text-[#00a63e]" />
                </div>
              </div>
            </Card>
          </div>

          <Card className="overflow-hidden bg-white dark:bg-[#1a2e23] border-[#dee2e6] dark:border-app-border-dark rounded-2xl shadow-sm">
            <Table>
              <TableHeader className="bg-app-bg-secondary/50 dark:bg-app-table-header-dark">
                <TableRow>
                  <TableHead className="px-6 py-4 text-xs font-normal text-[#64748B] tracking-wider uppercase">Data</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-normal text-[#64748B] tracking-wider uppercase">Prescrição/Vendas</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-normal text-[#64748B] tracking-wider uppercase">Cliente</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-normal text-[#64748B] tracking-wider uppercase">Valor bruto</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-normal text-[#64748B] tracking-wider uppercase">Comissao</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-normal text-[#64748B] tracking-wider uppercase">Visualizar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comissoesData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-app-bg-secondary/50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-app-border-dark">
                    <TableCell className="px-6 py-4 text-sm text-app-text-muted font-normal">{item.data}</TableCell>
                    <TableCell className="px-6 py-4 text-sm font-normal text-app-text-primary dark:text-white">{item.descricao}</TableCell>
                    <TableCell className="px-6 py-4 text-sm text-app-text-muted font-normal">{item.cliente}</TableCell>
                    <TableCell className="px-6 py-4 text-sm font-normal text-gray-900 dark:text-gray-100">R$ {item.valorBruto.toFixed(2)}</TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-normal text-emerald-600">R$ {item.valorComissao.toFixed(2)}</span>
                        <span className="text-[10px] text-app-text-muted font-normal">{item.percentual}% de comissao</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setComissaoSelecionada(item)}
                        className="h-8 px-3 rounded-lg border-app-border dark:border-app-border-dark"
                      >
                        Ver Prescrição/Vendas
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Dialog open={Boolean(comissaoSelecionada)} onOpenChange={(open) => !open && setComissaoSelecionada(null)}>
            <DialogContent className="max-w-[620px]">
              <DialogHeader>
                <DialogTitle>Produtos da {comissaoSelecionada?.descricao}</DialogTitle>
              </DialogHeader>

              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {comissaoSelecionada?.produtos.map((produto) => (
                  <div
                    key={`${comissaoSelecionada.id}-${produto.nome}`}
                    className="flex items-center justify-between rounded-lg border border-app-border dark:border-app-border-dark px-3 py-2"
                  >
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{produto.nome}</p>
                      <p className="text-xs text-app-text-muted">
                        Qtd: {produto.quantidade} • Unitário: R$ {produto.valorUnitario.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900 dark:text-white">
                        R$ {(produto.quantidade * produto.valorUnitario).toFixed(2)}
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        Comissão {comissaoSelecionada.percentual}%: R$ {((produto.quantidade * produto.valorUnitario * comissaoSelecionada.percentual) / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}

interface SummaryCardProps {
  title: string;
  value: string;
  percentage?: string;
  subtitle: string;
  icon: LucideIcon;
}

function formatDateToBr(value: string) {
  if (!value) return '-'
  if (value.includes('/')) return value
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}

function SummaryCard({ title, value, percentage, subtitle, icon: Icon }: SummaryCardProps) {
  return (
    <div className="bg-white dark:bg-app-card-dark p-7 rounded-[22px] shadow-sm border border-gray-100 dark:border-gray-800/50 space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-[16px] font-normal text-gray-900 dark:text-white leading-tight">{title}</span>
        <div className="h-9 w-9 rounded-xl bg-app-bg-secondary dark:bg-app-table-header-dark flex items-center justify-center border border-gray-100 dark:border-gray-800">
          <Icon className="h-4.5 w-4.5 text-app-text-muted" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-3xl font-normal text-gray-900 dark:text-white tracking-tight">{value}</div>
        <div className="flex flex-wrap items-center gap-1.5 text-[13px]">
          {percentage && (
            <span className="font-normal text-[#1d3b2e] dark:text-[#4da885]">{percentage}</span>
          )}
          <span className="font-normal text-app-text-muted dark:text-app-text-muted">{subtitle}</span>
        </div>
      </div>
    </div>
  )
}

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800/50 pb-2">
      <span className="text-[15px] font-normal text-app-text-muted dark:text-app-text-muted">{label}</span>
      <span className="text-[15px] font-normal text-gray-900 dark:text-white">{value}</span>
    </div>
  )
}
