import {
  Calendar,
  Users,
  Activity,
  FileDown,
  DollarSign,
  Download,
  TrendingUp as TrendingUpIcon
} from 'lucide-react'
import { useState } from 'react'
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

const BAR_DATA = [
  { name: 'Jan', consultas: 45, pacientes: 38 },
  { name: 'Fev', consultas: 52, pacientes: 42 },
  { name: 'Mar', consultas: 48, pacientes: 40 },
  { name: 'Abr', consultas: 61, pacientes: 51 },
  { name: 'Mai', consultas: 55, pacientes: 47 },
  { name: 'Jun', consultas: 68, pacientes: 55 },
  { name: 'Jul', consultas: 58, pacientes: 49 },
  { name: 'Ago', consultas: 48, pacientes: 40 },
  { name: 'Set', consultas: 45, pacientes: 39 },
  { name: 'Out', consultas: 50, pacientes: 41 }
]

const PIE_DATA = [
  { name: 'Consulta de Rotina', value: 45, color: '#008cff' },
  { name: 'Consulta de Retorno', value: 30, color: '#00d0a5' },
  { name: 'Primeira Consulta', value: 15, color: '#ffb928' },
  { name: 'Consulta de Urgencia', value: 10, color: '#ff7a45' }
]

const MOCK_COMISSOES_PRESCRICOES = [
  {
    data: '21/11/2025',
    descricao: 'Prescricao/Venda #1281',
    cliente: 'Maria Silva Santos',
    valorBruto: 385.0,
    percentual: 10,
    valorComissao: 38.5
  },
  {
    data: '20/11/2025',
    descricao: 'Prescricao/Venda #1280',
    cliente: 'Joao Pedro Costa',
    valorBruto: 250.0,
    percentual: 10,
    valorComissao: 25.0
  },
  {
    data: '19/11/2025',
    descricao: 'Prescricao/Venda #1278',
    cliente: 'Ana Carolina Lima',
    valorBruto: 120.0,
    percentual: 5,
    valorComissao: 6.0
  }
]

const MOCK_REPASSES = [
  {
    data: '21/11/2025',
    atendimento: 'Consulta inicial',
    cliente: 'Maria Silva Santos',
    valorBruto: 250.0,
    percentual: 60,
    valorRepasse: 150.0
  },
  {
    data: '20/11/2025',
    atendimento: 'Retorno',
    cliente: 'Joao Pedro Costa',
    valorBruto: 180.0,
    percentual: 50,
    valorRepasse: 90.0
  },
  {
    data: '19/11/2025',
    atendimento: 'Consulta especial',
    cliente: 'Ana Carolina Lima',
    valorBruto: 300.0,
    percentual: 55,
    valorRepasse: 165.0
  }
]

export const RelatoriosView = ({ onPageChange }: RelatoriosViewProps) => {
  const [activeTab, setActiveTab] = useState<'desempenho' | 'repasses' | 'comissoes'>('desempenho')

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Consultas realizadas"
              value="580"
              percentage="+12%"
              subtitle="em relacao ao ano anterior"
              icon={Calendar}
            />
            <SummaryCard
              title="Pacientes ativos"
              value="247"
              percentage="+23"
              subtitle="novos pacientes este mes"
              icon={Users}
            />
            <SummaryCard
              title="Media mensal"
              value="58"
              subtitle="consultas por mes"
              icon={TrendingUpIcon}
            />
            <SummaryCard
              title="Taxa de ocupacao"
              value="87%"
              percentage="+5%"
              subtitle="em relacao ao mes anterior"
              icon={Activity}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-app-card-dark p-8 rounded-[20px] shadow-sm border border-gray-100 dark:border-gray-800/50">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-normal text-gray-900 dark:text-white">Consultas por mes</h3>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={BAR_DATA} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
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
              </div>
            </div>

            <div className="bg-white dark:bg-app-card-dark p-8 rounded-[20px] shadow-sm border border-gray-100 dark:border-gray-800/50">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-normal text-gray-900 dark:text-white">Distribuicao de procedimentos</h3>
              </div>
              <div className="h-[320px] w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PIE_DATA}
                      innerRadius={0}
                      outerRadius={100}
                      paddingAngle={0}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 pointer-events-none text-[12px] font-normal p-2">
                  <div className="absolute top-2 left-2 text-[#008cff]">Consulta de rotina (45%)</div>
                  <div className="absolute top-2 right-2 text-right text-[#ff7a45]">Consulta de urgencia (10%)</div>
                  <div className="absolute bottom-2 left-2 text-[#00d0a5]">Consulta de retorno (30%)</div>
                  <div className="absolute bottom-2 right-2 text-right text-[#ffb928]">Primeira consulta (15%)</div>
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
                  <StatLine label="Taxa de retorno:" value="85%" />
                  <StatLine label="Satisfacao:" value="4.8/5" />
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
                  <p className="text-2xl font-normal text-app-text-primary dark:text-white">R$ 405,00</p>
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
                  <p className="text-2xl font-normal text-[#00a63e]">55%</p>
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
                {MOCK_REPASSES.map((item, index) => (
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
                  <p className="text-sm text-[#6c757d] dark:text-app-text-muted font-normal tracking-wider mb-1">Total em Prescricoes/Vendas</p>
                  <p className="text-2xl font-normal text-app-text-primary dark:text-white">R$ 385,00</p>
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
                  <p className="text-2xl font-normal text-[#00a63e]">R$ 120,00</p>
                  <p className="text-[10px] text-app-text-muted font-normal">Percentual: 15%</p>
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
                  <p className="text-2xl font-normal text-app-text-primary dark:text-white">R$ 405,00</p>
                  <p className="text-[10px] text-app-text-muted font-normal">Percentual: 55%</p>
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
                  <p className="text-2xl font-normal text-[#00a63e]">R$ 32,50</p>
                  <p className="text-[10px] text-app-text-muted font-normal">Percentual: 10%</p>
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
                  <TableHead className="px-6 py-4 text-xs font-normal text-[#64748B] tracking-wider uppercase">Prescricao/Venda</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-normal text-[#64748B] tracking-wider uppercase">Cliente</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-normal text-[#64748B] tracking-wider uppercase">Valor bruto</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-normal text-[#64748B] tracking-wider uppercase">Comissao</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_COMISSOES_PRESCRICOES.map((item, index) => (
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  )
}

function SummaryCard({ title, value, percentage, subtitle, icon: Icon }: any) {
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
