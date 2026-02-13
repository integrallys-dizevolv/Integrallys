import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CreditCard, Clock, CheckCircle, DollarSign, FileText } from 'lucide-react'
import { BoletoModal } from '../modals/BoletoModal'
import { CheckoutModal } from '../modals/CheckoutModal'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/Breadcrumb'
import { MOCK_SAVED_CARDS } from '@/mocks/paciente/cartoes'

interface PagamentosViewProps {
    mockFaturas: any[]
    onPageChange: (page: string) => void
}

export function PagamentosView({ mockFaturas, onPageChange }: PagamentosViewProps) {
    const [selectedTab, setSelectedTab] = useState('todos')
    const [boletoModalOpen, setBoletoModalOpen] = useState(false)
    const [checkoutModalOpen, setCheckoutModalOpen] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState<any>(null)

    const handleOpenBoleto = (payment: any) => {
        setSelectedPayment(payment)
        setBoletoModalOpen(true)
    }

    const handleOpenCheckout = (payment: any) => {
        setSelectedPayment(payment)
        setCheckoutModalOpen(true)
    }

    // Calculations for stats
    const totalPendente = mockFaturas
        .filter(f => f.status === 'Pendente')
        .reduce((acc, curr) => acc + parseFloat(curr.valor.replace('R$ ', '').replace(',', '.')), 0)
        .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const totalPago = mockFaturas
        .filter(f => f.status === 'Pago')
        .reduce((acc, curr) => acc + parseFloat(curr.valor.replace('R$ ', '').replace(',', '.')), 0)
        .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const totalGeral = mockFaturas
        .reduce((acc, curr) => acc + parseFloat(curr.valor.replace('R$ ', '').replace(',', '.')), 0)
        .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const filteredFaturas = mockFaturas.filter(item => {
        if (selectedTab === 'todos') return true
        if (selectedTab === 'pendentes') return item.status === 'Pendente'
        if (selectedTab === 'pagos') return item.status === 'Pago'
        if (selectedTab === 'vencidos') return item.status === 'Vencido' // Assuming 'Vencido' exists in data or logic
        return true
    })



    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => onPageChange('inicio')} className="cursor-pointer">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Pagamentos</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pagamentos</h2>
                <Button
                    variant="outline"
                    className="flex flex-row items-center justify-center gap-2 whitespace-nowrap h-11 px-4 shrink-0 rounded-[10px]"
                    onClick={() => onPageChange('gerenciar-cartoes')}
                >
                    <CreditCard className="h-4 w-4 shrink-0" />
                    <span className="leading-none">Gerenciar Cartões ({MOCK_SAVED_CARDS.length})</span>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-[14px] border-none shadow-sm overflow-hidden relative">
                    <CardContent className="p-6 flex flex-row items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <Clock className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-0.5">Pendente</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalPendente}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[14px] border-none shadow-sm overflow-hidden relative">
                    <CardContent className="p-6 flex flex-row items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <CheckCircle className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-0.5">Pago</p>
                            <h3 className="text-2xl font-bold text-emerald-600">{totalPago}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[14px] border-none shadow-sm overflow-hidden relative">
                    <CardContent className="p-6 flex flex-row items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <DollarSign className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-0.5">Total</p>
                            <h3 className="text-2xl font-bold text-blue-600">{totalGeral}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-2 overflow-x-auto pb-2 md:pb-0">
                {['todos', 'pendentes', 'pagos', 'vencidos'].map((tab) => {
                    const count = tab === 'todos' ? mockFaturas.length :
                        mockFaturas.filter(f => {
                            if (tab === 'pendentes') return f.status === 'Pendente'
                            if (tab === 'pagos') return f.status === 'Pago'
                            if (tab === 'vencidos') return f.status === 'Vencido'
                            return false
                        }).length

                    const label = tab.charAt(0).toUpperCase() + tab.slice(1)
                    const isActive = selectedTab === tab

                    // Define active styles based on the tab type
                    const getActiveStyles = () => {
                        switch (tab) {
                            case 'pendentes': return 'bg-amber-50 border-amber-200 text-amber-700'
                            case 'pagos': return 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            case 'vencidos': return 'bg-red-50 border-red-200 text-red-700'
                            default: return 'bg-gray-100 border-gray-200 text-gray-900'
                        }
                    }

                    return (
                        <button
                            key={tab}
                            onClick={() => setSelectedTab(tab)}
                            className={`
                                h-8 px-4 rounded-full text-sm font-medium border transition-colors
                                ${isActive
                                    ? getActiveStyles()
                                    : 'bg-app-card dark:bg-app-card-dark border-app-border dark:border-app-border-dark text-app-text-secondary hover:bg-app-bg-secondary dark:hover:bg-white/5'
                                }
                            `}
                        >
                            {label} ({count})
                        </button>
                    )
                })}
            </div>

            {/* Payment List */}
            <div className="grid gap-4">
                {filteredFaturas.map((item) => (
                    <Card
                        key={item.id}
                        className="rounded-[14px] bg-app-card dark:bg-app-card-dark border-app-border dark:border-app-border-dark shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md cursor-pointer group"
                    >
                        <CardContent className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">

                            {/* Left + Center Info */}
                            <div className="flex items-start md:items-center gap-4 w-full">
                                {/* Icon Box */}
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border 
                                    ${item.status === 'Pendente'
                                        ? 'bg-amber-50 border-amber-100 text-amber-500'
                                        : 'bg-emerald-50 border-emerald-100 text-emerald-500'}`}
                                >
                                    {item.status === 'Pendente' ? <Clock className="h-6 w-6" /> : <CheckCircle className="h-6 w-6" />}
                                </div>

                                {/* Details */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-semibold text-app-text-primary dark:text-white text-base md:text-lg">
                                            {item.descricao}
                                        </h4>
                                        <Badge className={`rounded-md px-2 py-0.5 text-xs font-medium border-0
                                            ${item.status === 'Pendente'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-emerald-100 text-emerald-700'}`}
                                        >
                                            {item.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-app-text-muted">
                                        {item.doutor || 'Dr. Especialista'} • {item.vencimento} • <span className={`font-semibold ${item.status === 'Pendente' ? 'text-app-text-primary dark:text-white' : 'text-emerald-600'}`}>{item.valor}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Actions Right */}
                            <div className="flex flex-row items-center gap-3 w-full md:w-auto mt-2 md:mt-0 flex-nowrap">
                                {item.status === 'Pendente' ? (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="flex-1 md:flex-none h-10 rounded-[10px] gap-2 whitespace-nowrap px-2 sm:px-4 text-xs sm:text-sm flex items-center justify-center"
                                            onClick={() => handleOpenBoleto(item)}
                                        >
                                            <FileText className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                                            Gerar Boleto
                                        </Button>
                                        <Button
                                            className="flex-1 md:flex-none h-10 rounded-[10px] gap-2 whitespace-nowrap bg-[#0039A6] hover:bg-[#1d3b2e] text-white px-2 sm:px-4 text-xs sm:text-sm flex items-center justify-center"
                                            onClick={() => handleOpenCheckout(item)}
                                        >
                                            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                                            Pagar Online
                                        </Button>
                                    </>
                                ) : (
                                    <div className="w-full text-right md:w-auto">
                                        <span className="text-xs text-app-text-muted block md:hidden">Status</span>
                                        <span className="text-sm text-app-text-muted">Pago em {item.pagamento || '08/01/2024'}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <BoletoModal
                isOpen={boletoModalOpen}
                onClose={() => setBoletoModalOpen(false)}
                paymentData={selectedPayment}
            />

            <CheckoutModal
                isOpen={checkoutModalOpen}
                onClose={() => setCheckoutModalOpen(false)}
                paymentData={selectedPayment}
            />
        </div>
    )
}
