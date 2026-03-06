import React from 'react'
import { Clock, Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { toast } from 'sonner'

interface DashboardViewProps {
    onPageChange?: (page: string) => void
}

import { MOCK_DASHBOARD_STATS, MOCK_NEXT_APPOINTMENTS } from '@/mocks/recepcionista/dashboard'

export const DashboardView = ({ onPageChange }: DashboardViewProps) => {

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_DASHBOARD_STATS.map((stat, idx) => (
                    <Card key={idx} className="shadow-sm border-app-border dark:border-app-border-dark">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="space-y-2">
                                <p className="text-sm font-normal text-app-text-muted dark:text-white/60">
                                    {stat.label}
                                </p>
                                <h3 className="text-3xl font-normal text-app-text-primary dark:text-white">
                                    {stat.value}
                                </h3>
                            </div>
                            <div>
                                <stat.icon size={28} className={stat.color} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Next Appointments Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-app-text-primary dark:text-white/90">
                        <Clock className="h-5 w-5" />
                        <h2 className="text-lg font-normal">Próximos atendimentos</h2>
                    </div>
                    <Button
                        onClick={() => onPageChange?.('agenda')}
                        className="bg-[#0039A6] hover:bg-[#002d82] text-white font-normal shadow-sm"
                    >
                        Ver agenda completa
                    </Button>
                </div>

                <div className="space-y-3">
                    {MOCK_NEXT_APPOINTMENTS.map((app) => (
                        <Card key={app.id} className="shadow-sm hover:shadow-md transition-shadow border-app-border dark:border-app-border-dark">
                            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                {/* Left Side: Patient Info */}
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="h-12 w-12 rounded-full bg-app-bg-secondary dark:bg-white/5 flex items-center justify-center text-app-text-muted dark:text-white/60 shrink-0">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-normal text-app-text-primary dark:text-white text-base">
                                            {app.patient}
                                        </h4>
                                        <p className="text-sm text-app-text-muted dark:text-white/60 font-normal">
                                            {app.specialist} • {app.type}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Side: Status & Time */}
                                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                    <span className={`px - 3 py - 1 rounded - md text - xs font - normal ${app.statusColor} `}>
                                        {app.status}
                                    </span>
                                    <span className="font-normal text-app-text-primary dark:text-white text-sm">
                                        {app.time}
                                    </span>
                                    <button onClick={() => toast.info('Notificações disponíveis em breve.')} className="text-app-text-muted hover:text-app-text-secondary dark:hover:text-white/80 transition-colors">
                                        <Bell size={20} />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
