import { useState, useMemo } from 'react'
import {
    Search,
    Package,
    AlertTriangle,
    AlertOctagon,
    Clock,
    Plus,
    MoreVertical,
    Eye,
    Edit2,
    Trash2,
    Archive,
    Calendar,
    ChevronDown} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell
} from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb'
import { MOCK_STOCK_ITEMS, StockItem } from '@/mocks/gestor/estoque'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/Dialog'



interface EstoqueViewProps {
    onPageChange?: (page: string) => void
}

export const EstoqueView = ({ onPageChange }: EstoqueViewProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedUnit, setSelectedUnit] = useState('Todas')
    const [isNovoItemOpen, setIsNovoItemOpen] = useState(false)

    // Mock data based on images
    const [items, setItems] = useState<StockItem[]>(MOCK_STOCK_ITEMS)
    const [novoItem, setNovoItem] = useState({
        product: '',
        lot: '',
        expirationDate: '',
        quantity: '',
        minQuantity: '',
        unitCost: '',
        unitPrice: ''
    })

    const parseMoney = (value: string) => Number(value.replace(/\./g, '').replace(',', '.'))
    const formatMoney = (value: number) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const filteredItems = useMemo(() => {
        const term = searchTerm.toLowerCase()
        return items.filter(item =>
            item.product.toLowerCase().includes(term) ||
            item.lot.toLowerCase().includes(term)
        )
    }, [searchTerm, items])
    const totals = useMemo(() => {
        const base = {
            totalItems: 0,
            totalUnits: 0,
            totalCost: 0,
            totalSale: 0,
            totalMarginValue: 0,
            totalMarginPercent: 0
        }
        const result = filteredItems.reduce((acc, item) => {
            const unitCost = parseMoney(item.unitCost)
            const unitPrice = parseMoney(item.unitPrice)
            acc.totalItems += 1
            acc.totalUnits += item.quantity
            acc.totalCost += unitCost * item.quantity
            acc.totalSale += unitPrice * item.quantity
            return acc
        }, base)
        result.totalMarginValue = result.totalSale - result.totalCost
        result.totalMarginPercent = result.totalCost > 0 ? (result.totalMarginValue / result.totalCost) * 100 : 0
        return result
    }, [filteredItems])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Adequado':
                return (
                    <Badge className="bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white border-none shadow-sm font-normal rounded-lg px-2.5 py-1 whitespace-nowrap flex items-center gap-1.5 w-fit">
                        <span className="h-1.5 w-1.5 rounded-full bg-app-card dark:bg-emerald-400"></span>
                        Adequado
                    </Badge>
                )
            case 'Baixo':
                return (
                    <Badge className="bg-amber-500 dark:bg-amber-900/40 dark:text-amber-100 text-white border-none shadow-sm font-normal rounded-lg px-2.5 py-1 whitespace-nowrap flex items-center gap-1.5 w-fit">
                        <AlertTriangle size={12} />
                        Estoque Baixo
                    </Badge>
                )
            case 'Crítico':
                return (
                    <Badge className="bg-red-600 dark:bg-red-900/40 dark:text-red-100 text-white border-none shadow-sm font-normal rounded-lg px-2.5 py-1 whitespace-nowrap flex items-center gap-1.5 w-fit">
                        <AlertOctagon size={12} />
                        Crítico
                    </Badge>
                )
            case 'Vencendo':
                return (
                    <Badge className="bg-orange-600 dark:bg-orange-950 dark:text-orange-200 text-white border-none shadow-sm font-normal rounded-lg px-2.5 py-1 whitespace-nowrap flex items-center gap-1.5 w-fit">
                        <Clock size={12} />
                        Vencendo
                    </Badge>
                )
            default:
                return <Badge variant="outline" className="rounded-lg">{status}</Badge>
        }
    }

    const toNumber = (value: string) => Number(value.replace(',', '.')) || 0
    const toBRDate = (isoDate: string) => {
        if (!isoDate) return ''
        const [year, month, day] = isoDate.split('-')
        return `${day}/${month}/${year}`
    }
    const calcularStatusNovoItem = (quantity: number, minQuantity: number, expirationDateIso: string): StockItem['status'] => {
        const hoje = new Date('2026-02-21T00:00:00')
        const venc = expirationDateIso ? new Date(`${expirationDateIso}T00:00:00`) : null
        if (venc) {
            const diffDias = Math.ceil((venc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
            if (diffDias <= 30) return 'Vencendo'
        }
        if (quantity <= Math.max(1, Math.floor(minQuantity * 0.5))) return 'Crítico'
        if (quantity < minQuantity) return 'Baixo'
        return 'Adequado'
    }
    const handleSalvarNovoItem = () => {
        const quantity = Number(novoItem.quantity) || 0
        const minQuantity = Number(novoItem.minQuantity) || 0
        const status = calcularStatusNovoItem(quantity, minQuantity, novoItem.expirationDate)

        const item: StockItem = {
            id: Date.now(),
            product: novoItem.product || 'Novo produto',
            lot: novoItem.lot || '-',
            expirationDate: toBRDate(novoItem.expirationDate) || '01/12/2026',
            quantity,
            minQuantity,
            unitCost: toNumber(novoItem.unitCost).toFixed(2).replace('.', ','),
            unitPrice: toNumber(novoItem.unitPrice).toFixed(2).replace('.', ','),
            status
        }

        setItems((prev) => [item, ...prev])
        setNovoItem({
            product: '',
            lot: '',
            expirationDate: '',
            quantity: '',
            minQuantity: '',
            unitCost: '',
            unitPrice: ''
        })
        setIsNovoItemOpen(false)
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Breadcrumb */}
            <div className="flex justify-between items-center">
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
                            <BreadcrumbPage className="text-sm font-normal text-gray-900 dark:text-white">Estoque por unidade</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <Button onClick={() => setIsNovoItemOpen(true)} className="h-10 bg-[#0039A6] hover:bg-[#002a7a] text-white font-normal rounded-lg px-4 flex items-center gap-2">
                    <Plus size={18} />
                    Novo item
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total de Produtos */}
                <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-app-card dark:bg-[#0c1e3d] rounded-xl">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <span className="text-sm font-normal text-gray-600 dark:text-app-text-muted">Total de produtos</span>
                            <div className="h-8 w-8 rounded bg-[#0039A6] flex items-center justify-center text-white">
                                <Package size={16} />
                            </div>
                        </div>
                        <div className="mt-4 space-y-1">
                            <h3 className="text-2xl font-normal text-[#101828] dark:text-white">7</h3>
                            <p className="text-xs text-[#6a7282] dark:text-app-text-muted font-normal">Categorias ativas</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Estoque Baixo */}
                <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-app-card dark:bg-[#0c1e3d] rounded-xl">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <span className="text-sm font-normal text-gray-600 dark:text-app-text-muted">Estoque baixo</span>
                            <div className="h-8 w-8 rounded bg-amber-400 flex items-center justify-center text-white">
                                <AlertTriangle size={16} />
                            </div>
                        </div>
                        <div className="mt-4 space-y-1">
                            <h3 className="text-2xl font-normal text-[#101828] dark:text-white">1</h3>
                            <p className="text-xs text-[#6a7282] dark:text-app-text-muted font-normal">Produtos precisam reposição</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Críticos */}
                <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-app-card dark:bg-[#0c1e3d] rounded-xl">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <span className="text-sm font-normal text-gray-600 dark:text-app-text-muted">Críticos</span>
                            <div className="h-8 w-8 rounded bg-red-500 flex items-center justify-center text-white">
                                <AlertOctagon size={16} />
                            </div>
                        </div>
                        <div className="mt-4 space-y-1">
                            <h3 className="text-2xl font-normal text-[#101828] dark:text-white">1</h3>
                            <p className="text-xs text-[#6a7282] dark:text-app-text-muted font-normal">Reposição urgente</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Vencendo em Breve */}
                <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-app-card dark:bg-[#0c1e3d] rounded-xl">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <span className="text-sm font-normal text-gray-600 dark:text-app-text-muted">Vencendo em breve</span>
                            <div className="h-8 w-8 rounded bg-orange-500 flex items-center justify-center text-white">
                                <Clock size={16} />
                            </div>
                        </div>
                        <div className="mt-4 space-y-1">
                            <h3 className="text-2xl font-normal text-[#101828] dark:text-white">1</h3>
                            <p className="text-xs text-[#6a7282] dark:text-app-text-muted font-normal">Próximos 30 dias</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Card with Table */}
            <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0">
                    {/* Header Table Section */}
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 bg-app-card dark:bg-[#0c1e3d] p-6 rounded-t-xl border border-b-0 border-app-border dark:border-gray-800">
                        <h2 className="text-lg font-normal text-gray-900 dark:text-white shrink-0">Estoque consolidado</h2>

                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-start sm:items-center flex-wrap justify-end">
                            {/* Search */}
                            <div className="flex gap-2 w-full sm:w-auto">
                                <div className="relative w-full sm:w-[240px]">
                                    <Input
                                        placeholder="Buscar produto ou lote..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="h-10 bg-app-bg-secondary dark:bg-[#0039A6] border-app-border dark:border-app-border-dark rounded-lg pr-10 focus:ring-1 focus:ring-[#0039A6] focus:border-[#0039A6] font-normal"
                                    />
                                </div>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-10 w-10 border-app-border bg-app-card dark:bg-[#0c1e3d] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5 rounded-lg shrink-0 font-normal"
                                >
                                    <Search size={18} className="text-app-text-muted dark:text-app-text-muted" />
                                </Button>
                            </div>

                            {/* Tombar Button */}
                            <Button
                                variant="outline"
                                className="h-10 border-app-border bg-app-card dark:bg-[#0c1e3d] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5 rounded-lg font-normal text-gray-700 dark:text-white/80 gap-2 whitespace-nowrap w-full sm:w-auto"
                            >
                                <Archive size={16} />
                                Tombar produtos
                            </Button>

                            {/* Unit Filter */}
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                                <span className="text-sm text-app-text-muted dark:text-app-text-muted whitespace-nowrap font-normal">Unidade:</span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="h-10 min-w-[140px] justify-between border-app-border bg-app-bg-secondary dark:bg-[#0c1e3d] dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/5 rounded-lg text-gray-700 dark:text-white/80 font-normal"
                                        >
                                            {selectedUnit}
                                            <ChevronDown size={14} className="text-app-text-muted" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[140px] bg-app-card dark:bg-[#0c1e3d] border-app-border dark:border-gray-800">
                                        <DropdownMenuItem onClick={() => setSelectedUnit('Todas')}>Todas</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedUnit('Clínica Central')}>Clínica Central</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedUnit('Unidade Norte')}>Unidade Norte</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                    <div className="border border-t-0 border-app-border dark:border-gray-800 bg-app-bg-secondary/40 dark:bg-[#0a1630] px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                            <div className="flex flex-col">
                                <span className="text-[11px] text-app-text-muted uppercase tracking-wider font-normal">Produtos</span>
                                <span className="text-base font-normal text-gray-900 dark:text-white">{totals.totalItems}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] text-app-text-muted uppercase tracking-wider font-normal">Quantidade total</span>
                                <span className="text-base font-normal text-gray-900 dark:text-white">{totals.totalUnits}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] text-app-text-muted uppercase tracking-wider font-normal">Custo total</span>
                                <span className="text-base font-normal text-gray-900 dark:text-white">R$ {formatMoney(totals.totalCost)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] text-app-text-muted uppercase tracking-wider font-normal">Venda total</span>
                                <span className="text-base font-normal text-gray-900 dark:text-white">R$ {formatMoney(totals.totalSale)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] text-app-text-muted uppercase tracking-wider font-normal">Margem total</span>
                                <span className="text-base font-normal text-emerald-600 dark:text-emerald-400">
                                    R$ {formatMoney(totals.totalMarginValue)} ({totals.totalMarginPercent.toFixed(1)}%)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-app-card dark:bg-[#0c1e3d] rounded-b-xl border border-t-0 border-app-border dark:border-gray-800 shadow-sm overflow-hidden mt-0">
                        <div className="overflow-x-auto custom-scrollbar">
                            <Table>
                                <TableHeader className="bg-app-card dark:bg-[#0c1e3d]">
                                    <TableRow className="hover:bg-transparent border-b border-gray-100 dark:border-gray-800">
                                        <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Produto</TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Lote</TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Validade</TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider text-center whitespace-nowrap">Quantidade</TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider text-center whitespace-nowrap">Mín.</TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider text-right whitespace-nowrap">Custo Unit.<br /><span className="text-[10px] font-normal lowercase">(R$)</span></TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider text-right whitespace-nowrap">Venda Unit.<br /><span className="text-[10px] font-normal lowercase">(R$)</span></TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider text-right whitespace-nowrap">Margem<br /><span className="text-[10px] font-normal lowercase">(R$)</span></TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider text-right whitespace-nowrap">Margem<br /><span className="text-[10px] font-normal lowercase">(%)</span></TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Status</TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-normal text-[#6a7282] dark:text-app-text-muted uppercase tracking-wider text-right whitespace-nowrap">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.map((item) => {
                                        const unitCost = parseMoney(item.unitCost)
                                        const unitPrice = parseMoney(item.unitPrice)
                                        const marginValue = unitPrice - unitCost
                                        const marginPercent = unitCost > 0 ? (marginValue / unitCost) * 100 : 0
                                        return (
                                        <TableRow key={item.id} className="hover:bg-app-bg-secondary/50 dark:hover:bg-app-card/5 border-b border-gray-50 dark:border-gray-800 transition-colors">
                                            <TableCell className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-normal text-[#101828] dark:text-white whitespace-nowrap">{item.product}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <span className="text-sm text-[#6a7282] dark:text-app-text-muted whitespace-nowrap font-normal">{item.lot}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <div className="flex items-center gap-1.5 text-[#6a7282] dark:text-app-text-muted">
                                                    <Calendar size={14} />
                                                    <span className="text-sm whitespace-nowrap font-normal">{item.expirationDate}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5 text-center">
                                                <span className="text-sm font-normal text-[#6a7282] dark:text-app-text-muted whitespace-nowrap">{item.quantity}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-5 text-center">
                                                <span className="text-sm text-[#6a7282] dark:text-app-text-muted whitespace-nowrap font-normal">{item.minQuantity}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-5 text-right">
                                                <span className="text-sm text-[#6a7282] dark:text-white whitespace-nowrap font-normal">{item.unitCost}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-5 text-right">
                                                <span className="text-sm text-[#6a7282] dark:text-white whitespace-nowrap font-normal">{item.unitPrice}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-5 text-right">
                                                <span className="text-sm font-normal text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{formatMoney(marginValue)}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-5 text-right">
                                                <span className="text-sm font-normal text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{marginPercent.toFixed(1)}%</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                {getStatusBadge(item.status)}
                                            </TableCell>
                                            <TableCell className="px-6 py-5 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="p-2 hover:bg-app-bg-secondary dark:hover:bg-app-card/10 rounded-lg transition-all text-app-text-muted outline-none focus:ring-2 focus:ring-[#0039A6]/20 font-normal">
                                                            <MoreVertical size={20} />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border-gray-100 dark:border-gray-800 dark:bg-[#0c1e3d]">
                                                        <DropdownMenuItem className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer hover:bg-app-bg-secondary dark:hover:bg-app-card/5 text-gray-700 dark:text-gray-200 font-normal">
                                                            <Eye size={16} className="text-app-text-muted" />
                                                            <span className="text-sm font-normal">Visualizar</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer hover:bg-app-bg-secondary dark:hover:bg-app-card/5 text-gray-700 dark:text-gray-200 font-normal">
                                                            <Edit2 size={16} className="text-app-text-muted" />
                                                            <span className="text-sm font-normal">Editar</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 font-normal">
                                                            <Trash2 size={16} />
                                                            <span className="text-sm font-normal">Excluir</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                            {filteredItems.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="w-12 h-12 bg-app-bg-secondary dark:bg-app-card/5 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Search size={24} className="text-app-text-muted" />
                                    </div>
                                    <h3 className="text-sm font-normal text-gray-900 dark:text-white">Nenhum item encontrado</h3>
                                    <p className="text-sm text-app-text-muted dark:text-app-text-muted mt-1 font-normal">Tente buscar por outro termo.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </CardContent>
            </Card>

            <Dialog open={isNovoItemOpen} onOpenChange={setIsNovoItemOpen}>
                <DialogContent className="max-w-[560px] bg-app-card dark:bg-app-card-dark rounded-[14px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-normal">Novo item de estoque</DialogTitle>
                    </DialogHeader>

                    <div className="p-6 pt-2 space-y-5 pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                placeholder="Produto"
                                value={novoItem.product}
                                onChange={(e) => setNovoItem((prev) => ({ ...prev, product: e.target.value }))}
                                className="h-11 rounded-[10px] bg-app-bg-secondary/50 dark:bg-app-bg-dark"
                            />
                            <Input
                                placeholder="Lote"
                                value={novoItem.lot}
                                onChange={(e) => setNovoItem((prev) => ({ ...prev, lot: e.target.value }))}
                                className="h-11 rounded-[10px] bg-app-bg-secondary/50 dark:bg-app-bg-dark"
                            />
                            <Input
                                type="date"
                                hideDateIcon
                                value={novoItem.expirationDate}
                                onChange={(e) => setNovoItem((prev) => ({ ...prev, expirationDate: e.target.value }))}
                                className="h-11 rounded-[10px] bg-app-bg-secondary/50 dark:bg-app-bg-dark"
                            />
                            <Input
                                placeholder="Quantidade"
                                type="number"
                                value={novoItem.quantity}
                                onChange={(e) => setNovoItem((prev) => ({ ...prev, quantity: e.target.value }))}
                                className="h-11 rounded-[10px] bg-app-bg-secondary/50 dark:bg-app-bg-dark"
                            />
                            <Input
                                placeholder="Quantidade m?nima"
                                type="number"
                                value={novoItem.minQuantity}
                                onChange={(e) => setNovoItem((prev) => ({ ...prev, minQuantity: e.target.value }))}
                                className="h-11 rounded-[10px] bg-app-bg-secondary/50 dark:bg-app-bg-dark"
                            />
                            <Input
                                placeholder="Custo unit?rio (ex: 52,00)"
                                value={novoItem.unitCost}
                                onChange={(e) => setNovoItem((prev) => ({ ...prev, unitCost: e.target.value }))}
                                className="h-11 rounded-[10px] bg-app-bg-secondary/50 dark:bg-app-bg-dark"
                            />
                            <Input
                                placeholder="Pre?o de venda (ex: 150,00)"
                                value={novoItem.unitPrice}
                                onChange={(e) => setNovoItem((prev) => ({ ...prev, unitPrice: e.target.value }))}
                                className="h-11 rounded-[10px] bg-app-bg-secondary/50 dark:bg-app-bg-dark md:col-span-2"
                            />
                        </div>

                        <DialogFooter className="pt-2 gap-3 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsNovoItemOpen(false)}
                                className="w-full sm:w-auto h-11 px-6 rounded-[10px]"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSalvarNovoItem}
                                className="w-full sm:w-auto h-11 px-8 rounded-[10px] bg-[#0039A6] hover:bg-[#002a7a] text-white"
                            >
                                Salvar item
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
