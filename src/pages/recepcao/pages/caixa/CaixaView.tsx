import { useEffect, useState } from 'react'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import {
    Wallet,
    TrendingUp,
    DollarSign,
    TrendingDown,
    AlertCircle,
    Lock,
    Unlock,
    Banknote,
    Smartphone,
    CreditCard,
    Download,
    FileText
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ReceptionTable } from '../../ui/ReceptionTable'
import { Transaction } from '../../context/types'
import { AbrirCaixaModal } from '../../../admin/pages/financeiro/modals/AbrirCaixaModal'
import { FecharCaixaModal } from './modals/FecharCaixaModal'
import { NovaMovimentacaoModal } from './modals/NovaMovimentacaoModal'
import { MOCK_TRANSACTIONS } from '@/mocks/recepcionista/caixa'
import {
    RECEPCAO_CAIXA_TRANSACTIONS_KEY,
    canReopenCaixa,
    loadCaixaTransactions,
    persistCaixaFechamento,
} from '@/services/recepcaoCaixa.service'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb'
import { toast } from 'sonner'
import { CAIXA_STORAGE_KEYS } from '@/mocks/caixa.mock'

interface CaixaViewProps {
    onPageChange?: (page: string) => void;
}

const TROCO_STORAGE_KEY = 'recepcao_caixinha_troco_saldo'

