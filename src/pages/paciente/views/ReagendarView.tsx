import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Clock, ChevronLeft, ChevronRight, CheckCircle, CheckCircle2 } from 'lucide-react'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/Breadcrumb'
import { MOCK_TIME_SLOTS } from '@/mocks/paciente/agenda'
import type { PatientAppointment } from '@/types'

interface ReagendarViewProps {
    onPageChange: (page: string) => void
    appointment: PatientAppointment | null
}

export function ReagendarView({ onPageChange, appointment }: ReagendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)

    // Calendar logic
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
        setShowSuccessAlert(false)
        // Reset time when date changes if desired, or keep it. Keeping it is fine.
    }

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]

    // Generate dates array
    const calendarDays = []
    for (let i = 0; i < startDayOfWeek; i++) {
        calendarDays.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i)
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
                            <BreadcrumbPage>Reagendar Consulta</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Reagendar Consulta</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Selecione uma nova data e horário para sua consulta
                    </p>
                </div>
            </div>

            {/* Current Appointment Card */}
            <Card className="p-6 bg-white dark:bg-[#0c1e3d] border-gray-100 dark:border-gray-800 shadow-sm rounded-[14px]">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-6">Consulta Atual</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                    <div className="space-y-1">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Médico</span>
                        <p className="text-base font-medium text-gray-700 dark:text-gray-200">{appointment?.medico || 'Dr. João Silva'}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Especialidade</span>
                        <p className="text-base font-medium text-gray-700 dark:text-gray-200">{appointment?.especialidade || 'Cardiologia'}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Data e Hora Atual</span>
                        <p className="text-base font-medium text-gray-700 dark:text-gray-200">{appointment?.data || '15/01/2026 às 14:30'}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Local</span>
                        <p className="text-base font-medium text-gray-700 dark:text-gray-200">{appointment?.local || 'Clínica Central - Sala 201'}</p>
                    </div>
                </div>
            </Card>

            {/* Selection Section */}
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
                                    onClick={() => {
                                        setSelectedTime(time)
                                        setShowSuccessAlert(false)
                                    }}
                                    className={`
                                        flex flex-row items-center justify-center gap-2 h-12 rounded-[10px] border whitespace-nowrap transition-all duration-200
                                        ${isSelected
                                            ? 'border-gray-900 bg-gray-50 text-gray-900 dark:border-white dark:bg-white/10 dark:text-white font-medium shadow-sm'
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


            {/* Alert Card */}
            {showSuccessAlert && selectedDate && selectedTime && (
                <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border-l-4 border-emerald-500 rounded-[12px] p-4 flex flex-row items-start gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                            Nova Data Selecionada
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Sua consulta será reagendada para <strong className="font-bold text-slate-900 dark:text-white">{selectedDate.toLocaleDateString('pt-BR')}</strong> às <strong className="font-bold text-slate-900 dark:text-white">{selectedTime}</strong>
                        </p>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="flex justify-between gap-3 pt-2">
                <Button
                    variant="outline"
                    className="h-12 px-8 rounded-[10px] border-black-200  0 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/10"
                    onClick={() => onPageChange('agenda')}
                >
                    Cancelar
                </Button>
                <Button
                    className=" w-full sm:w-auto 
    h-11 px-6 
    bg-[#0039A6] hover:bg-[#1d3b2e] 
    text-white rounded-[10px] 
    flex flex-row items-center justify-center 
    gap-2 
    whitespace-nowrap 
    transition-all active:scale-95 
    shadow-sm"
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setShowSuccessAlert(true)}
                >
                    <CheckCircle className="h-5 w-5 shrink-0" />
                    <span className="leading-none">Confirmar Reagendamento</span>
                </Button>
            </div>
        </div>
    )
}
