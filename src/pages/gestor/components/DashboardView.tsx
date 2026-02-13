import React from 'react'
import {
    DollarSign,
    MoreVertical,
    Calendar,
    Plus,
    Wallet,
    User,
    Clock,
    TrendingUp,
    TrendingDown
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb'
import { NovoLancamentoModal } from '../modals/NovoLancamentoModal'
import { MOCK_ACCOUNTS, MOCK_PAYMENTS_DUE, MOCK_RECEIVABLES, MOCK_AGENDA_TODAY } from '@/mocks/gestor/dashboard'

export const DashboardView = () => {
    const [isNovoLancamentoOpen, setIsNovoLancamentoOpen] = React.useState(false)
    const [period, setPeriod] = React.useState('Este mês')

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink className="text-sm font-normal text-app-text-muted hover:text-gray-900 transition-colors cursor-pointer">Gestão</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-sm font-normal text-gray-900">Dashboard</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3 bg-app-card dark:bg-[#0c1e3d] px-4 h-11 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <span className="text-xs font-normal text-app-text-muted uppercase tracking-widest">Período:</span>
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="bg-transparent border-none text-sm font-normal text-[#1F382C] dark:text-emerald-400 focus:ring-0 cursor-pointer"
                        >
                            <option value="Este mês">Este mês</option>
                            <option value="Últimos 7 dias">Últimos 7 dias</option>
                            <option value="Hoje">Hoje</option>
                        </select>
                    </div>
                    <Button
                        onClick={() => setIsNovoLancamentoOpen(true)}
                        className="bg-[#0039A6] hover:bg-[#002d82] text-white flex items-center gap-2 rounded-xl h-11 px-6 shadow-lg shadow-[#1F382C]/10 transition-all active:scale-95 font-normal"
                    >
                        <Plus size={20} />
                        Novo lançamento
                    </Button>
                </div>
            </div>

            {/* Main Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-app-card dark:bg-[#0c1e3d]">
                    <CardContent className="p-8">
                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <p className="text-sm font-normal text-[#6a7282] dark:text-app-text-muted">Entrada total no período</p>
                                <h3 className="text-3xl font-normal text-[#101828] dark:text-white tracking-tight">R$ 45.800,00</h3>
                                <div className="flex items-center gap-1.5 text-xs font-normal text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 w-fit px-2.5 py-1 rounded-lg">
                                    <TrendingUp size={14} />
                                    +15% vs período anterior
                                </div>
                            </div>
                            <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20">
                                <TrendingUp size={24} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-app-card dark:bg-[#0c1e3d]">
                    <CardContent className="p-8">
                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <p className="text-sm font-normal text-[#6a7282] dark:text-app-text-muted">Saída total no período</p>
                                <h3 className="text-3xl font-normal text-[#101828] dark:text-white tracking-tight">R$ 18.250,00</h3>
                                <div className="flex items-center gap-1.5 text-xs font-normal text-rose-600 bg-rose-50 dark:bg-rose-500/10 w-fit px-2.5 py-1 rounded-lg">
                                    <TrendingDown size={14} />
                                    -8% vs período anterior
                                </div>
                            </div>
                            <div className="p-3 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/20">
                                <TrendingDown size={24} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-app-card dark:bg-[#0c1e3d]">
                    <CardContent className="p-8">
                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <p className="text-sm font-normal text-[#6a7282] dark:text-app-text-muted">Saldo atual consolidado</p>
                                <h3 className="text-3xl font-normal text-[#101828] dark:text-white tracking-tight">R$ 27.550,00</h3>
                                <div className="flex items-center gap-1.5 text-xs font-normal text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 w-fit px-2.5 py-1 rounded-lg">
                                    <DollarSign size={14} />
                                    Saldo positivo
                                </div>
                            </div>
                            <div className="p-3 bg-[#1B3B30] text-white rounded-xl shadow-lg shadow-[#1B3B30]/20">
                                <DollarSign size={24} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Saldo de Contas Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-normal text-[#101828] dark:text-white flex items-center gap-2">
                    <Wallet size={20} className="text-[#6a7282]" />
                    Saldo de contas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {MOCK_ACCOUNTS.map((account, idx) => {
                        const Icon = account.icon
                        return (
                            <div key={idx} className="bg-app-card dark:bg-[#0c1e3d] p-6 rounded-[20px] border border-gray-100 dark:border-gray-800 shadow-sm hover:border-[#1F382C]/20 transition-all group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-lg ${account.color} text-white`}>
                                        <Icon size={18} />
                                    </div>
                                    <span className="text-xs font-normal uppercase tracking-wider text-[#6a7282]">{account.type}</span>
                                </div>
                                <h4 className="text-sm font-normal text-[#6a7282] dark:text-app-text-muted mb-1">{account.name}</h4>
                                <p className="text-xl font-normal text-[#101828] dark:text-white">{account.balance}</p>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Pending Payments and Receivables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pagamentos a Vencer */}
                <div className="bg-app-card dark:bg-[#0c1e3d] rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                        <h3 className="text-lg font-normal text-[#101828] dark:text-white">Pagamentos a vencer</h3>
                        <span className="px-4 py-1.5 rounded-full bg-red-600 dark:bg-rose-900/40 dark:text-rose-100 text-white text-sm font-normal shadow-sm">R$ 17.300,00</span>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                        {MOCK_PAYMENTS_DUE.map((item, idx) => (
                            <div key={idx} className="p-6 flex items-center justify-between hover:bg-app-bg-secondary/50 dark:hover:bg-app-card/5 transition-colors">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-normal text-[#1F382C] dark:text-white">{item.title}</h4>
                                    <p className="text-xs text-app-text-muted flex items-center gap-1.5">
                                        <span className="font-normal">{item.cat}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span>Vence em {item.date}</span>
                                    </p>
                                </div>
                                <span className="text-sm font-normal text-gray-700 dark:text-white/80">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Entradas a Receber */}
                <div className="bg-app-card dark:bg-[#0c1e3d] rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                        <h3 className="text-lg font-normal text-[#101828] dark:text-white">Entradas a receber</h3>
                        <span className="px-4 py-1.5 rounded-full bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white text-sm font-normal shadow-sm">R$ 910,00</span>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                        {MOCK_RECEIVABLES.map((item, idx) => (
                            <div key={idx} className="p-6 flex items-center justify-between hover:bg-app-bg-secondary/50 dark:hover:bg-app-card/5 transition-colors">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-normal text-[#1F382C] dark:text-white">{item.title}</h4>
                                    <p className="text-xs text-app-text-muted flex items-center gap-1.5">
                                        <span className="font-normal">{item.cat}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span>Expectativa em {item.date}</span>
                                    </p>
                                </div>
                                <span className="text-sm font-normal text-gray-700 dark:text-white/80">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Consolidated Agenda Section */}
            <Card className="rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="p-8 border-b border-gray-50 dark:border-gray-800">
                        <h3 className="text-xl font-normal text-[#101828] dark:text-white">Agenda consolidada - hoje</h3>
                        <p className="text-sm text-[#6a7282] font-normal mt-1">Agendamentos de todos os profissionais da unidade</p>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-transparent hover:bg-transparent border-b border-gray-100 dark:border-gray-800">
                                    <TableHead className="px-8 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider pl-8 text-left whitespace-nowrap">Horário</TableHead>
                                    <TableHead className="px-8 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider text-left whitespace-nowrap">Paciente</TableHead>
                                    <TableHead className="px-8 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider text-left whitespace-nowrap">Profissional</TableHead>
                                    <TableHead className="px-8 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider text-left whitespace-nowrap">Procedimento</TableHead>
                                    <TableHead className="px-8 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider text-left whitespace-nowrap">Sala</TableHead>
                                    <TableHead className="px-8 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider text-left whitespace-nowrap">Status</TableHead>
                                    <TableHead className="px-8 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider text-right pr-8 whitespace-nowrap">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_AGENDA_TODAY.map((row, idx) => (
                                    <TableRow key={idx} className="hover:bg-app-bg-secondary/50 dark:hover:bg-app-card/5 border-b border-gray-50 dark:border-gray-800 transition-colors">
                                        <TableCell className="px-8 py-5 text-sm font-normal text-[#101828] dark:text-emerald-400 pl-8">
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <Clock size={14} className="text-[#6a7282]" />
                                                {row.time}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-5">
                                            <div className="flex items-center gap-3 whitespace-nowrap">
                                                <div className="w-8 h-8 rounded-full bg-app-bg-secondary dark:bg-app-card/5 flex items-center justify-center text-[#6a7282]">
                                                    <User size={16} />
                                                </div>
                                                <span className="text-sm font-normal text-[#101828] dark:text-gray-200">{row.patient}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-5 text-sm font-normal text-[#6a7282] dark:text-white/80 whitespace-nowrap">{row.expert}</TableCell>
                                        <TableCell className="px-8 py-5 text-sm text-[#6a7282] dark:text-app-text-muted whitespace-nowrap">{row.proc}</TableCell>
                                        <TableCell className="px-8 py-5 text-sm font-normal text-[#6a7282] uppercase tracking-tighter whitespace-nowrap">{row.room}</TableCell>
                                        <TableCell className="px-8 py-5">
                                            <Badge className={`px-3 py-1 rounded-lg text-sm font-normal border-none text-white shadow-sm whitespace-nowrap transition-all ${row.status === 'Confirmado'
                                                ? 'bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100'
                                                : 'bg-amber-500 dark:bg-amber-900/40 dark:text-amber-100'
                                                }`}>
                                                {row.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-8 py-5 text-right pr-8">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-2 hover:bg-app-bg-secondary dark:hover:bg-app-card/10 rounded-lg transition-all text-[#6a7282]">
                                                        <MoreVertical size={20} />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border-gray-100 dark:border-gray-800 dark:bg-[#020817]">
                                                    <DropdownMenuItem className="flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                                        <Plus size={16} className="text-[#1F382C]" />
                                                        <span className="text-sm font-normal">Ver detalhes</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-app-bg-secondary dark:hover:bg-app-card/5">
                                                        <Calendar size={16} className="text-emerald-500" />
                                                        <span className="text-sm font-normal">Reagendar</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <NovoLancamentoModal
                isOpen={isNovoLancamentoOpen}
                onClose={() => setIsNovoLancamentoOpen(false)}
            />
        </div>
    )
}
