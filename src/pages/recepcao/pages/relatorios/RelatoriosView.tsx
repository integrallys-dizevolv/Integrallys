import { useState, useMemo, useEffect } from 'react'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Card, CardContent } from '@/components/ui/Card'
import {
    Calendar,
    Users,
    Activity,
    Printer,
    Download,
    Search,
    CheckCircle2,
    XCircle,
    AlertCircle,
    DollarSign,
    ShoppingBag,
    FileText,
    Package,
    RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
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
    TableRow,
} from '@/components/ui/Table'

// Mocks
import { MOCK_RELATORIOS_PERFORMANCE } from '@/mocks/recepcionista/relatorios'
import { MOCK_RELATORIO_CONSULTAS } from '@/mocks/recepcionista/relatoriosConsultas'
import { MOCK_PACIENTES_RELATORIO, DashboardPatient } from '@/mocks/recepcionista/relatoriosPacientes'
import { MOCK_RELATORIO_VENDAS, SaleReportItem } from '@/mocks/recepcionista/relatoriosVendas'
import { MOCK_RELATORIO_ORCAMENTOS, BudgetReportItem } from '@/mocks/recepcionista/relatoriosOrcamentos'
import { MOCK_ESTOQUE_SALDO, MOCK_ESTOQUE_MOVIMENTACAO, InventoryItem, InventoryMovement } from '@/mocks/recepcionista/relatoriosEstoque'
import { MOCK_RELATORIO_CANCELAMENTOS, RelatorioCancelamentoItem } from '@/mocks/recepcionista/relatoriosCancelamentos'
import { MOCK_RELATORIO_RECEBIMENTOS, RelatorioRecebimentoItem } from '@/mocks/recepcionista/relatoriosRecebimentos'
import { MOCK_RELATORIO_RETORNOS, RelatorioRetornoItem } from '@/mocks/recepcionista/relatoriosRetornos'
import { loadAgendaCancellationEvents } from '@/utils/agendaCancelamentos'

interface RelatoriosViewProps {
    onPageChange?: (page: string) => void;
}