export const CaixaView = ({ onPageChange }: CaixaViewProps) => {
    const setCurrentPage = onPageChange;
    const [activeTab, setActiveTab] = useState<'resumo' | 'movimentacoes'>('resumo')
    const [transactionsList, setTransactionsList] = useState<Transaction[]>(() => {
        if (typeof window === 'undefined') return MOCK_TRANSACTIONS as unknown as Transaction[]
        const stored = loadCaixaTransactions()
        return stored.length > 0 ? (stored as unknown as Transaction[]) : (MOCK_TRANSACTIONS as unknown as Transaction[])
    })
    const [isClosed, setIsClosed] = useState(() => {
        if (typeof window === 'undefined') return true
        return window.localStorage.getItem(CAIXA_STORAGE_KEYS.status) !== 'open'
    })
    const [isModalAbrirOpen, setIsModalAbrirOpen] = useState(false)
    const [isModalFecharOpen, setIsModalFecharOpen] = useState(false)
    const [isModalMovimentacaoOpen, setIsModalMovimentacaoOpen] = useState(false)
    const [saldoInicial, setSaldoInicial] = useState(0)
    const [resumoFechamento, setResumoFechamento] = useState<{ saldoFinal: number; valorTransferido: number; saldoRestante: number } | null>(null)
    const [filterMethod, setFilterMethod] = useState<string | null>(null)

    // Calculate totals dynamically
    const calculateTotals = () => {
        const cashIncome = transactionsList
            .filter(t => t.method === 'cash' && t.type === 'income')
            .reduce((sum, t) => sum + t.value, 0)
        const cashExpense = transactionsList
            .filter(t => t.method === 'cash' && t.type === 'expense')
            .reduce((sum, t) => sum + t.value, 0)

        const pixTotal = transactionsList
            .filter(t => t.method === 'pix' && t.type === 'income')
            .reduce((sum, t) => sum + t.value, 0)

        const debitTotal = transactionsList
            .filter(t => t.method === 'debit' && t.type === 'income')
            .reduce((sum, t) => sum + t.value, 0)

        const creditTotal = transactionsList
            .filter(t => t.method === 'credit' && t.type === 'income')
            .reduce((sum, t) => sum + t.value, 0)

        const totalIncome = transactionsList
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.value, 0)

        // Saldo esperado = Saldo Inicial + Entradas Dinheiro - Saídas Dinheiro
        // Note: We might want to include expenses of other types, but usually "Saldo Esperado" refers to Cash in Drawer.
        const saldoEsperado = saldoInicial + cashIncome - cashExpense

        return {
            cashIncome,
            cashExpense,
            pixTotal,
            debitTotal,
            creditTotal,
            totalIncome,
            saldoEsperado
        }
    }

    const {
        cashIncome,
        cashExpense,
        pixTotal,
        debitTotal,
        creditTotal,
        totalIncome,
        saldoEsperado
    } = calculateTotals()

    useEffect(() => {
        if (typeof window === 'undefined') return
        window.localStorage.setItem(RECEPCAO_CAIXA_TRANSACTIONS_KEY, JSON.stringify(transactionsList))
    }, [transactionsList])

    useEffect(() => {
        if (typeof window === 'undefined') return

        const abertura = window.localStorage.getItem(CAIXA_STORAGE_KEYS.abertura)
        if (abertura) {
            const parsed = Number(abertura)
            if (Number.isFinite(parsed)) setSaldoInicial(parsed)
        }

        const rawFechamentos = window.localStorage.getItem(CAIXA_STORAGE_KEYS.fechamentos)
        if (!rawFechamentos) return
        try {
            const parsed = JSON.parse(rawFechamentos)
            const last = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null
            if (!last) return
            setResumoFechamento({
                saldoFinal: Number(last.saldoFinal) || 0,
                valorTransferido: Number(last.valorTransferido) || 0,
                saldoRestante: Number(last.saldoRestante) || 0,
            })
        } catch {
            setResumoFechamento(null)
        }
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return

        const syncTransactions = () => {
            const stored = loadCaixaTransactions()
            if (stored.length > 0) {
                setTransactionsList(stored as unknown as Transaction[])
            }
        }

        const onTransactionsUpdated = (event: Event) => {
            const custom = event as CustomEvent<Transaction[]>
            if (Array.isArray(custom.detail)) {
                setTransactionsList(custom.detail as unknown as Transaction[])
                return
            }
            syncTransactions()
        }

        window.addEventListener('storage', syncTransactions)
        window.addEventListener('caixa-transactions-updated', onTransactionsUpdated)

        return () => {
            window.removeEventListener('storage', syncTransactions)
            window.removeEventListener('caixa-transactions-updated', onTransactionsUpdated)
        }
    }, [])

    const handleAbrirCaixa = (valor: number) => {
        setSaldoInicial(valor)
        setIsClosed(false)
        try {
            window.localStorage.setItem(CAIXA_STORAGE_KEYS.status, 'open')
            window.localStorage.setItem(CAIXA_STORAGE_KEYS.abertura, String(valor))
        } catch {
            // ignore local storage errors in mock mode
        }
        setIsModalAbrirOpen(false)
    }

    const handleFecharCaixa = async (valorTransferido: number) => {
        // Aqui entraria a lógica de persistência
        console.log('Fechando caixa com transferência de:', valorTransferido)
        const saldoTroco = Math.max(0, saldoEsperado - valorTransferido)
        try {
            window.localStorage.setItem(TROCO_STORAGE_KEY, String(saldoTroco))
            window.dispatchEvent(new CustomEvent('caixa-troco-updated', { detail: saldoTroco }))
        } catch {
            // ignore local storage errors in mock mode
        }
        await persistCaixaFechamento({
            saldoInicial,
            saldoFinal: saldoEsperado,
            valorTransferido,
            saldoRestante: saldoTroco,
            usuario: 'Ana Recepcionista',
        })
        setResumoFechamento({
            saldoFinal: saldoEsperado,
            valorTransferido,
            saldoRestante: saldoTroco,
        })
        setIsClosed(true)
        try {
            window.localStorage.setItem(CAIXA_STORAGE_KEYS.status, 'closed')
        } catch {
            // ignore local storage errors in mock mode
        }
        setIsModalFecharOpen(false)
        setSaldoInicial(0)
        // Reset transactions for next session simulation? Or keep history?
        // For simulation purposes, maybe keep them or reset. Let's keep for now.
    }

    const handleAddTransaction = (transaction: { description: string, value: number, method: 'cash' | 'credit' | 'debit' | 'pix', type: 'income' | 'expense' }) => {
        const newTransaction: Transaction = {
            id: Math.random().toString(36).substr(2, 9),
            hour: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            description: transaction.description,
            value: transaction.value,
            method: transaction.method,
            type: transaction.type,
            responsible: 'Ana Recepcionista', // Mocked user
            status: 'cleared'
        }
        setTransactionsList(prev => [newTransaction, ...prev])
    }

    const handleCardClick = (method: string) => {
        setFilterMethod(method)
        setActiveTab('movimentacoes')
    }

    const clearFilter = () => {
        setFilterMethod(null)
    }

    const transactions = filterMethod
        ? transactionsList.filter(t => t.method === filterMethod)
        : transactionsList

    const columns = [
        {
            header: 'Horário',
            key: 'hour',
            render: (t: Transaction) => <span className="font-normal text-[#344054] dark:text-gray-200">{t.hour}</span>
        },
        {
            header: 'Descrição',
            key: 'description',
            render: (t: Transaction) => <span className="text-[#6a7282] dark:text-gray-400">{t.description}</span>
        },
        {
            header: 'Forma de Pagamento',
            key: 'method',
            render: (t: Transaction) => {
                const getIcon = () => {
                    switch (t.method) {
                        case 'cash': return <Banknote size={16} />
                        case 'pix': return <Smartphone size={16} />
                        case 'credit':
                        case 'debit':
                        case 'card': return <CreditCard size={16} />
                        default: return <DollarSign size={16} />
                    }
                }
                const getName = () => {
                    switch (t.method) {
                        case 'cash': return 'Dinheiro'
                        case 'pix': return 'PIX'
                        case 'credit': return 'Cartão de Crédito'
                        case 'debit': return 'Cartão de Débito'
                        default: return t.method
                    }
                }
                return (
                    <div className="flex items-center gap-2 text-[#6a7282] dark:text-gray-400">
                        {getIcon()}
                        <span>{getName()}</span>
                    </div>
                )
            }
        },
        {
            header: 'Responsável',
            key: 'responsible',
            render: (t: Transaction) => <span className="text-[#6a7282] dark:text-gray-400">{t.responsible}</span>
        },
        {
            header: 'Valor',
            key: 'value',
            className: "text-right",
            render: (t: Transaction) => (
                <span className={`font-normal ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'} R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
            )
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => setCurrentPage?.('inicio')} className="cursor-pointer text-app-text-primary/70 dark:text-white/80 hover:text-[#0039A6] dark:hover:text-white">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-app-text-primary dark:text-white font-normal">Caixa</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-normal text-app-text-primary dark:text-white">Controle de caixa</h1>
                    <p className="text-app-text-secondary dark:text-white/60 text-sm md:text-base font-normal">
                        Gerenciamento de recebimentos e fechamento de caixa
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    {!isClosed && (
                        <Button
                            onClick={() => setIsModalMovimentacaoOpen(true)}
                            variant="outline"
                            className="w-full md:w-auto h-11 md:h-12 px-6 rounded-xl flex items-center justify-center gap-2 border-app-border dark:border-white/10 order-2 md:order-1"
                        >
                            <TrendingUp size={18} />
                            Lançamento Manual
                        </Button>
                    )}
                    <Button
                        onClick={() => {
                            if (isClosed) {
                                if (!canReopenCaixa()) {
                                    toast.error('Somente o gestor pode reabrir o caixa')
                                    return
                                }
                                setIsModalAbrirOpen(true)
                                return
                            }
                            setIsModalFecharOpen(true)
                        }}
                        className={`w-full md:w-auto h-11 md:h-12 px-8 rounded-xl flex items-center justify-center gap-2 font-normal transition-all active:scale-[0.98] shadow-lg order-1 md:order-2 ${isClosed
                            ? 'bg-[#0039A6] hover:bg-[#002d82] text-white shadow-[#0039A6]/10'
                            : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/10'
                            }`}
                    >
                        {isClosed ? <Unlock size={18} /> : <Lock size={18} />}
                        {isClosed ? 'Abrir caixa' : 'Fechar caixa'}
                    </Button>
                </div>
            </div>

            {/* Top Summary Card */}
            <Card className={`p-4 md:p-8 bg-app-card dark:bg-app-card-dark rounded-[24px] border ${isClosed ? 'border-red-100 dark:border-red-900/20' : 'border-green-100 dark:border-green-900/20'} shadow-sm space-y-6 md:space-y-8`}>
                <div className={`flex items-center gap-2 font-normal text-sm md:text-base ${isClosed ? 'text-red-600' : 'text-green-600'}`}>
                    {isClosed ? <AlertCircle size={20} className="shrink-0" /> : <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />}
                    <span>{isClosed ? 'Caixa fechado' : 'Caixa aberto'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {/* Saldo Inicial */}
                    <Card className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-[20px] space-y-3 border-none">
                        <div className="flex items-center gap-2 text-blue-600 font-normal text-xs md:text-[13px] uppercase tracking-wide">
                            <Wallet size={16} />
                            <span>Saldo inicial</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-normal text-blue-700 dark:text-blue-400">
                            R$ {isClosed ? '250,00' : saldoInicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h2>
                    </Card>

                    {/* Recebido em Dinheiro */}
                    <Card className="p-6 bg-green-50/50 dark:bg-green-900/10 rounded-[20px] space-y-3 border-none">
                        <div className="flex items-center gap-2 text-green-600 font-normal text-xs md:text-[13px] uppercase tracking-wide">
                            <TrendingUp size={16} />
                            <span>Recebido em dinheiro</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-normal text-green-700 dark:text-green-400">
                            R$ {cashIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h2>
                    </Card>

                    {/* Saldo Esperado */}
                    <Card className="p-6 bg-purple-50/50 dark:bg-purple-900/10 rounded-[20px] space-y-3 border-none">
                        <div className="flex items-center gap-2 text-purple-600 font-normal text-xs md:text-[13px] uppercase tracking-wide">
                            <DollarSign size={16} />
                            <span>Saldo esperado</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-normal text-purple-700 dark:text-purple-400">
                            R$ {isClosed ? (250 + 330).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : saldoEsperado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h2>
                    </Card>

                    {/* Total Recebido */}
                    <Card className="p-6 bg-orange-50/50 dark:bg-orange-900/10 rounded-[20px] space-y-3 border-none">
                        <div className="flex items-center gap-2 text-orange-600 font-normal text-xs md:text-[13px] uppercase tracking-wide">
                            <TrendingDown size={16} />
                            <span>Total recebido</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-normal text-orange-700 dark:text-orange-400">
                            R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h2>
                    </Card>
                </div>
            </Card>

            {/* Tabs Section */}
            <SegmentedControl
                options={[
                    { value: 'resumo', label: 'Resumo por forma de pagamento' },
                    { value: 'movimentacoes', label: 'Movimentações do dia' }
                ]}
                value={activeTab}
                onChange={(value) => setActiveTab(value as 'resumo' | 'movimentacoes')}
            />

            {/* Content Section */}
            <Card className="bg-app-card dark:bg-app-card-dark p-4 md:p-8 rounded-[24px] border border-app-border dark:border-app-border-dark shadow-sm min-h-[400px]">
                {isClosed ? (
                    <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center space-y-5">
                        <Lock className="h-10 w-10 text-red-500" />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-normal text-app-text-primary dark:text-white">Caixa Fechado</h3>
                            <p className="text-app-text-secondary dark:text-white/60 max-w-xl">
                                Não é possível registrar novos lançamentos enquanto o caixa estiver fechado.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-3xl text-left">
                            <Card className="p-4 border-app-border dark:border-app-border-dark">
                                <p className="text-xs text-app-text-muted">Saldo do fechamento</p>
                                <p className="text-lg text-app-text-primary dark:text-white">R$ {(resumoFechamento?.saldoFinal ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            </Card>
                            <Card className="p-4 border-app-border dark:border-app-border-dark">
                                <p className="text-xs text-app-text-muted">Transferido ao cofre</p>
                                <p className="text-lg text-app-text-primary dark:text-white">R$ {(resumoFechamento?.valorTransferido ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            </Card>
                            <Card className="p-4 border-app-border dark:border-app-border-dark">
                                <p className="text-xs text-app-text-muted">Caixinha de troco</p>
                                <p className="text-lg text-app-text-primary dark:text-white">R$ {(resumoFechamento?.saldoRestante ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            </Card>
                        </div>
                    </div>
                ) : activeTab === 'resumo' ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="space-y-1">
                            <h3 className="text-lg md:text-xl font-bold text-app-text-primary dark:text-white">Resumo por Forma de Pagamento</h3>
                            <p className="text-app-text-secondary dark:text-white/60 text-sm">Acompanhe os valores recebidos por cada método</p>
                        </div>

                        <div className="space-y-4">
                            {/* Dinheiro */}
                            <Card
                                onClick={() => handleCardClick('cash')}
                                className="p-6 bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[20px] flex items-center justify-between group hover:border-[#0039A6]/20 transition-all cursor-pointer hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 md:h-12 w-10 md:w-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 shadow-sm shrink-0">
                                        <Banknote size={22} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="font-normal text-app-text-secondary dark:text-white/90">Dinheiro</h4>
                                        <p className="text-xs text-app-text-muted dark:text-white/60 font-normal">Precisa bater com o físico</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl md:text-2xl font-normal text-app-text-primary dark:text-white">
                                        R$ {cashIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-[10px] md:text-xs font-normal text-app-text-muted uppercase tracking-widest">
                                        Em caixa: R$ {saldoEsperado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </Card>

                            {/* PIX */}
                            <Card
                                onClick={() => handleCardClick('pix')}
                                className="p-6 bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[20px] flex items-center justify-between group hover:border-[#0039A6]/20 transition-all cursor-pointer hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 md:h-12 w-10 md:w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                                        <Smartphone size={22} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="font-bold text-[#344054] dark:text-gray-200">PIX</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Conferir com extrato bancário</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl md:text-2xl font-bold text-[#101828] dark:text-white">
                                        R$ {pixTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </Card>

                            {/* Cartão de Débito */}
                            <Card
                                onClick={() => handleCardClick('debit')}
                                className="p-6 bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[20px] flex items-center justify-between group hover:border-[#0039A6]/20 transition-all cursor-pointer hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 md:h-12 w-10 md:w-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 shadow-sm shrink-0">
                                        <CreditCard size={22} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="font-bold text-[#344054] dark:text-gray-200">Cartão de Débito</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Conferir com relatório de Prescrição/Vendas</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl md:text-2xl font-bold text-[#101828] dark:text-white">
                                        R$ {debitTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </Card>

                            {/* Cartão de Crédito */}
                            <Card
                                onClick={() => handleCardClick('credit')}
                                className="p-6 bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[20px] flex items-center justify-between group hover:border-[#0039A6]/20 transition-all cursor-pointer hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 md:h-12 w-10 md:w-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 shadow-sm shrink-0">
                                        <CreditCard size={22} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="font-bold text-[#344054] dark:text-gray-200">Cartão de Crédito</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Conferir com relatório de Prescrição/Vendas</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl md:text-2xl font-bold text-[#101828] dark:text-white">
                                        R$ {creditTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </Card>

                            {/* Total Banner */}
                            <Card className="mt-8 p-6 bg-[#0039A6] rounded-[20px] flex items-center justify-between text-white shadow-xl shadow-[#0039A6]/20 border-none">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        <Banknote size={24} />
                                    </div>
                                    <h4 className="text-lg md:text-xl font-normal">Total recebido</h4>
                                </div>
                                <p className="text-2xl md:text-4xl font-normal">
                                    R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </Card>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                            <Button
                                variant="outline"
                                className="w-full sm:flex-1 h-12 md:h-13 rounded-xl font-bold gap-2 text-[#667085] dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm"
                            >
                                <Download size={18} />
                                Exportar Resumo
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full sm:flex-1 h-12 md:h-13 rounded-xl font-bold gap-2 text-[#667085] dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm"
                            >
                                <FileText size={18} />
                                Gerar Relatório
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="pb-4 flex justify-between items-center">
                            <h3 className="text-lg md:text-xl font-bold text-app-text-primary dark:text-white">
                                Movimentações do Dia ({transactions.length})
                                {filterMethod && (
                                    <span className="ml-2 text-sm font-normal text-app-text-secondary">
                                        (Filtro: {filterMethod === 'cash' ? 'Dinheiro' : filterMethod === 'pix' ? 'PIX' : filterMethod === 'credit' ? 'Crédito' : 'Débito'})
                                    </span>
                                )}
                            </h3>
                            {filterMethod && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilter}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                    Limpar filtro
                                </Button>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <ReceptionTable columns={columns} data={transactions} />
                        </div>
                    </div>
                )}
            </Card>

            <AbrirCaixaModal
                isOpen={isModalAbrirOpen}
                onClose={() => setIsModalAbrirOpen(false)}
                onConfirm={handleAbrirCaixa}
            />

            <FecharCaixaModal
                isOpen={isModalFecharOpen}
                onClose={() => setIsModalFecharOpen(false)}
                onConfirm={handleFecharCaixa}
                saldoAtual={saldoEsperado}
                saldoInicial={saldoInicial}
                totalEntradas={transactionsList.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.value, 0)}
                totalSaidas={transactionsList.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.value, 0)}
            />

            <NovaMovimentacaoModal
                isOpen={isModalMovimentacaoOpen}
                onClose={() => setIsModalMovimentacaoOpen(false)}
                onConfirm={handleAddTransaction}
            />
        </div>
    )
}
