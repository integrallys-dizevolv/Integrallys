import { useState } from 'react'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { getTodayDate } from '@/utils/dateUtils'
import {
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    Download,
    Calendar,
    Wallet,
    CreditCard,
    Banknote,
    MoreVertical,
    Smartphone,
    FileText,
    Eye,
    Edit,
    Upload,
    Trash2
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb'
import { Badge } from '@/components/ui/Badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table'
import { Input } from '@/components/ui/Input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { NovoLancamentoModal } from '../financeiro/modals/NovoLancamentoModal'
import { DREView } from '../financeiro/pages/DREView'
import { MOCK_TRANSACTIONS } from '@/mocks/gestor/financeiro'
import { loadCartoes, loadFaturas } from '@/services/cartaoEmpresarial.service'

interface FinanceiroViewProps {
    onPageChange?: (page: string) => void
}

// Reusable Box Card Component
const BoxCard = ({
    title,
    type,
    icon: Icon,
    entradas,
    saidas,
    saldo,
    variant = 'default'
}: {
    title: string;
    type: string;
    icon: LucideIcon;
    entradas: string;
    saidas: string;
    saldo: string;
    variant?: 'default' | 'green' | 'yellow'
}) => {
    const variants = {
        default: "bg-app-card dark:bg-[#0c1e3d]/40 border-gray-100 dark:border-app-border-dark",
        green: "bg-[#ECFDF3] dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-100/20",
        yellow: "bg-[#FFF9E5] dark:bg-amber-500/10 border-[#FFE4A3] dark:border-amber-500/20"
    }

    return (
        <Card className={`${variants[variant]} border shadow-sm rounded-[24px] hover:shadow-md transition-all p-8 flex flex-col justify-between h-[280px]`}>
            <div>
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <h4 className="text-xl font-normal text-[#101828] dark:text-white">{title}</h4>
                        <p className="text-sm text-app-text-muted dark:text-app-text-muted font-normal">{type}</p>
                    </div>
                    <div className={`p-2.5 rounded-xl ${variant === 'default' ? 'bg-app-bg-secondary dark:bg-app-card/5 text-app-text-muted' : variant === 'green' ? 'bg-[#0052cc]/10 text-[#0052cc]' : 'bg-amber-500/10 text-amber-600'}`}>
                        <Icon size={24} />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-app-text-muted dark:text-app-text-muted font-normal uppercase tracking-widest text-[10px]">Entradas</span>
                        <span className="text-[#0052cc] dark:text-emerald-500 font-normal">+R$ {entradas}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-app-text-muted dark:text-app-text-muted font-normal uppercase tracking-widest text-[10px]">Saídas</span>
                        <span className="text-[#B42318] dark:text-rose-500 font-normal">-R$ {saidas}</span>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-app-border/50 dark:border-app-border-dark flex justify-between items-center">
                <span className="text-lg font-normal text-[#101828] dark:text-white uppercase tracking-tight">Saldo</span>
                <span className="text-2xl font-normal text-[#101828] dark:text-white tracking-tighter">R$ {saldo}</span>
            </div>
        </Card>
    )
}


export const FinanceiroView = ({ onPageChange }: FinanceiroViewProps) => {
    const [activeTab, setActiveTab] = useState<'lancamentos' | 'caixa' | 'dre' | 'cartao'>('lancamentos')
    const [isNovoLancamentoModalOpen, setIsNovoLancamentoModalOpen] = useState(false)



    // Filters State
    const [filterType, setFilterType] = useState('Todos')
    const [filterUnit, setFilterUnit] = useState('Todos')
    const [filterCategory, setFilterCategory] = useState('Todos')
    const [filterPayment, setFilterPayment] = useState('Todos')
    const [filterDate, setFilterDate] = useState(getTodayDate())

    const filteredTransactions = MOCK_TRANSACTIONS.filter(t => {
        if (filterType !== 'Todos' && t.typeValue !== filterType) return false
        if (filterUnit !== 'Todos' && t.unidadeValue !== filterUnit) return false
        if (filterCategory !== 'Todos' && t.catValue !== filterCategory) return false
        if (filterPayment !== 'Todos' && t.formaValue !== filterPayment) return false
        if (filterDate && t.date !== filterDate.split('-').reverse().join('/')) return false // Simple date match
        return true
    })
    const parseMoney = (value: string) => Number(value.replace(/\./g, '').replace(',', '.'))
    const getStatusFromRow = (row: typeof MOCK_TRANSACTIONS[number]) => {
        const total = parseMoney(row.total)
        const paid = parseMoney(row.pago)
        const saldo = parseMoney(row.saldo)
        if (saldo === 0 && paid >= total) return 'Pago'
        if (paid > 0 && saldo > 0) return 'Parcial'
        return 'Pendente'
    }
    const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
        switch (status) {
            case 'Quitado': case 'Pago': return 'default'
            case 'Parcial': return 'secondary'
            case 'Pendente': return 'destructive'
            default: return 'outline'
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            onClick={() => onPageChange?.('inicio')}
                            className="text-sm font-normal text-app-text-muted hover:text-gray-900 dark:text-app-text-muted dark:hover:text-white transition-colors cursor-pointer"
                        >
                            Início
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-sm font-normal text-gray-900 dark:text-white">Financeiro</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Tabs Navigation - Premium Pill Style */}
            <div className="flex justify-center w-full">
                <div className="w-full max-w-4xl">
                    <SegmentedControl
                        options={[
                            { value: 'lancamentos', label: 'Lançamentos' },
                            { value: 'caixa', label: 'Caixa' },
                            { value: 'cartao', label: 'Cartão Empresarial' },
                            { value: 'dre', label: 'DRE' },
                        ]}
                        value={activeTab}
                        onChange={(val) => setActiveTab(val as 'lancamentos' | 'caixa' | 'dre' | 'cartao')}
                    />
                </div>
            </div>

            {activeTab === 'lancamentos' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    {/* Filters Section */}
                    <Card className="border border-gray-100 dark:border-app-border-dark shadow-sm rounded-[24px] bg-app-card dark:bg-[#0c1e3d] p-6">
                        <div className="flex flex-col xl:flex-row gap-6 items-end">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 flex-1 w-full">
                                <div className="space-y-2">
                                    <label className="text-sm font-normal text-gray-700 dark:text-white/80">Período</label>
                                    <div className="relative">
                                        <Input type="date" hideDateIcon
                                            value={filterDate}
                                            onChange={(e) => setFilterDate(e.target.value)}
                                            className="pl-10 h-11 rounded-xl border-app-border bg-app-bg-secondary/50 dark:bg-app-card/5 dark:border-app-border-dark text-sm font-normal text-gray-600"
                                        />
                                        <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-app-text-muted" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-normal text-gray-700 dark:text-white/80">Tipo</label>
                                    <Select value={filterType} onValueChange={setFilterType}>
                                        <SelectTrigger className="h-11 rounded-xl border-app-border bg-app-bg-secondary/50 dark:bg-app-card/5 dark:border-app-border-dark text-gray-600 text-sm font-normal">
                                            <SelectValue preferPlaceholder placeholder="Ambos" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Ambos">Ambos</SelectItem>
                                            <SelectItem value="Entrada">Entrada</SelectItem>
                                            <SelectItem value="Saída">Saída</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-normal text-gray-700 dark:text-white/80">Unidade</label>
                                    <Select value={filterUnit} onValueChange={setFilterUnit}>
                                        <SelectTrigger className="h-11 rounded-xl border-app-border bg-app-bg-secondary/50 dark:bg-app-card/5 dark:border-app-border-dark text-gray-600 text-sm font-normal">
                                            <SelectValue preferPlaceholder placeholder="Todas" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Todos">Todas</SelectItem>
                                            <SelectItem value="Clínica">Clínica Central</SelectItem>
                                            <SelectItem value="Norte">Unidade Norte</SelectItem>
                                            <SelectItem value="Sul">Consultório Sul</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-normal text-gray-700 dark:text-white/80">Categoria</label>
                                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                                        <SelectTrigger className="h-11 rounded-xl border-app-border bg-app-bg-secondary/50 dark:bg-app-card/5 dark:border-app-border-dark text-gray-600 text-sm font-normal">
                                            <SelectValue preferPlaceholder placeholder="Todas" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Todas">Todas</SelectItem>
                                            <SelectItem value="Consultas">Consultas</SelectItem>
                                            <SelectItem value="Procedimentos">Procedimentos</SelectItem>
                                            <SelectItem value="Fornecedores">Fornecedores</SelectItem>
                                            <SelectItem value="Impostos">Impostos</SelectItem>
                                            <SelectItem value="Produtos">Produtos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-normal text-gray-700 dark:text-white/80 whitespace-nowrap">Forma de pagamento</label>
                                    <Select value={filterPayment} onValueChange={setFilterPayment}>
                                        <SelectTrigger className="h-11 rounded-xl border-app-border bg-app-bg-secondary/50 dark:bg-app-card/5 dark:border-app-border-dark text-gray-600 text-sm font-normal">
                                            <SelectValue preferPlaceholder placeholder="Todas" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Todas">Todas</SelectItem>
                                            <SelectItem value="pix">PIX</SelectItem>
                                            <SelectItem value="cartao">Cartão</SelectItem>
                                            <SelectItem value="cartao_empresarial">Cartão Empresarial</SelectItem>
                                            <SelectItem value="boleto">Boleto</SelectItem>
                                            <SelectItem value="transferencia">Transferência</SelectItem>
                                            <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button
                                onClick={() => setIsNovoLancamentoModalOpen(true)}
                                className="h-11 px-6 rounded-xl bg-[#0039A6] hover:bg-[#002a75] text-white shadow-md font-normal shrink-0 w-full md:w-auto"
                            >
                                <Plus size={18} className="mr-2" /> Novo lançamento
                            </Button>
                        </div>
                    </Card>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border border-gray-100 dark:border-app-border-dark shadow-sm bg-app-card dark:bg-[#0c1e3d] rounded-[24px] p-6 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-sm font-normal text-gray-600 dark:text-white/80">Entradas no período</span>
                                <ArrowUpRight size={20} className="text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-normal text-[#0052cc] dark:text-emerald-500 tracking-tight">R$ 1.050,00</h3>
                            <p className="text-xs text-app-text-muted font-normal mt-1">5 lançamentos</p>
                        </Card>
                        <Card className="border border-gray-100 dark:border-app-border-dark shadow-sm bg-app-card dark:bg-[#0c1e3d] rounded-[24px] p-6 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-sm font-normal text-gray-600 dark:text-white/80">Saídas no período</span>
                                <ArrowDownRight size={20} className="text-rose-500" />
                            </div>
                            <h3 className="text-2xl font-normal text-[#B42318] dark:text-rose-500 tracking-tight">R$ 5.050,00</h3>
                            <p className="text-xs text-app-text-muted font-normal mt-1">3 lançamentos</p>
                        </Card>
                        <Card className="border border-gray-100 dark:border-app-border-dark shadow-sm bg-app-card dark:bg-[#0c1e3d] rounded-[24px] p-6 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-sm font-normal text-gray-600 dark:text-white/80">Saldo do período</span>
                                <Wallet size={20} className="text-[#0039A6] dark:text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-normal text-[#101828] dark:text-white tracking-tight">-R$ 4.000,00</h3>
                            <p className="text-xs text-app-text-muted font-normal mt-1">Lucro líquido</p>
                        </Card>
                        <Card className="border border-gray-100 dark:border-app-border-dark shadow-sm bg-app-card dark:bg-[#0c1e3d] rounded-[24px] p-6 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-sm font-normal text-gray-600 dark:text-white/80">Recebimentos abertos</span>
                                <FileText size={20} className="text-amber-500" />
                            </div>
                            <h3 className="text-2xl font-normal text-amber-500 tracking-tight">R$ 580,00</h3>
                            <p className="text-xs text-app-text-muted font-normal mt-1">2 pendências</p>
                        </Card>
                    </div>

                    {/* Table */}
                    <Card className="border border-gray-100 dark:border-app-border-dark shadow-sm rounded-[24px] overflow-hidden bg-app-card dark:bg-[#0c1e3d]">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#F9FAFB] dark:bg-app-card/5 border-b border-gray-100 dark:border-app-border-dark">
                                        <TableHead className="px-6 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider pl-6 whitespace-nowrap">Data/hora</TableHead>
                                        <TableHead className="px-6 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider whitespace-nowrap">Tipo</TableHead>
                                        <TableHead className="px-6 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider whitespace-nowrap">Unidade</TableHead>
                                        <TableHead className="px-6 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider whitespace-nowrap">Descrição</TableHead>
                                        <TableHead className="px-6 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider whitespace-nowrap">Categoria</TableHead>
                                        <TableHead className="px-6 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider whitespace-nowrap">Valor total</TableHead>
                                        <TableHead className="px-6 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider whitespace-nowrap">Valor pago</TableHead>
                                        <TableHead className="px-6 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider whitespace-nowrap">Saldo</TableHead>
                                        <TableHead className="px-6 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider whitespace-nowrap">Forma</TableHead>
                                        <TableHead className="px-6 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider whitespace-nowrap">Status</TableHead>
                                        <TableHead className="px-6 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider pr-6 whitespace-nowrap text-right">Acoes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-50 dark:divide-white/5">
                                    {filteredTransactions.map((row) => {
                                        const status = getStatusFromRow(row)
                                        return (
                                        <TableRow key={row.id} className="group hover:bg-app-bg-secondary/50 dark:hover:bg-app-card/5 transition-colors border-none">
                                            <TableCell className="px-6 py-5 pl-6 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-normal text-gray-700 dark:text-white/80">{row.date}</span>
                                                    <span className="text-xs text-app-text-muted">{row.time}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-normal text-white shadow-sm ${row.variant === 'green' ? 'bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100' : 'bg-red-600 dark:bg-rose-900/40 dark:text-rose-100'}`}>
                                                    {row.type}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-6 py-5 text-sm text-gray-600 dark:text-app-text-muted whitespace-nowrap">{row.unidade}</TableCell>
                                            <TableCell className="px-6 py-5 text-sm font-normal text-gray-800 dark:text-gray-200 max-w-[200px] truncate">{row.desc}</TableCell>
                                            <TableCell className="px-6 py-5 text-sm text-gray-600 dark:text-app-text-muted whitespace-nowrap">{row.cat}</TableCell>
                                            <TableCell className="px-6 py-5 text-sm font-normal text-gray-700 dark:text-white/80 whitespace-nowrap">R$ {row.total}</TableCell>
                                            <TableCell className="px-6 py-5 text-sm text-gray-600 dark:text-app-text-muted whitespace-nowrap">R$ {row.pago}</TableCell>
                                            <TableCell className="px-6 py-5 text-sm font-normal text-amber-500 whitespace-nowrap">R$ {row.saldo}</TableCell>
                                            <TableCell className="px-6 py-5 text-sm text-gray-600 dark:text-app-text-muted whitespace-nowrap">{row.forma}</TableCell>
                                            <TableCell className="px-6 py-5 whitespace-nowrap">
                                                <Badge variant={getStatusBadgeVariant(status)} className="font-normal">
                                                    {status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-5 text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button
                                                            className="h-9 w-9 inline-flex items-center justify-center border border-blue-200 dark:border-blue-900/10 bg-app-card dark:bg-app-bg-dark hover:bg-blue-50 dark:hover:bg-blue-900/20 text-app-text-secondary dark:text-app-text-muted rounded-xl transition-all"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                                            <Eye className="h-4 w-4 mr-2 text-app-text-secondary" />
                                                            <span>Visualizar</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                                            <Edit className="h-4 w-4 mr-2 text-app-text-secondary" />
                                                            <span>Editar</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                                            <Upload className="h-4 w-4 mr-2 text-app-text-secondary" />
                                                            <span>Anexos</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={(e) => e.stopPropagation()}>
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            <span>Excluir</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'caixa' && (
                <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                    {/* 1. Summary Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border border-gray-100 dark:border-app-border-dark shadow-sm bg-app-card dark:bg-[#0c1e3d] rounded-[24px] overflow-hidden group hover:shadow-md transition-all duration-300">
                            <CardContent className="p-8 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-normal text-gray-600 dark:text-white/80">Entradas no período</span>
                                    <ArrowUpRight size={20} className="text-emerald-500" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-4xl font-normal text-[#0052cc] dark:text-emerald-500 tracking-tighter">R$ 35.200,00</h2>
                                    <p className="text-xs font-normal text-app-text-muted">Total de entradas</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-100 dark:border-app-border-dark shadow-sm bg-app-card dark:bg-[#0c1e3d] rounded-[24px] overflow-hidden group hover:shadow-md transition-all duration-300">
                            <CardContent className="p-8 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-normal text-gray-600 dark:text-white/80">Saídas no período</span>
                                    <ArrowDownRight size={20} className="text-rose-500" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-4xl font-normal text-[#B42318] dark:text-rose-500 tracking-tighter">R$ 13.600,00</h2>
                                    <p className="text-xs font-normal text-app-text-muted">Total de saídas</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-100 dark:border-app-border-dark shadow-sm bg-app-card dark:bg-[#0c1e3d] rounded-[24px] overflow-hidden group hover:shadow-md transition-all duration-300">
                            <CardContent className="p-8 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-normal text-gray-600 dark:text-white/80">Saldo do período</span>
                                    <Wallet size={20} className="text-[#0039A6] dark:text-emerald-400" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-4xl font-normal text-[#0039A6] dark:text-white tracking-tighter">R$ 21.600,00</h2>
                                    <p className="text-xs font-normal text-app-text-muted">Resultado do período</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 2. Saldo por Caixa (Accounts Grid) */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-normal text-[#101828] dark:text-white px-1">Saldo por caixa</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <BoxCard
                                title="Banco Sicredi"
                                type="Conta bancária"
                                icon={CreditCard}
                                entradas="8.500,00"
                                saidas="3.200,00"
                                saldo="10.000,00"
                            />
                            <BoxCard
                                title="Bradesco"
                                type="Conta bancária"
                                icon={CreditCard}
                                entradas="12.000,00"
                                saidas="5.800,00"
                                saldo="15.000,00"
                            />
                            <BoxCard
                                title="Cofre (Dinheiro)"
                                type="Caixa físico - cofre"
                                icon={Banknote}
                                entradas="3.500,00"
                                saidas="1.200,00"
                                saldo="5.000,00"
                                variant="green"
                            />
                            <BoxCard
                                title="Caixinha de troco"
                                type="Caixa físico - troco"
                                icon={Banknote}
                                entradas="500,00"
                                saidas="0,00"
                                saldo="500,00"
                                variant="yellow"
                            />
                            <BoxCard
                                title="Nubank"
                                type="Conta bancária"
                                icon={CreditCard}
                                entradas="6.200,00"
                                saidas="2.100,00"
                                saldo="7.500,00"
                            />
                            <BoxCard
                                title="Cartão empresarial"
                                type="Intermediário"
                                icon={Smartphone}
                                entradas="4.500,00"
                                saidas="1.300,00"
                                saldo="3.200,00"
                            />
                        </div>

                        {/* 3. Total Footer */}
                        <div className="flex items-center justify-between mt-8 pt-4">
                            <span className="text-lg font-normal text-[#101828] dark:text-white">Total geral em caixa</span>
                            <span className="text-3xl font-normal text-[#0039A6] dark:text-emerald-500 tracking-tight">R$ 41.200,00</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-app-border-dark my-8" />

                    {/* 4. Status do Caixa Card */}
                    <Card className="border border-gray-100 dark:border-app-border-dark shadow-sm rounded-[16px] bg-app-card dark:bg-[#0c1e3d] p-8">
                        <div className="flex flex-col gap-8">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-normal text-gray-900 dark:text-white">Status do caixa</span>
                                <Badge className="bg-green-600 dark:bg-green-900/40 dark:text-green-100 hover:bg-green-700 dark:hover:bg-green-900/60 text-white rounded-full px-4 py-1 text-xs font-normal border-none shadow-sm transition-all">ABERTO</Badge>
                                <span className="text-sm text-app-text-muted dark:text-app-text-muted font-normal">Clínica Central</span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="space-y-2">
                                    <p className="text-sm text-app-text-muted dark:text-app-text-muted font-normal">Saldo inicial</p>
                                    <p className="text-2xl font-normal text-[#101828] dark:text-white">R$ 1.000,00</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-app-text-muted dark:text-app-text-muted font-normal">Entradas</p>
                                    <p className="text-2xl font-normal text-[#0052cc] dark:text-emerald-500">R$ 470,00</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-app-text-muted dark:text-app-text-muted font-normal">Saídas</p>
                                    <p className="text-2xl font-normal text-[#B42318] dark:text-rose-500">R$ 500,00</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-app-text-muted dark:text-app-text-muted font-normal">Saldo atual</p>
                                    <p className="text-2xl font-normal text-[#101828] dark:text-white">R$ 970,00</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* 5. Action Buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <Button variant="outline" className="h-10 px-4 py-2 rounded-[8px] text-sm font-normal bg-app-card border-app-border text-gray-700 hover:bg-app-bg-secondary dark:bg-transparent dark:border-app-border-dark dark:text-white/80 shadow-sm">
                            Abrir caixa
                        </Button>
                        <Button variant="outline" className="h-10 px-4 py-2 rounded-[8px] text-sm font-normal bg-app-card border-app-border text-gray-700 hover:bg-app-bg-secondary dark:bg-transparent dark:border-app-border-dark dark:text-white/80 shadow-sm">
                            Registrar suprimento
                        </Button>
                        <Button variant="outline" className="h-10 px-4 py-2 rounded-[8px] text-sm font-normal bg-app-card border-app-border text-gray-700 hover:bg-app-bg-secondary dark:bg-transparent dark:border-app-border-dark dark:text-white/80 shadow-sm">
                            Registrar sangria
                        </Button>
                        <Button variant="outline" className="h-10 px-4 py-2 rounded-[8px] text-sm font-normal bg-app-card border-app-border text-gray-700 hover:bg-app-bg-secondary dark:bg-transparent dark:border-app-border-dark dark:text-white/80 shadow-sm">
                            Fechar caixa
                        </Button>
                        <Button variant="outline" className="h-10 px-4 py-2 rounded-[8px] text-sm font-normal bg-app-card border-app-border text-gray-700 hover:bg-app-bg-secondary dark:bg-transparent dark:border-app-border-dark dark:text-white/80 ml-2 flex items-center gap-2 shadow-sm">
                            <Download size={16} /> Exportar extrato
                        </Button>
                    </div>

                    {/* 6. Movements Table & Sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Movements Table */}
                        <div className="lg:col-span-2 space-y-4">
                            <Card className="border border-gray-100 dark:border-app-border-dark shadow-sm rounded-[16px] overflow-hidden bg-app-card dark:bg-[#0c1e3d]">
                                <div className="px-8 py-6">
                                    <h3 className="text-lg font-normal text-gray-700 dark:text-white">Movimentações do dia</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-[#F9FAFB] dark:bg-app-card/5 border-b border-gray-100 dark:border-app-border-dark">
                                                <TableHead className="px-8 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider pl-8">Hora</TableHead>
                                                <TableHead className="px-8 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider">Tipo</TableHead>
                                                <TableHead className="px-8 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider">Descrição</TableHead>
                                                <TableHead className="px-8 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider">Forma</TableHead>
                                                <TableHead className="px-8 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider">Valor</TableHead>
                                                <TableHead className="px-8 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider">Operador</TableHead>
                                                <TableHead className="px-8 py-4 text-[11px] font-normal text-app-text-muted uppercase tracking-wider text-right pr-8">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="divide-y divide-gray-50 dark:divide-white/5">
                                            {[
                                                { hora: '14:30', tipo: 'Entrada', desc: 'Pagamento consulta', forma: 'PIX', valor: '350,00', op: 'Ana Costa', variant: 'green' },
                                                { hora: '11:15', tipo: 'Saída', desc: 'Sangria para cofre', forma: 'Dinheiro', valor: '500,00', op: 'Carlos Lima', variant: 'rose' },
                                                { hora: '09:45', tipo: 'Entrada', desc: 'Prescrição/Vendas de produtos', forma: 'Cartão', valor: '120,00', op: 'Ana Costa', variant: 'green' },
                                                { hora: '08:00', tipo: 'Entrada', desc: 'Suprimento inicial', forma: 'Dinheiro', valor: '1.000,00', op: 'Sistema', variant: 'green' },
                                            ].map((m, i) => (
                                                <TableRow key={i} className="group hover:bg-app-bg-secondary/50 dark:hover:bg-app-card/5 transition-colors border-none">
                                                    <TableCell className="px-8 py-5 text-sm text-gray-600 dark:text-app-text-muted pl-8 font-normal">{m.hora}</TableCell>
                                                    <TableCell className="px-8 py-5">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-normal text-white shadow-sm ${m.variant === 'green' ? 'bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100' : 'bg-red-600 dark:bg-rose-900/40 dark:text-rose-100'}`}>
                                                            {m.tipo}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-8 py-5 text-sm font-normal text-gray-700 dark:text-white max-w-[200px] truncate">{m.desc}</TableCell>
                                                    <TableCell className="px-8 py-5 text-sm text-app-text-muted dark:text-app-text-muted font-normal">{m.forma}</TableCell>
                                                    <TableCell className={`px-8 py-5 text-sm font-normal ${m.variant === 'green' ? 'text-[#0052cc]' : 'text-[#B42318]'}`}>
                                                        {m.variant === 'green' ? '+ R$ ' : '- R$ '} {m.valor}
                                                    </TableCell>
                                                    <TableCell className="px-8 py-5 text-sm text-gray-600 dark:text-white/80 font-normal">{m.op}</TableCell>
                                                    <TableCell className="px-8 py-5 text-right pr-8">
                                                        <button className="p-2 text-app-text-muted hover:text-gray-600 dark:hover:text-white transition-colors font-normal">
                                                            <MoreVertical size={16} />
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                {/* Decorative bottom bar */}
                                <div className="h-1.5 w-full bg-[#0039A6] dark:bg-emerald-500/50"></div>
                            </Card>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="space-y-6">
                            <Card className="border border-gray-100 dark:border-app-border-dark shadow-sm rounded-[20px] overflow-hidden bg-app-card dark:bg-[#0c1e3d] p-8">
                                <h3 className="text-lg font-normal text-gray-800 dark:text-white mb-6">Resumo</h3>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <p className="text-[12px] font-normal text-blue-900/40 dark:text-app-text-muted uppercase tracking-wider">Por forma de pagamento</p>
                                        <div className="space-y-5">
                                                {[
                                                    { label: 'Dinheiro', icon: Banknote, value: 'R$ 620,00' },
                                                    { label: 'PIX', icon: Smartphone, value: 'R$ 350,00' },
                                                    { label: 'Cartão Empresarial', icon: CreditCard, value: 'R$ 120,00' },
                                                    { label: 'Boleto', icon: FileText, value: 'R$ 0,00' },
                                                ].map((row, i) => (
                                                <div key={i} className="flex items-center justify-between group">
                                                    <div className="flex items-center gap-3">
                                                        <row.icon size={18} className="text-app-text-muted" />
                                                        <span className="text-sm font-normal text-gray-600 dark:text-white/80">{row.label}</span>
                                                    </div>
                                                    <span className="text-sm font-normal text-gray-800 dark:text-white">{row.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100 dark:border-app-border-dark space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-app-text-muted">Total de entradas</span>
                                            <span className="text-[#0052cc] font-normal">R$ 1.090,00</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-app-text-muted">Total de saídas</span>
                                            <span className="text-[#B42318] font-normal">R$ 500,00</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-base font-normal text-gray-900 dark:text-white">Saldo final</span>
                                            <span className="text-xl font-normal text-[#0039A6] dark:text-emerald-500">R$ 970,00</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'cartao' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <Card className="p-6 rounded-[20px] border border-app-border dark:border-app-border-dark">
                        <h3 className="text-lg font-normal text-gray-900 dark:text-white mb-4">Cartões empresariais cadastrados</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cartoes.map((card) => (
                                <div key={card.id} className="rounded-xl border border-app-border dark:border-app-border-dark p-4 bg-app-bg-secondary/40 dark:bg-app-card/10">
                                    <p className="text-sm text-app-text-muted">Banco</p>
                                    <p className="text-base text-gray-900 dark:text-white">{card.banco}</p>
                                    <p className="text-sm text-app-text-muted mt-2">Limite</p>
                                    <p className="text-lg text-[#0039A6] dark:text-emerald-400">R$ {card.limite.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    <p className="text-xs text-app-text-muted mt-1">Fecha dia {card.fechamentoDia} • Vence dia {card.vencimentoDia}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-[20px] border border-app-border dark:border-app-border-dark overflow-hidden">
                        <div className="px-6 py-4 border-b border-app-border dark:border-app-border-dark">
                            <h3 className="text-lg font-normal text-gray-900 dark:text-white">Faturas</h3>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Competência</TableHead>
                                    <TableHead>Valor total</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {faturas.map((fatura) => (
                                    <TableRow key={fatura.id}>
                                        <TableCell>{fatura.competencia}</TableCell>
                                        <TableCell>R$ {fatura.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                                        <TableCell>
                                            <Badge className={fatura.status === 'Paga' ? 'bg-emerald-600 text-white' : fatura.status === 'Fechada' ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white'}>
                                                {fatura.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            )}


            {activeTab === 'dre' && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <DREView />
                </div>
            )}
            <NovoLancamentoModal
                isOpen={isNovoLancamentoModalOpen}
                onClose={() => setIsNovoLancamentoModalOpen(false)}
            />
        </div>
    )
}
    const cartoes = loadCartoes()
    const faturas = loadFaturas()
