import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select'
import { ArrowLeft, Clock, ChevronLeft, ChevronRight, ArrowRight, Check, Info, CreditCard, QrCode } from 'lucide-react'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/Breadcrumb'
import { MOCK_TIME_SLOTS, MOCK_SPECIALISTS, MOCK_PROCEDURES } from '@/mocks/paciente/agenda'

interface NovoAgendamentoViewProps {
    onPageChange: (page: string) => void
}

export function NovoAgendamentoView({ onPageChange }: NovoAgendamentoViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [specialist, setSpecialist] = useState<string>('')
    const [procedure, setProcedure] = useState<string>('')
    const [step, setStep] = useState(1)
    const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix' | null>(null)

    // Calendar Logic (Reused)
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const days = new Date(year, month + 1, 0).getDate()
        const firstDay = new Date(year, month, 1).getDay()
        return { days, firstDay }
    }

    const { days: daysInMonth, firstDay: startDayOfWeek } = getDaysInMonth(currentDate)

    const handlePrevMonth = () => {
        const newDate = new Date(currentDate)
        newDate.setMonth(newDate.getMonth() - 1)
        setCurrentDate(newDate)
    }

    const handleNextMonth = () => {
        const newDate = new Date(currentDate)
        newDate.setMonth(newDate.getMonth() + 1)
        setCurrentDate(newDate)
    }

    const isDateDisabled = (day: number) => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return checkDate < today
    }

    const isDateSelected = (day: number) => {
        if (!selectedDate) return false
        return selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear()
    }

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        setSelectedDate(newDate)
    }

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]

    const calendarDays = []
    for (let i = 0; i < startDayOfWeek; i++) {
        calendarDays.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i)
    }

    const calculatePreviewValue = () => {
        const valueStr = procedure.split('R$')[1] || '0'
        const value = parseInt(valueStr)
        return (value / 2).toFixed(2).replace('.', ',')
    }



    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Top Navigation */}
            <div className="flex flex-col gap-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => onPageChange('inicio')} className="cursor-pointer">Início</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => onPageChange('agenda')} className="cursor-pointer">Minha Agenda</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Novo Agendamento</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Novo Agendamento</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {step === 1
                                ? "Selecione o especialista, procedimento, data e horário"
                                : step === 2
                                    ? "Revise os detalhes do seu agendamento"
                                    : "Realize o pagamento antecipado de 50%"
                            }
                        </p>
                    </div>


                </div>
                {/* Stepper */}
                <div className="flex items-center gap-2 justify-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${step >= 1 ? 'bg-[#0039A6] text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                        {step > 1 ? <Check className="h-5 w-5" /> : '1'}
                    </div>
                    <div className={`w-12 h-[2px] ${step >= 2 ? 'bg-[#0039A6]' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${step >= 2 ? 'bg-[#0039A6] text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                        {step > 2 ? <Check className="h-5 w-5" /> : '2'}
                    </div>
                    <div className={`w-12 h-[2px] ${step >= 3 ? 'bg-[#0039A6]' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${step >= 3 ? 'bg-[#0039A6] text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>3</div>
                </div>
            </div>


            {step === 1 ? (
                <>
                    {/* Info Card */}
                    <Card className="p-6 bg-white dark:bg-[#0c1e3d] border-gray-100 dark:border-gray-800 shadow-sm rounded-[14px]">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-6">Informações da Consulta</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300">Especialista</label>
                                <Select onValueChange={setSpecialist} value={specialist}>
                                    <SelectTrigger className="h-11 rounded-[10px] bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-gray-700">
                                        <SelectValue preferPlaceholder placeholder="Selecione o especialista" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MOCK_SPECIALISTS.map(s => (
                                            <SelectItem key={s.id} value={`${s.name} (${s.specialty})`}>{s.name} ({s.specialty})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300">Procedimento</label>
                                <Select onValueChange={setProcedure} value={procedure}>
                                    <SelectTrigger className="h-11 rounded-[10px] bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-gray-700">
                                        <SelectValue preferPlaceholder placeholder="Selecione o procedimento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MOCK_PROCEDURES.map(p => (
                                            <SelectItem key={p.id} value={`${p.name} - R$${p.price}`}>{p.name} - R${p.price}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>

                    {/* Date & Time Selection (Reused Layout) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left: Calendar */}
                        <Card className="p-6 bg-white dark:bg-[#0c1e3d] border-gray-100 dark:border-gray-800 shadow-sm rounded-[14px] flex flex-col items-center">
                            <div className="w-full flex items-center justify-between mb-6 px-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrevMonth}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="font-semibold capitalize text-gray-800 dark:text-white">
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </span>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNextMonth}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="w-full grid grid-cols-7 gap-1 mb-2 text-center">
                                {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'].map(day => (
                                    <span key={day} className="text-xs text-gray-400">{day}</span>
                                ))}
                            </div>

                            <div className="w-full grid grid-cols-7 gap-1 text-center">
                                {calendarDays.map((day, index) => {
                                    if (day === null) return <div key={`empty-${index}`} className="h-10" />

                                    const isDisabled = isDateDisabled(day)
                                    const isSelected = isDateSelected(day)

                                    return (
                                        <button
                                            key={day}
                                            disabled={isDisabled}
                                            onClick={() => handleDateClick(day)}
                                            className={`
                                                h-10 w-10 mx-auto flex items-center justify-center rounded-lg text-sm transition-all
                                                ${isDisabled
                                                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50'
                                                    : isSelected
                                                        ? 'bg-slate-900 text-white dark:bg-slate-700 font-medium shadow-md scale-105'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                                }
                                            `}
                                        >
                                            {day}
                                        </button>
                                    )
                                })}
                            </div>
                        </Card>

                        {/* Right: Time Slots */}
                        <Card className="p-6 bg-white dark:bg-[#0c1e3d] border-gray-100 dark:border-gray-800 shadow-sm rounded-[14px]">
                            <div className="grid grid-cols-3 gap-3">
                                {MOCK_TIME_SLOTS.map(time => {
                                    const isSelected = selectedTime === time
                                    const isDisabled = !selectedDate

                                    return (
                                        <button
                                            key={time}
                                            disabled={isDisabled}
                                            onClick={() => setSelectedTime(time)}
                                            className={`
                                                flex flex-row items-center justify-center gap-2 h-12 rounded-[10px] border whitespace-nowrap transition-all duration-200
                                                ${isSelected
                                                    ? 'border-[#0039A6] bg-[#0039A6]/5 text-[#0039A6] dark:border-[#0039A6] dark:bg-[#0039A6]/20 dark:text-white font-medium shadow-sm ring-1 ring-[#0039A6]'
                                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                                }
                                                ${isDisabled ? 'opacity-40 cursor-not-allowed bg-gray-50 dark:bg-gray-800/50' : 'cursor-pointer'}
                                            `}
                                        >
                                            <Clock className="h-4 w-4 shrink-0" />
                                            <span className="text-sm">{time}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </Card>
                    </div>
                </>
            ) : step === 2 ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <Card className="p-6 bg-white dark:bg-[#0c1e3d] border-gray-100 dark:border-gray-800 shadow-sm rounded-[14px]">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-6">Resumo do Agendamento</h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                                <div>
                                    <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">Especialista</p>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">{specialist}</p>
                                </div>
                                <div>
                                    <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">Procedimento</p>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">{procedure.split('-')[1]?.trim()}</p>
                                </div>
                                <div>
                                    <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">Data</p>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">{selectedDate?.toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div>
                                    <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">Horário</p>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">{selectedTime}</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2">
                                <div>
                                    <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor Total</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">R$ {procedure.split('R$')[1] || '0,00'}</p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <p className="text-[13px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Pagamento Antecipado (50%)</p>
                                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                        R$ {calculatePreviewValue()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-blue-500 rounded-[10px] p-4 flex gap-3">
                        <Info className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 dark:text-blue-300">
                            <strong>Importante:</strong> Para confirmar seu agendamento, é necessário realizar o pagamento antecipado de 50% do valor. O restante pode ser pago no dia da consulta.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <Card className="p-6 md:p-8 bg-white dark:bg-[#0c1e3d] border-gray-100 dark:border-gray-800 shadow-sm rounded-[14px]">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Pagamento Antecipado</h3>

                        <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">Valor a Pagar:</span>
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                R$ {calculatePreviewValue()}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Escolha a Forma de Pagamento</h4>

                            <div className="grid gap-4">
                                <div
                                    className={`
                                        relative p-4 rounded-[10px] border cursor-pointer transition-all duration-200
                                        ${paymentMethod === 'credit'
                                            ? 'border-[#0039A6] bg-[#0039A6]/5 ring-1 ring-[#0039A6]'
                                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0c1e3d] hover:border-[#0039A6]'
                                        }
                                    `}
                                    onClick={() => setPaymentMethod('credit')}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                            <CreditCard className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium text-gray-900 dark:text-white">Cartão de Crédito</p>
                                            <p className="text-sm text-gray-500">Pagamento instantâneo</p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`
                                        relative p-4 rounded-[10px] border cursor-pointer transition-all duration-200
                                        ${paymentMethod === 'pix'
                                            ? 'border-[#0039A6] bg-[#0039A6]/5 ring-1 ring-[#0039A6]'
                                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0c1e3d] hover:border-[#0039A6]'
                                        }
                                    `}
                                    onClick={() => setPaymentMethod('pix')}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                            <QrCode className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium text-gray-900 dark:text-white">PIX</p>
                                            <p className="text-sm text-gray-500">Confirmação em até 5 minutos</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}


            {/* Footer */}
            <div className={`flex ${step === 1 ? 'justify-end' : 'justify-between'} pt-2`}>
                {step > 1 && (
                    <Button
                        variant="outline"
                        className="h-11 px-6 rounded-[10px] flex items-center gap-2 shadow-sm border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/5"
                        onClick={() => setStep(step - 1)}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Voltar</span>
                    </Button>
                )}

                <Button
                    className={`h-11 px-6 rounded-[10px] flex items-center gap-2 shadow-sm transition-all active:scale-95
                        ${(step === 1 && (!selectedDate || !selectedTime || !specialist || !procedure)) || (step === 3 && !paymentMethod)
                            ? 'opacity-50 cursor-not-allowed grayscale bg-gray-500'
                            : 'bg-[#0039A6] hover:bg-[#002d82] text-white'
                        }`}
                    disabled={(step === 1 && (!selectedDate || !selectedTime || !specialist || !procedure)) || (step === 3 && !paymentMethod)}
                    onClick={() => {
                        if (step === 1) setStep(2)
                        else if (step === 2) setStep(3)
                        else if (step === 3) {
                            void paymentMethod
                        }
                    }}
                >
                    <span>{step === 1 ? 'Continuar' : step === 2 ? 'Ir para Pagamento' : 'Finalizar e Pagar'}</span>
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