export const RelatoriosView = ({ onPageChange }: RelatoriosViewProps) => {
    const setCurrentPage = onPageChange;
    const [activeTab, setActiveTab] = useState('Consultas')
    const [period, setPeriod] = useState('Últimos 30 dias')

    // Filter States for Consultas
    const [searchTerm, setSearchTerm] = useState('')
    const [specialistFilter, setSpecialistFilter] = useState('todos')
    const [planFilter, setPlanFilter] = useState('todos')
    const [unitFilter, setUnitFilter] = useState('todos')
    const [statusFilter, setStatusFilter] = useState('todos')

    // Filter States for Pacientes
    const [patientSearchTerm, setPatientSearchTerm] = useState('')
    const [birthMonthFilter, setBirthMonthFilter] = useState('todos')
    const [sourceFilter, setSourceFilter] = useState('todos')
    const [genderFilter, setGenderFilter] = useState('todos')
    const [cityFilter, setCityFilter] = useState('todos')
    const [patientPlanFilter, setPatientPlanFilter] = useState('todos')
    const [onlyNoShows, setOnlyNoShows] = useState(false)

    // Filter States for Vendas
    const [salesSearchTerm, setSalesSearchTerm] = useState('')
    const [salesProductFilter, setSalesProductFilter] = useState('todos')
    const [salesProfessionalFilter, setSalesProfessionalFilter] = useState('todos')
    const [salesUserFilter, setSalesUserFilter] = useState('todos')
    const [salesUnitFilter, setSalesUnitFilter] = useState('todos')
    const [salesPaymentMethodFilter, setSalesPaymentMethodFilter] = useState('todos')

    // Filter States for Orçamentos
    const [budgetSearchTerm, setBudgetSearchTerm] = useState('')
    const [budgetUnitFilter, setBudgetUnitFilter] = useState('todos')
    const [budgetProfessionalFilter, setBudgetProfessionalFilter] = useState('todos')
    const [budgetStatusFilter, setBudgetStatusFilter] = useState('todos')

    // Filter States for Estoque
    const [stockViewMode, setStockViewMode] = useState<'saldo' | 'movimentacao'>('saldo')
    const [stockSearchTerm, setStockSearchTerm] = useState('')
    const [stockUnitFilter, setStockUnitFilter] = useState('todos')
    const [stockStatusFilter, setStockStatusFilter] = useState('todos') // Em Estoque, Baixo, etc.
    const [stockTypeFilter, setStockTypeFilter] = useState('todos') // Suprimentos / Prescricao/Vendas
    const [stockMovementTypeFilter, setStockMovementTypeFilter] = useState('todos') // Entrada, Saída

    // Filter States for Cancelamentos
    const [cancellationSearchTerm, setCancellationSearchTerm] = useState('')
    const [cancellationStatusFilter, setCancellationStatusFilter] = useState('todos')
    const [cancellationProfessionalFilter, setCancellationProfessionalFilter] = useState('todos')

    // Filter States for Recebimentos
    const [receiptsSearchTerm, setReceiptsSearchTerm] = useState('')
    const [receiptsStatusFilter, setReceiptsStatusFilter] = useState('todos')
    const [receiptsPaymentMethodFilter, setReceiptsPaymentMethodFilter] = useState('todos')
    const [receiptsDateFilter, setReceiptsDateFilter] = useState<'venda' | 'compensacao'>('venda')

    // Filter States for Retornos
    const [returnsSearchTerm, setReturnsSearchTerm] = useState('')
    const [returnsProfessionalFilter, setReturnsProfessionalFilter] = useState('todos')
    const [returnsSpecialtyFilter, setReturnsSpecialtyFilter] = useState('todos')
    const [returnsStatusFilter, setReturnsStatusFilter] = useState('todos')
    const [agendaCancellationEvents, setAgendaCancellationEvents] = useState(loadAgendaCancellationEvents())

    useEffect(() => {
        const syncEvents = () => setAgendaCancellationEvents(loadAgendaCancellationEvents())
        syncEvents()
        window.addEventListener('storage', syncEvents)
        return () => window.removeEventListener('storage', syncEvents)
    }, [])


    const tabs = [
        { name: 'Consultas', icon: Calendar },
        { name: 'Cancelamentos', icon: XCircle },
        { name: 'Retornos', icon: RotateCcw },
        { name: 'Recebimentos', icon: DollarSign },
        { name: 'Vendas', icon: ShoppingBag },
        { name: 'Orçamentos', icon: FileText },
        { name: 'Estoque', icon: Package },
        { name: 'Pacientes', icon: Users },
        { name: 'Performance', icon: Activity },
    ]

    const periods = [
        'Hoje',
        'Ontem',
        'Últimos 7 dias',
        'Últimos 30 dias',
        'Últimos 3 meses',
        'Este ano',
    ]

    const parseLocalDate = (dateString: string) => {
        if (!dateString) return null

        const normalized = dateString.trim()
        const [datePart] = normalized.split(' ')
        const [ymdPart] = datePart.split('T')

        if (ymdPart.includes('/')) {
            const [day, month, year] = ymdPart.split('/')
            const parsedYear = Number(year)
            const parsedMonth = Number(month)
            const parsedDay = Number(day)
            if (!parsedYear || !parsedMonth || !parsedDay) return null
            return new Date(parsedYear, parsedMonth - 1, parsedDay)
        }

        if (ymdPart.includes('-')) {
            const [year, month, day] = ymdPart.split('-')
            const parsedYear = Number(year)
            const parsedMonth = Number(month)
            const parsedDay = Number(day)
            if (!parsedYear || !parsedMonth || !parsedDay) return null
            return new Date(parsedYear, parsedMonth - 1, parsedDay)
        }

        return null
    }

    const getRetornoStatus = (returnDateString: string) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const returnDate = parseLocalDate(returnDateString)
        if (!returnDate) return 'Prazo vencido'

        const limitePrazoDate = new Date(returnDate)
        limitePrazoDate.setDate(limitePrazoDate.getDate() - 10)

        if (today > returnDate) return 'Prazo vencido'
        if (today >= limitePrazoDate) return 'Limite prazo'
        return 'No prazo'
    }

    // Helper to filter by date period
    const isWithinPeriod = useMemo(() => (dateString: string) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const date = parseLocalDate(dateString)
        if (!date) return false

        const diffTime = Math.abs(today.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        switch (period) {
            case 'Hoje':
                return date.toDateString() === today.toDateString()
            case 'Ontem': {
                const yesterday = new Date(today)
                yesterday.setDate(yesterday.getDate() - 1)
                return date.toDateString() === yesterday.toDateString()
            }
            case 'Últimos 7 dias':
                return diffDays <= 7
            case 'Últimos 30 dias':
                return diffDays <= 30
            case 'Últimos 3 meses':
                return diffDays <= 90
            case 'Este ano':
                return date.getFullYear() === today.getFullYear()
            default:
                return true
        }
    }, [period])

    // Filtered Consultas
    const filteredConsultas = useMemo(() => {
        return MOCK_RELATORIO_CONSULTAS.filter(item => {
            // Search (Name)
            const matchesSearch = item.paciente.toLowerCase().includes(searchTerm.toLowerCase())

            // Period
            const matchesPeriod = isWithinPeriod(item.data)

            // Filters
            const matchesSpecialist = specialistFilter === 'todos' || item.profissional === specialistFilter
            const matchesPlan = planFilter === 'todos' || item.plano === planFilter
            const matchesUnit = unitFilter === 'todos' || item.unidade === unitFilter
            const matchesStatus = statusFilter === 'todos' || item.statusConsulta === statusFilter

            return matchesSearch && matchesPeriod && matchesSpecialist && matchesPlan && matchesUnit && matchesStatus
        })
    }, [searchTerm, specialistFilter, planFilter, unitFilter, statusFilter, isWithinPeriod])

    // Totals Calculation
    const totals = useMemo(() => {
        return filteredConsultas.reduce((acc, curr) => {
            // For simplicity in totalizer:  
            // If Paid: add full value to received? No, if partial... 
            // Let's assume for MOCK simplicity:
            // Received: Sum of valorProcedimento where status is Pago
            // Open: Sum of valorProcedimento where status is Em Aberto

            // A more accurate way with 'Parcial' would require a 'valorPago' field. 
            // I'll stick to simplistic logic based on the status instructions.

            if (curr.statusPagamento === 'Pago') {
                acc.received += curr.valorProcedimento
            } else if (curr.statusPagamento === 'Em Aberto') {
                acc.open += curr.valorProcedimento
            } else if (curr.statusPagamento === 'Parcial') {
                // Split 50/50 for mock demo purposes
                acc.received += curr.valorProcedimento / 2
                acc.open += curr.valorProcedimento / 2
            }
            return acc
        }, { received: 0, open: 0 })
    }, [filteredConsultas])

    // Filter Logic for Other Tabs (Simplified from original)
    // ... (Keeping Pacientes and Performance logic as is/simplified)
    // Filter Logic for Pacientes
    const filteredPacientes = useMemo(() => {
        return MOCK_PACIENTES_RELATORIO.filter((patient: DashboardPatient) => {
            // Search (Name)
            const matchesSearch = patient.name.toLowerCase().includes(patientSearchTerm.toLowerCase())

            // Birth Month
            let matchesBirthMonth = true
            if (birthMonthFilter !== 'todos') {
                if (patient.birthDate) {
                    // Assumes YYYY-MM-DD
                    const month = new Date(patient.birthDate).getMonth() + 1 // 1-12
                    matchesBirthMonth = month.toString() === birthMonthFilter
                } else {
                    matchesBirthMonth = false
                }
            }

            // Source (Mídia)
            const matchesSource = sourceFilter === 'todos' || patient.source === sourceFilter

            // Gender
            const matchesGender = genderFilter === 'todos' || patient.gender?.toLowerCase() === genderFilter.toLowerCase()

            // City
            const matchesCity = cityFilter === 'todos' || patient.city === cityFilter

            // Plan
            const matchesPlan = patientPlanFilter === 'todos' || patient.plan === patientPlanFilter

            // No Shows
            const matchesNoShow = !onlyNoShows || (patient.noShowCount !== undefined && patient.noShowCount > 0)

            return matchesSearch && matchesBirthMonth && matchesSource && matchesGender && matchesCity && matchesPlan && matchesNoShow
        })
    }, [patientSearchTerm, birthMonthFilter, sourceFilter, genderFilter, cityFilter, patientPlanFilter, onlyNoShows])

    // Filtered Vendas
    const filteredVendas = useMemo(() => {
        return MOCK_RELATORIO_VENDAS.filter((item: SaleReportItem) => {
            // Search (Patient Name)
            const matchesSearch = item.patientName.toLowerCase().includes(salesSearchTerm.toLowerCase())

            // Period
            const matchesPeriod = isWithinPeriod(item.date)

            // Filters
            const matchesProduct = salesProductFilter === 'todos' || item.productName === salesProductFilter
            const matchesProfessional = salesProfessionalFilter === 'todos' || item.professionalName === salesProfessionalFilter
            const matchesUser = salesUserFilter === 'todos' || item.userName === salesUserFilter
            const matchesUnit = salesUnitFilter === 'todos' || item.unit === salesUnitFilter
            const matchesPaymentMethod = salesPaymentMethodFilter === 'todos' || item.paymentMethod === salesPaymentMethodFilter

            return matchesSearch && matchesPeriod && matchesProduct && matchesProfessional && matchesUser && matchesUnit && matchesPaymentMethod
        })
    }, [salesSearchTerm, isWithinPeriod, salesProductFilter, salesProfessionalFilter, salesUserFilter, salesUnitFilter, salesPaymentMethodFilter])

    // Sales Totals
    const salesTotals = useMemo(() => {
        return filteredVendas.reduce((acc, curr) => {
            acc.totalSold += curr.totalValue
            return acc
        }, { totalSold: 0 })
    }, [filteredVendas])

    // Filtered Budgets
    const filteredBudgets = useMemo(() => {
        return MOCK_RELATORIO_ORCAMENTOS.filter((item: BudgetReportItem) => {
            // Search (Patient Name)
            const matchesSearch = item.patientName.toLowerCase().includes(budgetSearchTerm.toLowerCase())

            // Period (Using Creation Date for filtering by date range)
            const matchesPeriod = isWithinPeriod(item.creationDate)

            // Filters
            const matchesUnit = budgetUnitFilter === 'todos' || item.unit === budgetUnitFilter
            const matchesProfessional = budgetProfessionalFilter === 'todos' || item.professionalName === budgetProfessionalFilter
            const matchesStatus = budgetStatusFilter === 'todos' || item.status === budgetStatusFilter

            return matchesSearch && matchesPeriod && matchesUnit && matchesProfessional && matchesStatus
        })
    }, [budgetSearchTerm, isWithinPeriod, budgetUnitFilter, budgetProfessionalFilter, budgetStatusFilter])

    // Budget Totals
    const budgetTotals = useMemo(() => {
        return filteredBudgets.reduce((acc, curr) => {
            acc.totalValue += curr.totalValue
            if (curr.status === 'No Prazo') acc.totalWithinDeadline += curr.totalValue
            if (curr.status === 'Vencido') acc.totalExpired += curr.totalValue
            return acc
        }, { totalValue: 0, totalWithinDeadline: 0, totalExpired: 0 })
    }, [filteredBudgets])

    // Filtered Stock Items (Saldo)
    const filteredStockItems = useMemo(() => {
        return MOCK_ESTOQUE_SALDO.filter((item: InventoryItem) => {
            const matchesSearch = item.productName.toLowerCase().includes(stockSearchTerm.toLowerCase()) ||
                item.batch.toLowerCase().includes(stockSearchTerm.toLowerCase())
            const matchesUnit = stockUnitFilter === 'todos' || item.unit === stockUnitFilter
            const matchesStatus = stockStatusFilter === 'todos' || item.status === stockStatusFilter
            const matchesStockType = stockTypeFilter === 'todos' || item.stockType === stockTypeFilter

            return matchesSearch && matchesUnit && matchesStatus && matchesStockType
        })
    }, [stockSearchTerm, stockUnitFilter, stockStatusFilter, stockTypeFilter])

    // Filtered Stock Movements (Movimentação)
    const filteredStockMovements = useMemo(() => {
        return MOCK_ESTOQUE_MOVIMENTACAO.filter((item: InventoryMovement) => {
            const matchesSearch = item.productName.toLowerCase().includes(stockSearchTerm.toLowerCase())
            const matchesPeriod = isWithinPeriod(item.date)
            const matchesUnit = stockUnitFilter === 'todos' || item.unit === stockUnitFilter
            const matchesType = stockMovementTypeFilter === 'todos' || item.type === stockMovementTypeFilter
            const matchesStockType = stockTypeFilter === 'todos' || item.stockType === stockTypeFilter

            return matchesSearch && matchesPeriod && matchesUnit && matchesType && matchesStockType
        })
    }, [stockSearchTerm, isWithinPeriod, stockUnitFilter, stockMovementTypeFilter, stockTypeFilter])

    // Stock Totals
    const stockTotals = useMemo(() => {
        const totalProducts = filteredStockItems.reduce((acc, curr) => acc + curr.quantity, 0)
        return { totalProducts }
    }, [filteredStockItems])

    const cancelamentosFonte = useMemo<RelatorioCancelamentoItem[]>(() => {
        const fromAgenda = agendaCancellationEvents.map((event, index) => {
            const created = new Date(event.createdAt)
            return {
                id: 100000 + index,
                paciente: event.patient,
                profissional: event.professional,
                unidade: event.unit,
                dataAgendada: event.appointmentDate,
                horaAgendada: event.appointmentTime,
                status: 'Cancelado' as const,
                motivo: 'Cancelamento',
                observacoes: event.reason,
                canceladoPor: event.cancelledBy,
                dataCancelamento: Number.isNaN(created.getTime()) ? '' : created.toLocaleString('pt-BR')
            }
        })

        return [...fromAgenda, ...MOCK_RELATORIO_CANCELAMENTOS]
    }, [agendaCancellationEvents])

    // Filtered Cancelamentos
    const filteredCancelamentos = useMemo(() => {
        return cancelamentosFonte.filter((item: RelatorioCancelamentoItem) => {
            const matchesSearch = item.paciente.toLowerCase().includes(cancellationSearchTerm.toLowerCase()) ||
                item.motivo.toLowerCase().includes(cancellationSearchTerm.toLowerCase())
            const matchesPeriod = isWithinPeriod(item.dataAgendada)
            const matchesStatus = cancellationStatusFilter === 'todos' || item.status === cancellationStatusFilter
            const matchesProfessional = cancellationProfessionalFilter === 'todos' || item.profissional === cancellationProfessionalFilter

            return matchesSearch && matchesPeriod && matchesStatus && matchesProfessional
        })
    }, [cancellationSearchTerm, isWithinPeriod, cancellationStatusFilter, cancellationProfessionalFilter, cancelamentosFonte])

    // Cancellation Totals
    const cancellationTotals = useMemo(() => {
        const totalCancelled = filteredCancelamentos.filter(i => i.status === 'Cancelado').length
        const totalNoShow = filteredCancelamentos.filter(i => i.status === 'Não Compareceu').length
        return { totalCancelled, totalNoShow }
    }, [filteredCancelamentos])

    // Filtered Receipts
    const getReceiptFees = (item: RelatorioRecebimentoItem) => {
        const parcelamentoPercent = item.taxaParcelamentoPercent ?? 0
        const antecipacaoPercent = item.taxaAntecipacaoPercent ?? 0
        const valorTaxaParcelamento = item.valorBruto * (parcelamentoPercent / 100)
        const valorTaxaAntecipacao = item.valorBruto * (antecipacaoPercent / 100)
        const valorTaxaTotal = valorTaxaParcelamento + valorTaxaAntecipacao
        const valorLiquido = item.valorBruto - valorTaxaTotal

        return {
            parcelamentoPercent,
            antecipacaoPercent,
            valorTaxaParcelamento,
            valorTaxaAntecipacao,
            valorTaxaTotal,
            valorLiquido,
        }
    }

    const filteredReceipts = useMemo(() => {
        return MOCK_RELATORIO_RECEBIMENTOS.filter((item: RelatorioRecebimentoItem) => {
            const matchesSearch = item.cliente.toLowerCase().includes(receiptsSearchTerm.toLowerCase()) ||
                item.descricao.toLowerCase().includes(receiptsSearchTerm.toLowerCase())
            const periodDate = receiptsDateFilter === 'venda' ? item.dataVenda : item.dataCompensacao
            const matchesPeriod = isWithinPeriod(periodDate)
            const matchesStatus = receiptsStatusFilter === 'todos' || item.status === receiptsStatusFilter
            const matchesPayment = receiptsPaymentMethodFilter === 'todos' || item.formaPagamento === receiptsPaymentMethodFilter

            return matchesSearch && matchesPeriod && matchesStatus && matchesPayment
        })
    }, [receiptsSearchTerm, isWithinPeriod, receiptsStatusFilter, receiptsPaymentMethodFilter, receiptsDateFilter])

    // Receipts Totals
    const receiptsTotals = useMemo(() => {
        const totalGross = filteredReceipts.reduce((acc, curr) => acc + curr.valorBruto, 0)
        const totalFees = filteredReceipts.reduce((acc, curr) => acc + getReceiptFees(curr).valorTaxaTotal, 0)
        const totalNet = filteredReceipts.reduce((acc, curr) => acc + getReceiptFees(curr).valorLiquido, 0)
        const totalReceived = filteredReceipts
            .filter(i => i.status === 'Recebido')
            .reduce((acc, curr) => acc + getReceiptFees(curr).valorLiquido, 0)
        const totalFuture = filteredReceipts
            .filter(i => i.status === 'A Receber')
            .reduce((acc, curr) => acc + getReceiptFees(curr).valorLiquido, 0)

        return { totalGross, totalFees, totalNet, totalReceived, totalFuture }
    }, [filteredReceipts])

    const retornoProfessionalOptions = useMemo(() => {
        const unique = new Set(MOCK_RELATORIO_RETORNOS.map(item => item.profissional))
        return Array.from(unique)
    }, [])

    const retornoSpecialtyOptions = useMemo(() => {
        const unique = new Set(MOCK_RELATORIO_RETORNOS.map(item => item.especialidade))
        return Array.from(unique)
    }, [])

    const filteredRetornos = useMemo(() => {
        return MOCK_RELATORIO_RETORNOS.filter((item: RelatorioRetornoItem) => {
            const matchesSearch = item.cliente.toLowerCase().includes(returnsSearchTerm.toLowerCase())
            const matchesPeriod = isWithinPeriod(item.data)
            const matchesProfessional = returnsProfessionalFilter === 'todos' || item.profissional === returnsProfessionalFilter
            const matchesSpecialty = returnsSpecialtyFilter === 'todos' || item.especialidade === returnsSpecialtyFilter
            const status = getRetornoStatus(item.proximoRetorno)
            const matchesStatus = returnsStatusFilter === 'todos' || status === returnsStatusFilter

            return matchesSearch && matchesPeriod && matchesProfessional && matchesSpecialty && matchesStatus
        })
    }, [returnsSearchTerm, returnsProfessionalFilter, returnsSpecialtyFilter, returnsStatusFilter, isWithinPeriod])

    const retornoTotals = useMemo(() => {
        const counts = { total: 0, noPrazo: 0, limitePrazo: 0, prazoVencido: 0 }
        filteredRetornos.forEach((item) => {
            counts.total += 1
            const status = getRetornoStatus(item.proximoRetorno)
            if (status === 'No prazo') counts.noPrazo += 1
            if (status === 'Limite prazo') counts.limitePrazo += 1
            if (status === 'Prazo vencido') counts.prazoVencido += 1
        })
        return counts
    }, [filteredRetornos])

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => setCurrentPage?.('inicio')} className="cursor-pointer text-app-text-primary/70 dark:text-white/80 hover:text-[#0039A6] dark:hover:text-white">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-app-text-primary dark:text-white font-normal">Relatórios</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div>
                <h1 className="text-3xl font-normal text-app-text-primary dark:text-white tracking-tight">Relatórios</h1>
                <p className="text-app-text-secondary dark:text-white/60 font-normal mt-1">
                    Visualize métricas e indicadores de consultas e performance
                </p>
            </div>

            <SegmentedControl
                options={tabs.map(tab => ({ value: tab.name, label: tab.name }))}
                value={activeTab}
                onChange={setActiveTab}
            />

            <div className="bg-app-card dark:bg-app-card-dark rounded-[24px] border border-app-border dark:border-app-border-dark shadow-sm min-h-[600px] overflow-hidden flex flex-col">
                <div className="p-8 flex-1 flex flex-col space-y-8">
                    {/* Header Controls */}
                    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-app-bg-secondary dark:bg-white/5 flex items-center justify-center">
                                {activeTab === 'Consultas' ? <Calendar className="text-[#101828] dark:text-white" size={20} /> :
                                    activeTab === 'Pacientes' ? <Users className="text-[#101828] dark:text-white" size={20} /> :
                                        activeTab === 'Vendas' ? <ShoppingBag className="text-[#101828] dark:text-white" size={20} /> :
                                            activeTab === 'Retornos' ? <RotateCcw className="text-[#101828] dark:text-white" size={20} /> :
                                                <Activity className="text-[#101828] dark:text-white" size={20} />}
                            </div>
                            <h2 className="text-xl font-normal text-app-text-primary dark:text-white">Relatório de {activeTab}</h2>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                            {/* Date Period Selector */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                                {periods.map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPeriod(p)}
                                        className={`px-4 py-2 rounded-xl text-xs font-normal transition-all whitespace-nowrap ${period === p
                                            ? 'bg-[#0039A6] text-white'
                                            : 'bg-app-card border border-app-border text-app-text-secondary hover:bg-app-bg-secondary dark:bg-white/5 dark:border-app-border-dark dark:text-white/60'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" className="h-10 px-4 rounded-xl border-app-border dark:border-app-border-dark font-normal flex items-center gap-2 hover:bg-app-bg-secondary transition-all">
                                    <Printer size={16} />
                                    Imprimir
                                </Button>
                                <Button className="h-10 px-4 rounded-xl bg-[#0039A6] hover:bg-[#002d82] text-white font-normal flex items-center gap-2 shadow-lg shadow-[#0039A6]/10 transition-all">
                                    <Download size={16} />
                                    Exportar
                                </Button>
                            </div>
                        </div>
                    </div>

                    {activeTab === 'Consultas' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 flex-1 flex flex-col">
                            {/* Header / Totalizer */}
                            <div className="bg-app-bg-secondary/30 dark:bg-white/5 rounded-xl p-6 border border-app-border dark:border-app-border-dark">
                                <div className="flex flex-col md:flex-row md:items-center justify-end gap-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                            <DollarSign size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-app-text-secondary uppercase tracking-wider">Total Recebido</span>
                                            <span className="text-2xl font-normal text-emerald-600 dark:text-emerald-400">R$ {totals.received.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                    <div className="w-px h-12 bg-app-border dark:bg-app-border-dark hidden md:block" />
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                            <AlertCircle size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-app-text-secondary uppercase tracking-wider">Total em Aberto</span>
                                            <span className="text-2xl font-normal text-amber-600 dark:text-amber-400">R$ {totals.open.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Filters Bar */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted" />
                                    <Input
                                        placeholder="Buscar paciente..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 h-10 rounded-xl border-app-border dark:border-app-border-dark bg-app-bg-secondary/30 dark:bg-white/5"
                                    />
                                </div>
                                <Select value={specialistFilter} onValueChange={setSpecialistFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todos os Especialistas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos os Especialistas</SelectItem>
                                        <SelectItem value="Dr. João Santos">Dr. João Santos</SelectItem>
                                        <SelectItem value="Dra. Ana Lima">Dra. Ana Lima</SelectItem>
                                        <SelectItem value="Dra. Flávia Alves">Dra. Flávia Alves</SelectItem>
                                        <SelectItem value="Dra. Sofia Castro">Dra. Sofia Castro</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={planFilter} onValueChange={setPlanFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todos os Convênios" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos os Convênios</SelectItem>
                                        <SelectItem value="Particular">Particular</SelectItem>
                                        <SelectItem value="Unimed">Unimed</SelectItem>
                                        <SelectItem value="Bradesco Saúde">Bradesco Saúde</SelectItem>
                                        <SelectItem value="SulAmérica">SulAmérica</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={unitFilter} onValueChange={setUnitFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todas as Unidades" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todas as Unidades</SelectItem>
                                        <SelectItem value="Central">Central</SelectItem>
                                        <SelectItem value="Norte">Norte</SelectItem>
                                        <SelectItem value="Sul">Sul</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todos os Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos os Status</SelectItem>
                                        <SelectItem value="Agendado">Agendado</SelectItem>
                                        <SelectItem value="Realizado">Realizado</SelectItem>
                                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                                        <SelectItem value="Nao Compareceu">Não Compareceu</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Table */}
                            <div className="rounded-xl border border-app-border dark:border-app-border-dark overflow-hidden flex-1">
                                <Table>
                                    <TableHeader className="bg-app-bg-secondary/50 dark:bg-white/5">
                                        <TableRow className="hover:bg-transparent border-b border-app-border dark:border-app-border-dark">
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Data/Hora</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Paciente</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Procedimento</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Profissional/Unid.</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Plano</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Recorrência</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Status Pagamento</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Status</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary text-right">Valor</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredConsultas.length > 0 ? (
                                            filteredConsultas.map((item) => (
                                                <TableRow key={item.id} className="hover:bg-app-bg-secondary/30 dark:hover:bg-white/5 transition-colors border-b border-app-border/50">
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-app-text-primary dark:text-white font-medium">{item.data}</span>
                                                            <span className="text-xs text-app-text-secondary dark:text-white/60">{item.hora}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className="text-app-text-primary dark:text-white font-normal">{item.paciente}</span>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className="text-app-text-secondary dark:text-white/80">{item.procedimento}</span>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-app-text-primary dark:text-white text-sm">{item.profissional}</span>
                                                            <span className="text-xs text-app-text-secondary dark:text-white/60">{item.unidade}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <Badge variant="outline" className="font-normal text-xs border-app-border text-app-text-secondary">
                                                            {item.plano}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-16 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-[#0039A6] rounded-full"
                                                                    style={{ width: `${item.recorrencia}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-app-text-secondary">{item.recorrencia}%</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <Badge variant="outline" className={cn("w-fit font-normal text-[10px] border-none px-2",
                                                                item.statusPagamento === 'Pago' ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                                                                    item.statusPagamento === 'Em Aberto' ? "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" :
                                                                        item.statusPagamento === 'Parcial' ? "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" :
                                                                            "bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                                            )}>
                                                                {item.statusPagamento}
                                                            </Badge>
                                                            {item.metodoPagamento && item.metodoPagamento.length > 0 && (
                                                                <span className="text-[10px] text-app-text-muted px-1">
                                                                    {item.metodoPagamento.join(', ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-1.5">
                                                                {item.statusConsulta === 'Realizado' && <CheckCircle2 size={14} className="text-emerald-500" />}
                                                                {item.statusConsulta === 'Cancelado' && <XCircle size={14} className="text-red-500" />}
                                                                {item.statusConsulta === 'Agendado' && <Calendar size={14} className="text-blue-500" />}
                                        {item.statusConsulta === 'Nao Compareceu' && <AlertCircle size={14} className="text-amber-500" />}
                                                                <span className="text-sm text-app-text-primary dark:text-white">{item.statusConsulta}</span>
                                                            </div>
                                                            {item.statusConsulta === 'Cancelado' && item.justificativaCancelamento && (
                                                                <span className="text-[10px] text-red-600 dark:text-red-400 mt-1 max-w-[150px] leading-tight">
                                                                    {item.justificativaCancelamento}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-right">
                                                        <span className="font-medium text-app-text-primary dark:text-white">
                                                            R$ {item.valorProcedimento.toFixed(2)}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={9} className="h-32 text-center text-app-text-secondary">
                                                    Nenhum registro encontrado para os filtros selecionados.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>


                        </div>
                    )}

                    {activeTab === 'Cancelamentos' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 flex-1 flex flex-col">
                            {/* Header / Totalizer */}
                            <div className="bg-app-bg-secondary/30 dark:bg-white/5 rounded-xl p-6 border border-app-border dark:border-app-border-dark">
                                <div className="flex flex-col md:flex-row md:items-center justify-end gap-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                                            <XCircle size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-app-text-secondary uppercase tracking-wider">Cancelados</span>
                                            <span className="text-2xl font-normal text-red-600 dark:text-red-400">{cancellationTotals.totalCancelled}</span>
                                        </div>
                                    </div>
                                    <div className="w-px h-12 bg-app-border dark:bg-app-border-dark hidden md:block" />
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                            <AlertCircle size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-app-text-secondary uppercase tracking-wider">Não Compareceu</span>
                                            <span className="text-2xl font-normal text-amber-600 dark:text-amber-400">{cancellationTotals.totalNoShow}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Filters Bar */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted" />
                                    <Input
                                        placeholder="Buscar paciente ou motivo..."
                                        value={cancellationSearchTerm}
                                        onChange={(e) => setCancellationSearchTerm(e.target.value)}
                                        className="pl-9 h-10 rounded-xl border-app-border dark:border-app-border-dark bg-app-bg-secondary/30 dark:bg-white/5"
                                    />
                                </div>
                                <Select value={cancellationProfessionalFilter} onValueChange={setCancellationProfessionalFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todos os Profissionais" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos os Profissionais</SelectItem>
                                        <SelectItem value="Dr. João Santos">Dr. João Santos</SelectItem>
                                        <SelectItem value="Dra. Ana Lima">Dra. Ana Lima</SelectItem>
                                        <SelectItem value="Dra. Flávia Alves">Dra. Flávia Alves</SelectItem>
                                        <SelectItem value="Dra. Sofia Castro">Dra. Sofia Castro</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={cancellationStatusFilter} onValueChange={setCancellationStatusFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todos os Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos os Status</SelectItem>
                                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                                        <SelectItem value="Nao Compareceu">Não Compareceu</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Table */}
                            <div className="rounded-xl border border-app-border dark:border-app-border-dark overflow-hidden flex-1">
                                <Table>
                                    <TableHeader className="bg-app-bg-secondary/50 dark:bg-white/5">
                                        <TableRow className="hover:bg-transparent border-b border-app-border dark:border-app-border-dark">
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider pl-6 w-[140px]">Data/Hora</TableHead>
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider">Paciente</TableHead>
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider">Profissional / Unidade</TableHead>
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider w-[120px]">Status</TableHead>
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider">Motivo / Justificativa</TableHead>
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider">Cancelado Por</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCancelamentos.length > 0 ? (
                                            filteredCancelamentos.map((item) => (
                                                <TableRow key={item.id} className="hover:bg-app-bg-secondary/30 dark:hover:bg-white/5 transition-colors border-b border-app-border/50">
                                                    <TableCell className="py-4 pl-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-app-text-primary dark:text-white font-medium">{new Date(item.dataAgendada).toLocaleDateString('pt-BR')}</span>
                                                            <span className="text-xs text-app-text-secondary dark:text-white/60">{item.horaAgendada}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className="text-app-text-primary dark:text-white font-normal">{item.paciente}</span>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-app-text-primary dark:text-white text-sm">{item.profissional}</span>
                                                            <span className="text-xs text-app-text-secondary dark:text-white/60">{item.unidade}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <Badge variant="outline" className={cn("font-normal text-[10px] border-none px-2",
                                                            item.status === 'Cancelado'
                                                                ? "bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                                                : "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                                                        )}>
                                                            {item.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-sm text-app-text-primary dark:text-white font-medium">{item.motivo}</span>
                                                            {item.observacoes && (
                                                                <span className="text-xs text-app-text-secondary dark:text-white/60 truncate max-w-[200px]" title={item.observacoes}>
                                                                    {item.observacoes}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-app-text-primary dark:text-white">{item.canceladoPor || '-'}</span>
                                                            {item.dataCancelamento && <span className="text-[10px] text-app-text-secondary">{item.dataCancelamento}</span>}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-32 text-center text-app-text-secondary">
                                                    Nenhum cancelamento encontrado para os filtros selecionados.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Retornos' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 flex-1 flex flex-col">
                            {/* Header / Totalizer */}
                            <div className="bg-app-bg-secondary/30 dark:bg-white/5 rounded-xl p-6 border border-app-border dark:border-app-border-dark">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                                            <Users size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-app-text-secondary uppercase tracking-wider">Total</span>
                                            <span className="text-2xl font-normal text-blue-600 dark:text-blue-400">{retornoTotals.total}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-app-text-secondary uppercase tracking-wider">No Prazo</span>
                                            <span className="text-2xl font-normal text-emerald-600 dark:text-emerald-400">{retornoTotals.noPrazo}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                            <AlertCircle size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-app-text-secondary uppercase tracking-wider">Limite Prazo</span>
                                            <span className="text-2xl font-normal text-amber-600 dark:text-amber-400">{retornoTotals.limitePrazo}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                                            <XCircle size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-app-text-secondary uppercase tracking-wider">Prazo Vencido</span>
                                            <span className="text-2xl font-normal text-red-600 dark:text-red-400">{retornoTotals.prazoVencido}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Filters Bar */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted" />
                                    <Input
                                        placeholder="Buscar cliente..."
                                        value={returnsSearchTerm}
                                        onChange={(e) => setReturnsSearchTerm(e.target.value)}
                                        className="pl-9 h-10 rounded-xl border-app-border dark:border-app-border-dark bg-app-bg-secondary/30 dark:bg-white/5"
                                    />
                                </div>
                                <Select value={returnsProfessionalFilter} onValueChange={setReturnsProfessionalFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todos os Profissionais" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos os Profissionais</SelectItem>
                                        {retornoProfessionalOptions.map((profissional) => (
                                            <SelectItem key={profissional} value={profissional}>{profissional}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={returnsSpecialtyFilter} onValueChange={setReturnsSpecialtyFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todas as Especialidades" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todas as Especialidades</SelectItem>
                                        {retornoSpecialtyOptions.map((especialidade) => (
                                            <SelectItem key={especialidade} value={especialidade}>{especialidade}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={returnsStatusFilter} onValueChange={setReturnsStatusFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todas as Situações" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todas as Situações</SelectItem>
                                        <SelectItem value="No prazo">No prazo</SelectItem>
                                        <SelectItem value="Limite prazo">Limite prazo</SelectItem>
                                        <SelectItem value="Prazo vencido">Prazo vencido</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Table */}
                            <div className="rounded-xl border border-app-border dark:border-app-border-dark overflow-hidden flex-1">
                                <Table>
                                    <TableHeader className="bg-app-bg-secondary/50 dark:bg-white/5">
                                        <TableRow className="hover:bg-transparent border-b border-app-border dark:border-app-border-dark">
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider pl-6">Data</TableHead>
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider">Cliente</TableHead>
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider">Últimos Procedimentos</TableHead>
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider">Profissional / Especialidade</TableHead>
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider">Próximo Retorno</TableHead>
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider">Situação</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRetornos.length > 0 ? (
                                            filteredRetornos.map((item) => {
                                                const status = getRetornoStatus(item.proximoRetorno)
                                                const dataAtendimento = parseLocalDate(item.data)
                                                const dataRetorno = parseLocalDate(item.proximoRetorno)
                                                return (
                                                    <TableRow key={item.id} className="hover:bg-app-bg-secondary/30 dark:hover:bg-white/5 transition-colors border-b border-app-border/50">
                                                        <TableCell className="py-4 pl-6">
                                                            <span className="text-app-text-primary dark:text-white font-medium">
                                                                {dataAtendimento ? dataAtendimento.toLocaleDateString('pt-BR') : item.data}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <span className="text-app-text-primary dark:text-white font-normal">{item.cliente}</span>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <span className="text-xs text-app-text-secondary dark:text-white/70">
                                                                {item.procedimentosRecentes.join(' | ')}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-app-text-primary dark:text-white text-sm">{item.profissional}</span>
                                                                <span className="text-xs text-app-text-secondary dark:text-white/60">{item.especialidade}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <span className="text-app-text-primary dark:text-white font-medium">
                                                                {dataRetorno ? dataRetorno.toLocaleDateString('pt-BR') : item.proximoRetorno}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <Badge variant="outline" className={cn("font-normal text-[10px] border-none px-2",
                                                                status === 'No prazo'
                                                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                                                                    : status === 'Limite prazo'
                                                                        ? "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                                                                        : "bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                                            )}>
                                                                {status}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-32 text-center text-app-text-secondary">
                                                    Nenhum retorno encontrado para os filtros selecionados.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Recebimentos' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 flex-1 flex flex-col">
                            {/* Header / Totalizer */}
                            <div className="bg-app-bg-secondary/30 dark:bg-white/5 rounded-xl p-6 border border-app-border dark:border-app-border-dark">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                            <DollarSign size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-app-text-secondary uppercase tracking-wider">Total Líquido</span>
                                            <span className="text-2xl font-normal text-emerald-600 dark:text-emerald-400">R$ {receiptsTotals.totalNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-app-text-secondary uppercase tracking-wider">Já Recebido</span>
                                            <span className="text-xl font-normal text-blue-600 dark:text-blue-400">R$ {receiptsTotals.totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                            <Calendar size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-app-text-secondary uppercase tracking-wider">A Receber (Futuro)</span>
                                            <span className="text-xl font-normal text-amber-600 dark:text-amber-400">R$ {receiptsTotals.totalFuture.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                                            <Activity size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-app-text-secondary uppercase tracking-wider">Total Taxas</span>
                                            <span className="text-xl font-normal text-red-600 dark:text-red-400">R$ {receiptsTotals.totalFees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Filters Bar */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted" />
                                    <Input
                                        placeholder="Buscar cliente ou descrição..."
                                        value={receiptsSearchTerm}
                                        onChange={(e) => setReceiptsSearchTerm(e.target.value)}
                                        className="pl-9 h-10 rounded-xl border-app-border dark:border-app-border-dark bg-app-bg-secondary/30 dark:bg-white/5"
                                    />
                                </div>
                                <Select value={receiptsDateFilter} onValueChange={(value) => setReceiptsDateFilter(value as 'venda' | 'compensacao')}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Data de Venda" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="venda">Data de Venda</SelectItem>
                                        <SelectItem value="compensacao">Data de Compensacao</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={receiptsPaymentMethodFilter} onValueChange={setReceiptsPaymentMethodFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todas as Formas de Pagamento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todas as Formas de Pagamento</SelectItem>
                                        <SelectItem value="Pix">Pix</SelectItem>
                                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                                        <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                                        <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                                        <SelectItem value="Boleto">Boleto</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={receiptsStatusFilter} onValueChange={setReceiptsStatusFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todos os Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos os Status</SelectItem>
                                        <SelectItem value="Recebido">Recebido</SelectItem>
                                        <SelectItem value="A Receber">A Receber (Futuro)</SelectItem>
                                        <SelectItem value="Atrasado">Atrasado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Table */}
                            <div className="rounded-xl border border-app-border dark:border-app-border-dark overflow-hidden flex-1">
                                <Table>
                                    <TableHeader className="bg-app-bg-secondary/50 dark:bg-white/5">
                                        <TableRow className="hover:bg-transparent border-b border-app-border dark:border-app-border-dark">
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider pl-6">Data Comp.</TableHead>
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider">Cliente / Descrição</TableHead>
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider">Pagamento</TableHead>
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider">Status</TableHead>
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider text-right">Valor Bruto</TableHead>
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider text-right">Taxas</TableHead>
                                            <TableHead className="h-11 text-xs font-medium text-app-text-secondary uppercase tracking-wider text-right pr-6">Valor Líquido</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredReceipts.length > 0 ? (
                                            filteredReceipts.map((item) => {
                                                const receiptFees = getReceiptFees(item)
                                                return (
                                                <TableRow key={item.id} className="hover:bg-app-bg-secondary/30 dark:hover:bg-white/5 transition-colors border-b border-app-border/50">
                                                    <TableCell className="py-4 pl-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-app-text-primary dark:text-white font-medium">{new Date(item.dataCompensacao).toLocaleDateString('pt-BR')}</span>
                                                            <span className="text-[10px] text-app-text-secondary">Venda: {new Date(item.dataVenda).toLocaleDateString('pt-BR')}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-app-text-primary dark:text-white font-normal">{item.cliente}</span>
                                                            <span className="text-xs text-app-text-secondary dark:text-white/60">{item.descricao}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm text-app-text-primary dark:text-white">{item.formaPagamento}</span>
                                                            <span className="text-xs text-app-text-secondary dark:text-white/60">{item.parcelas}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <Badge variant="outline" className={cn("font-normal text-[10px] border-none px-2",
                                                            item.status === 'Recebido' ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                                                                item.status === 'A Receber' ? "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" :
                                                                    "bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                                        )}>
                                                            {item.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-right">
                                                        <span className="text-sm text-app-text-secondary dark:text-white/80">
                                                            R$ {item.valorBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-right">
                                                        <div className="flex flex-col items-end gap-0.5">
                                                            <span className="text-[10px] text-app-text-secondary dark:text-white/60">
                                                                Parc.: {receiptFees.parcelamentoPercent.toFixed(2)}%
                                                            </span>
                                                            <span className="text-[10px] text-app-text-secondary dark:text-white/60">
                                                                Ant.: {receiptFees.antecipacaoPercent.toFixed(2)}%
                                                            </span>
                                                            <span className="text-sm text-red-500 dark:text-red-400">
                                                                - R$ {receiptFees.valorTaxaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-right pr-6">
                                                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                                            R$ {receiptFees.valorLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                                )
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-32 text-center text-app-text-secondary">
                                                    Nenhum recebimento encontrado para os filtros selecionados.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Vendas' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 flex-1 flex flex-col">
                            {/* Header / Totalizer */}
                            <div className="bg-app-bg-secondary/30 dark:bg-white/5 rounded-xl p-6 border border-app-border dark:border-app-border-dark">
                                <div className="flex flex-col md:flex-row md:items-center justify-end gap-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                            <DollarSign size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-app-text-secondary uppercase tracking-wider">Total de Vendas</span>
                                            <span className="text-2xl font-normal text-emerald-600 dark:text-emerald-400">R$ {salesTotals.totalSold.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Filters Bar */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted" />
                                    <Input
                                        placeholder="Buscar cliente..."
                                        value={salesSearchTerm}
                                        onChange={(e) => setSalesSearchTerm(e.target.value)}
                                        className="pl-9 h-10 rounded-xl border-app-border dark:border-app-border-dark bg-app-bg-secondary/30 dark:bg-white/5"
                                    />
                                </div>
                                <Select value={salesUnitFilter} onValueChange={setSalesUnitFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todas as Unidades" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todas as Unidades</SelectItem>
                                        <SelectItem value="Central">Central</SelectItem>
                                        <SelectItem value="Norte">Norte</SelectItem>
                                        <SelectItem value="Sul">Sul</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={salesProductFilter} onValueChange={setSalesProductFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todos os Produtos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos os Produtos</SelectItem>
                                        <SelectItem value="Toxina Botulínica">Toxina Botulínica</SelectItem>
                                        <SelectItem value="Kit Pós-Cirúrgico">Kit Pós-Cirúrgico</SelectItem>
                                        <SelectItem value="Consulta Dermatológica">Consulta Dermatológica</SelectItem>
                                        <SelectItem value="Limpeza de Pele">Limpeza de Pele</SelectItem>
                                        <SelectItem value="Creme Hidratante Facial">Creme Hidratante Geral</SelectItem>
                                        <SelectItem value="Sessão Laser">Sessão Laser</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={salesProfessionalFilter} onValueChange={setSalesProfessionalFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todos os Profissionais" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos os Profissionais</SelectItem>
                                        <SelectItem value="Dr. João Santos">Dr. João Santos</SelectItem>
                                        <SelectItem value="Dra. Ana Lima">Dra. Ana Lima</SelectItem>
                                        <SelectItem value="Dra. Sofia Castro">Dra. Sofia Castro</SelectItem>
                                        <SelectItem value="Dra. Flávia Alves">Dra. Flávia Alves</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={salesUserFilter} onValueChange={setSalesUserFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todos os Usuários" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos os Usuários</SelectItem>
                                        <SelectItem value="Ana Recepcionista">Ana Recepcionista</SelectItem>
                                        <SelectItem value="Beatriz Recepcionista">Beatriz Recepcionista</SelectItem>
                                        <SelectItem value="Carla Recepcionista">Carla Recepcionista</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={salesPaymentMethodFilter} onValueChange={setSalesPaymentMethodFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todas as Formas de Pagamento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todas as Formas de Pagamento</SelectItem>
                                        <SelectItem value="Pix">Pix</SelectItem>
                                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                                        <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                                        <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Table */}
                            <div className="rounded-xl border border-app-border dark:border-app-border-dark overflow-hidden flex-1">
                                <Table>
                                    <TableHeader className="bg-app-bg-secondary/50 dark:bg-white/5">
                                        <TableRow className="hover:bg-transparent border-b border-app-border dark:border-app-border-dark">
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Data/Hora</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Cliente</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Produto/Serviço</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Quant.</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Unid. / Profissional</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Vendedor</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Pagamento</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary text-right">Valor Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredVendas.length > 0 ? (
                                            filteredVendas.map((item) => (
                                                <TableRow key={item.id} className="hover:bg-app-bg-secondary/30 dark:hover:bg-white/5 transition-colors border-b border-app-border/50">
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-app-text-primary dark:text-white font-medium">{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                                                            <span className="text-xs text-app-text-secondary dark:text-white/60">{item.time}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className="text-app-text-primary dark:text-white font-normal">{item.patientName}</span>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-app-text-primary dark:text-white font-normal">{item.productName}</span>
                                                            <span className="text-[10px] text-app-text-secondary dark:text-white/60">{item.category}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className="text-app-text-primary dark:text-white font-normal ml-2">{item.quantity}</span>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-app-text-primary dark:text-white text-sm">{item.professionalName}</span>
                                                            <span className="text-xs text-app-text-secondary dark:text-white/60">{item.unit}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className="text-xs text-app-text-secondary dark:text-white/80">{item.userName}</span>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <Badge variant="outline" className="font-normal text-xs border-app-border text-app-text-secondary">
                                                            {item.paymentMethod}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-right">
                                                        <span className="font-medium text-app-text-primary dark:text-white">
                                                            R$ {item.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={8} className="h-32 text-center text-app-text-secondary">
                                                    Nenhum registro encontrado para os filtros selecionados.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>


                        </div>
                    )}

                    {activeTab === 'Orçamentos' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 flex-1 flex flex-col">
                            {/* Header / Totalizer */}
                            <div className="bg-app-bg-secondary/30 dark:bg-white/5 rounded-xl p-6 border border-app-border dark:border-app-border-dark">
                                <div className="flex flex-col md:flex-row md:items-center justify-end gap-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                                            <FileText size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-app-text-secondary uppercase tracking-wider">Total em Orçamentos</span>
                                            <span className="text-2xl font-normal text-blue-600 dark:text-blue-400">R$ {budgetTotals.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                    <div className="w-px h-12 bg-app-border dark:bg-app-border-dark hidden md:block" />
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-app-text-secondary uppercase tracking-wider">No Prazo</span>
                                            <span className="text-2xl font-normal text-emerald-600 dark:text-emerald-400">R$ {budgetTotals.totalWithinDeadline.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                    <div className="w-px h-12 bg-app-border dark:bg-app-border-dark hidden md:block" />
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                                            <AlertCircle size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-app-text-secondary uppercase tracking-wider">Vencidos</span>
                                            <span className="text-2xl font-normal text-red-600 dark:text-red-400">R$ {budgetTotals.totalExpired.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Filters Bar */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted" />
                                    <Input
                                        placeholder="Buscar cliente..."
                                        value={budgetSearchTerm}
                                        onChange={(e) => setBudgetSearchTerm(e.target.value)}
                                        className="pl-9 h-10 rounded-xl border-app-border dark:border-app-border-dark bg-app-bg-secondary/30 dark:bg-white/5"
                                    />
                                </div>
                                <Select value={budgetUnitFilter} onValueChange={setBudgetUnitFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todas as Unidades" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todas as Unidades</SelectItem>
                                        <SelectItem value="Central">Central</SelectItem>
                                        <SelectItem value="Norte">Norte</SelectItem>
                                        <SelectItem value="Sul">Sul</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={budgetProfessionalFilter} onValueChange={setBudgetProfessionalFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todos os Profissionais" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos os Profissionais</SelectItem>
                                        <SelectItem value="Dr. João Santos">Dr. João Santos</SelectItem>
                                        <SelectItem value="Dra. Ana Lima">Dra. Ana Lima</SelectItem>
                                        <SelectItem value="Dra. Sofia Castro">Dra. Sofia Castro</SelectItem>
                                        <SelectItem value="Dra. Flávia Alves">Dra. Flávia Alves</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={budgetStatusFilter} onValueChange={setBudgetStatusFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todas as Situações" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todas as Situações</SelectItem>
                                        <SelectItem value="No Prazo">No Prazo</SelectItem>
                                        <SelectItem value="Vencido">Vencido</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Table */}
                            <div className="rounded-xl border border-app-border dark:border-app-border-dark overflow-hidden flex-1">
                                <Table>
                                    <TableHeader className="bg-app-bg-secondary/50 dark:bg-white/5">
                                        <TableRow className="hover:bg-transparent border-b border-app-border dark:border-app-border-dark">
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Data Criação</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Validade</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Cliente</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Itens/Descrição</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Unid. / Profissional</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Situação</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary text-right">Valor Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredBudgets.length > 0 ? (
                                            filteredBudgets.map((item) => (
                                                <TableRow key={item.id} className="hover:bg-app-bg-secondary/30 dark:hover:bg-white/5 transition-colors border-b border-app-border/50">
                                                    <TableCell className="py-4">
                                                        <span className="text-app-text-primary dark:text-white font-medium">{new Date(item.creationDate).toLocaleDateString('pt-BR')}</span>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className={cn("text-xs font-medium",
                                                            item.status === 'Vencido' ? "text-red-600 dark:text-red-400" : "text-app-text-secondary dark:text-white/60"
                                                        )}>
                                                            {new Date(item.expirationDate).toLocaleDateString('pt-BR')}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className="text-app-text-primary dark:text-white font-normal">{item.patientName}</span>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className="text-sm text-app-text-secondary dark:text-white/80">{item.description}</span>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-app-text-primary dark:text-white text-sm">{item.professionalName}</span>
                                                            <span className="text-xs text-app-text-secondary dark:text-white/60">{item.unit}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <Badge variant="outline" className={cn("font-normal text-xs border-none px-2",
                                                            item.status === 'No Prazo' ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                                                                "bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                                        )}>
                                                            {item.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-right">
                                                        <span className="font-medium text-app-text-primary dark:text-white">
                                                            R$ {item.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-32 text-center text-app-text-secondary">
                                                    Nenhum orçamento encontrado para os filtros selecionados.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Estoque' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 flex-1 flex flex-col">
                            {/* Sub-Navigation for Stock Views */}
                            <div className="flex justify-start">
                                <SegmentedControl
                                    options={[
                                        { value: 'saldo', label: 'Saldo em Estoque' },
                                        { value: 'movimentacao', label: 'Movimentação Diária' }
                                    ]}
                                    value={stockViewMode}
                                    onChange={(val) => setStockViewMode(val as 'saldo' | 'movimentacao')}
                                />
                            </div>

                            {/* Header / Totalizer (Only relevant for Stock Balance usually, or general stats) */}
                            {stockViewMode === 'saldo' && (
                                <div className="bg-app-bg-secondary/30 dark:bg-white/5 rounded-xl p-6 border border-app-border dark:border-app-border-dark">
                                    <div className="flex flex-col md:flex-row md:items-center justify-end gap-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                                                <Package size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-app-text-secondary uppercase tracking-wider">Total em Estoque</span>
                                                <span className="text-2xl font-normal text-indigo-600 dark:text-indigo-400">{stockTotals.totalProducts} produtos</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Filters Bar */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted" />
                                    <Input
                                        placeholder={stockViewMode === 'saldo' ? "Buscar produto, lote..." : "Buscar produto..."}
                                        value={stockSearchTerm}
                                        onChange={(e) => setStockSearchTerm(e.target.value)}
                                        className="pl-9 h-10 rounded-xl border-app-border dark:border-app-border-dark bg-app-bg-secondary/30 dark:bg-white/5"
                                    />
                                </div>
                                <Select value={stockUnitFilter} onValueChange={setStockUnitFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todas as Unidades" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todas as Unidades</SelectItem>
                                        <SelectItem value="Central">Central</SelectItem>
                                        <SelectItem value="Norte">Norte</SelectItem>
                                        <SelectItem value="Sul">Sul</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={stockTypeFilter} onValueChange={setStockTypeFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todos os tipos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos os tipos</SelectItem>
                                        <SelectItem value="Suprimentos">Suprimentos</SelectItem>
                                        <SelectItem value="Prescricao/Vendas">Prescricao/Vendas</SelectItem>
                                    </SelectContent>
                                </Select>

                                {stockViewMode === 'saldo' ? (
                                    <Select value={stockStatusFilter} onValueChange={setStockStatusFilter}>
                                        <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                            <SelectValue preferPlaceholder placeholder="Todos os Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todos">Todos os Status</SelectItem>
                                            <SelectItem value="Em Estoque">Em Estoque</SelectItem>
                                            <SelectItem value="Baixo Estoque">Baixo Estoque</SelectItem>
                                            <SelectItem value="Sem Estoque">Sem Estoque</SelectItem>
                                            <SelectItem value="Vencido">Vencido</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Select value={stockMovementTypeFilter} onValueChange={setStockMovementTypeFilter}>
                                        <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                            <SelectValue preferPlaceholder placeholder="Todas as Movimentações" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todos">Todas as MovimentaÃ§Ãµes</SelectItem>
                                            <SelectItem value="Entrada">Entrada</SelectItem>
                                            <SelectItem value="Saída">Saída</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>

                            {/* Table - Saldo em Estoque */}
                            {stockViewMode === 'saldo' && (
                                <div className="rounded-xl border border-app-border dark:border-app-border-dark overflow-hidden flex-1">
                                    <Table>
                                        <TableHeader className="bg-app-bg-secondary/50 dark:bg-white/5">
                                            <TableRow className="hover:bg-transparent border-b border-app-border dark:border-app-border-dark">
                                                <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Produto</TableHead>
                                                <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Tipo Estoque</TableHead>
                                                <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Categoria</TableHead>
                                                <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Unidade</TableHead>
                                                <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Quantidade</TableHead>
                                                <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Qtd. Mínima</TableHead>
                                                <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Lote / Validade</TableHead>
                                                <TableHead className="font-normal text-xs uppercase text-app-text-secondary text-right">Preço Custo</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredStockItems.length > 0 ? (
                                                filteredStockItems.map((item) => (
                                                    <TableRow key={item.id} className="hover:bg-app-bg-secondary/30 dark:hover:bg-white/5 transition-colors border-b border-app-border/50">
                                                        <TableCell className="py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-app-text-primary dark:text-white font-medium">{item.productName}</span>
                                                                <span className={cn("text-xs w-fit px-1.5 py-0.5 rounded-md mt-1",
                                                                    item.status === 'Em Estoque' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
                                                                    item.status === 'Baixo Estoque' && "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
                                                                    item.status === 'Sem Estoque' && "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
                                                                    item.status === 'Vencido' && "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400"
                                                                )}>
                                                                    {item.status}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <Badge variant="outline" className="rounded-full font-normal">
                                                                {item.stockType}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <span className="text-sm text-app-text-secondary dark:text-white/80">{item.category}</span>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <span className="text-sm text-app-text-secondary dark:text-white/80">{item.unit}</span>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <span className="text-app-text-primary dark:text-white font-medium">{item.quantity}</span>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <span className="text-sm text-app-text-secondary dark:text-white/80">{item.minQuantity}</span>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-xs text-app-text-secondary dark:text-white/60">Lote: {item.batch}</span>
                                                                <span className={cn("text-xs",
                                                                    item.status === 'Vencido' ? "text-red-600 dark:text-red-400 font-medium" : "text-app-text-secondary dark:text-white/60"
                                                                )}>
                                                                    Val: {new Date(item.expirationDate).toLocaleDateString('pt-BR')}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4 text-right">
                                                            <span className="font-medium text-app-text-primary dark:text-white">
                                                                R$ {item.costPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={8} className="h-32 text-center text-app-text-secondary">
                                                        Nenhum item encontrado no estoque.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            {/* Table - Movimentação */}
                            {stockViewMode === 'movimentacao' && (
                                <div className="rounded-xl border border-app-border dark:border-app-border-dark overflow-hidden flex-1">
                                    <Table>
                                        <TableHeader className="bg-app-bg-secondary/50 dark:bg-white/5">
                                            <TableRow className="hover:bg-transparent border-b border-app-border dark:border-app-border-dark">
                                                <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Data / Hora</TableHead>
                                                <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Tipo</TableHead>
                                                <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Unidade / Usuário</TableHead>
                                                <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Detalhes (NF/Fornecedor/Cliente)</TableHead>
                                                <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Produto</TableHead>
                                                <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Quantidade</TableHead>
                                                <TableHead className="font-normal text-xs uppercase text-app-text-secondary text-right">Preço Custo</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredStockMovements.length > 0 ? (
                                                filteredStockMovements.map((item) => (
                                                    <TableRow key={item.id} className="hover:bg-app-bg-secondary/30 dark:hover:bg-white/5 transition-colors border-b border-app-border/50">
                                                        <TableCell className="py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-app-text-primary dark:text-white font-medium">{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                                                                <span className="text-xs text-app-text-secondary dark:text-white/60">{item.time}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <Badge variant="outline" className={cn("font-normal text-xs border-none px-2",
                                                                item.type === 'Entrada' ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                                                                    "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                                                            )}>
                                                                {item.type}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm text-app-text-primary dark:text-white">{item.stockType}</span>
                                                                <span className="text-xs text-app-text-secondary dark:text-white/60">{item.origin}{item.procedureName ? ` - ${item.procedureName}` : ""}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-app-text-primary dark:text-white text-sm">{item.unit}</span>
                                                                <span className="text-xs text-app-text-secondary dark:text-white/60">{item.userName}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <div className="flex flex-col max-w-[200px]">
                                                                {item.type === 'Entrada' ? (
                                                                    <>
                                                                        <span className="text-sm font-medium text-app-text-primary dark:text-white truncate" title={item.supplier}>{item.supplier}</span>
                                                                        <span className="text-xs text-app-text-secondary dark:text-white/60">NF: {item.invoiceNumber || '-'}</span>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-sm font-medium text-app-text-primary dark:text-white truncate" title={item.clientName}>{item.clientName}</span>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <span className="text-sm text-app-text-primary dark:text-white">{item.productName}</span>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <span className="text-sm font-medium text-app-text-primary dark:text-white">{item.quantity}</span>
                                                        </TableCell>
                                                        <TableCell className="py-4 text-right">
                                                            <span className="font-medium text-app-text-primary dark:text-white">
                                                                R$ {item.costPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="h-32 text-center text-app-text-secondary">
                                                        Nenhuma movimentação encontrada para os filtros selecionados.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                        </div>
                    )}

                    {activeTab === 'Pacientes' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 flex-1 flex flex-col">
                            {/* Filters Bar */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted" />
                                    <Input
                                        placeholder="Buscar por nome..."
                                        value={patientSearchTerm}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatientSearchTerm(e.target.value)}
                                        className="pl-9 h-10 rounded-xl border-app-border dark:border-app-border-dark bg-app-bg-secondary/30 dark:bg-white/5"
                                    />
                                </div>
                                <Select value={birthMonthFilter} onValueChange={setBirthMonthFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todos os Meses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos os Meses</SelectItem>
                                        <SelectItem value="1">Janeiro</SelectItem>
                                        <SelectItem value="2">Fevereiro</SelectItem>
                                        <SelectItem value="3">Março</SelectItem>
                                        <SelectItem value="4">Abril</SelectItem>
                                        <SelectItem value="5">Maio</SelectItem>
                                        <SelectItem value="6">Junho</SelectItem>
                                        <SelectItem value="7">Julho</SelectItem>
                                        <SelectItem value="8">Agosto</SelectItem>
                                        <SelectItem value="9">Setembro</SelectItem>
                                        <SelectItem value="10">Outubro</SelectItem>
                                        <SelectItem value="11">Novembro</SelectItem>
                                        <SelectItem value="12">Dezembro</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={genderFilter} onValueChange={setGenderFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todos os Gêneros" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos os Gêneros</SelectItem>
                                        <SelectItem value="masculino">Masculino</SelectItem>
                                        <SelectItem value="feminino">Feminino</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todos os Canais" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos os Canais</SelectItem>
                                        <SelectItem value="Indicação">Indicação</SelectItem>
                                        <SelectItem value="Instagram">Instagram</SelectItem>
                                        <SelectItem value="Facebook">Facebook</SelectItem>
                                        <SelectItem value="Google Search">Google</SelectItem>
                                        <SelectItem value="Rádio">Rádio</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={cityFilter} onValueChange={setCityFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todas as Cidades" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todas as Cidades</SelectItem>
                                        <SelectItem value="São Paulo">São Paulo</SelectItem>
                                        <SelectItem value="Guarulhos">Guarulhos</SelectItem>
                                        <SelectItem value="Osasco">Osasco</SelectItem>
                                        <SelectItem value="Campinas">Campinas</SelectItem>
                                        <SelectItem value="Santo André">Santo André</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={patientPlanFilter} onValueChange={setPatientPlanFilter}>
                                    <SelectTrigger className="h-10 rounded-xl border-app-border bg-app-bg-secondary/30">
                                        <SelectValue preferPlaceholder placeholder="Todos os Convênios" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos os Convênios</SelectItem>
                                        <SelectItem value="Particular">Particular</SelectItem>
                                        <SelectItem value="Unimed">Unimed</SelectItem>
                                        <SelectItem value="Bradesco Saúde">Bradesco Saúde</SelectItem>
                                        <SelectItem value="SulAmérica">SulAmérica</SelectItem>
                                        <SelectItem value="Amil">Amil</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setOnlyNoShows(!onlyNoShows)}
                                        className={cn(
                                            "h-10 px-4 rounded-xl border text-xs font-medium transition-all flex items-center gap-2 w-full justify-center",
                                            onlyNoShows
                                                ? "bg-amber-100 border-amber-200 text-amber-700 dark:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-400"
                                                : "bg-app-bg-secondary border-app-border text-app-text-secondary hover:bg-app-bg-secondary/70 hover:text-app-text-primary"
                                        )}
                                    >
                                        <AlertCircle size={14} />
                                        {onlyNoShows ? 'Mostrando Apenas Não Comparecimento' : 'Filtrar Não Comparecimento'}
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-xl border border-app-border dark:border-app-border-dark overflow-hidden flex-1">
                                <Table>
                                    <TableHeader className="bg-app-bg-secondary/50 dark:bg-white/5">
                                        <TableRow className="hover:bg-transparent border-b border-app-border dark:border-app-border-dark">
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Paciente</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Origem / Cidade</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Convênio</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Preferências</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary">Última Visita</TableHead>
                                            <TableHead className="font-normal text-xs uppercase text-app-text-secondary text-right">Faltas</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPacientes.length > 0 ? (
                                            filteredPacientes.map((patient) => (
                                                <TableRow key={patient.id} className="hover:bg-app-bg-secondary/30 dark:hover:bg-white/5 transition-colors border-b border-app-border/50">
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-app-text-primary dark:text-white font-medium">{patient.name}</span>
                                                            <div className="flex items-center gap-2 text-xs text-app-text-secondary dark:text-white/60">
                                                                <span>{patient.age}</span>
                                                                <span>•</span>
                                                                <span>{patient.gender}</span>
                                                                <span>•</span>
                                                                <span>Nasc: {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('pt-BR') : '-'}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-xs font-medium text-[#0039A6] dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full w-fit">
                                                                    {patient.source}
                                                                </span>
                                                            </div>
                                                            <span className="text-xs text-app-text-secondary dark:text-white/60">{patient.city}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <Badge variant="outline" className="font-normal text-xs border-app-border text-app-text-secondary">
                                                            {patient.plan}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-xs text-app-text-primary dark:text-white">{patient.preferredDoctor}</span>
                                                            <span className="text-[10px] text-app-text-secondary dark:text-white/50">{patient.mostCommonProcedure}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm text-app-text-primary dark:text-white">
                                                                {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString('pt-BR') : '-'}
                                                            </span>
                                                            <span className="text-[10px] text-app-text-secondary dark:text-white/50">
                                                                há {patient.daysSinceLastVisit} dias
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-right">
                                                        {patient.noShowCount && patient.noShowCount > 0 ? (
                                                            <Badge variant="outline" className="font-normal text-[10px] bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
                                                                {patient.noShowCount} faltas
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="font-normal text-[10px] bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                                                                Assíduo
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-32 text-center text-app-text-secondary">
                                                    Nenhum paciente encontrado para os filtros selecionados.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Performance' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {/* Key Performance Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {MOCK_RELATORIOS_PERFORMANCE.kpis.map((stat) => (
                                    <Card key={stat.label} className="shadow-sm border-app-border dark:border-app-border-dark">
                                        <CardContent className="p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-normal text-app-text-secondary dark:text-white/60 uppercase tracking-tighter">{stat.label}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <h3 className={`text-3xl font-normal ${stat.color} tracking-tighter`}>{stat.value}</h3>
                                                <Calendar size={24} className="text-app-text-muted dark:text-white/30" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Patient Analysis Section */}
                            <Card className="border-2 border-[#0039A6]/20 dark:border-gray-800 overflow-hidden">
                                <div className="bg-app-bg-secondary/50 dark:bg-white/5 p-4 border-b border-app-border dark:border-app-border-dark flex items-center gap-2">
                                    <Users size={18} className="text-[#0039A6]" />
                                    <h3 className="font-normal text-app-text-primary dark:text-white">Análise de pacientes</h3>
                                </div>
                                <CardContent className="p-8 space-y-10">
                                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                        {MOCK_RELATORIOS_PERFORMANCE.pacienteAnalysis.map((stat, idx) => (
                                            <div key={idx} className={`p-6 ${stat.bg} ${idx === 2 ? 'ring-2 ring-emerald-400/50' : ''} rounded-2xl flex flex-col items-center justify-center text-center space-y-1 transition-transform hover:scale-105`}>
                                                <span className={`text-3xl font-normal ${stat.text}`}>{stat.value}</span>
                                                <span className={`text-xs font-normal ${stat.text} opacity-80`}>{stat.label}</span>
                                                {stat.sub && <span className={`text-[10px] font-normal ${stat.text} opacity-60 mt-1 uppercase tracking-tight`}>{stat.sub}</span>}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-900/50 p-6 rounded-2xl">
                                        <p className="text-sm font-normal text-blue-900 dark:text-blue-200 leading-relaxed">
                                            <span className="font-normal">Interpretação:</span> 73.2% dos seus pacientes já realizaram consultas anteriormente (mínimo 2 consultas nos últimos 6 meses), e 61.3% dos pacientes que já foram atendidos retornaram no período analisado.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

