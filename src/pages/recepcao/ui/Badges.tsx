import React from 'react'
import { AppointmentStatus, PaymentStatus } from '../context/types'

export const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
    const styles = {
        confirmed: 'bg-blue-600 dark:bg-blue-500 text-white',
        'check-in': 'bg-amber-600 dark:bg-amber-500 text-white',
        waiting: 'bg-emerald-600 dark:bg-emerald-500 text-white animate-pulse',
        'in-progress': 'bg-purple-600 dark:bg-purple-500 text-white',
        'checked-out': 'bg-[#0039A6] dark:bg-app-bg-dark text-white',
        cancelled: 'bg-red-600 dark:bg-red-500 text-white',
        delayed: 'bg-orange-600 dark:bg-orange-500 text-white'
    }

    const labels = {
        confirmed: 'Confirmado',
        'check-in': 'Check-in',
        waiting: 'Aguardando',
        'in-progress': 'Em Atendimento',
        'checked-out': 'Finalizado',
        cancelled: 'Cancelado',
        delayed: 'Atrasado'
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-normal border-none shadow-sm ${styles[status]}`}>
            {labels[status]}
        </span>
    )
}

export const PaymentBadge = ({ status }: { status: PaymentStatus }) => {
    const styles = {
        paid: 'bg-emerald-600 dark:bg-emerald-500 text-white',
        partial: 'bg-amber-600 dark:bg-amber-500 text-white',
        pending: 'bg-blue-600 dark:bg-blue-500 text-white',
        unpaid: 'bg-red-600 dark:bg-red-500 text-white'
    }

    const labels = {
        paid: 'Pago',
        partial: 'Parcial',
        pending: 'Pendente',
        unpaid: 'Não Pago'
    }

    return (
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-normal border-none shadow-sm ${styles[status]} text-[10px] uppercase tracking-wider`}>
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            {labels[status]}
        </span>
    )
}

